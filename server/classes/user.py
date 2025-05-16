import re
import json
import utils
from utils import UserFaultException



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