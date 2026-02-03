# 🚀 Deploy to AWS EC2 - Complete Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2 → Instances
2. **Launch Instance**
3. Select: **Ubuntu 22.04 LTS (free tier)**
4. Instance type: **t2.micro** (free tier)
5. Storage: **8 GB** (free tier)
6. Security Group: Create new with rules:
   - SSH (22): Your IP
   - HTTP (80): Anywhere
   - HTTPS (443): Anywhere

### Step 2: Connect & Deploy
```bash
# SSH into your instance
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-public-ip

# Clone your repository
git clone https://github.com/your-username/quiz-app.git
cd quiz-app

# Run deployment
bash setup-ec2.sh
```

✅ **Done!** Access your app at `http://your-public-ip`

---

## 📦 Method 1: Docker Compose (Easiest)

Perfect for beginners and quick deployment.

```bash
ssh -i your-key.pem ubuntu@your-public-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
exit

# Re-login
ssh -i your-key.pem ubuntu@your-public-ip

# Deploy
git clone https://github.com/your-username/quiz-app.git
cd quiz-app
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

**Access:** `http://your-public-ip`

---

## 🔧 Method 2: System Service (Recommended for Production)

Automatic restart, logging, and monitoring.

```bash
ssh -i your-key.pem ubuntu@your-public-ip

# Clone repo
git clone https://github.com/your-username/quiz-app.git
cd quiz-app

# Run setup script
bash setup-ec2.sh
```

**Access:** `http://your-public-ip`

**Check status:**
```bash
sudo systemctl status quiz-app
sudo journalctl -u quiz-app -f
```

---

## 🔐 Enable HTTPS (Free SSL with Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Auto-renewal runs daily. Check status:
```bash
sudo systemctl status certbot.timer
```

---

## 📊 Monitoring & Logs

### View Real-time Logs
```bash
# App logs
sudo journalctl -u quiz-app -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check Health
```bash
curl http://localhost/health
```

### Monitor Resources
```bash
htop
df -h
free -h
```

---

## 🔄 Update Code

```bash
cd quiz-app
git pull origin master
sudo systemctl restart quiz-app
```

Or with Docker:
```bash
cd quiz-app
docker-compose down
git pull
docker-compose up -d --build
```

---

## 🛠️ Troubleshooting

### App won't start
```bash
sudo systemctl status quiz-app
sudo journalctl -u quiz-app -n 50
```

### Port 80 already in use
```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

### Nginx not working
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Permission denied
```bash
sudo chown -R ubuntu:ubuntu ~/quiz-app
```

### SSH timeout
- Check security group allows SSH from your IP
- Make sure key file has correct permissions: `chmod 400 key.pem`

---

## 🎯 Performance Tuning

### For t2.micro (1 GB RAM)
In `gunicorn_config.py`:
```python
workers = 3
threads = 2
```

### For t2.small (2 GB RAM)
```python
workers = 5
threads = 3
```

### For t3.medium (4 GB RAM)
```python
workers = 9
threads = 4
```

Restart after changes:
```bash
sudo systemctl restart quiz-app
```

---

## 💰 Cost Breakdown (Monthly)

| Instance | On-Demand | Free Tier |
|----------|-----------|-----------|
| t2.micro | $0 | ✅ Yes |
| t2.small | $11.50 | ❌ No |
| t3.medium | $24.50 | ❌ No |
| Data Transfer | $0.09/GB | 1 GB free |

---

## 🔐 Security Checklist

- [ ] SSH key only (no password)
- [ ] Security group restricted
- [ ] HTTPS enabled (Let's Encrypt)
- [ ] Regular backups enabled
- [ ] Monitor CloudWatch
- [ ] Auto-restart enabled
- [ ] Firewall configured

---

## 📝 Useful Commands

```bash
# Status
sudo systemctl status quiz-app

# Start/Stop/Restart
sudo systemctl start quiz-app
sudo systemctl stop quiz-app
sudo systemctl restart quiz-app

# Enable on boot
sudo systemctl enable quiz-app

# View logs
sudo journalctl -u quiz-app -f

# Real-time stats
htop

# Disk usage
df -h

# Memory usage
free -h

# Nginx status
sudo systemctl status nginx

# SSL certificate status
sudo certbot certificates
```

---

## 🆘 Need Help?

1. Check logs: `sudo journalctl -u quiz-app -f`
2. Test health: `curl http://localhost/health`
3. Verify Nginx: `sudo nginx -t`
4. Check permissions: `ls -la ~`
5. Monitor resources: `htop`

---

## 🎉 Next Steps

1. **Custom Domain**: Update Route53 DNS records
2. **CDN**: Add CloudFront for static files
3. **Database**: Move data to RDS
4. **Auto Scaling**: Setup load balancer
5. **Monitoring**: Enable CloudWatch alerts
6. **Backup**: Setup automated backups
