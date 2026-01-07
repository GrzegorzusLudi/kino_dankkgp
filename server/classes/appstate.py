import re
import json
import utils
from utils import UserFaultException
from classes.user import User
from classes.message import Message
from classes.queue import Queue

class AppState:
    def __init__(self):
        self.usernum = 0 

        self.messages = []
        self.users = {}

        self.queue = Queue()

        self.previousStateStringified = None

        self.MAX_MESSAGES = 200

    def getAllUsers(self):
        return self.users

    def getUser(self,sid):
        return self.users[sid]

    def addUser(self,sid):

        newuser = User(sid,self.usernum)
        self.usernum += 1

        self.users[sid] = newuser

    def removeUser(self,sid):
        del self.users[sid]

    def removeUserBySid(self,sid):
        del self.users[sid]

    def checkIfUserExists(self,nick,user):
        for key,value in self.users.items():
            if value.nick == nick:
                raise UserFaultException('Nick already exists',user)

    def addMessage(self,sid,message):
        user = self.getUser(sid)
        newMessage = Message(user,message)

        self.messages += [newMessage]
        self.messages = self.messages[(-self.MAX_MESSAGES):]

    def addVideo(self,sid,url):
        user = self.getUser(sid)
        self.queue.addVideo(user,url)

    def skipCurrentVideo(self,sid,skipBool):
        user = self.getUser(sid)
        self.queue.voteSkipCurrentVideo(user,skipBool)

    def getrenderedstate(self,getall,sid):
        currentState = self.stateObject(sid)
        
        newstate = currentState
        statestringified = self.stringifyState(currentState)
        if self.previousStateStringified != None:
            newstate = {}
            for key,value in statestringified.items():
                if value != self.previousStateStringified[key]:
                    newstate[key] = currentState[key]

        self.previousStateStringified = statestringified

        if getall:
            return currentState
        return newstate

    def stringifyState(self,state):
        statecode = {}
        for key,value in state.items():
            statecode[key] = utils.jsonify(value)
        return statecode

    def update(self):
        self.queue.update(self.users)
        
    def stateObject(self,sid):
        return {
            'messages':[ message.toData() for message in self.messages ],
            'users':{ k:v.toData() for k,v in self.users.items() },
            'queue':self.queue.toData(sid)
        }
