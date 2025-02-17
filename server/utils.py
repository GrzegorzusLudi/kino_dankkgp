import json

class UserFaultException(Exception):
    def __init__(self,message,user):
        super().__init__(message)
        self.user = user

def jsonify(obj):
    return json.dumps(obj)

def raiseError(message,user):
    raise UserFaultException(message,user)

