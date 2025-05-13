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