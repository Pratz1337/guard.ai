import torch
import torchaudio
import numpy as np
import soundfile as sf

class SimpleAudioClassifier(torch.nn.Module):
    def __init__(self):
        super(SimpleAudioClassifier, self).__init__()
        self.conv1 = torch.nn.Conv1d(1, 16, kernel_size=3, stride=1, padding=1)
        self.conv2 = torch.nn.Conv1d(16, 32, kernel_size=3, stride=1, padding=1)
        self.adaptive_pool = torch.nn.AdaptiveAvgPool1d(1000)
        self.fc1 = torch.nn.Linear(32 * 1000, 128)
        self.fc2 = torch.nn.Linear(128, 10)
        self.pool = torch.nn.MaxPool1d(2)
        self.relu = torch.nn.ReLU()

    def forward(self, x):
        x = self.relu(self.conv1(x))
        x = self.pool(x)
        x = self.relu(self.conv2(x))
        x = self.pool(x)
        x = self.adaptive_pool(x)
        x = x.view(x.size(0), -1) 
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        return x

def poison_audio(input_file_path, output_file_path, epsilon=0.01):
    waveform, sample_rate = torchaudio.load(input_file_path)

    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)

    waveform = waveform.unsqueeze(0)

    model = SimpleAudioClassifier()
    model.eval() 
    criterion = torch.nn.CrossEntropyLoss()

    # Generate adversarial noise
    waveform.requires_grad = True
    output = model(waveform)
    target = torch.zeros(output.size(0), dtype=torch.long)  # Dummy target for loss calculation
    loss = criterion(output, target)
    model.zero_grad()
    loss.backward()

    # Create adversarial example
    noise = epsilon * waveform.grad.sign()
    poisoned_waveform = waveform + noise
    poisoned_waveform = poisoned_waveform.clamp(min=-1.0, max=1.0).detach().squeeze(0).numpy()

    # Save the poisoned audio file
    sf.write(output_file_path, poisoned_waveform.T, sample_rate)  # Transpose for correct format

