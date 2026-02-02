Edu Games — simple education game web platform

Quick start (local):

1. Create a virtual env and install:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

App will run on http://localhost:5000

Docker (build & run):

```powershell
docker build -t edu-games .
docker run -p 5000:5000 edu-games
```

Files of interest:
- `app.py` - Flask backend
- `templates/index.html` - frontend UI
- `static/` - JS/CSS
- `questions.json` - sample questions

You can extend games by adding more routes and frontend modules.
