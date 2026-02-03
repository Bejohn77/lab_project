# Docker deployment for EC2

This app is fully Docker-compatible. Two deployment options:

## Option 1: Docker Compose (Recommended - Easiest)

On your EC2 instance:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Clone repo
git clone https://your-repo/quiz-app.git
cd quiz-app

# Start app
docker-compose up -d

# View logs
docker-compose logs -f

# Stop app
docker-compose down
```

## Option 2: Single Docker Container

```bash
# Build image
docker build -t quiz-app .

# Run container
docker run -d \
  --name quiz-app \
  -p 80:5000 \
  --restart unless-stopped \
  quiz-app

# View logs
docker logs -f quiz-app

# Stop container
docker stop quiz-app
```

## Benefits

- ✅ No dependency conflicts
- ✅ Easy to scale
- ✅ Built-in health checks
- ✅ One-command deployment
- ✅ Works same everywhere (local, EC2, K8s)

## Update Code

```bash
docker-compose down
git pull
docker-compose up -d --build
```

See [DEPLOY_EC2.md](DEPLOY_EC2.md) for system service deployment.
