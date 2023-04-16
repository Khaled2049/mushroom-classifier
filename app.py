from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from keras.models import load_model
import cv2
import tensorflow as tf
import numpy as np

app = Flask(__name__)
cors = CORS(app, resources={r"/upload": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

model = load_model('models/model.h5')


@app.route('/')
@cross_origin()
def hello_world():
    return {"message": 'Hello, World!'}


@app.route('/upload', methods=['GET', 'POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        f.save('images/' + f.filename)

        img = cv2.imread('images/' + f.filename)
        resize = tf.image.resize(img, (256, 256))
        yhat = model.predict(np.expand_dims(resize/255, 0))
        prediction = yhat.astype(np.float32)
        return jsonify({"prediction": str(prediction[0][0])})


if __name__ == '__main__':
    app.run(port=3001, debug=True)
