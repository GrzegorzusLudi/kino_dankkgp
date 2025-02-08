from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import utils
from os.path import abspath

import multiprocessing
import time
    
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Static file serving route
@app.route('/static/<path:filename>')
def custom_static(filename):
    return send_from_directory('static', filename)

@app.route('/',methods=['GET'])
def index():
    return render_template('index.html')

@socketio.on('connect')
def test_connect():
    emit('message', {'data': 'Connected'})

@socketio.on('echo')
def test_message(message):
    print(message)
    emit('message', {'data': message['data']})

app.static_folder = abspath(app.root_path + '/../ugly_frontend_for_testing/static')
app.template_folder = abspath(app.root_path + '/../ugly_frontend_for_testing/templates')
socketio.run(app)

def timeout():
    i = 0
    while True:
        print(i)
        i+=1
        time.sleep(1)

p = multiprocessing.Process(target=bar)
p.start()

    