// NumberGenerator.ts

import GameManager from "./GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NumberGenerator extends cc.Component {
    static instance: NumberGenerator = null;

    gridStartNumber = 1;
    gridEndNumber = 8;
    private occupied: boolean[][] = [];

    onLoad() {
        NumberGenerator.instance = this;
    }

    assignRandomCellPairs() {
        const gm = GameManager.instance;

        // Initialize the occupied matrix
        for (let row = 0; row < gm.gridSize; row++) {
            this.occupied[row] = Array(gm.gridSize).fill(false);
        }

        let successfulNumbers = 0;

        for (let num = this.gridStartNumber; num <= this.gridEndNumber; num++) {
            let maxAttempts = 100;
            let placed = false;

            while (maxAttempts-- > 0) {
                const [start, end] = this.pickTwoValidPositions();

                // Defensive check
                if (!start || !end) break;

                const path = this.findShortestPath(start, end);

                if (path) {
                    gm.gridMatrix[start.y][start.x].setValue(num);
                    gm.gridMatrix[end.y][end.x].setValue(num);
                    this.markPathAsOccupied(path);

                    console.log(`Number ${num} path: ${path.map(p => `[${p.y},${p.x}]`).join(" -> ")}`);
                    placed = true;
                    successfulNumbers++;
                    break;
                }
            }

            // Stop placing more numbers if placement failed
            if (!placed) {
                console.warn(`Stopped at number ${num} due to insufficient space/path`);
                break;
            }
        }

        this.gridEndNumber = this.gridStartNumber + successfulNumbers - 1;
    }

    pickTwoValidPositions(): [{x: number, y: number}, {x: number, y: number}] {
    const gm = GameManager.instance;
    const valid = [];

    for (let y = 0; y < gm.gridSize; y++) {
        for (let x = 0; x < gm.gridSize; x++) {
            if (!this.occupied[y][x] && gm.gridMatrix[y][x].cellValue === -1) {
                valid.push({ x, y });
            }
        }
    }

    const shuffled = valid.sort(() => 0.5 - Math.random());

    for (let i = 0; i < shuffled.length; i++) {
        for (let j = i + 1; j < shuffled.length; j++) {
            const a = shuffled[i];
            const b = shuffled[j];

            const isAdjacent =
                Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;

            if (!isAdjacent) {
                return [a, b];
            }
        }
    }

    return [shuffled[0], shuffled[0]];
}

    findShortestPath(start: { x: number, y: number }, end: { x: number, y: number }): { x: number, y: number }[] | null {
        const gm = GameManager.instance;
        const directions = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ];

        const visited = Array.from({ length: gm.gridSize }, () => Array(gm.gridSize).fill(false));
        const parentMap = new Map<string, { x: number, y: number }>();

        const queue: { x: number, y: number }[] = [start];
        visited[start.y][start.x] = true;

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (current.x === end.x && current.y === end.y) {
                const path = [];
                let curr = end;
                while (!(curr.x === start.x && curr.y === start.y)) {
                    path.push(curr);
                    curr = parentMap.get(`${curr.x},${curr.y}`)!;
                }
                path.push(start);
                path.reverse();
                return path;
            }

            for (const { dx, dy } of directions) {
                const nx = current.x + dx;
                const ny = current.y + dy;
                if (
                    nx >= 0 && nx < gm.gridSize &&
                    ny >= 0 && ny < gm.gridSize &&
                    !visited[ny][nx] &&
                    !this.occupied[ny][nx]
                ) {
                    visited[ny][nx] = true;
                    parentMap.set(`${nx},${ny}`, current);
                    queue.push({ x: nx, y: ny });
                }
            }
        }

        return null;
    }

    markPathAsOccupied(path: { x: number, y: number }[]) {
        for (const pos of path) {
            this.occupied[pos.y][pos.x] = true;
        }
    }
}

