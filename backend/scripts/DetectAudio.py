import numpy as np
import librosa
import tensorflow as tf
from tensorflow.keras.models import load_model

MODEL_PATH = r'C:\Users\sayal\OneDrive\Desktop\final\ait2\fence.ai\backend\models\audio_classifier.h5'
SAMPLE_RATE = 16000
DURATION = 5
N_MELS = 128
MAX_TIME_STEPS = 109

model = load_model(MODEL_PATH)

def preprocess_audio(file_path, sample_rate=SAMPLE_RATE, duration=DURATION, n_mels=N_MELS, max_time_steps=MAX_TIME_STEPS):

    audio, _ = librosa.load(file_path, sr=sample_rate, duration=duration)
    
    mel_spectrogram = librosa.feature.melspectrogram(y=audio, sr=sample_rate, n_mels=n_mels)
    mel_spectrogram = librosa.power_to_db(mel_spectrogram, ref=np.max)
    
    if mel_spectrogram.shape[1] < max_time_steps:
        mel_spectrogram = np.pad(mel_spectrogram, ((0, 0), (0, max_time_steps - mel_spectrogram.shape[1])), mode='constant')
    else:
        mel_spectrogram = mel_spectrogram[:, :max_time_steps]
    
    mel_spectrogram = np.expand_dims(mel_spectrogram, axis=-1)
    mel_spectrogram = np.expand_dims(mel_spectrogram, axis=0)
    
    return mel_spectrogram


def predict_audio(AUDIO_FILE_PATH) :
    
    audio_preprocessed = preprocess_audio(AUDIO_FILE_PATH)
    prediction = model.predict(audio_preprocessed)

    predicted_class = np.argmax(prediction, axis=1)[0]

    class_labels = ["fake", "real"]

    return f"The audio file is classified as: {class_labels[predicted_class]}"