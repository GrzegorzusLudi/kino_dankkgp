import re
import json
import utils
from utils import UserFaultException
from classes.video import Video

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

    def update(self,users):
        if self.currentlyPlayedVideo != None:
            self.currentlyPlayedSecond += 1
            self.checkNewVideo()
            self.checkVideosVoting(users)

    def checkNewVideo(self):
        if self.currentlyPlayedSecond >= self.currentlyPlayedVideo.durationInSeconds:
            self.queue = self.queue[1:]
            if len(self.queue) > 0:
                self.currentlyPlayedVideo = self.queue[0]
            else:
                self.currentlyPlayedVideo = None
            self.currentlyPlayedSecond = 0

    def checkVideosVoting(self,users):
        for video in self.queue:
            video.refreshVoting(users)

    def voteSkipCurrentVideo(self,user,skipBool):
        if self.currentlyPlayedVideo != None:
            self.currentlyPlayedVideo.voteSkip(user,skipBool)

            self.removeSkippedVideos()

    def removeSkippedVideos(self):
        if self.currentlyPlayedVideo.canBeSkipped():
            self.currentlyPlayedSecond = 0

        self.queue = list(filter(lambda x: not x.canBeSkipped(), self.queue))
        if len(self.queue) == 0:
            self.currentlyPlayedVideo = None
        else:
            self.currentlyPlayedVideo = self.queue[0]

    def toData(self,sid):
        return { 
            'videos': [ video.toData(sid) for video in self.queue ],
            'currentlyPlayedVideo': self.currentlyPlayedVideo.toData(sid) if self.currentlyPlayedVideo != None else None,
            'currentlyPlayedSecond': self.currentlyPlayedSecond
            }