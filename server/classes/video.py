import re
import json
import utils
import apiconnection
from utils import UserFaultException
from classes.voting import Voting

from urllib.parse import urlparse
from urllib.parse import parse_qs


class Video:
    def __init__(self,id,url,user):
        self.id = id
        self.validateVideo(url,user)
        self.url = url
        self.user = user
        api_data = self.getVideoDataFromAPI()
        self.durationInSeconds = api_data['duration']
        self.snippetData = api_data['snippet']

        self.skipVoting = Voting()
        self.moveUpVoting = Voting()

    def validateVideo(self,url,user):
        if self.validateYoutube(url):
            self.type = 'youtube'
        else:
            raise UserFaultException('Invalid video url',user)

    def validateYoutube(self,url):
        regex = r'(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=([^"&?\/\s]{11})|youtu\.be\/([^"&?\/\s]{11}))'
        return re.match(regex,url)

    #duration data from API
    def getVideoDataFromAPI(self):
        if self.type == 'youtube':
            return self.getVideoDataFromYoutubeAPI()
        
    def getVideoDataFromYoutubeAPI(self):
        service = apiconnection.buildApiService()

        videoId = self.getYoutubeIdFromURL() 
        self.videoId = videoId[0]

        return apiconnection.getVideoDataFromAPI(service,videoId)

    def getYoutubeIdFromURL(self):
        if 'youtu.be' in self.url:
            return urlparse(self.url).path[1:]
        elif 'youtube.com' in self.url:
            return parse_qs(urlparse(self.url).query)['v']

    def refreshVoting(self,users):
        self.skipVoting.refreshVoting(users)
        self.moveUpVoting.refreshVoting(users)


    def voteSkip(self,user,voteBool):
        self.skipVoting.updateUser(user,voteBool)

    def voteMoveUp(self,user,voteBool):
        self.moveUpVoting.updateUser(user,voteBool)


    def canBeSkipped(self):
        return self.skipVoting.majority

    def canBeMovedUp(self):
        return self.moveUpVoting.majority


    def clearMoveUpVoting(self):
        return self.moveUpVoting.clear()


    def toData(self,sid):
        return {
            'id': self.id,
            'url': self.url,
            'videoId': self.videoId,
            'title': self.snippetData['title'],
            'type': self.type,
            'user': self.user.toData(),
            'duration_in_seconds':self.durationInSeconds,
            'skip_voting': self.skipVoting.toData(sid),
            'move_up_voting': self.moveUpVoting.toData(sid)
        }
    

