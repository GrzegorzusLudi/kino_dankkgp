import re
from googleapiclient.discovery import build

service = build('youtube', 'v3', developerKey='AIzaSyDAEkqCJsG3aUDTepgIHZIq2riYkPQaO-g')

result = service.videos().list(part='contentDetails',id='DQEHqbKAY20',maxResults=1).execute()

formatted = result['items'][0]['contentDetails']['duration']


print(formatted)
print(re.findall(r'\d+',formatted))