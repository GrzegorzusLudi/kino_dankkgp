import os
import re
from dotenv import load_dotenv
from googleapiclient.discovery import build

load_dotenv()

service = build('youtube', 'v3', developerKey=os.getenv('GOOGLE_API_KEY'))

result = service.videos().list(part='contentDetails',id='DQEHqbKAY20',maxResults=1).execute()

formatted = result['items'][0]['contentDetails']['duration']


print(formatted)
print(re.findall(r'\d+',formatted))