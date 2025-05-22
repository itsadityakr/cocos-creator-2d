


















const { ccclass } = cc._decorator;
import GridManager from "./GridManager";

@ccclass
export default class PathManager extends cc.Component {
    static isDrawing: boolean = false;
    static mouseHeld: boolean = false;
    static currentNumber: number = -1;
    static drawnPath: cc.Node[] = [];


    static startPath(number: number, startNode: cc.Node) {
        this.isDrawing = true;
        this.currentNumber = number;
        this.drawnPath = [startNode];
    }


    static addNodeToPath(node: cc.Node) {
        if (!this.isDrawing || !this.mouseHeld) return;

        const gm = node.getComponent(GridManager);
        if (!gm) return;

        // Prevent adding if cell value is different and not the start node
        if (gm.cellValue !== -1 && gm.cellValue !== this.currentNumber && node !== this.drawnPath[0]) {
            return;
        }

        // Get last node position
        const lastNode = this.drawnPath[this.drawnPath.length - 1];
        if (lastNode) {
            const lastCol = lastNode["gridColumn"];
            const lastRow = lastNode["gridRow"];
            const newCol = node["gridColumn"];
            const newRow = node["gridRow"];

            if (lastCol === undefined || lastRow === undefined || newCol === undefined || newRow === undefined) {
                return; // Cannot verify adjacency, block move
            }

            const dx = Math.abs(newCol - lastCol);
            const dy = Math.abs(newRow - lastRow);

            // Allow only horizontal or vertical adjacency (no diagonal)
            if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
                return; // Not adjacent properly, block the move
            }
        }

        this.drawnPath.push(node);
    }

    static endPath(endNode: cc.Node) {
        this.isDrawing = false;
        this.mouseHeld = false;
    }

    static resetPath() {
        this.drawnPath = [];
        this.isDrawing = false;
        this.mouseHeld = false;
    }

    static lockPath() {
        for (let node of this.drawnPath) {
            const gm = node.getComponent(GridManager);
            if (gm) {
                gm.lockTile(this.currentNumber);
            }
        }
    }
}