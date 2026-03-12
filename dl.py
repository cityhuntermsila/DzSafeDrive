import urllib.request
import os

base_url = "https://raw.githubusercontent.com/vladmandic/face-api/master/model/"
files = ["yolov8n.json", "yolov8n.weights.bin"]

os.makedirs("public/yolov8n_web_model", exist_ok=True)

try:
    for f in files:
        print(f"Downloading {f}...")
        if f.endswith('.json'):
            urllib.request.urlretrieve(base_url + f, "public/yolov8n_web_model/model.json")
        else:
             urllib.request.urlretrieve(base_url + f, "public/yolov8n_web_model/group1-shard1of1.bin")
    print("Download complete.")
except Exception as e:
    print(f"Error downloading from {base_url}: {e}")
