import re
import json
import utils
import apiconnection
from utils import UserFaultException

from urllib.parse import urlparse
from urllib.parse import parse_qs



class Queue:
    def __init__(self):
        self.queue = []
        self.currentlyPlayedVideo = None
        self.currentlyPlayedSecond = 0

    def addVideo(self,user,url):
        video = Video(url,user)
        self.queue.append(video)
        if self.currentlyPlayedVideo == None:
            self.currentlyPlayedVideo = video
        
    def toData(self):
        return { 
            'videos': [ video.toData() for video in self.queue ],
            'currentlyPlayedVideo': self.currentlyPlayedVideo.toData() if self.currentlyPlayedVideo != None else None,
            'currentlyPlayedSecond': self.currentlyPlayedSecond
            }

    def update(self):
        if self.currentlyPlayedVideo != None:
            self.currentlyPlayedSecond += 1
            self.checkNewVideo()

    def checkNewVideo(self):
        if self.currentlyPlayedSecond >= self.currentlyPlayedVideo.durationInSeconds:
            self.queue = self.queue[1:]
            if len(self.queue) > 0:
                self.currentlyPlayedVideo = self.queue[0]
            else:
                self.currentlyPlayedVideo = None
            self.currentlyPlayedSecond = 0


class Video:
    def __init__(self,url,user):
        self.validateVideo(url,user)
        self.url = url
        self.user = user
        api_data = self.getVideoDataFromAPI()
        self.durationInSeconds = api_data['duration']
        self.snippetData = api_data['snippet']


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

    def toData(self):
        return {
            'url': self.url,
            'videoId': self.videoId,
            'title': self.snippetData['title'],
            'type': self.type,
            'user': self.user.toData(),
            'duration_in_seconds':self.durationInSeconds,
        }

