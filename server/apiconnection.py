import re
from googleapiclient.discovery import build

import os
from dotenv import load_dotenv
load_dotenv()


def buildApiService():
    return build('youtube', 'v3', developerKey=os.getenv('GOOGLE_API_KEY'))

def getVideoDataFromAPI(service, videoId):
    result = service.videos().list(part='contentDetails,snippet',id=videoId,maxResults=1).execute()

    formattedDuration = result['items'][0]['contentDetails']['duration']

    return {'duration': getDateInSeconds(formattedDuration), 'snippet':result['items'][0]['snippet'] }

def getDateInSeconds(date):
    timenumbers = re.findall(r'\d+[A-Z]',date)

    value = 0
    for tnum in timenumbers:
        unit = tnum[-1]
        amount = int(tnum[:-1])

        if unit == 'H':
            value += amount * 3600
        elif unit == 'M':
            value += amount * 60
        elif unit == 'S':
            value += amount

    return value

