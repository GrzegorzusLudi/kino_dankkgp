from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import utils

from stateutils import AppState,User



application_state = AppState()
def run_socketio_app(app):

    
    socketio = SocketIO(app, logger=True)
    socketio.run(app)

    #connect events
    @socketio.on('connect')
    def user_connect():
        emit('message', {'data': 'Connected'})
        application_state.addUser(request.sid)


    @socketio.on('disconnect')
    def user_disconnect():
        application_state.removeUser(request.sid)


    #chat events
    @socketio.on('set-nick')
    def set_nick(data):
        user = application_state.getUser(request.sid)
        user.setNick(data['data']) 
        notify_about_state_change(socketio)
    
    @socketio.on('chat-message')
    def chat_message(data):
        application_state.addMessage(request.sid,data['data'])

    return (socketio,application_state)

last_state = ''
def notify_about_state_change(socket):
    rendered_state = application_state.renderedstate()
    print(rendered_state)
    socket.emit('statechange',{'data':rendered_state})