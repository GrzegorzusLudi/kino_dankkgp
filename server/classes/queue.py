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
        self.videoIdCounter = 0

    def addVideo(self,user,url):
        video = Video(self.videoIdCounter,url,user)
        self.videoIdCounter += 1
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

    def voteSkipCurrentVideo(self,user,voteBool):
        if self.currentlyPlayedVideo != None:
            self.currentlyPlayedVideo.voteSkip(user,voteBool)

            self.removeSkippedVideos()

    def voteMoveVideoUp(self,user,videoId,voteBool):
        video = self.getVideoById(videoId)
        if video != None:
            video.voteMoveUp(user,voteBool)

            if video.canBeMovedUp():
                self.moveVideoUp(user,video)
        
    def voteSkipVideo(self,user,videoId,voteBool):
        video = self.getVideoById(videoId)
        if video != None:
            video.voteSkip(user,voteBool)

            if video.canBeSkipped():
                self.removeSkippedVideos()


    def moveVideoUp(self,user,video):        
        self.queue = [video] + list(filter(lambda x: x.id != video.id, self.queue))
        video.clearMoveUpVoting()

        self.updateCurrentVideo()



    def getVideoById(self,videoId):
        videosFound = list(filter(lambda x: x.id == videoId, self.queue))

        if len(videosFound) == 0:
            return None
        
        return videosFound[0]

    def removeSkippedVideos(self):
        self.queue = list(filter(lambda x: not x.canBeSkipped(), self.queue))
        self.updateCurrentVideo()

    def updateCurrentVideo(self):
        if len(self.queue) == 0:
            self.currentlyPlayedVideo = None
        else:
            self.currentlyPlayedVideo = self.queue[0]
        self.currentlyPlayedSecond = 0


    def toData(self,sid):
        return { 
            'videos': [ video.toData(sid) for video in self.queue ],
            'currentlyPlayedVideo': self.currentlyPlayedVideo.toData(sid) if self.currentlyPlayedVideo != None else None,
            'currentlyPlayedSecond': self.currentlyPlayedSecond
            }