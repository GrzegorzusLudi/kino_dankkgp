import math


class Voting:
    def __init__(self):
        self.usersVoted = []
        self.majority = False
        self.userNumberToHaveMajority = 0

    def refreshVoting(self,users):
        userNumber = len(users.items())

        newUsersVoted = []
        for userSid in self.usersVoted:
            if userSid in users:
                newUsersVoted.append(userSid)

        self.usersVoted = newUsersVoted

        self.userNumberToHaveMajority = math.ceil(userNumber / 2)

        self.updateMajority()

    def updateMajority(self):
        self.majority = len(self.usersVoted) >= self.userNumberToHaveMajority

    def updateUser(self,user,voteBool):
        sid = user.sid

        if voteBool and (sid not in self.usersVoted):
            self.usersVoted.append(sid)
        elif (not voteBool) and (sid in self.usersVoted):
            self.usersVoted.remove(sid)

        self.updateMajority()

        
    def toData(self,sid):
        return {
            'you_voted': sid in self.usersVoted,
            'user_number_voted': len( self.usersVoted ),
            'user_number_to_have_majority': self.userNumberToHaveMajority
        }