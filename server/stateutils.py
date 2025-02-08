import json
import utils
import datetime

class AppState:
    def __init__(self):
        self.usernum = 0 

        self.messages = []
        self.users = {}

        self.MAX_MESSAGES = 200

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

    def addMessage(self,sid,message):
        user = self.getUser(sid)
        newMessage = Message(user,message)

        self.messages += [newMessage]
        self.messages = self.messages[(-self.MAX_MESSAGES):]

    def stateObject(self):
        return {
            'messages':[ message.toData() for message in self.messages ],
            'users':{ k:v.toData() for k,v in self.users.items() }
        }

    def renderedstate(self):
        return self.stateObject()
        


class Message:
    def __init__(self,user,message):
        self.user = user
        self.message = message
        self.date = datetime.datetime.today()

    def toData(self):
        return {
            'nick':self.user.nick,
            'message':self.message,
            'date':self.date.strftime('%Y-%m-%d'),
            'time':self.date.strftime('%H:%M:%S'),
        }
    
class User:
    def __init__(self,sid,num):
        self.sid = sid
        self.num = num
        self.nick = 'anonim' + str(num)

    def setNick(self,nick):
        self.nick = nick

    def toData(self):
        return {
            'nick':self.nick,
            'num':self.num
        }
