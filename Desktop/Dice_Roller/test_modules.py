#!/usr/bin/env python3
"""
Simple test script to verify modular components work correctly.
"""

def test_config():
    """Test configuration module."""
    print("Testing config module...")
    try:
        from config import DICE_SIDES, NUM_DICE, INITIAL_PLAYER_BALANCE, COLOR_PRIMARY
        print(f"✓ Config loaded: DICE_SIDES={DICE_SIDES}, NUM_DICE={NUM_DICE}, BALANCE={INITIAL_PLAYER_BALANCE}")
        return True
    except Exception as e:
        print(f"✗ Config test failed: {e}")
        return False

def test_dice_logic():
    """Test dice logic module."""
    print("Testing dice logic module...")
    try:
        from dice_logic import roll_single_die, get_die_ascii_face, evaluate_roll
        
        # Test rolling
        roll = roll_single_die()
        print(f"✓ Dice roll: {roll}")
        
        # Test ASCII face
        face = get_die_ascii_face(roll)
        print(f"✓ ASCII face generated (length: {len(face)})")
        
        # Test evaluation
        rolls = [1, 2, 3]
        outcome = evaluate_roll(rolls)
        print(f"✓ Roll evaluation: {outcome}")
        
        return True
    except Exception as e:
        print(f"✗ Dice logic test failed: {e}")
        return False

def test_player_manager():
    """Test player manager module."""
    print("Testing player manager module...")
    try:
        from player_manager import PlayerManager
        
        pm = PlayerManager()
        
        # Test adding player
        success, message = pm.add_player("TestPlayer")
        print(f"✓ Add player: {message}")
        
        # Test getting player
        player = pm.get_player("TestPlayer")
        print(f"✓ Get player: {player['balance']}")
        
        # Test setting bet
        success, message = pm.set_bet("TestPlayer", 10)
        print(f"✓ Set bet: {message}")
        
        return True
    except Exception as e:
        print(f"✗ Player manager test failed: {e}")
        return False

def test_music_manager():
    """Test music manager module."""
    print("Testing music manager module...")
    try:
        from music_manager import MusicManager
        
        mm = MusicManager()
        print(f"✓ Music manager created")
        print(f"✓ Music available: {mm.is_music_available()}")
        
        return True
    except Exception as e:
        print(f"✗ Music manager test failed: {e}")
        return False

def test_gui_components():
    """Test GUI components module."""
    print("Testing GUI components module...")
    try:
        from gui_components import setup_fonts, get_outcome_color
        
        fonts = setup_fonts()
        print(f"✓ Fonts setup: {len(fonts)} fonts configured")
        
        color = get_outcome_color("Win")
        print(f"✓ Outcome color: {color}")
        
        return True
    except Exception as e:
        print(f"✗ GUI components test failed: {e}")
        return False

def test_round_manager():
    """Test round manager module (winner logic, pot splitting)."""
    print("Testing round manager module...")
    try:
        from round_manager import ceelo_rank, determine_winners, split_pot_among_winners
        # Test ceelo_rank
        assert ceelo_rank("Win", "4-5-6 (Cee-lo!)") == (4, 6)
        assert ceelo_rank("Win", "Trips! (3-3-3)") == (3, 3)
        assert ceelo_rank("Win", "Other") == (2, 0)
        assert ceelo_rank("Point", 5) == (1, 5)
        assert ceelo_rank("Lose", None) == (-1, 0)
        assert ceelo_rank("Other", None) == (0, 0)
        print("✓ ceelo_rank edge cases")
        # Test determine_winners
        round_rolls = {
            "A": {"outcome": "Win", "value": "4-5-6 (Cee-lo!)", "bet": 10},
            "B": {"outcome": "Win", "value": "Trips! (3-3-3)", "bet": 10},
            "C": {"outcome": "Point", "value": 5, "bet": 10}
        }
        winners = determine_winners(round_rolls)
        assert winners == ["A"]
        print("✓ determine_winners single winner")
        # Test tie
        round_rolls_tie = {
            "A": {"outcome": "Point", "value": 6, "bet": 10},
            "B": {"outcome": "Point", "value": 6, "bet": 10}
        }
        winners_tie = determine_winners(round_rolls_tie)
        assert set(winners_tie) == {"A", "B"}
        print("✓ determine_winners tie")
        # Test split_pot_among_winners
        class DummyPM:
            def __init__(self):
                self.players = {
                    "A": {"balance": 0, "rounds_won": 0},
                    "B": {"balance": 0, "rounds_won": 0},
                    "C": {"balance": 0, "rounds_won": 0}
                }
        pm = DummyPM()
        split_pot_among_winners(round_rolls, ["A"], pm)
        assert pm.players["A"]["balance"] == 30 and pm.players["A"]["rounds_won"] == 1
        pm = DummyPM()
        split_pot_among_winners(round_rolls_tie, ["A", "B"], pm)
        assert pm.players["A"]["balance"] == 10 and pm.players["B"]["balance"] == 10
        assert pm.players["A"]["rounds_won"] == 1 and pm.players["B"]["rounds_won"] == 1
        print("✓ split_pot_among_winners single and tie cases")
        return True
    except Exception as e:
        print(f"✗ Round manager test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("=== Testing Modular Dice Roller Components ===\n")
    
    tests = [
        test_config,
        test_dice_logic,
        test_player_manager,
        test_music_manager,
        test_gui_components,
        test_round_manager
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print(f"=== Test Results: {passed}/{total} tests passed ===")
    
    if passed == total:
        print("🎉 All tests passed! The modular structure is working correctly.")
        print("You can now run 'python3 main.py' to start the application.")
    else:
        print("❌ Some tests failed. Please check the error messages above.")

if __name__ == "__main__":
    main() 