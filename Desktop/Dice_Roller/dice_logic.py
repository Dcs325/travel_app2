import random
from collections import Counter
from config import DICE_SIDES
from typing import List, Dict, Any


def roll_single_die(sides: int = DICE_SIDES) -> int:
    """
    Simulates rolling a single die with a given number of sides.
    Args:
        sides (int): Number of sides on the die.
    Returns:
        int: The result of the die roll.
    """
    if not isinstance(sides, int) or sides < 2:
        raise ValueError("Number of sides must be an integer of 2 or more.")
    return random.randint(1, sides)


def get_die_ascii_face(roll: int) -> List[str]:
    """
    Returns an ASCII art representation of a 6-sided die face.
    Args:
        roll (int): The die value (1-6).
    Returns:
        List[str]: List of strings representing the die face.
    """
    faces = {
        1: ["\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
            "\u2502       \u2502",
            "\u2502   \u25cf   \u2502",
            "\u2502       \u2502",
            "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"],
        2: ["\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
            "\u2502 \u25cf     \u2502",
            "\u2502       \u2502",
            "\u2502     \u25cf \u2502",
            "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"],
        3: ["\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
            "\u2502 \u25cf     \u2502",
            "\u2502   \u25cf   \u2502",
            "\u2502     \u25cf \u2502",
            "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"],
        4: ["\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
            "\u2502 \u25cf   \u25cf \u2502",
            "\u2502       \u2502",
            "\u2502 \u25cf   \u25cf \u2502",
            "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"],
        5: ["\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
            "\u2502 \u25cf   \u25cf \u2502",
            "\u2502   \u25cf   \u2502",
            "\u2502 \u25cf   \u25cf \u2502",
            "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"],
        6: ["\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
            "\u2502 \u25cf   \u25cf \u2502",
            "\u2502 \u25cf   \u25cf \u2502",
            "\u2502 \u25cf   \u25cf \u2502",
            "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"]
    }
    return faces.get(roll, ["Error:", "Invalid", "Roll", ":(", ""])


def evaluate_roll(rolls: List[int]) -> Dict[str, Any]:
    """
    Evaluates the three dice rolls based on Cee-lo inspired rules.
    Args:
        rolls (List[int]): List of three dice values.
    Returns:
        Dict[str, Any]: Outcome and value of the roll.
    """
    rolls_sorted = sorted(rolls)
    roll_counts = Counter(rolls)

    # Rule 1: 1, 2, 3 (Automatic Loss)
    if rolls_sorted == [1, 2, 3]:
        return {"outcome": "Lose", "value": "1-2-3 (Automatic Loss)"}

    # Rule 2: 4, 5, 6 (Cee-lo - Automatic Win)
    if rolls_sorted == [4, 5, 6]:
        return {"outcome": "Win", "value": "4-5-6 (Cee-lo!)"}

    # Rule 3: Trips (Three of a kind - Automatic Win)
    if len(roll_counts) == 1:  # All three numbers are the same
        return {"outcome": "Win", "value": f"Trips! ({rolls[0]}-{rolls[0]}-{rolls[0]})"}

    # Rule 4: Point Number (Two numbers are the same, the third is the point)
    if len(roll_counts) == 2:  # Exactly two unique numbers, means two are a pair
        for num, count in roll_counts.items():
            if count == 1:  # This is the unique number
                return {"outcome": "Point", "value": num}
    
    # If none of the above, it's a "No Score" roll
    return {"outcome": "No Score", "value": "No point established"} 