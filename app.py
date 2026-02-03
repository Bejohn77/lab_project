from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
import os
import logging
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Security headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

# Error handlers
@app.errorhandler(400)
def bad_request(e):
    logger.warning(f"Bad request: {request.remote_addr}")
    return jsonify({'error': 'Bad request'}), 400

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    logger.error(f"Server error: {str(e)}")
    return jsonify({'error': 'Internal server error'}), 500

def load_questions():
    try:
        path = os.path.join(app.root_path, 'questions.json')
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading questions: {str(e)}")
        return []

@app.route('/')
def index():
    logger.info(f"Home page accessed from {request.remote_addr}")
    return render_template('index.html')

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200

@app.route('/api/questions')
def api_questions():
    try:
        questions = load_questions()
        logger.info(f"Questions requested from {request.remote_addr}")
        return jsonify(questions), 200
    except Exception as e:
        logger.error(f"Error in api_questions: {str(e)}")
        return jsonify({'error': 'Failed to load questions'}), 500

@app.route('/api/submit', methods=['POST'])
def api_submit():
    try:
        data = request.json or {}
        answers = data.get('answers', {})
        questions = load_questions()
        
        if not questions:
            return jsonify({'error': 'No questions available'}), 500
        
        score = 0
        for q in questions:
            qid = str(q['id'])
            if qid in answers and int(answers[qid]) == int(q['answer']):
                score += 1
        
        logger.info(f"Quiz submitted from {request.remote_addr}: {score}/{len(questions)}")
        return jsonify({'score': score, 'total': len(questions), 'percentage': round((score/len(questions)*100), 1)}), 200
    except Exception as e:
        logger.error(f"Error in api_submit: {str(e)}")
        return jsonify({'error': 'Failed to submit quiz'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'production') == 'development'
    logger.info(f"Starting app on port {port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)
