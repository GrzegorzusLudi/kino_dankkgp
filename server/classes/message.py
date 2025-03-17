import re
import json
import utils
import datetime
from utils import UserFaultException


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
    