# Cee-lo Dice Game - Modular Version

A modular implementation of a Cee-lo dice game with GUI, featuring player management, custom betting, automatic round-based play, winner declaration, and a clear, responsive interface.

## Project Structure

The application is organized into modular components for maintainability and clarity:

### Core Modules

- **`config.py`** - Configuration constants, colors, and settings
- **`dice_logic.py`** - Dice rolling mechanics and game evaluation rules
- **`music_manager.py`** - Background music functionality using pygame (optional)
- **`player_manager.py`** - Player data management and game state
- **`gui_components.py`** - Reusable GUI components and styling utilities
- **`main.py`** - Main application class and entry point

### Legacy File

- **`dice_roller_gui.py`** - Original monolithic file (kept for reference)

## Features

- **Player Management**: Add/remove players, manage balances
- **Custom Betting System**: Place any amount you want to bet, every round. **Bets persist until a scoring outcome (Win, Lose, or Point); the "Place Bet" button only appears when needed.**
- **Round-Based Play**: Each player rolls once per round
- **Automatic Winner Declaration**: Winner is determined and announced after all players roll
- **Pot Payout**: Winner receives the pot, losers lose their bets, ties split the pot
- **Automatic Round Reset**: Game resets for the next round automatically
- **Player List Display**: The last player with money is now labeled as **WINNER** (not "OUT") in the player list and info area
- **Always-Visible Place Bet Button**: The "Place Bet" button is always available for the current player when needed
- **Dice Rolling**: Visual ASCII dice display with Cee-lo rules
- **Smaller, More Visible Dice**: Dice are sized to always fit the window
- **Game Logging**: Real-time game event logging
- **Responsive GUI**: Clean, modern interface with consistent styling
- **Black Text Buttons**: All buttons use black lettering for better readability
- **Leaderboard:** Track and display the number of rounds won by each player ("Show Leaderboard" button, also accessible from the winner popup)
- **History Log:** View a popup with the full round-by-round history, including all rolls and outcomes ("Show History" button, also accessible from the winner popup)
- Handles player elimination and game-over scenarios with popups and reset options. **When only one player has money left, a popup declares them the overall winner.**
- **Play Again Option:** The winner popup includes a "Play Again" button that resets balances and statuses but keeps the player list.
- Planned: Customizable rules, min/max bet, flexible player count, sound effects, and more.

## Game Rules (Cee-lo)

1. **1-2-3**: Automatic loss
2. **4-5-6**: Automatic win (Cee-lo!)
3. **Trips**: Three of a kind - automatic win
4. **Point**: Two of a kind with a unique third number - the unique number becomes the point
5. **No Score**: Any other combination - no point established

## Installation

1. Ensure Python 3.x is installed
2. Install required dependencies:
   ```bash
   pip install pygame  # Optional - for background music
   ```
3. For GUI functionality, ensure tkinter is available (usually included with Python)

## Usage

Run the main application:
```bash
python3 main.py
```

### Setup Phase
1. Add players using the "Add Player" button
2. Optionally deposit additional funds for players
3. Click "Start Game" when ready

### Game Phase (Round-Based)
1. Each player places a bet and rolls once per round
2. After all players have rolled, the winner is automatically determined and announced
3. The winner receives the pot (sum of all bets); ties split the pot
4. Balances are updated, and the next round starts automatically
5. Continue until all players are out of money

## Game Flow

### Automatic Round-Based Play
- **Each player rolls once per round**
- **Winner is determined and paid automatically** after all have rolled
- **Pot payout**: Winner gets the pot, ties split it
- **Automatic round reset**: Next round starts with the first active player
- **If a player rolls "No Score," they roll again (the player does not change)**
- **When only one player has money left, they are declared the overall winner and labeled as WINNER in the player list**

### Betting System
- **Custom Amounts**: Enter any bet amount you want
- **Automatic Prompting**: Roll button prompts for bet if none set
- **Bets persist until a scoring outcome (Win, Lose, or Point)**
- **"Place Bet" button only appears when needed**
- **Fresh Start**: Each player starts with no bet when it's their turn

## Music Setup (Optional)

To enable background music:
1. Place a music file (MP3, WAV, or OGG) in the project directory
2. Update the `MUSIC_FILE` constant in `config.py` to match your file name
3. The music will automatically load and be available for playback

## Modular Benefits

- **Separation of Concerns**: Each module handles a specific aspect of the application
- **Maintainability**: Easier to modify individual components without affecting others
- **Reusability**: Components can be reused in other projects
- **Testing**: Individual modules can be tested in isolation
- **Scalability**: Easy to add new features or modify existing ones

## File Descriptions

### `config.py`
Contains all configuration constants including:
- Window dimensions and title
- Color palette for consistent styling
- Game settings (dice sides, number of dice, initial balance)
- Music file path (optional)

### `dice_logic.py`
Handles all dice-related functionality:
- `roll_single_die()`: Simulates rolling a single die
- `get_die_ascii_face()`: Returns ASCII art for dice faces
- `evaluate_roll()`: Implements Cee-lo game rules

### `music_manager.py`
Manages background music functionality:
- `MusicManager` class for music playback
- Thread-safe music playing
- Automatic music file validation

### `player_manager.py`
Manages player data and game state:
- `PlayerManager` class for player operations
- Betting logic and balance management
- Game state tracking and validation
- Automatic player rotation

### `gui_components.py`
Provides reusable GUI components:
- Font configuration and management
- Styled widget creation functions
- Utility functions for common GUI operations
- Consistent black text styling for buttons

### `main.py`
Main application class and entry point:
- `CeeLoDiceGameApp` class orchestrates all components
- GUI setup and event handling
- Game flow management
- Automatic round-based play and winner logic
- Always-visible betting UI

## Recent Updates

### v2.3 - Winner Label, Play Again, and UI/Logic Fixes
- **Player List Display:** The last player with money is now labeled as WINNER (not "OUT") in the player list and info area
- **Game Over Logic:** When only one player has money left, a popup declares them the overall winner, and the log reflects this
- **Play Again Option:** The winner popup includes a "Play Again" button that resets balances and statuses but keeps the player list
- **Betting System:** Bets persist until a scoring outcome (Win, Lose, or Point); the "Place Bet" button only appears when needed
- **Bug Fixes:** The "ROLL DICE" button is always enabled/disabled at the correct times; the "Place Bet" prompt only appears when appropriate; if a player rolls "No Score," they roll again (the player does not change)
- **Leaderboard and History:** Both are accessible from the winner popup as well as the main interface

### v2.2 - Round-Based Play and Winner Logic
- **Round-based play:** Each player rolls once per round
- **Automatic winner declaration and payout** after all players roll
- **Pot is awarded to the winner, ties split the pot**
- **Automatic round reset** for continuous play

### v2.1 - UI and Logic Improvements
- **"Place Bet" button is always visible** for the current player
- **Dice are smaller and always fit the window**
- **Bugfix:** Betting UI and player switching are now robust and reliable

### v2.0 - Simplified Interface
- **Removed music controls** for cleaner interface
- **Simplified betting system** - custom amounts only
- **Automatic player switching** when points are achieved
- **Black text buttons** for better readability
- **Smaller "Back to Setup" button**
- **Enhanced dice display** with die labels

### v1.0 - Modular Structure
- **Broke down monolithic file** into focused modules
- **Improved maintainability** and code organization
- **Added comprehensive testing** with `test_modules.py`
- **Enhanced documentation** and usage instructions

## Testing

Run the test suite to verify all components work correctly:
```bash
python3 test_modules.py
```

## Contributing

To extend the application:
1. Identify the appropriate module for your changes
2. Follow the existing code style and patterns
3. Update the README if adding new features
4. Test your changes thoroughly

## License

This project is open source and available under the MIT License. 