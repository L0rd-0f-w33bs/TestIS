import os
import math
import operator
import pickle
from flask import Flask, request, jsonify
import nltk
from werkzeug.utils import secure_filename

from flask_cors import CORS

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
MODEL_FILE = 'model.pkl'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app, origins=['http://localhost:5173'])


nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_review(review):
    tokens = nltk.word_tokenize(review)
    punct_tokens = [tokens[0]]  # do not add full stop before the first word in the review
    for i in range(1, len(tokens)):
        if tokens[i][0].isupper():
            punct_tokens.append('.')
        punct_tokens.append(tokens[i])
    punct_tokens.append('.')
    return negate(punct_tokens)

def negate(review):
    tokens = list(review)
    newlist = []
    deletelist = []

    while tokens:
        for token in tokens:
            newlist.append(token.lower())
            deletelist.append(token)
            if token in ['not', 'no', "n't"]:
                break

        for token in deletelist:
            tokens.remove(token)
        deletelist.clear()

        for token in tokens:
            deletelist.append(token)
            if token not in ['.', ',', ';', '!', 'and', 'but', 'because', '-']:
                newlist.append('not_' + token.lower())
            else:
                newlist.append(token)
                break

        for token in deletelist:
            tokens.remove(token)
        deletelist.clear()

    return newlist

def newbinary(rev):
    review = list(rev)
    new_list = []
    deletelist = []
    add_again = []
    temp = []  # for one sentence at a time

    while review:
        for word in review:
            deletelist.append(word)
            if word in ['.', '!', ';']:
                new_list.append(word)
                break
            if word not in temp:
                new_list.append(word)
                temp.append(word)
            elif word not in add_again:
                add_again.append(word)
            else:
                new_list.append(word)
                temp.append(word)
                add_again.remove(word)

        for word in deletelist:
            review.remove(word)
        deletelist.clear()
        temp.clear()

    return new_list

def load_model():
    with open(MODEL_FILE, 'rb') as f:
        return pickle.load(f)

def test(review, logPrior, logLikelihood, classes, vocab):
    total = {c: logPrior[c] for c in classes}
    tokens = list(review)
    for w in tokens:
        if w in vocab:
            for c in classes:
                total[c] += logLikelihood[(w, c)]
    return max(total.items(), key=operator.itemgetter(1))[0]

def tag(review):
    labels = []  # list to store adjective-noun pairs
    adjectives = set()  # set for storing adjectives
    tagged_list = nltk.pos_tag(nltk.word_tokenize(review))
    for i in range(len(tagged_list)-1):
        if tagged_list[i][1] == 'JJ' and tagged_list[i+1][1] in ['NN', 'NNS']:
            if not tagged_list[i+1][0].startswith('not_'):
                labels.append(tagged_list[i][0] + " " + tagged_list[i+1][0])
            adjectives.add(tagged_list[i][0])

    if not labels and not adjectives:
        labels.append('good')
    else:
        for pair in labels:
            if pair.split()[0] in adjectives:
                adjectives.remove(pair.split()[0])

    return labels, adjectives

@app.route('/predict', methods=['POST'])
def predict_sentiment():
    data = request.json
    review = data['review']
    
    logprior, loglikelihood, vocab = load_model()
    sentiment = test(process_review(review), logprior, loglikelihood, ['neg', 'pos'], vocab)

    return jsonify({'sentiment': sentiment})

@app.route('/tag', methods=['POST'])
def tag_review():
    data = request.json
    review = data['review']

    labels, adjectives = tag(review)

    return jsonify({'labels': labels, 'adjectives': list(adjectives)})


if __name__ == '__main__':
    app.run(debug=True)