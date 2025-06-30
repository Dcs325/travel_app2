import tkinter as tk
import tkinter.font as tkfont
from tkinter import messagebox, scrolledtext, ttk
from config import *

# Counter for generating unique style names
_style_counter = 0

def get_unique_style_name():
    """Generate a unique style name for ttk widgets."""
    global _style_counter
    _style_counter += 1
    return f'CustomStyle{_style_counter}'


def setup_fonts():
    """Configure application fonts."""
    try:
        fonts = {
            'mono_font': tkfont.Font(family="Courier New", size=11, weight="bold"),
            'default_font': tkfont.Font(family="Arial", size=14),
            'title_font': tkfont.Font(family="Arial", size=24, weight="bold"),
            'header_font': tkfont.Font(family="Arial", size=16, weight="bold"),
            'roll_button_font': tkfont.Font(family="Arial", size=18, weight="bold"),
            'music_button_font': tkfont.Font(family="Arial", size=12, weight="bold"),
            'player_label_font': tkfont.Font(family="Arial", size=12),
            'bet_button_font': tkfont.Font(family="Arial", size=12)
        }
    except Exception:
        fonts = {
            'mono_font': ("TkFixedFont", 11, "bold"),
            'default_font': ("TkDefaultFont", 14),
            'title_font': ("TkDefaultFont", 24, "bold"),
            'header_font': ("TkDefaultFont", 16, "bold"),
            'roll_button_font': ("TkDefaultFont", 18, "bold"),
            'music_button_font': ("TkDefaultFont", 12, "bold"),
            'player_label_font': ("TkDefaultFont", 12),
            'bet_button_font': ("TkDefaultFont", 12)
        }
    return fonts


def create_title_label(parent, text, font_key='title_font'):
    """Create a title label with consistent styling."""
    fonts = setup_fonts()
    return tk.Label(
        parent,
        text=text,
        font=fonts[font_key],
        fg=COLOR_ACCENT,
        bg=COLOR_SECONDARY,
        pady=10
    )


def create_frame(parent, **kwargs):
    """Create a frame with consistent styling."""
    return tk.Frame(
        parent,
        bg=COLOR_SECONDARY,
        **kwargs
    )


def create_button(parent, text, command, font_key='default_font', bg=COLOR_BUTTON_BET, fg=COLOR_TEXT_DARK, **kwargs):
    """Create a modern tk button with consistent styling and hover effect."""
    fonts = setup_fonts()
    
    # Create the button with direct color support
    btn = tk.Button(parent, 
                   text=text, 
                   command=command, 
                   font=fonts[font_key],
                   bg=bg,
                   fg=fg,
                   relief=tk.RAISED,
                   borderwidth=2,
                   padx=10,
                   pady=5,
                   **kwargs)
    
    # Add hover effect
    def on_enter(e):
        btn.config(bg=COLOR_ACCENT)
    def on_leave(e):
        btn.config(bg=bg)
    
    btn.bind('<Enter>', on_enter)
    btn.bind('<Leave>', on_leave)
    
    return btn


def create_colored_button(parent, text, command, bg_color, fg_color=COLOR_TEXT_DARK, font_key='default_font', **kwargs):
    """Create a tk button with a specific background color (more reliable than ttk)."""
    fonts = setup_fonts()
    
    # Create the button with direct color support
    btn = tk.Button(parent, 
                   text=text, 
                   command=command, 
                   font=fonts[font_key],
                   bg=bg_color,
                   fg=fg_color,
                   relief=tk.RAISED,
                   borderwidth=2,
                   padx=10,
                   pady=5,
                   **kwargs)
    
    # Add hover effect
    def on_enter(e):
        btn.config(bg=COLOR_ACCENT)
    def on_leave(e):
        btn.config(bg=bg_color)
    
    btn.bind('<Enter>', on_enter)
    btn.bind('<Leave>', on_leave)
    
    return btn


def create_entry(parent, **kwargs):
    """Create an entry widget with consistent styling."""
    return tk.Entry(
        parent,
        font=setup_fonts()['default_font'],
        bg=COLOR_TEXT_LIGHT,
        fg=COLOR_TEXT_DARK,
        relief=tk.SUNKEN,
        bd=2,
        **kwargs
    )


def create_label(parent, text, font_key='default_font', fg=COLOR_TEXT_LIGHT, **kwargs):
    """Create a label with consistent styling."""
    fonts = setup_fonts()
    return tk.Label(
        parent,
        text=text,
        font=fonts[font_key],
        fg=fg,
        bg=COLOR_SECONDARY,
        **kwargs
    )


def create_listbox(parent, **kwargs):
    """Create a listbox with consistent styling."""
    return tk.Listbox(
        parent,
        font=setup_fonts()['default_font'],
        bg=COLOR_TEXT_LIGHT,
        fg=COLOR_TEXT_DARK,
        selectbackground=COLOR_ACCENT,
        selectforeground=COLOR_TEXT_LIGHT,
        relief=tk.SUNKEN,
        bd=2,
        **kwargs
    )


def create_scrolled_text(parent, **kwargs):
    """Create a scrolled text widget with consistent styling."""
    return scrolledtext.ScrolledText(
        parent,
        font=setup_fonts()['default_font'],
        bg=COLOR_TEXT_LIGHT,
        fg=COLOR_TEXT_DARK,
        relief=tk.SUNKEN,
        bd=2,
        **kwargs
    )


def show_message(title, message, message_type="info"):
    """
    Show a message box with consistent styling. Uses colored popups for errors and warnings.
    """
    if message_type == "error":
        # Custom error popup with red background and icon
        popup = tk.Toplevel()
        popup.title(title)
        popup.configure(bg="#c0392b")
        popup.resizable(False, False)
        tk.Label(popup, text="❌ ERROR", font=("Arial", 16, "bold"), fg="#fff", bg="#c0392b").pack(padx=20, pady=(15, 5))
        tk.Label(popup, text=message, font=("Arial", 12), fg="#fff", bg="#c0392b", wraplength=350, justify="left").pack(padx=20, pady=(0, 15))
        tk.Button(popup, text="OK", command=popup.destroy, bg="#fff", fg="#c0392b", font=("Arial", 12, "bold"), relief=tk.RAISED).pack(pady=(0, 15))
        popup.grab_set()
        popup.transient()
        popup.wait_window()
    elif message_type == "warning":
        # Custom warning popup with yellow background and icon
        popup = tk.Toplevel()
        popup.title(title)
        popup.configure(bg="#f1c40f")
        popup.resizable(False, False)
        tk.Label(popup, text="⚠️ WARNING", font=("Arial", 16, "bold"), fg="#222", bg="#f1c40f").pack(padx=20, pady=(15, 5))
        tk.Label(popup, text=message, font=("Arial", 12), fg="#222", bg="#f1c40f", wraplength=350, justify="left").pack(padx=20, pady=(0, 15))
        tk.Button(popup, text="OK", command=popup.destroy, bg="#fff", fg="#f1c40f", font=("Arial", 12, "bold"), relief=tk.RAISED).pack(pady=(0, 15))
        popup.grab_set()
        popup.transient()
        popup.wait_window()
    else:
        messagebox.showinfo(title, message)


def center_window(window):
    """Center a window on the screen."""
    window.update_idletasks()
    window_width = window.winfo_screenwidth()
    window_height = window.winfo_screenheight()
    position_right = int(window_width / 2 - window.winfo_width() / 2)
    position_down = int(window_height / 2 - window.winfo_height() / 2)
    window.geometry(f"+{position_right}+{position_down}")


def get_outcome_color(outcome):
    """Get the appropriate color for a game outcome."""
    color_map = {
        "Win": COLOR_WIN,
        "Lose": COLOR_LOSE,
        "Point": COLOR_POINT,
        "No Score": COLOR_PUSH
    }
    return color_map.get(outcome, COLOR_TEXT_LIGHT)


def add_tooltip(widget, text: str) -> None:
    """
    Add a tooltip to a widget. Usage: add_tooltip(button, 'Click to roll the dice!')
    """
    tooltip = tk.Toplevel(widget)
    tooltip.withdraw()
    tooltip.overrideredirect(True)
    label = tk.Label(tooltip, text=text, bg='#222', fg='#fff', relief=tk.SOLID, borderwidth=1, font=("Arial", 10))
    label.pack(ipadx=4, ipady=2)
    def enter(event):
        x = widget.winfo_rootx() + 20
        y = widget.winfo_rooty() + widget.winfo_height() + 2
        tooltip.geometry(f'+{x}+{y}')
        tooltip.deiconify()
    def leave(event):
        tooltip.withdraw()
    widget.bind('<Enter>', enter)
    widget.bind('<Leave>', leave) 