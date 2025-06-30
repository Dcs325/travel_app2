import os

# Suppress the Tk deprecation warning on macOS
os.environ['TK_SILENCE_DEPRECATION'] = '1'

# --- Configuration ---
MUSIC_FILE = "background_music.mp3"  # !!! IMPORTANT: Replace with your actual music file path
DICE_SIDES = 6
NUM_DICE = 3
INITIAL_PLAYER_BALANCE = 100

# --- Color Palette (Customizable!) ---
COLOR_PRIMARY = "#2c3e50"     # Dark Blue/Gray for background
COLOR_SECONDARY = "#34495e"   # Slightly lighter Dark Blue/Gray for frames
COLOR_ACCENT = "#e74c3c"      # Red for highlights/title
COLOR_LOSE = "#c0392b"        # Darker Red for lose
COLOR_WIN = "#27ae60"         # Green for win
COLOR_POINT = "#f39c12"       # Orange for point
COLOR_PUSH = "#007bff"        # Blue for push
COLOR_TEXT_LIGHT = "#ecf0f1"  # Light gray for most text
COLOR_TEXT_DARK = "#2c3e50"   # Dark text for light backgrounds
COLOR_BUTTON_ROLL_DISABLED = "red"  # Original red for disabled state
COLOR_BUTTON_ROLL_ACTIVE = "#FF4500"  # Orange Red for active state
COLOR_BUTTON_MUSIC_PLAY = "#f5cd2d"  # Yellow for play music
COLOR_BUTTON_MUSIC_STOP = "#e84a4a"  # Red for stop music
COLOR_BUTTON_BET = "#6c757d"  # Gray for bet buttons
COLOR_BORDER = "#bdc3c7"      # Light border color

# --- Window Configuration ---
WINDOW_WIDTH = 1000
WINDOW_HEIGHT = 800
WINDOW_TITLE = "Cee-lo Dice Game" 