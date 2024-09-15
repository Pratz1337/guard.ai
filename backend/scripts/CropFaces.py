from ultralytics import YOLO
import cv2
import numpy as np
from pathlib import Path


def crop_faces(image_np_array):
    # Load a model

    model_path = r"C:\Users\sayal\OneDrive\Desktop\final\ait2\fence.ai\backend\models\face_recogniser.pt"
    model = YOLO(model_path)  # load a custom model

    img = cv2.imdecode(image_np_array, cv2.IMREAD_COLOR)
    results = model(img)  # return a list of Results object

    cropped_images = []  # List to store cropped images

    for result in results:
        # get classification of result
        boxes = result.boxes.xyxy.tolist()
    # Iterate through the bounding boxes
        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = box
            # Crop the object using the bounding box coordinates
            cropped_img = img[int(y1):int(y2), int(x1):int(x2)]
            cropped_images.append(cropped_img)

    # Convert list of images to a NumPy array
    # Note: This assumes all images are resized to a common shape for consistency
    target_width, target_height = 128, 128  # Example target size
    cropped_images_resized = [cv2.resize(img, (target_width, target_height))
                              for img in cropped_images]
    images_array = np.array(cropped_images_resized)
    print("Shape of the images array:", images_array.shape)
    return images_array
