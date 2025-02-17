import re
from googleapiclient.discovery import build

import os
from dotenv import load_dotenv
load_dotenv()


def buildApiService():
    return service = build('youtube', 'v3', developerKey=os.getenv('GOOGLE_API_KEY'))

