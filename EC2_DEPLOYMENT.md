# AWS EC2 Deployment Guide

## Prerequisites
- AWS EC2 instance running Ubuntu 22.04 LTS
- SSH access to the instance
- Security group allowing ports 80, 443, and 5000

## Quick Setup on EC2

### 1. Connect to your instance
```bash
ssh -i your-key.pem ubuntu@your-instance-public-ip
```

### 2. Update system and install dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv git docker.io docker-compose
```

### 3. Add ubuntu user to docker group
```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

### 4. Clone or download the quiz app
```bash
git clone https://your-repo/quiz-app.git
cd quiz-app
```

### 5. Copy .env configuration
```bash
cp .env.example .env
```

### 6. Option A: Run with Docker Compose (Recommended)
```bash
docker-compose up -d
```

Check logs:
```bash
docker-compose logs -f
```

### 6. Option B: Run with Python directly
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 7. Check health endpoint
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status":"healthy","timestamp":"2026-02-03T..."}
```

## Production Setup with Nginx Reverse Proxy

### 1. Install Nginx
```bash
sudo apt install -y nginx
```

### 2. Create Nginx config
```bash
sudo nano /etc/nginx/sites-available/quiz-app
```

Add:
```nginx
upstream flask_app {
    server localhost:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://flask_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    location /health {
        proxy_pass http://flask_app;
        access_log off;
    }
}
```

### 3. Enable config and restart Nginx
```bash
sudo ln -s /etc/nginx/sites-available/quiz-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring and Logs

### View Docker logs
```bash
docker-compose logs -f web
```

### View app logs
```bash
tail -f app.log
```

### Monitor system
```bash
htop
df -h
```

## Health Checks

Create a cron job to monitor the app:
```bash
crontab -e
```

Add:
```
*/5 * * * * curl -f http://localhost:5000/health || systemctl restart docker-compose
```

## Scaling

To scale with multiple workers, update `gunicorn_config.py`:
```python
workers = multiprocessing.cpu_count() * 2 + 1
```

## Troubleshooting

### Port already in use
```bash
lsof -i :5000
```

### Docker compose not starting
```bash
docker-compose ps
docker-compose logs
```

### Nginx not proxying
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Cost Optimization

- Use **t2.micro** or **t3.micro** for light traffic (AWS free tier eligible)
- Monitor CloudWatch metrics
- Use VPC and Security Groups properly
- Enable automatic backups

## Updating the app

```bash
cd quiz-app
git pull origin master
docker-compose up -d --build
```

