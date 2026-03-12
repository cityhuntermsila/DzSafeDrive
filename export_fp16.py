from ultralytics import YOLO

# Load a model
model = YOLO('yolov8n.pt')  # load an official YOLOv8n model

# Export the model to TFJS format
# half=True tells it to use FP16 quantization
model.export(format='tfjs', half=True, imgsz=640)
print("Export completed successfully.")
