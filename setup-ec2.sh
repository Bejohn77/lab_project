#!/bin/bash

# AWS EC2 Setup Script for Quiz App
# Run this on your EC2 instance: bash setup-ec2.sh

echo "🚀 Starting Quiz App EC2 Setup..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3 python3-pip python3-venv git nginx curl

# Clone or download project
cd /home/ubuntu || cd ~
if [ ! -d "quiz-app" ]; then
  echo "📦 Cloning quiz app..."
  # Replace with your repo URL
  # git clone https://github.com/your-repo/quiz-app.git
  mkdir -p quiz-app
fi

cd quiz-app

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create systemd service file
sudo tee /etc/systemd/system/quiz-app.service > /dev/null <<EOF
[Unit]
Description=Quiz App Flask Application
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/quiz-app
ExecStart=/home/ubuntu/quiz-app/venv/bin/gunicorn -c gunicorn_config.py app:app
Restart=always
RestartSec=10
Environment="PATH=/home/ubuntu/quiz-app/venv/bin"

[Install]
WantedBy=multi-user.target
EOF

# Create Nginx config
sudo tee /etc/nginx/sites-available/quiz-app > /dev/null <<'NGINXEOF'
upstream quiz_app {
    server localhost:5000;
}

server {
    listen 80;
    server_name _;

    client_max_body_size 10M;

    location / {
        proxy_pass http://quiz_app;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    location /health {
        proxy_pass http://quiz_app;
        access_log off;
    }

    location /static/ {
        alias /home/ubuntu/quiz-app/static/;
        expires 30d;
    }
}
NGINXEOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/quiz-app /etc/nginx/sites-enabled/quiz-app
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable quiz-app
sudo systemctl start quiz-app
sudo systemctl enable nginx
sudo systemctl restart nginx

# Test the health endpoint
echo "⏳ Waiting for app to start..."
sleep 3
curl -f http://localhost:5000/health || echo "⚠️  Health check not responding yet"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Service Status:"
sudo systemctl status quiz-app --no-pager
echo ""
echo "📊 View logs:"
echo "  sudo journalctl -u quiz-app -f"
echo ""
echo "🌐 Access your app:"
echo "  http://YOUR_EC2_PUBLIC_IP"
echo ""
echo "📝 Restart app:"
echo "  sudo systemctl restart quiz-app"
echo ""
echo "🛑 Stop app:"
echo "  sudo systemctl stop quiz-app"
