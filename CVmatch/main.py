from blackd import cors
from flask import Flask, request, jsonify
import os
import re

import nltk
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')



app = Flask(__name__)


UPLOADS_FOLDER = 'uploads'

CORS(app, origins=["http://localhost:4200"])

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    tokens = word_tokenize(text)
    stop_words = set(ENGLISH_STOP_WORDS)
    tokens = [token for token in tokens if token not in stop_words]
    processed_text = ' '.join(tokens)
    return processed_text

def process_files(cv_content, requirements_content):
    cv_script = preprocess_text(cv_content)
    req_script = preprocess_text(requirements_content)

    match_test = [cv_script, req_script]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(match_test)

    similarity = cosine_similarity(tfidf_matrix)
    match_percentage = similarity[0][1] * 100
    match_percentage = round(match_percentage, 2)

    return match_percentage

@app.route('/api/submit-cv', methods=['POST'])
@cross_origin()
def submit_cv():
    if 'cv' not in request.files or 'requirements' not in request.files:
        return jsonify({'error': 'Both CV and Requirements files are required.'}), 400

    cv_file = request.files['cv']
    requirements_file = request.files['requirements']

    if not cv_file or not requirements_file:
        return jsonify({'error': 'Both CV and Requirements files are required.'}), 400

    cv_filename = secure_filename(cv_file.filename)
    requirements_filename = secure_filename(requirements_file.filename)

    cv_path = os.path.join(UPLOADS_FOLDER, cv_filename)
    requirements_path = os.path.join(UPLOADS_FOLDER, requirements_filename)

    cv_file.save(cv_path)
    requirements_file.save(requirements_path)

    try:
        with open(cv_path, 'rb') as cv_file, open(requirements_path, 'rb') as requirements_file:
            cv_content = cv_file.read()
            requirements_content = requirements_file.read()

            try:
                cv_content = cv_content.decode('utf-8')
            except UnicodeDecodeError:
                cv_content = cv_content.decode('latin-1')

            try:
                requirements_content = requirements_content.decode('utf-8')
            except UnicodeDecodeError:
                requirements_content = requirements_content.decode('latin-1')

            match_percentage = process_files(cv_content, requirements_content)
            result = f'Match Percentage is: {match_percentage}% to Requirement'

        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
