// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

// Importing the necessary decorators from Cocos Creator
// `ccclass` is used to define a new component class
// `property` is a decorator that allows exposure of variables to the Inspector panel
const { ccclass, property } = cc._decorator;

@ccclass // Marks the class as a component for use in Cocos Creator
export default class NewClass extends cc.Component { // Extends from `cc.Component`, making it a valid Cocos component

    // Exposes a property that stores the prefab to be spawned.
    // Prefabs are reusable game objects stored in the Assets panel.
    @property(cc.Prefab) prefabSprite: cc.Prefab = null;

    // Exposes a Node that acts as the spawn area.
    // This defines where prefabs should be instantiated.
    @property(cc.Node) spawnArea: cc.Node = null;

    // Button that will trigger spawning when clicked
    @property(cc.Node) spawnBtn: cc.Node = null;

    // Button that will remove all spawned prefabs when clicked
    @property(cc.Node) removeAllBtn: cc.Node = null;

    // Private variables to store the size of the spawn area
    private spawnAreaSizeHeight: number; // Stores the height of spawnArea
    private spawnAreaSizeWidth: number;  // Stores the width of spawnArea

    // LIFE-CYCLE CALLBACKS:

    start() {
        // Runs once when the component is initialized
        // Ensures that the spawn area's dimensions are captured for later use
        if (this.spawnArea) {
            this.spawnAreaSizeHeight = this.spawnArea.height; // Get the height of the spawn area
            this.spawnAreaSizeWidth = this.spawnArea.width;   // Get the width of the spawn area
        }
    }

    // Removes all child nodes (prefabs) from the spawn area
    removeAllPrefabs() {
        this.spawnArea.removeAllChildren(); // Deletes all spawned prefabs from the `spawnArea`
    }

    // Creates a new instance of the prefab and positions it correctly
    spawnPrefabs() {
        let createdPrefab = cc.instantiate(this.prefabSprite); // Instantiates a copy of the prefab
        createdPrefab.parent = this.spawnArea; // Sets the parent of the prefab to the `spawnArea`
        createdPrefab.setPosition(this.getRandomPrefabPositions()); // Positions the prefab inside `spawnArea`
    }

    // Generates a random position within the spawn area, preventing it from appearing at the extreme edges
    getRandomPrefabPositions(): cc.Vec2 {
        let halfWidth = this.spawnArea.width / 2; // Calculates half-width of the spawn area
        let halfHeight = this.spawnArea.height / 2; // Calculates half-height of the spawn area

        // Generates a random X-coordinate within the spawn area with slight padding to prevent edge clipping
        let x = (Math.random() * (this.spawnArea.width - 20)) - (halfWidth - 10);

        // Generates a random Y-coordinate within the spawn area with slight padding
        let y = (Math.random() * (this.spawnArea.height - 20)) - (halfHeight - 10);

        return new cc.Vec2(x, y); // Returns the generated position as a Vec2 (a 2D coordinate in Cocos Creator)
    }

    // Event handler for spawn button click
    onClickSpawnBtn() {
        this.spawnPrefabs(); // Calls the spawn function when the button is clicked
    }

    // Event handler for remove-all button click
    onClickRemoveAllBtn() {
        this.removeAllPrefabs(); // Calls the remove-all function when the button is clicked
    }
}