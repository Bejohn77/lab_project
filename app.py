from flask import Flask, jsonify, request, render_template
import json
import os

app = Flask(__name__, static_folder='static', template_folder='templates')


def load_questions():
    path = os.path.join(app.root_path, 'questions.json')
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/questions')
def api_questions():
    return jsonify(load_questions())


@app.route('/api/submit', methods=['POST'])
def api_submit():
    data = request.json or {}
    answers = data.get('answers', {})
    questions = load_questions()
    score = 0
    for q in questions:
        qid = str(q['id'])
        if qid in answers and int(answers[qid]) == int(q['answer']):
            score += 1
    return jsonify({'score': score, 'total': len(questions)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
