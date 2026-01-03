from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from utils import UserFaultException

from classes.appstate import AppState
from classes.user import User



application_state = AppState()
def run_socketio_app(app):

    socketio = SocketIO(app, logger=True)
    socketio.run(app)

    #connect events
    @socketio.on('connect')
    def user_connect():
        emit('message', {'data': 'Connected', 'sid': request.sid})
        application_state.addUser(request.sid)


    @socketio.on('disconnect')
    def user_disconnect():
        application_state.removeUser(request.sid)


    #chat events
    @socketio.on('set-nick')
    def set_nick(data):
        user = application_state.getUser(request.sid)
        nick = data['data']
        application_state.checkIfUserExists(nick,user)
        user.setNick(nick)
        notify_about_state_change(socketio)
    
    @socketio.on('chat-message')
    def chat_message(data):
        application_state.addMessage(request.sid,data['data'])
    
    #queue events
    @socketio.on('queue-add-video')
    def queue_add_video(data):
        application_state.addVideo(request.sid,data['data'])

    @socketio.on('queue-skip-current-video')
    def skip_current_video(data):
        skipBool = data['data'] == 'true'
        application_state.skipCurrentVideo(request.sid,skipBool)

    #error handling
    @socketio.on_error()
    def chat_error_handler(e):
        print(e)
        if isinstance(e, UserFaultException):
            print('An error has occurred: ' + str(e))
            emit('error',{'data':str(e)},to=e.user.sid)
        else:
            raise e

    return (socketio,application_state)

def update_application_state():
    application_state.update()

last_state = ''
def notify_about_state_change(socket,getall=False):
    rendered_state = application_state.getrenderedstate(getall)
    print(rendered_state)
    if len(rendered_state.values()) > 0:
        socket.emit('statechange',{'data':rendered_state})
        