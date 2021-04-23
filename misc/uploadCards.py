
import json
import requests

file = open("./cardsData.json")
data = json.load(file)

for card in data:
    requests.post("http://localhost:5001/monikers-ef6c5/us-central1/api/card", data={
        "title": card["title"],
        "origin": card["origin"],
        "description": card["description_sanatized"],
        "points": int(card["points"]),
        "createdAt": "2015-02-10T00:00:00.000Z"
    })

# {
#     "title": "Doge",
#     "description_unsanitized": "An Internet meme that shows a Shiba lnu surrounded by colorful Comic Sans text that\ndescribes its inner monologue, such as \"Wow,\" \"Concern,\" and \"so scare.\" There is much confuse over the name's pronunciation, yet it was recently used to brand a Bitcoin competitor.",
#     "description_sanatized": "An Internet meme that shows a Shiba lnu surrounded by colorful Comic Sans text that describes its inner monologue, such as \"Wow,\" \"Concern,\" and \"so scare.\" There is much confuse over the name's pronunciation, yet it was recently used to brand a Bitcoin competitor.",
#     "category": "Celebrity",
#     "origin": "Original: Celebrity",
#     "points": 3
# },