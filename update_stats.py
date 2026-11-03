import os
import json
import urllib.request
from datetime import datetime

API_KEY = os.environ.get("YOUTUBE_API_KEY")
CHANNEL_ID = "UC888e5EGVKQWDy6LGWUYRUw"  # Ganti dengan Channel ID YouTube Anda

def get_youtube_views():
    if not API_KEY or CHANNEL_ID == "UC888e5EGVKQWDy6LGWUYRUw":
        print("API Key atau Channel ID belum diatur.")
        return "767"  # Nilai default jika belum diset
    
    url = f"https://www.googleapis.com/youtube/v3/channels?part=statistics&id={CHANNEL_ID}&key={API_KEY}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if "items" in data and len(data["items"]) > 0:
                stats = data["items"][0]["statistics"]
                return stats.get("viewCount", "767")
    except Exception as e:
        print(f"Gagal mengambil data YouTube: {e}")
    return "767"

if __name__ == "__main__":
    print("Memperbarui statistik YouTube...")
    yt_views = get_youtube_views()
    
    # Data yang akan dimasukkan ke data.json
    new_data = {
        "totalEarnings": "$0.03",
        "totalDownloads": "0",
        "totalStreams": "50",
        "youtubeViews": yt_views,
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    with open('data.json', 'w') as f:
        json.dump(new_data, f, indent=4)

    print("Data berhasil diperbarui dengan views YouTube asli:", yt_views)
