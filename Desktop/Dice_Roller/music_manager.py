import os
import sys
import threading
import time
from config import MUSIC_FILE

# Try to import pygame early
try:
    import pygame
    pygame.mixer.init()  # Initialize the mixer specifically
    _pygame_available = True
except ImportError:
    _pygame_available = False
    print("Error: pygame is not available. Music functionality will be disabled.")
    print("To install pygame: pip install pygame")


class MusicManager:
    def __init__(self):
        self.music_playing = False
        self.music_thread = None
        self.music_file = MUSIC_FILE
        
    def load_music(self):
        """Load and prepare the background music."""
        if not _pygame_available:
            return False
            
        try:
            # Check if music file exists
            if not self.music_file or not os.path.exists(self.music_file):
                print(f"Warning: Music file '{self.music_file}' not found.")
                print("Music functionality will be disabled.")
                print("To enable music, place a music file (e.g., .mp3, .wav, .ogg) in the same directory as this script.")
                print("Then update the MUSIC_FILE constant in config.py to match your file name.")
                return False
                
            # Load the music file
            pygame.mixer.music.load(self.music_file)
            print(f"Music loaded successfully: {self.music_file}")
            return True
            
        except Exception as e:
            print(f"Error loading music: {e}")
            return False
    
    def play_music(self):
        """Start playing background music in a separate thread."""
        if not _pygame_available or not self.music_file:
            return
            
        if not self.music_playing:
            try:
                # Start music in a separate thread to avoid blocking the GUI
                self.music_thread = threading.Thread(target=self._play_music_loop, daemon=True)
                self.music_thread.start()
                self.music_playing = True
                print("Music started playing.")
            except Exception as e:
                print(f"Error playing music: {e}")
    
    def _play_music_loop(self):
        """Internal method to play music in a loop."""
        try:
            pygame.mixer.music.play(-1)  # -1 means loop indefinitely
            # Keep the thread alive while music is playing
            while self.music_playing:
                time.sleep(0.1)
        except Exception as e:
            print(f"Error in music loop: {e}")
    
    def stop_music(self):
        """Stop the background music."""
        if not _pygame_available:
            return
            
        if self.music_playing:
            try:
                pygame.mixer.music.stop()
                self.music_playing = False
                print("Music stopped.")
            except Exception as e:
                print(f"Error stopping music: {e}")
    
    def is_music_available(self):
        """Check if music functionality is available."""
        return _pygame_available and self.music_file
    
    def is_playing(self):
        """Check if music is currently playing."""
        return self.music_playing 