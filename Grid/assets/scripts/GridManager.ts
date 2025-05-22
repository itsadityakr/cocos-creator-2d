const { ccclass, property } = cc._decorator;

import PathManager from "./PathManager";
import FeedbackManager from "./FeedbackManager";

@ccclass
export default class GridManager extends cc.Component {
    static instance: GridManager = null;

    @property(cc.Node)
    prefabBackground: cc.Node = null;

    @property(cc.Label)
    prefabLabel: cc.Label = null;

    gameController = null;
    column = 0;
    row = 0;
    cellValue = -1;
    isLocked: boolean = false;

    onLoad() {
        GridManager.instance = this;

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    setupCell(column: number, row: number, gameController) {
        this.column = column;
        this.row = row;
        this.cellValue = -1;
        this.prefabLabel.string = '';
        this.gameController = gameController;
        this.isLocked = false;

        // Set directly on the node for easy access in PathManager
        this.node["gridColumn"] = column;
        this.node["gridRow"] = row;
    }


    setValue(value: number) {
        this.cellValue = value;
        this.prefabLabel.string = value.toString();

        const color = this.gameController.getColorForNumber(value);
        this.prefabLabel.node.color = cc.Color.BLACK;
        if (this.prefabBackground) {
            this.prefabBackground.color = color;
        }
    }

    onMouseDown(event: cc.Event.EventMouse) {
        if (!this.isPointerInsideCanvas(event) || this.isLocked) return;

        if (this.cellValue !== -1 && !PathManager.isDrawing) {
            this.colorTile(this.cellValue);
            PathManager.mouseHeld = true;
            PathManager.startPath(this.cellValue, this.node);
            FeedbackManager.instance.console(`Started path with: ${this.cellValue}`);
        }
    }

    onMouseEnter(event: cc.Event.EventMouse) {
    if (!this.isPointerInsideCanvas(event) || this.isLocked) return;

    if (PathManager.isDrawing && PathManager.mouseHeld) {
        const lastNode = PathManager.drawnPath[PathManager.drawnPath.length - 1];
        const lastGm = lastNode.getComponent(GridManager);

        // Calculate difference between last node and current node
        const rowDiff = Math.abs(this.row - lastGm.row);
        const colDiff = Math.abs(this.column - lastGm.column);

        // Allow only if move is horizontal or vertical (not diagonal)
        if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) 
            return; // Reject diagonal move
        }

        if (!PathManager.drawnPath.includes(this.node)) {
            if (this.cellValue === -1 || this.node === PathManager.drawnPath[0]) {
                PathManager.addNodeToPath(this.node);
                this.colorTile(PathManager.currentNumber);
            }
        }
    }
}



    onMouseUp(event: cc.Event.EventMouse) {
        if (!this.isPointerInsideCanvas(event)) return;

        if (PathManager.isDrawing) {
            PathManager.mouseHeld = false;
            const gm = this.node.getComponent(GridManager);

            if (gm && gm.cellValue === PathManager.currentNumber && this.node !== PathManager.drawnPath[0]) {
                FeedbackManager.instance.console(`Correct pair matched: ${PathManager.currentNumber}`);
                PathManager.lockPath();
            } else if (gm && gm.cellValue !== -1 && gm.cellValue !== PathManager.currentNumber) {
                FeedbackManager.instance.console(`Wrong Pairs Matched`);
            }

            PathManager.endPath(this.node);
        }
    }

    colorTile(value: number) {
        if (this.isLocked || (this.cellValue !== -1 && this.cellValue !== value)) return;

        const color = this.gameController.getColorForNumber(value);
        this.prefabBackground.color = color;
    }

    lockTile(value: number) {
        const color = this.gameController.getColorForNumber(value);
        this.prefabBackground.color = color;
        this.prefabLabel.node.color = cc.Color.BLACK;
    }

    resetColor() {
        if (this.cellValue === -1) {
            this.prefabBackground.color = cc.Color.WHITE;
        } else {

            const color = this.gameController.getColorForNumber(this.cellValue);
            this.prefabBackground.color = color;
        }
    }

    isPointerInsideCanvas(event: cc.Event.EventMouse): boolean {
        const canvas = cc.find("Canvas");
        if (!canvas) return false;

        const mousePos = event.getLocation();
        const localPos = canvas.convertToNodeSpaceAR(mousePos);

        const canvasSize = canvas.getContentSize();
        const halfWidth = canvasSize.width / 2;
        const halfHeight = canvasSize.height / 2;

        return (
            localPos.x >= -halfWidth && localPos.x <= halfWidth &&
            localPos.y >= -halfHeight && localPos.y <= halfHeight
        );
    }
}
