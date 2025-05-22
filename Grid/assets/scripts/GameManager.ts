// GameManager.ts 

import ColorManager from "./ColorManager";
import GridManager from "./GridManager";
import NumberGenerator from "./NumberGenerator";

const { ccclass, property } = cc._decorator;

@ccclass export default class GameManager extends cc.Component {
    static instance: GameManager = null;

    

    @property(cc.Prefab)
    gridCellPrefab: cc.Prefab = null;

    @property(cc.Node)
    gridContainerNode: cc.Node = null;

    gridSize = 9;
    gridMatrix = [];

    onLoad() {
        GameManager.instance = this;
    }

    start() {
        ColorManager.instance.initializeColorPalette();
        this.generateGrid();
        NumberGenerator.instance.assignRandomCellPairs();
    }

    generateGrid() {
        this.gridContainerNode.removeAllChildren();
        this.gridMatrix = [];

        for (let row = 0; row < this.gridSize; row++) {
            this.gridMatrix[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                const cellNode = cc.instantiate(this.gridCellPrefab);
                cellNode.parent = this.gridContainerNode;
                cellNode.setPosition(col * 100, -row * 100);

                const cellComponent = cellNode.getComponent(GridManager);
                cellComponent.setupCell(col, row, this);
                this.gridMatrix[row][col] = cellComponent;
            }
        }
    }

    getColorForNumber(value) {
        return ColorManager.instance.colorMap.get(value) || cc.Color.WHITE;
    }

    isAllPairsMatched(): boolean {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.gridMatrix[row][col];
                if (cell.cellValue !== -1 && !cell.isLocked) {
                    return false; // Numbered cell still unlocked
                }
            }
        }
        return true; // All numbered cells locked
    }



}
