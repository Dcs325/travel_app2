import sys
import tkinter as tk
from tkinter import messagebox, simpledialog

# Import our modular components
from config import *
from dice_logic import roll_single_die, get_die_ascii_face, evaluate_roll
from music_manager import MusicManager
from player_manager import PlayerManager
from gui_components import *

# Try to import tkinter early
try:
    import tkinter as tk
    from tkinter import messagebox, scrolledtext
    import tkinter.font as tkfont
    _tkinter_available = True
except ImportError:
    _tkinter_available = False
    print("Error: tkinter is not available. Please install tkinter to use the GUI.")
    print("If you are on Linux, try: sudo apt-get install python3-tk")
    print("If you are on macOS, ensure your Python installation includes Tcl/Tk.")
    sys.exit(1)

def get_unicode_die_face(roll):
    # roll: 1-6
    unicode_dice = ["\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"]
    return unicode_dice[roll - 1]

class CeeLoDiceGameApp:
    """
    Main application class for the Cee-lo Dice Game GUI.
    Manages the game state, player actions, and UI.
    """
    def __init__(self, master: tk.Tk) -> None:
        """
        Initialize the Cee-lo Dice Game application.
        Args:
            master (tk.Tk): The root Tkinter window.
        """
        self.master = master
        self.player_manager = PlayerManager()
        self.current_player_name_var = tk.StringVar(self.master)
        self.current_player_name_var.set("No Player Selected")
        self.round_rolls = {}  # Track each player's roll and outcome for the round
        self.round_history = []  # Track all round results
        self.game_has_started = False  # Track if the game has started
        self.high_contrast_mode = False  # Accessibility: high contrast mode
        self.font_scale = 1.0  # Accessibility: font scaling
        self.round_number = 1  # Track the current round number
        self.betting_phase = False  # Track if we're in the betting phase
        self.roll_sound = None
        try:
            import pygame
            pygame.mixer.init()
            self.roll_sound = pygame.mixer.Sound("roll_dice.wav")
        except Exception:
            self.roll_sound = None
        self._setup_window()
        self.fonts = setup_fonts()
        self._create_menu_bar()
        self._create_widgets()
        self._update_player_dropdown()
        self._setup_keyboard_navigation()

    def _setup_window(self) -> None:
        """
        Configure the main window properties (title, size, background, etc.).
        """
        self.master.title(WINDOW_TITLE)
        self.master.configure(bg=COLOR_PRIMARY)
        self.master.resizable(True, True)  # Allow resizing for responsive layout

    def _create_menu_bar(self) -> None:
        """
        Create the menu bar with Accessibility and Help options.
        """
        menubar = tk.Menu(self.master)
        accessibility_menu = tk.Menu(menubar, tearoff=0)
        accessibility_menu.add_command(label="Toggle High Contrast Mode", command=self._toggle_high_contrast_mode, accelerator="Ctrl+H")
        accessibility_menu.add_command(label="Increase Font Size", command=self._increase_font_size, accelerator="Ctrl+=")
        accessibility_menu.add_command(label="Decrease Font Size", command=self._decrease_font_size, accelerator="Ctrl+-")
        accessibility_menu.add_command(label="Toggle Fullscreen", command=self._toggle_fullscreen, accelerator="F11")
        menubar.add_cascade(label="Accessibility", menu=accessibility_menu)
        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        help_menu.add_command(label="How to Play", command=self._show_how_to_play)
        menubar.add_cascade(label="Help", menu=help_menu)
        self.master.config(menu=menubar)
        # Keyboard shortcuts (Ctrl+H, Ctrl+=, Ctrl+-, F11 or Cmd+... on Mac)
        if self.master.tk.call('tk', 'windowingsystem') == 'aqua':  # macOS
            self.master.bind_all('<Command-h>', lambda e: self._toggle_high_contrast_mode())
            self.master.bind_all('<Command-equal>', lambda e: self._increase_font_size())
            self.master.bind_all('<Command-minus>', lambda e: self._decrease_font_size())
            self.master.bind_all('<Command-F11>', lambda e: self._toggle_fullscreen())
        else:
            self.master.bind_all('<Control-h>', lambda e: self._toggle_high_contrast_mode())
            self.master.bind_all('<Control-equal>', lambda e: self._increase_font_size())
            self.master.bind_all('<Control-minus>', lambda e: self._decrease_font_size())
            self.master.bind_all('<F11>', lambda e: self._toggle_fullscreen())

    def _toggle_high_contrast_mode(self) -> None:
        """
        Toggle high-contrast mode for accessibility.
        """
        self.high_contrast_mode = not self.high_contrast_mode
        if self.high_contrast_mode:
            # Set high-contrast palette
            self._apply_color_palette({
                'COLOR_PRIMARY': '#000000',
                'COLOR_SECONDARY': '#222222',
                'COLOR_ACCENT': '#FFFF00',
                'COLOR_LOSE': '#FF0000',
                'COLOR_WIN': '#00FF00',
                'COLOR_POINT': '#00FFFF',
                'COLOR_PUSH': '#FFA500',
                'COLOR_TEXT_LIGHT': '#FFFFFF',
                'COLOR_TEXT_DARK': '#000000',
                'COLOR_BUTTON_ROLL_DISABLED': '#FF0000',
                'COLOR_BUTTON_ROLL_ACTIVE': '#FFFF00',
                'COLOR_BUTTON_BET': '#FFFF00',
                'COLOR_BORDER': '#FFFFFF',
            })
        else:
            # Restore default palette
            from config import COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_LOSE, COLOR_WIN, COLOR_POINT, COLOR_PUSH, COLOR_TEXT_LIGHT, COLOR_TEXT_DARK, COLOR_BUTTON_ROLL_DISABLED, COLOR_BUTTON_ROLL_ACTIVE, COLOR_BUTTON_BET, COLOR_BORDER
            self._apply_color_palette({
                'COLOR_PRIMARY': COLOR_PRIMARY,
                'COLOR_SECONDARY': COLOR_SECONDARY,
                'COLOR_ACCENT': COLOR_ACCENT,
                'COLOR_LOSE': COLOR_LOSE,
                'COLOR_WIN': COLOR_WIN,
                'COLOR_POINT': COLOR_POINT,
                'COLOR_PUSH': COLOR_PUSH,
                'COLOR_TEXT_LIGHT': COLOR_TEXT_LIGHT,
                'COLOR_TEXT_DARK': COLOR_TEXT_DARK,
                'COLOR_BUTTON_ROLL_DISABLED': COLOR_BUTTON_ROLL_DISABLED,
                'COLOR_BUTTON_ROLL_ACTIVE': COLOR_BUTTON_ROLL_ACTIVE,
                'COLOR_BUTTON_BET': COLOR_BUTTON_BET,
                'COLOR_BORDER': COLOR_BORDER,
            })
        self._refresh_colors()

    def _apply_color_palette(self, palette: dict) -> None:
        """
        Update global color variables for the app.
        """
        globals().update(palette)

    def _refresh_colors(self) -> None:
        """
        Refresh the colors of all main widgets to reflect the current palette.
        """
        # Recreate widgets to apply new colors
        self._create_widgets()
        self._update_player_dropdown()

    def _create_widgets(self) -> None:
        """
        Create and configure all GUI widgets for setup and game screens.
        Responsive: use expand/fill/grid weights for resizing.
        """
        # Main container frame
        self.main_container_frame = create_frame(
            self.master, 
            padx=30, 
            pady=30, 
            bd=5, 
            relief=tk.RAISED
        )
        self.main_container_frame.pack(expand=True, fill=tk.BOTH, padx=20, pady=20)
        self.main_container_frame.pack_propagate(True)

        # Content frame
        self.content_frame = create_frame(self.main_container_frame)
        self.content_frame.pack(expand=True, fill=tk.BOTH)
        self.content_frame.pack_propagate(True)

        # Setup frame
        self.setup_frame = create_frame(self.content_frame)
        self.setup_frame.pack(expand=True, fill=tk.BOTH)
        self.setup_frame.pack_propagate(True)

        # Game frame
        self.game_frame = create_frame(self.content_frame)
        self.game_frame.grid_rowconfigure(5, weight=1)  # Make dice area expandable
        self.game_frame.grid_columnconfigure(0, weight=1)
        self.game_frame.pack_propagate(True)
        
        self._create_setup_widgets()
        self._create_game_widgets()

        # Now set geometry after widgets are packed
        self.master.update_idletasks()
        self.master.geometry(f"{WINDOW_WIDTH}x{WINDOW_HEIGHT}")
        center_window(self.master)

    def _create_setup_widgets(self) -> None:
        """
        Create widgets for the setup screen (player management, start button, etc.).
        """
        # Title
        self.setup_title = create_title_label(self.setup_frame, "Cee-lo Dice Game Setup")
        self.setup_title.pack(pady=20)

        # Player management section
        player_frame = create_frame(self.setup_frame)
        player_frame.pack(pady=20)

        # Player input
        input_frame = create_frame(player_frame)
        input_frame.pack(pady=10)

        create_label(input_frame, "Player Name:").pack(side=tk.LEFT, padx=5)
        self.player_entry = create_entry(input_frame, width=20)
        self.player_entry.pack(side=tk.LEFT, padx=5)

        # Player buttons
        button_frame = create_frame(player_frame)
        button_frame.pack(pady=10)

        add_btn = create_button(button_frame, "Add Player", self._add_player)
        add_btn.pack(side=tk.LEFT, padx=5)
        add_tooltip(add_btn, "Add a new player to the game.")
        rem_btn = create_button(button_frame, "Remove Player", self._remove_player)
        rem_btn.pack(side=tk.LEFT, padx=5)
        add_tooltip(rem_btn, "Remove the selected player from the game.")
        dep_btn = create_button(button_frame, "Deposit Funds", self._deposit_funds)
        dep_btn.pack(side=tk.LEFT, padx=5)
        add_tooltip(dep_btn, "Add funds to the selected player's balance.")

        # Player list
        list_frame = create_frame(player_frame)
        list_frame.pack(pady=10)

        create_label(list_frame, "Players:").pack()
        self.player_listbox = create_listbox(list_frame, height=6, width=40)
        self.player_listbox.pack()

        # Start game button
        start_btn = create_colored_button(
            self.setup_frame, 
            "Start Game", 
            self._start_game, 
            bg_color=COLOR_WIN,
            fg_color=COLOR_TEXT_DARK,
            font_key='title_font'
        )
        start_btn.pack(pady=20)
        add_tooltip(start_btn, "Begin the game with the current players.")

        # How to Play button
        how_to_play_btn = create_button(
            self.setup_frame,
            "How to Play",
            self._show_how_to_play,
            font_key='header_font'
        )
        how_to_play_btn.pack(pady=10)
        add_tooltip(how_to_play_btn, "Learn the rules and tips for playing Cee-lo.")

    def _create_game_widgets(self) -> None:
        """
        Create widgets for the game screen using grid layout for persistent bottom buttons.
        """
        # Title
        self.game_title = create_title_label(self.game_frame, "Cee-lo Dice Game")
        self.game_title.grid(row=0, column=0, pady=20, sticky="n")

        # Player info area (persistent)
        self.player_info_area = create_frame(self.game_frame)
        self.player_info_area.grid(row=1, column=0, pady=5, sticky="ew")
        self._update_player_info_area()

        # Player selection
        player_select_frame = create_frame(self.game_frame)
        player_select_frame.grid(row=2, column=0, pady=10, sticky="ew")
        create_label(player_select_frame, "Current Player:").pack(side=tk.LEFT, padx=5)
        self.player_dropdown = tk.OptionMenu(
            player_select_frame,
            self.current_player_name_var,
            "No Player Selected",
            command=self._on_player_select
        )
        self.player_dropdown.config(
            font=self.fonts['default_font'],
            bg=COLOR_BUTTON_BET,
            fg=COLOR_TEXT_DARK
        )
        self.player_dropdown.pack(side=tk.LEFT, padx=5)

        # Player info (for current player)
        self.player_info_frame = create_frame(self.game_frame)
        self.player_info_frame.grid(row=3, column=0, pady=10, sticky="ew")

        # Betting section
        self.betting_frame = create_frame(self.game_frame)
        self.betting_frame.grid(row=4, column=0, pady=10, sticky="ew")

        # Dice display (now under the game log in the top right)
        self.dice_frame = create_frame(self.game_frame)
        self.dice_frame.grid(row=2, column=2, pady=(10, 0), sticky="ne")
        self.dice_placeholder = create_label(
            self.dice_frame,
            "Dice will appear here after rolling\nRoll the dice to see your results!",
            font_key='header_font',
            fg=COLOR_TEXT_LIGHT
        )
        self.dice_placeholder.pack(pady=20)

        # Roll button
        self.roll_button = create_colored_button(
            self.game_frame,
            "ROLL DICE",
            self._roll_dice,
            bg_color=COLOR_BUTTON_ROLL_ACTIVE,
            fg_color=COLOR_TEXT_DARK,
            font_key='roll_button_font'
        )
        self.roll_button.grid(row=6, column=0, pady=10)
        add_tooltip(self.roll_button, "Roll the dice for your turn.")

        # Back to setup button
        back_btn = create_button(
            self.game_frame,
            "Back to Setup",
            self._back_to_setup,
            font_key='default_font'
        )
        back_btn.grid(row=7, column=0, pady=10)
        add_tooltip(back_btn, "Return to the setup screen and reset the game.")

        # How to Play button
        how_to_play_btn = create_button(
            self.game_frame,
            "How to Play",
            self._show_how_to_play,
            font_key='default_font'
        )
        how_to_play_btn.grid(row=8, column=0, pady=10)
        add_tooltip(how_to_play_btn, "Learn the rules and tips for playing Cee-lo.")

        # Round indicator
        self.round_label = create_label(self.game_frame, f"Round {self.round_number}", font_key='header_font', fg=COLOR_ACCENT)
        self.round_label.grid(row=0, column=1, pady=20, sticky="ne")

        # Add game log (scrolled text area) at the top right of the game screen
        from tkinter import scrolledtext
        self.game_log = scrolledtext.ScrolledText(
            self.game_frame,
            width=32,
            height=6,
            state=tk.DISABLED,
            bg=COLOR_SECONDARY,
            fg=COLOR_TEXT_LIGHT,
            font=self.fonts['default_font'],
            relief=tk.SUNKEN,
            bd=2
        )
        self.game_log.grid(row=0, column=2, rowspan=2, padx=(20, 10), pady=(20, 10), sticky="ne")

    def _add_player(self) -> None:
        """
        Add a new player from the entry field to the player manager and update the UI.
        """
        player_name = self.player_entry.get().strip()
        success, message = self.player_manager.add_player(player_name)
        
        if success:
            self.player_entry.delete(0, tk.END)
            self._update_player_listbox()
            self._update_player_dropdown()
            self._log_message(message)
        else:
            show_message("Error", message, "error")

    def _remove_player(self) -> None:
        """
        Remove the selected player from the player manager and update the UI.
        """
        selection = self.player_listbox.curselection()
        if not selection:
            show_message("Error", "Please select a player to remove.", "error")
            return

        player_name = self.player_listbox.get(selection[0])
        success, message = self.player_manager.remove_player(player_name)
        
        if success:
            self._update_player_listbox()
            self._update_player_dropdown()
            self._log_message(message)
        else:
            show_message("Error", message, "error")

    def _deposit_funds(self) -> None:
        """
        Add funds to the selected player's balance via a dialog prompt.
        """
        selection = self.player_listbox.curselection()
        if not selection:
            show_message("Error", "Please select a player to deposit funds.", "error")
            return

        player_name = self.player_listbox.get(selection[0])
        amount = tk.simpledialog.askinteger("Deposit Funds", f"Enter amount to deposit for {player_name}:")
        
        if amount:
            success, message = self.player_manager.deposit_funds(player_name, amount)
            if success:
                self._update_player_listbox()
                self._log_message(message)
            else:
                show_message("Error", message, "error")

    def _start_game(self) -> None:
        """
        Start the game by switching to the game screen and initializing state.
        """
        if not self.player_manager.get_all_players():
            show_message("Error", "Please add at least one player before starting the game.", "error")
            return
        self.setup_frame.pack_forget()
        self.game_frame.pack(expand=True, fill=tk.BOTH)
        self._log_message("Game started!")
        self.game_has_started = True
        # Start betting phase for all players
        self._start_betting_phase()

    def _back_to_setup(self) -> None:
        """
        Return to the setup screen and reset the game state.
        """
        self.game_frame.pack_forget()
        self.setup_frame.pack(expand=True, fill=tk.BOTH)
        self.player_manager.reset_game()
        self._log_message("Returned to setup screen.")
        self.game_has_started = False

    def _update_player_listbox(self) -> None:
        """
        Update the player listbox with current player names, balances, and statuses.
        """
        self.player_listbox.delete(0, tk.END)
        all_players = self.player_manager.get_all_players()
        active_players = self.player_manager.get_players_with_balance()
        winner_name = active_players[0] if len(active_players) == 1 and self.game_has_started else None
        for player_name in all_players:
            player = self.player_manager.get_player(player_name)
            if player["is_out"]:
                status = " (OUT)"
            elif winner_name and player_name == winner_name:
                status = " (WINNER)"
            else:
                status = ""
            self.player_listbox.insert(tk.END, f"{player_name}: ${player['balance']}{status}")
        # Also update the persistent info area
        self._update_player_info_area()

    def _update_player_dropdown(self) -> None:
        """
        Update the player dropdown menu with current active players.
        """
        menu = self.player_dropdown["menu"]
        menu.delete(0, tk.END)
        
        active_players = self.player_manager.get_players_with_balance()
        if not active_players:
            self.current_player_name_var.set("No Players Available")
            return

        for player_name in active_players:
            menu.add_command(
                label=player_name,
                command=lambda p=player_name: self.current_player_name_var.set(p)
            )
        
        if self.current_player_name_var.get() not in active_players:
            self.current_player_name_var.set(active_players[0])

        # Disable dropdown during a round (reenable between rounds)
        if hasattr(self, 'player_dropdown'):
            if self.round_rolls:
                self.player_dropdown.config(state=tk.DISABLED)
            else:
                self.player_dropdown.config(state=tk.NORMAL)

    def _on_player_select(self, *args) -> None:
        print(f"DEBUG: _on_player_select called. Current player: {self.current_player_name_var.get()}")
        self._update_player_betting_ui()

    def _update_player_betting_ui(self) -> None:
        print(f"DEBUG: _update_player_betting_ui for {self.current_player_name_var.get()}")
        # Clear existing betting widgets
        for widget in self.betting_frame.winfo_children():
            widget.destroy()

        current_player = self.current_player_name_var.get()
        if current_player == "No Player Selected" or current_player == "No Players Available":
            self._log_message("No player selected for betting")
            return

        player = self.player_manager.get_player(current_player)
        if not player:
            self._log_message(f"Player {current_player} not found")
            return

        # Player info
        for widget in self.player_info_frame.winfo_children():
            widget.destroy()

        create_label(
            self.player_info_frame,
            f"Player: {current_player} | Balance: ${player['balance']} | Current Bet: ${player['current_bet']}"
        ).pack()

        # Only show Place Bet button if current_bet is 0 and in betting phase
        if player["current_bet"] == 0 and getattr(self, 'betting_phase', False):
            place_bet_btn = create_button(
                self.betting_frame,
                "Place Bet",
                self._prompt_for_bet,
                bg=COLOR_BUTTON_BET
            )
            place_bet_btn.pack(side=tk.LEFT, padx=5)
            add_tooltip(place_bet_btn, "Place your bet before rolling.")
            self.roll_button.config(state=tk.DISABLED)
        # Enable/disable roll button based on bet and round state
        if not getattr(self, 'betting_phase', False) and player["current_bet"] > 0:
            # Only enable roll button if player hasn't rolled this round or is rerolling after 'No Score'
            if current_player not in self.round_rolls or player["last_roll_outcome"] == "No Score":
                self.roll_button.config(state=tk.NORMAL)
            else:
                self.roll_button.config(state=tk.DISABLED)
        else:
            self.roll_button.config(state=tk.DISABLED)

        self._log_message(f"Betting UI updated for {current_player}")

    def _prompt_for_bet(self) -> None:
        show_message("Info", "All bets are placed at the start of the round.", "info")

    def _log_message(self, message: str) -> None:
        """
        Add a message to the game log (if enabled).
        Args:
            message (str): The message to log.
        """
        self.game_log.insert(tk.END, f"{message}\n")
        self.game_log.see(tk.END)

    def _roll_dice(self) -> None:
        """
        Roll the dice for the current player and update the game state/UI.
        Shows an animated dice roll effect before displaying the result.
        """
        # Play dice roll sound if available
        if self.roll_sound:
            try:
                self.roll_sound.play()
            except Exception:
                pass
        current_player = self.current_player_name_var.get()
        if current_player in ["No Player Selected", "No Players Available"]:
            show_message("Error", "Please select a player to roll.", "error")
            return

        player = self.player_manager.get_player(current_player)
        if player["current_bet"] <= 0:
            # Only prompt for bet if current_bet is 0
            self._prompt_for_bet()
            # Check again after prompting
            player = self.player_manager.get_player(current_player)
            if player["current_bet"] <= 0:
                return  # User cancelled or bet is still 0

        # Animated dice roll effect
        import random
        animation_frames = 10
        animation_delay = 50  # ms
        def animate(frame=0):
            if frame < animation_frames:
                fake_rolls = [random.randint(1, 6) for _ in range(3)]
                self._display_dice(fake_rolls)
                self.master.after(animation_delay, lambda: animate(frame + 1))
            else:
                self._finalize_roll_dice(current_player)
        animate()

    def _finalize_roll_dice(self, current_player: str) -> None:
        """
        Finalize the dice roll for the given player and update the game state/UI.
        Enforces strict round-based play: one roll per player per round, unless 'No Score'.
        """
        player = self.player_manager.get_player(current_player)
        rolls = [roll_single_die() for _ in range(NUM_DICE)]
        outcome = evaluate_roll(rolls)
        print(f"DEBUG: outcome from evaluate_roll: {outcome}")
        self._display_dice(rolls)
        self._log_message(f"{current_player} rolled: {rolls}")
        self._log_message(f"Outcome: {outcome['outcome']} - {outcome['value']}")
        # Enhanced status message
        if outcome["outcome"] == "Win":
            msg = f"✅ {current_player} WINS! ({outcome['value']})"
            color = COLOR_WIN
        elif outcome["outcome"] == "Lose":
            msg = f"❌ {current_player} LOSES! ({outcome['value']})"
            color = COLOR_LOSE
        elif outcome["outcome"] == "Point":
            msg = f"{current_player} rolled a POINT: {outcome['value']}"
            color = COLOR_POINT
        else:
            msg = f"🎲 No Score. {current_player} rolls again."
            color = COLOR_PUSH
        if hasattr(self, 'outcome_label'):
            self.outcome_label.config(text=msg, fg=color)
        # Update player state
        player["last_roll_outcome"] = outcome["outcome"]
        player["point_value"] = outcome["value"]
        # Only record the roll in round_rolls if it's a scoring outcome
        if outcome["outcome"] in ["Win", "Lose", "Point"]:
            self.round_rolls[current_player] = {
                "rolls": rolls,
                "outcome": outcome["outcome"],
                "value": outcome["value"],
                "bet": player["current_bet"]
            }
            player["current_bet"] = 0
        self._update_player_listbox()
        self._update_player_dropdown()
        self._update_player_betting_ui()
        # Determine next action
        if str(outcome["outcome"]).strip().lower() == "no score":
            # Let the same player roll again
            self._log_message(f"No Score. {current_player} rolls again.")
            self._update_player_betting_ui()
        else:
            # Move to next eligible player who hasn't rolled this round
            all_players = self.player_manager.get_players_with_balance()
            next_player = None
            for p in all_players:
                if p not in self.round_rolls:
                    next_player = p
                    break
            if next_player:
                print(f"DEBUG: Switching to next player: {next_player}")
                self.current_player_name_var.set(next_player)
                self._log_message(f"Next up: {next_player}")
                self._on_player_select()  # Explicitly update UI for new player
            else:
                # All players have rolled, end the round
                self._end_round_and_declare_winner()

    def _display_dice(self, rolls: list[int]) -> None:
        """
        Display the dice faces using Unicode characters for the given roll values.
        Args:
            rolls (list[int]): The dice values to display.
        """
        # Clear existing dice display
        for widget in self.dice_frame.winfo_children():
            widget.destroy()

        # Get Cee-lo result for this roll
        outcome = evaluate_roll(rolls)
        player = self.current_player_name_var.get()
        if outcome["outcome"] == "Win":
            if outcome["value"] == "4-5-6 (Cee-lo!)":
                summary = f"{player} rolled CEE-LO!"
            elif "Trips" in str(outcome["value"]):
                summary = f"{player} rolled TRIPS: {str(outcome['value']).split('! (')[-1].replace(')', '')}"
            else:
                summary = f"{player} WINS!"
        elif outcome["outcome"] == "Lose":
            if outcome["value"] == "1-2-3 (Automatic Loss)":
                summary = f"{player} rolled an AUTOMATIC LOSS"
            else:
                summary = f"{player} LOSES!"
        elif outcome["outcome"] == "Point":
            summary = f"{player} rolled a POINT: {outcome['value']}"
        else:
            summary = f"{player} rolled NO SCORE"

        # Show the Cee-lo result as the main label
        result_label = create_label(
            self.dice_frame,
            summary,
            font_key='title_font',
            fg=COLOR_TEXT_LIGHT  # High contrast
        )
        result_label.pack(pady=10)

        # Create dice display container
        dice_container = create_frame(self.dice_frame)
        dice_container.pack(pady=2, fill=tk.BOTH, expand=True)

        # Display Unicode dice
        for i, roll in enumerate(rolls):
            die_frame = create_frame(dice_container)
            die_frame.pack(side=tk.LEFT, padx=2, pady=0, fill=tk.BOTH, expand=True)
            # Show just the number above the die
            number_label = create_label(die_frame, str(roll), font_key='title_font', fg=COLOR_TEXT_LIGHT)
            number_label.pack(pady=2)
            unicode_die = get_unicode_die_face(roll)
            # Use a much larger font for the die, and high contrast
            unicode_label = create_label(die_frame, unicode_die, font_key='mono_font', fg=COLOR_TEXT_LIGHT)
            unicode_label.config(font=("Courier New", 48, "bold"), fg=COLOR_TEXT_LIGHT)
            unicode_label.pack()

    def _end_round_and_declare_winner(self) -> None:
        """
        Determine the winner(s) for the round, transfer the pot, announce, and reset for next round.
        Uses round_manager for ranking and payout logic.
        """
        from round_manager import determine_winners, split_pot_among_winners
        if not self.round_rolls:
            return
        # Determine winners using modular logic
        winners = determine_winners(self.round_rolls)
        # Deduct bets from all players
        for player, info in self.round_rolls.items():
            self.player_manager.players[player]["balance"] -= info["bet"]
            self.player_manager.players[player]["current_bet"] = 0
            if self.player_manager.players[player]["balance"] <= 0:
                self.player_manager.players[player]["is_out"] = True
        # Split pot and update rounds_won
        split_pot_among_winners(self.round_rolls, winners, self.player_manager)
        # Log and save round summary
        if len(winners) == 1:
            self._log_message(f"🏆 {winners[0]} wins the round and takes the pot!")
        else:
            self._log_message(f"🤝 Tie! {' & '.join(winners)} split the pot.")
        round_summary = []
        for player, info in self.round_rolls.items():
            msg = f"{player}: {info['rolls']} ({info['outcome']} - {info['value']})"
            self._log_message(msg)
            round_summary.append(msg)
        self.round_history.append({
            "winners": winners,
            "summary": round_summary
        })
        # Reset round and update UI
        self.round_rolls = {}
        self.round_number += 1
        self._update_round_label()
        self._update_player_listbox()
        self._update_player_dropdown()
        self._start_betting_phase()
        # Show round end message
        self._log_message(f"Round complete! Winner(s): {', '.join(winners)}")
        self._log_message(f"====================\nNew round is starting!")
        # Check for last player with money
        active_players = self.player_manager.get_players_with_balance()
        if len(active_players) == 1:
            winner = active_players[0]
            self._log_message(f"🎉 {winner} is the last player with money and wins the game!")
            self._show_end_game_popup(winner)
        elif active_players:
            self.current_player_name_var.set(active_players[0])
            self._log_message("====================")
            self._log_message(f"New round is starting! {active_players[0]} goes first.")
            messagebox.showinfo("New Round", f"A new round is starting! {active_players[0]} goes first.")
        else:
            self._end_game_all_players_out()

    def _end_game_all_players_out(self) -> None:
        """
        Handle game over when all players are out of money.
        """
        show_message("Game Over", "All players are out of money! Game over.", "info")
        self._back_to_setup()

    def _show_leaderboard(self) -> None:
        """
        Show a popup with the current leaderboard (rounds won by each player).
        """
        leaderboard = self.player_manager.get_leaderboard()
        msg = "Leaderboard:\n\n" + "\n".join(f"{i+1}. {name}: {wins} round(s)" for i, (name, wins) in enumerate(leaderboard))
        messagebox.showinfo("Leaderboard", msg)

    def _show_history(self) -> None:
        """
        Show a popup with the full round-by-round history.
        """
        if not self.round_history:
            messagebox.showinfo("History", "No rounds played yet.")
            return
        msg = ""
        for i, round_info in enumerate(self.round_history, 1):
            msg += f"Round {i}: Winner(s): {', '.join(round_info['winners'])}\n"
            for line in round_info['summary']:
                msg += f"  {line}\n"
            msg += "\n"
        messagebox.showinfo("Round History", msg)

    def _setup_keyboard_navigation(self) -> None:
        """
        Set up keyboard navigation and shortcuts for accessibility.
        """
        # Tab/Shift-Tab navigation is default in Tkinter
        # Bind Enter/Space to activate focused button
        def activate_focused(event):
            widget = self.master.focus_get()
            if isinstance(widget, tk.Button):
                widget.invoke()
        self.master.bind("<Return>", activate_focused)
        self.master.bind("<KP_Enter>", activate_focused)
        self.master.bind("<space>", activate_focused)
        # Keyboard shortcuts
        self.master.bind("<r>", lambda e: self._roll_dice() if self.roll_button['state'] == tk.NORMAL else None)
        self.master.bind("<R>", lambda e: self._roll_dice() if self.roll_button['state'] == tk.NORMAL else None)
        self.master.bind("<b>", lambda e: self._prompt_for_bet())
        self.master.bind("<B>", lambda e: self._prompt_for_bet())
        self.master.bind("<Escape>", lambda e: self._back_to_setup())

    def _increase_font_size(self) -> None:
        """
        Increase the global font size for accessibility.
        """
        self.font_scale = min(self.font_scale + 0.1, 2.0)
        self._refresh_fonts()

    def _decrease_font_size(self) -> None:
        """
        Decrease the global font size for accessibility.
        """
        self.font_scale = max(self.font_scale - 0.1, 0.6)
        self._refresh_fonts()

    def _refresh_fonts(self) -> None:
        """
        Refresh all fonts in the app to reflect the current font scale.
        """
        # Recreate font objects with new size
        base_fonts = setup_fonts()
        scaled_fonts = {}
        for key, font in base_fonts.items():
            size = font['size'] if isinstance(font, dict) and 'size' in font else font.cget('size') if hasattr(font, 'cget') else 14
            scaled_size = int(size * self.font_scale)
            if hasattr(font, 'actual'):
                # It's a tkFont.Font object
                scaled_fonts[key] = font.copy()
                scaled_fonts[key].config(size=scaled_size)
            else:
                # It's a tuple fallback
                scaled_fonts[key] = (font[0], scaled_size) + font[2:]
        self.fonts = scaled_fonts
        self._refresh_colors()

    def _toggle_fullscreen(self) -> None:
        """
        Toggle fullscreen mode for the main window.
        """
        is_fullscreen = self.master.attributes('-fullscreen')
        self.master.attributes('-fullscreen', not is_fullscreen)

    def _show_how_to_play(self) -> None:
        """
        Show a popup with game rules and tips.
        """
        rules = (
            "How to Play Cee-lo Dice Game:\n\n"
            "1. Each player starts with a balance and takes turns rolling three dice.\n"
            "2. Place your bet, then roll the dice.\n"
            "3. Outcomes:\n"
            "   - 4-5-6: Automatic win!\n"
            "   - 1-2-3: Automatic loss.\n"
            "   - Trips (three of a kind): Automatic win.\n"
            "   - Point (two of a kind): The unique die is your point.\n"
            "   - No Score: Roll again.\n"
            "4. After all players roll, the best hand wins the pot. Ties split the pot.\n"
            "5. The last player with money is the overall winner.\n\n"
            "Tips:\n"
            "- Use the Accessibility menu for high contrast, font size, and fullscreen.\n"
            "- Hover over buttons for tooltips.\n"
            "- Use keyboard shortcuts: R (Roll), B (Bet), Esc (Back), F11 (Fullscreen).\n"
        )
        messagebox.showinfo("How to Play", rules)

    def _update_player_info_area(self) -> None:
        """
        Update the persistent player info area with all player names and balances.
        """
        for widget in self.player_info_area.winfo_children():
            widget.destroy()
        all_players = self.player_manager.get_all_players()
        if not all_players:
            create_label(self.player_info_area, "No players added.").pack()
            return
        for player_name in all_players:
            player = self.player_manager.get_player(player_name)
            status = " (OUT)" if player["is_out"] else ""
            create_label(
                self.player_info_area,
                f"{player_name}: ${player['balance']}{status}",
                font_key='header_font',
                fg=COLOR_TEXT_LIGHT if not player["is_out"] else COLOR_LOSE
            ).pack(side=tk.LEFT, padx=10)

    def _show_end_game_popup(self, winner: str) -> None:
        """
        Show a popup at the end of the game with winner info, leaderboard, and history buttons.
        """
        popup = tk.Toplevel(self.master)
        popup.title("Game Over")
        popup.configure(bg=COLOR_SECONDARY)
        popup.resizable(False, False)
        tk.Label(popup, text=f"🎉 {winner} is the last player with money and wins the game!", font=("Arial", 16, "bold"), fg=COLOR_WIN, bg=COLOR_SECONDARY).pack(padx=20, pady=(15, 5))
        # Leaderboard button
        leaderboard_btn = create_button(popup, "Show Leaderboard", self._show_leaderboard, bg=COLOR_BUTTON_BET, font_key='header_font')
        leaderboard_btn.pack(padx=20, pady=5)
        # History button
        history_btn = create_button(popup, "Show History", self._show_history, bg=COLOR_BUTTON_BET, font_key='header_font')
        history_btn.pack(padx=20, pady=5)
        # Play again or exit
        def on_play_again():
            popup.destroy()
            for player in self.player_manager.players.values():
                player["balance"] = INITIAL_PLAYER_BALANCE
                player["is_out"] = False
                player["current_bet"] = 0
                player["last_roll_outcome"] = None
                player["point_value"] = None
            self._log_message("Game reset! Add/remove players or click Start Game to play again.")
            self._back_to_setup()
        def on_exit():
            popup.destroy()
            self._end_game_all_players_out()
        play_again_btn = create_button(popup, "Play Again", on_play_again, bg=COLOR_WIN, font_key='header_font')
        play_again_btn.pack(padx=20, pady=10)
        exit_btn = create_button(popup, "Exit", on_exit, bg=COLOR_LOSE, font_key='header_font')
        exit_btn.pack(padx=20, pady=(0, 15))
        popup.grab_set()
        popup.transient(self.master)
        popup.wait_window()

    def _update_round_label(self):
        """Update the round number label."""
        self.round_label.config(text=f"Round {self.round_number}")

    def _start_betting_phase(self):
        """
        Begin the betting phase: prompt for all player bets at once before any dice are rolled.
        """
        self.betting_phase = True
        self.round_rolls = {}
        self._log_message("Betting phase: Enter bets for all players before rolling.")
        self._show_all_bets_dialog()

    def _show_all_bets_dialog(self):
        """
        Show a dialog to enter the same bet for all players at once.
        """
        players = self.player_manager.get_players_with_balance()
        if not players:
            self._log_message("No players available for betting.")
            return
        dialog = tk.Toplevel(self.master)
        dialog.title("Enter Bet for All Players")
        dialog.configure(bg=COLOR_SECONDARY)
        dialog.resizable(False, False)
        tk.Label(dialog, text="Enter bet amount for ALL players:", font=("Arial", 14, "bold"), fg=COLOR_ACCENT, bg=COLOR_SECONDARY).pack(padx=20, pady=(15, 5))
        entry = tk.Entry(dialog, width=10, font=("Arial", 14))
        entry.pack(padx=10, pady=10)
        entry.insert(0, "")
        error_label = tk.Label(dialog, text="", fg=COLOR_LOSE, bg=COLOR_SECONDARY, font=("Arial", 10, "bold"))
        error_label.pack(pady=(0, 5))
        def submit_bets():
            try:
                amount = int(entry.get())
                if amount <= 0:
                    error_label.config(text="Bet must be positive.")
                    return
                for player in players:
                    if amount > self.player_manager.get_player(player)["balance"]:
                        error_label.config(text=f"{player} does not have enough balance.")
                        return
                for player in players:
                    self.player_manager.set_bet(player, amount)
                dialog.destroy()
                self.betting_phase = False
                self._log_message(f"All bets of ${amount} are in! First player may roll.")
                self.current_player_name_var.set(players[0])
                self.player_dropdown.config(state=tk.DISABLED)
                self._update_player_betting_ui()
            except ValueError:
                error_label.config(text="Bet must be a number.")
        submit_btn = tk.Button(dialog, text="Submit Bets", command=submit_bets, font=("Arial", 12, "bold"), bg=COLOR_WIN, fg=COLOR_TEXT_DARK)
        submit_btn.pack(pady=(10, 15))
        dialog.grab_set()
        dialog.transient(self.master)
        dialog.wait_window()

    def _prompt_next_bet(self):
        pass  # No longer needed with new betting dialog


def main() -> None:
    """
    Main function to start the application.
    """
    if not _tkinter_available:
        return

    root = tk.Tk()
    app = CeeLoDiceGameApp(root)
    root.mainloop()


if __name__ == "__main__":
    main() 