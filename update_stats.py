import json
from datetime import datetime

# Data statistik otomatis (Anda bisa memperbarui angka di sini atau menghubungkannya ke sumber data)
new_data = {
    "totalEarnings": "$0.03",
    "totalDownloads": "0",
    "totalStreams": "50",
    "youtubeViews": "767",
    "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}

with open('data.json', 'w') as f:
    json.dump(new_data, f, indent=4)

print("Data berhasil diperbarui.")
