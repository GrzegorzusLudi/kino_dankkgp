import re
import json
import utils
from utils import UserFaultException



class Queue:
    def __init__(self):
        self.queue = []
        self.currentlyPlayedVideo = None

    def addVideo(self,user,url):
        video = Video(url,user)
        self.queue.append(video)
        
    def toData(self):
        return { 
            'videos': [ video.toData() for video in self.queue ],
            'currentlyPlayed': self.currentlyPlayedVideo.toData() if self.currentlyPlayedVideo != None else None
            }


class Video:
    def __init__(self,url,user):
        self.validateVideo(url,user)
        self.url = url
        self.user = user

    def validateVideo(self,url,user):
        if self.validateYoutube(url):
            self.type = 'youtube'
        else:
            raise UserFaultException('Invalid video url',user)

    def validateYoutube(self,url):
        #regex = r'(https?:\/\/)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})'
        regex = r'(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=([^"&?\/\s]{11})|youtu\.be\/([^"&?\/\s]{11}))'
        return re.match(regex,url)

    def toData(self):
        return {
            'url': self.url,
            'type': self.type,
            'user': self.user.toData()
        }

