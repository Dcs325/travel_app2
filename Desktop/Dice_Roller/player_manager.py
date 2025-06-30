from config import INITIAL_PLAYER_BALANCE
from typing import Dict, List, Tuple, Optional, Any


class PlayerManager:
    """
    Manages player data and actions for the Cee-lo game.
    """
    def __init__(self) -> None:
        """Initialize the player manager with an empty player dictionary."""
        self.players: Dict[str, Dict[str, Any]] = {}
    
    def add_player(self, player_name: str) -> Tuple[bool, str]:
        """
        Add a new player to the game.
        Returns (success, message).
        """
        if not player_name.strip():
            return False, "Player name cannot be empty."
        
        if player_name in self.players:
            return False, f"Player '{player_name}' already exists."
        
        self.players[player_name] = {
            "balance": INITIAL_PLAYER_BALANCE,
            "current_bet": 0,
            "last_roll_outcome": None,
            "point_value": None,
            "is_out": False,
            "rounds_won": 0
        }
        return True, f"Player '{player_name}' added with ${INITIAL_PLAYER_BALANCE} balance."
    
    def remove_player(self, player_name: str) -> Tuple[bool, str]:
        """
        Remove a player from the game.
        Returns (success, message).
        """
        if player_name not in self.players:
            return False, f"Player '{player_name}' not found."
        
        del self.players[player_name]
        return True, f"Player '{player_name}' removed from the game."
    
    def get_player(self, player_name: str) -> Optional[Dict[str, Any]]:
        """
        Get player data by name.
        Returns the player dictionary or None if not found.
        """
        return self.players.get(player_name)
    
    def get_all_players(self) -> List[str]:
        """
        Get all player names.
        """
        return list(self.players.keys())
    
    def get_active_players(self) -> List[str]:
        """
        Get all players who are not out of the game.
        """
        return [name for name, data in self.players.items() if not data["is_out"]]
    
    def get_players_with_balance(self) -> List[str]:
        """
        Get all players who have money to bet and are not out.
        """
        return [name for name, data in self.players.items() if data["balance"] > 0 and not data["is_out"]]
    
    def deposit_funds(self, player_name: str, amount: int) -> Tuple[bool, str]:
        """
        Add funds to a player's balance.
        Returns (success, message).
        """
        if player_name not in self.players:
            return False, f"Player '{player_name}' not found."
        
        try:
            amount = int(amount)
            if amount <= 0:
                return False, "Deposit amount must be positive."
        except ValueError:
            return False, "Deposit amount must be a valid number."
        
        self.players[player_name]["balance"] += amount
        return True, f"${amount} added to {player_name}'s balance. New balance: ${self.players[player_name]['balance']}"
    
    def set_bet(self, player_name: str, amount: int) -> Tuple[bool, str]:
        """
        Set a player's current bet.
        Returns (success, message).
        """
        if player_name not in self.players:
            return False, f"Player '{player_name}' not found."
        
        player = self.players[player_name]
        
        try:
            amount = int(amount)
            if amount <= 0:
                return False, "Bet amount must be positive."
        except ValueError:
            return False, "Bet amount must be a valid number."
        
        if amount > player["balance"]:
            return False, f"Insufficient funds. Balance: ${player['balance']}, Bet: ${amount}"
        
        player["current_bet"] = amount
        return True, f"Bet set to ${amount} for {player_name}"
    
    def clear_bet(self, player_name: str) -> Tuple[bool, str]:
        """
        Clear a player's current bet.
        Returns (success, message).
        """
        if player_name not in self.players:
            return False, f"Player '{player_name}' not found."
        
        self.players[player_name]["current_bet"] = 0
        return True, f"Bet cleared for {player_name}"
    
    def update_player_outcome(self, player_name: str, outcome: str, value: Any) -> None:
        """
        Update a player's last roll outcome and handle betting logic.
        """
        if player_name not in self.players:
            return
        
        player = self.players[player_name]
        player["last_roll_outcome"] = outcome
        player["point_value"] = value
        
        # Handle betting outcomes
        if outcome == "Win":
            player["balance"] += player["current_bet"]
            player["current_bet"] = 0
        elif outcome == "Lose":
            player["balance"] -= player["current_bet"]
            player["current_bet"] = 0
            if player["balance"] <= 0:
                player["is_out"] = True
    
    def get_next_player_name(self, current_player_name: str) -> Optional[str]:
        """
        Get the next active player in rotation.
        Returns the next player's name or None if no active players.
        """
        active_players = self.get_players_with_balance()
        if not active_players:
            return None
        
        if current_player_name not in active_players:
            return active_players[0]
        
        current_index = active_players.index(current_player_name)
        next_index = (current_index + 1) % len(active_players)
        return active_players[next_index]
    
    def check_game_over(self) -> bool:
        """
        Check if all players are out of the game.
        Returns True if game is over.
        """
        active_players = self.get_players_with_balance()
        return len(active_players) == 0
    
    def reset_game(self) -> None:
        """
        Reset all players to initial state for a new game.
        """
        for player_data in self.players.values():
            player_data["current_bet"] = 0
            player_data["last_roll_outcome"] = None
            player_data["point_value"] = None
            player_data["is_out"] = False 
    
    def get_leaderboard(self) -> List[Tuple[str, int]]:
        """
        Return a sorted list of (player_name, rounds_won) tuples.
        """
        return sorted(
            ((name, data["rounds_won"]) for name, data in self.players.items()),
            key=lambda x: x[1], reverse=True
        ) 