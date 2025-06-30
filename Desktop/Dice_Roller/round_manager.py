from typing import Dict, List, Tuple, Any


def ceelo_rank(outcome: str, value: Any) -> Tuple[int, int]:
    """
    Assign a rank to a Cee-lo roll outcome for winner determination.
    Args:
        outcome (str): The outcome type (e.g., 'Win', 'Point', 'Lose').
        value (Any): The value associated with the outcome.
    Returns:
        Tuple[int, int]: A tuple representing the rank (higher is better).
    """
    if outcome == "Win":
        if value == "4-5-6 (Cee-lo!)":
            return (4, 6)  # Highest
        elif isinstance(value, str) and "Trips" in value:
            try:
                trip_num = int(str(value).split("(")[-1][0])
            except Exception:
                trip_num = 0
            return (3, trip_num)
        else:
            return (2, 0)
    elif outcome == "Point":
        try:
            return (1, int(value))
        except Exception:
            return (1, 0)
    elif outcome == "Lose":
        return (-1, 0)
    else:
        return (0, 0)


def determine_winners(round_rolls: Dict[str, Dict[str, Any]]) -> List[str]:
    """
    Given a dict of player rolls and outcomes, return the list of winner(s).
    Args:
        round_rolls (Dict[str, Dict[str, Any]]): Player roll/outcome data for the round.
    Returns:
        List[str]: List of winner player names.
    """
    best_rank = (-2, 0)
    winners: List[str] = []
    for player, info in round_rolls.items():
        rank = ceelo_rank(info["outcome"], info["value"])
        if rank > best_rank:
            best_rank = rank
            winners = [player]
        elif rank == best_rank:
            winners.append(player)
    return winners


def split_pot_among_winners(round_rolls: Dict[str, Dict[str, Any]], winners: List[str], player_manager: Any) -> None:
    """
    Split the pot among winners and update player balances. Assumes player_manager.players is accessible.
    Args:
        round_rolls (Dict[str, Dict[str, Any]]): Player roll/outcome data for the round.
        winners (List[str]): List of winner player names.
        player_manager (Any): The player manager instance (must have .players dict).
    Returns:
        None
    """
    pot = sum(info["bet"] for info in round_rolls.values())
    if len(winners) == 1:
        player_manager.players[winners[0]]["balance"] += pot
        player_manager.players[winners[0]]["rounds_won"] += 1
    else:
        split = pot // len(winners)
        for w in winners:
            player_manager.players[w]["balance"] += split
            player_manager.players[w]["rounds_won"] += 1 