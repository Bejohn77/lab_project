#!/bin/bash

# Quick deployment script for EC2
# Usage: bash deploy.sh

echo "📦 Deploying Quiz App..."

# Pull latest code
git pull origin master

# Activate venv
source venv/bin/activate

# Install/update dependencies
pip install -r requirements.txt

# Restart app
sudo systemctl restart quiz-app

echo "✅ Deployment complete!"
echo ""
echo "Checking status:"
sudo systemctl status quiz-app --no-pager
