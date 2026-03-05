# 🎲 Pig Game

## Description

Pig Game is a simple **2-player dice game** built using **HTML, CSS, and JavaScript**.  
The goal of the game is to be the first player to reach the winning score.

Players take turns rolling a dice. During a turn, a player can roll the dice multiple times to accumulate points in their **current score**. However, if the player rolls a **1**, they lose the points accumulated during that turn and the turn switches to the other player.

The player can choose to **Hold**, which adds the current score to their total score and passes the turn to the other player.

The first player to reach the winning score wins the game.

---

## 🧠 Game Logic

The game follows these rules:

1. The game has **two players** playing in turns.
2. The active player can **roll the dice**.
3. If the dice roll is **not 1**, the value is added to the **current score**.
4. If the dice roll is **1**:
   - The current score becomes **0**
   - The turn switches to the **other player**
5. The player can press **Hold** to:
   - Add the current score to their **total score**
   - Switch the turn to the other player
6. The first player to reach the **winning score (20 points)** wins the game.
7. The **New Game** button resets the game state.

---

## 🛠 Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- DOM Manipulation
- Event Listeners

---

To run the project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pig-game.git



