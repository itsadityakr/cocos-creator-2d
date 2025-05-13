# 512 Clone - Cocos Creator (TypeScript)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge\&logo=typescript\&logoColor=white)

---

## Overview

A minimalist clone of the popular puzzle game **512**, developed using **Cocos Creator 2.4.15** with **TypeScript**. The game involves combining numbered tiles on a 4x4 grid to reach the target value (default: `16`, can be updated to `512`).

---

## What This Project Does

* Initializes a 4x4 tile grid using a 2D array.
* Allows tile movement using **arrow keys** (← ↑ → ↓).
* Merges tiles with the same value and increases score.
* Dynamically spawns tiles (2 or 4) in random empty positions.
* Tracks score and displays win message upon reaching the target.
* Basic UI interactions like **start screen**, **win screen**, **rules popup**, and a **footer message console**.
* Easy game restart and back-to-home flow.

---

## Node Tree

```
Canvas
├── Background                          // Main container for all game UI
│   ├── grid_4x4                        // 4x4 Grid (Node with 16 empty child nodes)
│   │   ├── Cell_0_0                    // Empty node at row 0, column 0
│   │   ├── Cell_0_1
│   │   ├── Cell_0_2
│   │   ├── Cell_0_3
│   │   ├── Cell_1_0
│   │   ├── Cell_1_1
│   │   ├── Cell_1_2
│   │   ├── Cell_1_3
│   │   ├── Cell_2_0
│   │   ├── Cell_2_1
│   │   ├── Cell_2_2
│   │   ├── Cell_2_3
│   │   ├── Cell_3_0
│   │   ├── Cell_3_1
│   │   ├── Cell_3_2
│   │   └── Cell_3_3
│   ├── footerConsole                  // Label that displays log messages like "Moved Left"
│   ├── scoreLabel                     // Label that displays the score
│   ├── footerDiscription              // Description panel shown/hidden via toggle
│   ├── rules                          // Rule panel that appears when "Rules" is clicked
│   │   └── btn_closeRules             // Close button inside Rules panel
│   ├── gameStartScreen                // Start screen shown before the game begins
│   │   ├── btn_startGame              // Start button to begin the game
│   │   └── btn_rules                  // Button to open Rules panel
│   └── gameWonScreen                  // Win screen shown when the player wins
│       └── label_winMessage           // Text label like "You Won!"
├── GameController                     // Node with attached 2048 main logic script
│   └── (Script: NewClass.ts)          // The main game controller handling input and logic
└── TilePrefab (Prefab Template)       // Not in the scene, instantiated into grid cells
    ├── Background (sprite or layout) 
    └── Label                         // Label displaying tile value like "2", "4", "8", etc.
```


---

## What We Learned

1. **How to use the `@property` decorator** to expose script variables (e.g., prefab, labels, nodes) in the Cocos Editor.
2. How to define and manipulate a **4x4 grid** using a 2D `number[][]` array.
3. How to write **game logic for merging tiles** based on user input (arrow keys).
4. **How to track and update game score** dynamically in a label.
5. How to dynamically **instantiate prefab tiles** using `cc.instantiate()`.
6. How to **set child position and hierarchy** using `spawnPrefab.parent =` and `setPosition(0, 0)`.
7. How to **filter arrays and remove zeros** to simulate tile sliding.
8. How to **set up keyboard input handlers** using `cc.systemEvent.on(KEY_DOWN, callback)`.
9. How to use **Cocos' color system** with `cc.Color` for visual tile differentiation.
10. How to show/hide UI screens using `node.active = true/false`.
11. How to **change node label text** using `getComponent(cc.Label).string`.
12. How to **set node z-index** using `node.setSiblingIndex(999)` to bring it to front.
13. How to **toggle instructions and descriptions** through button events.
14. How to **restart and reinitialize game state**, including grid, tiles, and score.
15. How to **update user-facing logs and status messages** in a dedicated console area.
16. How to check for **free spaces and spawn new tiles** in random positions.
17. How to encapsulate color logic using a **color mapping dictionary**.
18. How to use `TOUCH_END` on the scene to regain canvas focus on click.

---

## Code Explaination

Here's the code with in-depth comments to explain each part:

```typescript
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node) grid_4x4: cc.Node = null;
    @property(cc.Prefab) prefab: cc.Prefab = null;
    @property(cc.Node) footerConsole: cc.Node = null;
    @property(cc.Label) scoreLabel: cc.Label = null;
    @property(cc.Node) gameStartScreen: cc.Node = null;
    @property(cc.Node) gameWonScreen: cc.Node = null;
    @property(cc.Node) rules: cc.Node = null;
    @property(cc.Node) footerDiscription = null;

    score: number = 0;
    board: number[][] = Array(4).fill(null).map(() => Array(4).fill(0));

    winningValue: number = 16;
    gameOver: boolean = false;
    gameStarted: boolean = false;
    canGoHome: boolean = false;
    hasWon: boolean = false;
```

1. **`@ccclass` decorator**:

   * This is a special Cocos Creator decorator that marks a class as a component to be attached to a node in the scene. It enables features like automatic serialization of properties and exposes the class in the Cocos Creator editor.

2. **`export default class NewClass extends cc.Component`**:

   * `NewClass`: The name of the class that will define the behavior of a component in the game.
   * `extends cc.Component`: This class inherits from `cc.Component`, which is the base class for all components in Cocos Creator. This means the class will behave as a component that can be attached to a node in the scene.

3. **`@property(cc.Node) grid_4x4: cc.Node = null;`**:

   * `@property`: A decorator used to define a property that can be set in the editor.
   * `cc.Node`: The type of the property. In this case, it represents a node in the scene (like a container or a UI element).
   * `grid_4x4`: The variable name, which will be used to refer to the grid node in code.
   * `= null`: Initializes the property with a `null` value.

4. **`@property(cc.Prefab) prefab: cc.Prefab = null;`**:

   * `@property(cc.Prefab)`: This property type refers to a prefab (a reusable object in Cocos Creator).
   * `prefab`: The variable holding the prefab reference that can be instantiated to create tiles in the game.

5. **`@property(cc.Label) scoreLabel: cc.Label = null;`**:

   * `@property(cc.Label)`: This property will be a Cocos Creator Label component that displays text (like the score).
   * `scoreLabel`: The variable holding the label reference.
   * `= null`: Initializes the label property to `null`.

6. **`score: number = 0;`**:

   * This is a regular class variable, not tied to the Cocos Creator editor, but holds the score of the game. It’s initialized to `0`.

7. **`board: number[][] = Array(4).fill(null).map(() => Array(4).fill(0));`**:

   * `board`: A 2D array representing the game grid.
   * `Array(4).fill(null)`: Creates an array with 4 elements, all set to `null`.
   * `map(() => Array(4).fill(0))`: Fills each of the 4 rows with 4 zeros, initializing the game grid to 4x4 with zeros.

8. **`winningValue: number = 16;`**:

   * The target value a player needs to reach to win the game (e.g., 16 in a 2048 game).

9. **Boolean flags (`gameOver`, `gameStarted`, `canGoHome`, `hasWon`)**:

   * `gameOver`: Tracks if the game is over (set to `true` when the game ends).
   * `gameStarted`: Indicates if the game has been started (set to `true` when the game begins).
   * `canGoHome`: A flag that allows the player to go back to the home menu.
   * `hasWon`: Indicates if the player has won the game (set to `true` when the player wins).


```typescript
start() {
        this.rules.active = false;
        this.footerDiscription.active = false;
    }

    onClick() {
        this.gameStartScreen.active = false;
        this.hasWon = false;
        this.canGoHome = true;
        this.restartGame();
        this.setupClickEvent();
        this.setupKeyBindings();
        this.node.setSiblingIndex(999);
        cc.game.canvas.focus();
        this.updateMessageConsole("Game Started! Tiles Spawned.");
    }

    toggleFooterDiscription() {
        this.footerDiscription.active = !this.footerDiscription.active;
    }

    onClickOpenRules() {
        this.rules.active =! this.rules.active;
    }

    onClickCloseRules() {
        this.rules.active = false;
    }

    setupClickEvent() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.game.canvas.focus();
        }, this);
    }

    setupKeyBindings() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.moveLeft();
                break;
            case cc.macro.KEY.right:
                this.moveRight();
                break;
            case cc.macro.KEY.up:
                this.moveUp();
                break;
            case cc.macro.KEY.down:
                this.moveDown();
                break;
        }
    }
```

1. **`start()`**:

   * This method initializes the game state by hiding certain UI elements (rules and footer description) when the game starts. This ensures that only the relevant UI elements are visible at the beginning of the game.

2. **`onClick()`**:

   * Triggered when the player clicks to start the game.
   * The game start screen is hidden, the game state flags are reset (`hasWon = false`), and necessary methods (`restartGame`, `setupClickEvent`, and `setupKeyBindings`) are called.
   * `this.node.setSiblingIndex(999)` moves the current node to the top of the scene hierarchy, making it the most important node.
   * The canvas is focused to ensure that any touch or keyboard input is received by the game.

3. **`toggleFooterDiscription()`**:

   * This function toggles the visibility of the footer description. If it’s visible, it will hide it; if it’s hidden, it will show it.

4. **`onClickOpenRules()`**:

   * Toggles the visibility of the rules screen, allowing the player to see the rules or instructions when necessary.

5. **`onClickCloseRules()`**:

   * Closes the rules screen by setting the `rules` node to inactive (hidden).

6. **`setupClickEvent()`**:

   * Sets up a touch event listener to focus the canvas when the screen is tapped, making it ready to receive further input.

7. **`setupKeyBindings()`**:

   * Sets up key bindings for the arrow keys (up, down, left, right). This allows the player to control the game using the keyboard.

8. **`onKeyDown(event: cc.Event.EventKeyboard)`**:

   * A method that handles key press events.
   * When the arrow keys are pressed, it triggers corresponding movement methods (`moveLeft()`, `moveRight()`, `moveUp()`, `moveDown()`) to move tiles on the game grid.


```typescript
    moveLeft() {
        if (this.gameOver) return;
        for (let row = 0; row < 4; row++) {
            let newRow = this.board[row].filter(val => val !== 0);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    newRow[i + 1] = 0;
                    this.score += newRow[i];
                    if (newRow[i] === this.winningValue) {
                        this.win();
                        return;
                    }
                }
            }
            newRow = newRow.filter(val => val !== 0);
            while (newRow.length < 4) newRow.push(0);
            this.board[row] = newRow;
        }
        this.updateBoardView();
        this.spawnRandomTile();
        this.updateMessageConsole("Moved Left");
        this.updateScore();
    }

    moveRight() {
        if (this.gameOver) return;
        for (let row = 0; row < 4; row++) {
            let newRow = this.board[row].filter(val => val !== 0);
            for (let i = newRow.length - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1]) {
                    newRow[i] *= 2;
                    newRow[i - 1] = 0;
                    this.score += newRow[i];
                    if (newRow[i] === this.winningValue) {
                        this.win();
                        return;
                    }
                }
            }
            newRow = newRow.filter(val => val !== 0);
            while (newRow.length < 4) newRow.unshift(0);
            this.board[row] = newRow;
        }
        this.updateBoardView();
        this.spawnRandomTile();
        this.updateMessageConsole("Moved Right");
        this.updateScore();
    }

    moveUp() {
        if (this.gameOver) return;
        for (let col = 0; col < 4; col++) {
            let newColumn = [];
            for (let row = 0; row < 4; row++) {
                if (this.board[row][col] !== 0) newColumn.push(this.board[row][col]);
            }

            for (let i = 0; i < newColumn.length - 1; i++) {
                if (newColumn[i] === newColumn[i + 1]) {
                    newColumn[i] *= 2;
                    newColumn[i + 1] = 0;
                    this.score += newColumn[i];
                    if (newColumn[i] === this.winningValue) {
                        this.win();
                        return;
                    }
                }
            }

            newColumn = newColumn.filter(val => val !== 0);
            while (newColumn.length < 4) newColumn.push(0);

            for (let row = 0; row < 4; row++) {
                this.board[row][col] = newColumn[row];
            }
        }

        this.updateBoardView();
        this.spawnRandomTile();
        this.updateMessageConsole("Moved Up");
        this.updateScore();
    }

    moveDown() {
        if (this.gameOver) return;
        for (let col = 0; col < 4; col++) {
            let newColumn = [];
            for (let row = 3; row >= 0; row--) {
                if (this.board[row][col] !== 0) newColumn.push(this.board[row][col]);
            }

            for (let i = 0; i < newColumn.length - 1; i++) {
                if (newColumn[i] === newColumn[i + 1]) {
                    newColumn[i] *= 2;
                    newColumn[i + 1] = 0;
                    this.score += newColumn[i];
                    if (newColumn[i] === this.winningValue) {
                        this.win();
                        return;
                    }
                }
            }

            newColumn = newColumn.filter(val => val !== 0);
            while (newColumn.length < 4) newColumn.unshift(0);

            for (let row = 3; row >= 0; row--) {
                this.board[row][col] = newColumn[3 - row];
            }
        }

        this.updateBoardView();
        this.spawnRandomTile();
        this.updateMessageConsole("Moved Down");
        this.updateScore();
    }
```

1. **`moveLeft()`**:

   * **`this.gameOver` check**: Prevents any action if the game is over.
   * **Filtering and combining tiles**: The function filters out zeros from the row, combines adjacent tiles with the same value, doubles the first tile, and sets the second tile to zero. The score is updated whenever two tiles are merged.
   * **Filling with zeros**: After merging tiles, zeros are added to the end of the row to keep the board size constant.
   * **Board update**: The row is updated in the board, and the visual and game state are updated by calling `updateBoardView()`, `spawnRandomTile()`, and `updateScore()`.

2. **`moveRight()`**:

   * Similar to `moveLeft()`, but it works from the right side of the board and shifts the tiles in the opposite direction.
   * The row is processed in reverse (starting from the rightmost tile), and zeros are added to the beginning of the row after merging tiles.

3. **`moveUp()`**:

   * **Processing columns**: This method works by iterating over each column, rather than rows. It first filters out the zeros in each column, then merges tiles vertically (in the upward direction).
   * **Filling with zeros**: After merging, the column is filled with zeros at the bottom to maintain the board’s size.
   * **Updating the board**: After modifying the column, the board is updated accordingly.

4. **`moveDown()`**:

   * This method works similarly to `moveUp()`, but moves the tiles downward. It iterates through columns, merges tiles in the downward direction, and fills any empty spaces at the top with zeros.

```typescript
    win() {
        this.hasWon = true;
        this.gameOver = true;
        this.gameWonScreen.active = true; // Show Game Over screen
        this.updateMessageConsole(`🎉 You won! Restart to play again.`);
    }

    spawnRandomTile() {
        let freeSpaces = this.getFreeSpaces();
        if (freeSpaces.length === 0) {
            this.updateMessageConsole("No empty spaces left!");
            return;
        }

        let { x, y } = freeSpaces[Math.floor(Math.random() * freeSpaces.length)];
        this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
        this.createTile(x, y, this.board[x][y]);
        this.updateMessageConsole(`Spawned ${this.board[x][y]} at (${x}, ${y})`);
    }

    getFreeSpaces(): { x: number, y: number }[] {
        let freeSpaces = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 0) freeSpaces.push({ x: i, y: j });
            }
        }
        return freeSpaces;
    }

    updateBoardView() {
        this.grid_4x4.children.forEach((child, index) => {
            let row = Math.floor(index / 4);
            let col = index % 4;
            child.removeAllChildren();
            if (this.board[row][col] !== 0) {
                this.createTile(row, col, this.board[row][col]);
            }
        });
    }

    createTile(row: number, col: number, value: number) {
        let spawnPrefab = cc.instantiate(this.prefab);
        spawnPrefab.parent = this.grid_4x4.children[row * 4 + col];
        spawnPrefab.setPosition(0, 0);

        let label = spawnPrefab.children[0];
        label.getComponent(cc.Label).string = `${value}`;
        spawnPrefab.color = this.getColorForValue(value);

        return spawnPrefab;
    }

    getColorForValue(value: number): cc.Color {
        const colorMap = {
            2: new cc.Color(238, 228, 218),
            4: new cc.Color(237, 224, 200),
            8: new cc.Color(242, 177, 121),
            16: new cc.Color(245, 149, 99),
            32: new cc.Color(246, 124, 95),
            64: new cc.Color(246, 94, 59),
            128: new cc.Color(237, 207, 114),
            256: new cc.Color(237, 204, 97),
            512: new cc.Color(237, 200, 80),
            1024: new cc.Color(237, 197, 63),
            2048: new cc.Color(237, 194, 46)
        };

        return colorMap[value] || new cc.Color(205, 193, 180);
    }

    updateMessageConsole(message: string) {
        this.footerConsole.getComponent(cc.Label).string = message;
    }

    updateScore() {
        this.scoreLabel.getComponent(cc.Label).string = `${this.score}`;
    }

    goHome() {
        cc.director.loadScene('game');
        // this.gameStartScreen.active = true;
    }

    restartGame() {
        if (this.hasWon) {
            this.gameStartScreen.active = true;
        }
        else {
            this.gameOver = false;
            this.gameWonScreen.active = false;
            this.board = Array(4).fill(null).map(() => Array(4).fill(0));
            this.grid_4x4.children.forEach(child => child.removeAllChildren());
            this.spawnRandomTile();
            this.spawnRandomTile();
            this.updateMessageConsole("Game Restarted! New Tiles Spawned.");
        }
    }
}
```

Sure! Here's the in-depth explanation of the code's functionality:

### 1. **`win()`**

* This function is called when the player successfully wins the game by achieving a tile with the predefined winning value (2048 in this case).
* **`this.hasWon = true`**: This sets the `hasWon` flag to `true`, indicating that the player has won the game.
* **`this.gameOver = true`**: This sets the `gameOver` flag to `true` to stop further game actions, preventing any more tile movements or interactions.
* **`this.gameWonScreen.active = true`**: This line makes the "Game Won" screen visible to the player, indicating that they have won the game.
* **`this.updateMessageConsole('🎉 You won! Restart to play again.')`**: A message is displayed to the player in the footer console, telling them they have won and need to restart to play again.

### 2. **`spawnRandomTile()`**

* This function is responsible for randomly spawning a new tile on the board at an empty space (either a tile with a value of 2 or 4).
* **`let freeSpaces = this.getFreeSpaces()`**: The `getFreeSpaces()` function is called to get a list of all empty spaces on the game board.
* **`if (freeSpaces.length === 0)`**: If there are no empty spaces (i.e., the game board is full), a message is displayed in the console indicating that no spaces are left for spawning a tile.
* **`let { x, y } = freeSpaces[Math.floor(Math.random() * freeSpaces.length)]`**: A random free space is selected using `Math.random()` to choose a random index from the array of free spaces.
* **`this.board[x][y] = Math.random() < 0.9 ? 2 : 4`**: A value (either 2 or 4) is assigned to the selected free space. There’s a 90% chance for the value to be 2 and a 10% chance for it to be 4.
* **`this.createTile(x, y, this.board[x][y])`**: The `createTile()` function is called to instantiate a new tile at the selected position with the assigned value.
* **`this.updateMessageConsole('Spawned ... at ...')`**: The console message is updated to show the value of the spawned tile and its position on the board.

### 3. **`getFreeSpaces()`**

* This function scans the game board to identify and return all empty spaces.
* **`let freeSpaces = []`**: An empty array is initialized to store the coordinates of all empty spaces.
* **`for (let i = 0; i < 4; i++)`** and **`for (let j = 0; j < 4; j++)`**: These loops iterate over the entire 4x4 game board.
* **`if (this.board[i][j] === 0)`**: If the space at position `(i, j)` on the board has a value of 0 (meaning it’s empty), the coordinates `{ x: i, y: j }` are added to the `freeSpaces` array.
* **`return freeSpaces`**: After scanning the entire board, the array of free spaces is returned.

### 4. **`updateBoardView()`**

* This function updates the visual representation of the game board based on the current state of `this.board`.
* **`this.grid_4x4.children.forEach((child, index) => {...})`**: This loops through all the children (the grid cells) of the `grid_4x4` node, which represent the tiles on the board.
* **`let row = Math.floor(index / 4)`**: The row index is calculated based on the current grid cell's index in the array.
* **`let col = index % 4`**: The column index is calculated by taking the remainder when the index is divided by 4.
* **`child.removeAllChildren()`**: This removes any existing child objects (previously spawned tiles) from the current grid cell.
* **`if (this.board[row][col] !== 0)`**: If there is a non-zero value in the current grid cell, the `createTile()` function is called to create a new tile at that position.

### 5. **`createTile(row, col, value)`**

* This function is used to instantiate a new tile at a specific position on the game board.
* **`let spawnPrefab = cc.instantiate(this.prefab)`**: A tile prefab (a predefined template for a tile) is instantiated, creating a new instance of the tile.
* **`spawnPrefab.parent = this.grid_4x4.children[row * 4 + col]`**: The tile is assigned to the appropriate grid cell, making it a child of the corresponding `grid_4x4` child node (the visual representation of that board space).
* **`spawnPrefab.setPosition(0, 0)`**: The tile’s position within the grid cell is set to (0, 0), ensuring it is centered in the cell.
* **`let label = spawnPrefab.children[0]`**: The label component, which will display the tile’s value, is accessed by selecting the first child of the instantiated tile.
* **`label.getComponent(cc.Label).string = `\${value}\`\`**: The tile’s value (e.g., 2, 4, 8, etc.) is set as the text in the label.
* **`spawnPrefab.color = this.getColorForValue(value)`**: The color of the tile is set based on its value, which is determined by the `getColorForValue()` function.
* **`return spawnPrefab`**: The newly created tile is returned, though the function primarily modifies the game board visually.

### 6. **`getColorForValue(value)`**

* This function returns the color associated with a given tile value.
* **`const colorMap = {...}`**: A dictionary (`colorMap`) is defined that maps each possible tile value (2, 4, 8, etc.) to a specific color.
* **`return colorMap[value] || new cc.Color(205, 193, 180)`**: If the tile’s value matches one of the entries in `colorMap`, the corresponding color is returned. If no match is found (e.g., for a value not defined in the map), a default color is returned.

### 7. **`updateMessageConsole(message)`**

* This function updates the text displayed in the footer console with a given message.
* **`this.footerConsole.getComponent(cc.Label).string = message`**: The label component on the `footerConsole` node is updated with the provided message.

### 8. **`updateScore()`**

* This function updates the score display.
* **`this.scoreLabel.getComponent(cc.Label).string = `\${this.score}\`\`**: The label component on the `scoreLabel` node is updated with the current score.

### 9. **`goHome()`**

* This function reloads the main game scene.
* **`cc.director.loadScene('game')`**: The game scene is reloaded using `cc.director.loadScene()`, effectively restarting the game.

### 10. **`restartGame()`**

* This function handles restarting the game, resetting the board and score to their initial states.
* **`if (this.hasWon)`**: If the player has previously won, the start screen is shown again.
* **`this.gameOver = false`**: The `gameOver` flag is reset to `false` to allow gameplay to continue.
* **`this.gameWonScreen.active = false`**: The "Game Won" screen is hidden.
* **`this.board = Array(4).fill(null).map(() => Array(4).fill(0))`**: The board is reset to a 4x4 grid of zeros, clearing all tiles.
* **`this.grid_4x4.children.forEach(child => child.removeAllChildren())`**: Any existing tiles are removed from the grid cells.
* **`this.spawnRandomTile()`**: Two new random tiles are spawned on the board.
* **`this.updateMessageConsole('Game Restarted! New Tiles Spawned.')`**: A message is displayed indicating that the game has been restarted.

---

## Glossary of Key Terms

| Term / Symbol                 | Meaning                                                               |
| ----------------------------- | --------------------------------------------------------------------- |
| `@property`                   | Decorator to expose variables in the Cocos Editor                     |
| `@ccclass`                    | Decorator that marks a class as a Cocos component                     |
| `cc.Node`                     | A game object that can hold components like Label, Sprite, etc.       |
| `cc.Prefab`                   | Template object that can be instantiated dynamically                  |
| `cc.Label`                    | Component for displaying and updating text                            |
| `cc.Color`                    | Utility to apply color to nodes (e.g., tiles)                         |
| `cc.instantiate()`            | Used to clone prefab instances                                        |
| `getComponent()`              | Used to access a specific component on a node                         |
| `cc.systemEvent.on()`         | Binds system-level events like keyboard input                         |
| `cc.Event.EventKeyboard`      | Event class for keyboard inputs                                       |
| `cc.macro.KEY.left`           | Constant for Left Arrow key                                           |
| `this.node.setSiblingIndex()` | Brings the current node to the top of rendering order                 |
| `node.active = true/false`    | Toggles the visibility of a node                                      |
| `this.board`                  | 4x4 number matrix representing the game state                         |
| `filter()`                    | Array method to remove unwanted values (used to filter out `0`s)      |
| `push()` / `unshift()`        | Array methods used to simulate left/right and up/down movement        |
| `removeAllChildren()`         | Clears all existing tiles from a grid cell                            |
| `children[]`                  | Array of a node's direct child nodes (used for grid traversal)        |
| `TOUCH_END`                   | Event triggered when touch ends (used for regaining canvas focus)     |
| `Math.random()`               | Generates random values, used for tile placement and value assignment |
| `canvas.focus()`              | Brings focus back to the Cocos canvas (to ensure key input works)     |
| `cc.director.loadScene()`     | Used to reload/reset the current scene                                |

---

## Customization Ideas

* Change `winningValue` to `512` for a full challenge.
* Add a **"Game Over"** condition when no valid moves remain.
* Add **animations** using `cc.tween()` for smoother transitions.
* Add **mobile swipe controls** for better device support.

---

## Dependencies

* **Cocos Creator 2.4.15**
* **TypeScript**

---

## Author

![Static Badge](https://img.shields.io/badge/Aditya%20Kumar-black?style=for-the-badge\&logo=atlasos\&logoColor=%23ffffff)

---