import cv2
import numpy as np


def video_to_frames(video_path):
    # Create a VideoCapture object
    cap = cv2.VideoCapture(video_path)

    # Check if video opened successfully
    if not cap.isOpened():
        print("Error: Could not open video.")
        return []

    frames = []  # List to store frames

    # Read until video is completed
    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()

        # If frame is read correctly ret is True
        if not ret:
            break

        if len(frames) >= 20:
            break

        frames.append(frame)  # Append the frame to the list

    # When everything done, release the video capture object
    cap.release()

    return frames


def convert_video(video_path):
    frames = video_to_frames(video_path)
    frames = np.array(frames)
    print(f"Shape of frames array is: {frames.shape}")
    return frames