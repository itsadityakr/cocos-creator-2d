


















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

        
        if (gm.cellValue !== -1 && gm.cellValue !== this.currentNumber && node !== this.drawnPath[0]) {
            return; 
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