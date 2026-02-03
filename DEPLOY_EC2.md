# Deploy Quiz App to AWS EC2

## Quick Start (5 minutes)

### 1. Launch EC2 Instance
- AMI: Ubuntu 22.04 LTS (free tier eligible: t2.micro)
- Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Key Pair: Create and download .pem file

### 2. Connect to Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-public-ip
```

### 3. Clone & Setup

```bash
# Clone your repo
git clone https://github.com/your-username/quiz-app.git
cd quiz-app

# Run setup script
bash setup-ec2.sh
```

**Done!** Your app is now running at `http://your-public-ip`

---

## Manual Setup (if script doesn't work)

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install dependencies
sudo apt install -y python3 python3-pip python3-venv git nginx

# 3. Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Test the app
python app.py  # Should start on http://localhost:5000

# 5. Create systemd service (copy from setup-ec2.sh)

# 6. Configure Nginx (copy from setup-ec2.sh)

# 7. Start services
sudo systemctl restart quiz-app nginx
```

---

## Management

### Check Status
```bash
sudo systemctl status quiz-app
```

### View Logs
```bash
# App logs
sudo journalctl -u quiz-app -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart App
```bash
sudo systemctl restart quiz-app
```

### Update Code
```bash
cd quiz-app
git pull origin master
sudo systemctl restart quiz-app
```

### Stop/Start
```bash
sudo systemctl stop quiz-app
sudo systemctl start quiz-app
```

---

## SSL Certificate (Optional but Recommended)

### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Get Free SSL
```bash
sudo certbot --nginx -d your-domain.com
```

### Auto-renewal
```bash
sudo systemctl status certbot.timer
```

---

## Health Monitoring

### Check if app is running
```bash
curl http://localhost/health
```

Should return:
```json
{"status":"healthy","timestamp":"2026-02-03T..."}
```

### Monitor system resources
```bash
htop
```

---

## Performance Tuning

### Increase workers (in gunicorn_config.py)
```python
workers = multiprocessing.cpu_count() * 2 + 1
```

For **t2.micro**: keep at 3-5 workers  
For **t2.small**: use 4-7 workers  
For **t3.medium**: use 8-16 workers

### Reload after changes
```bash
sudo systemctl restart quiz-app
```

---

## Troubleshooting

### App won't start
```bash
sudo journalctl -u quiz-app -n 50
```

### Port 80 already in use
```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

### Nginx not connecting to app
```bash
sudo nginx -t  # Test config
curl http://localhost:5000/health  # Check if Flask app is running
```

### Permission denied on logs
```bash
sudo chown -R ubuntu:ubuntu ~/quiz-app
```

---

## Security Checklist

- [ ] SSH key only (disable password login)
- [ ] Security group: restrict to necessary ports only
- [ ] Enable SSL/TLS with Let's Encrypt
- [ ] Set Flask environment to production
- [ ] Regular backups enabled
- [ ] Monitor CloudWatch metrics
- [ ] Setup AWS Secrets Manager for secrets

---

## Cost Estimate (Monthly)

- **t2.micro** (free tier): $0
- **t2.small**: ~$0.016/hour = $11.50/month
- **t3.medium**: ~$0.0336/hour = $24.50/month
- **Data transfer**: $0.09 per GB (first 1GB free)

---

## Architecture

```
User Browser
    ↓
Internet
    ↓
AWS Security Group (Port 80)
    ↓
Nginx (Reverse Proxy)
    ↓
Gunicorn Workers (Port 5000)
    ↓
Flask App
    ↓
Static Files & JSON
```

---

## Support

For issues, check:
1. `sudo systemctl status quiz-app`
2. `sudo journalctl -u quiz-app -f`
3. `curl http://localhost:5000/health`
4. `sudo nginx -t`
