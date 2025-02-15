
from flask import Flask, render_template
import utils
import socketpaths
from os.path import abspath

import threading
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

app.static_folder = abspath(app.root_path + '/static')
app.template_folder = abspath(app.root_path + '/templates')

print(dir(app))
# Static file serving route
@app.route('/static/<path:filename>')
def custom_static(filename):
    return send_from_directory('static', filename)

@app.route('/',methods=['GET'])
def index():
    return render_template('index.html')

socketio,application_state = socketpaths.run_socketio_app(app)

def timeout():
    i = 0
    while True:
        socketpaths.notify_about_state_change(socketio)

        print(i)
        i+=1
        time.sleep(1)

p = threading.Thread(target=timeout)
p.start()