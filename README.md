Edu Games — simple education game web platform

## Features
- 📝 **Quiz Mode** - Multiple choice quizzes with instant scoring
- 🎯 **Flashcard Mode** - Interactive flashcard study
- 🎨 **Modern Design** - Beautiful gradient UI with animations
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- 🐳 **Docker Ready** - Easy deployment with Docker
- 📊 **Production Grade** - Logging, error handling, health checks
- ☁️ **AWS EC2 Ready** - Complete deployment guide included

## Quick Start (Local Development)

```powershell
# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

Visit: http://localhost:5000

## Docker

```bash
# Build image
docker build -t edu-games .

# Run container
docker run -p 5000:5000 edu-games
```

## Docker Compose

```bash
# Start app in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop app
docker-compose down
```

## Project Structure

```
quiz-app/
├── app.py                 # Flask backend with logging
├── requirements.txt       # Python dependencies
├── gunicorn_config.py    # Production config
├── questions.json        # Quiz questions
├── templates/
│   └── index.html        # Frontend UI
├── static/
│   ├── app.js           # Frontend logic
│   └── styles.css       # Modern styling
├── Dockerfile           # Container config
├── docker-compose.yml   # Compose setup
├── .env.example         # Environment template
└── EC2_DEPLOYMENT.md    # AWS deployment guide
```

## API Endpoints

- `GET /` - Main page
- `GET /health` - Health check
- `GET /api/questions` - Get all questions
- `POST /api/submit` - Submit quiz answers

## Environment Variables

Copy `.env.example` to `.env`:

```bash
FLASK_ENV=production
PORT=5000
```

## AWS EC2 Deployment

See [EC2_DEPLOYMENT.md](EC2_DEPLOYMENT.md) for complete setup guide.

Quick command:
```bash
docker-compose up -d
```

## Features Included

✅ Production-grade logging  
✅ Error handling & security headers  
✅ CORS support  
✅ Health check endpoint  
✅ Gunicorn configuration  
✅ Environment variable support  
✅ Responsive mobile-first design  
✅ Smooth animations  
✅ Form validation  
✅ Loading states  

## Customization

Edit `questions.json` to add your own questions:

```json
{
  "id": 1,
  "question": "Your question?",
  "choices": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answer": 1
}
```

## Monitoring

Check logs:
```bash
tail -f app.log
```

View access logs:
```bash
tail -f access.log
```

## License

MIT

