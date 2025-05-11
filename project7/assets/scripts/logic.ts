// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // Reference to the parent node (a panel) where instantiated prefabs will be added
    @property(cc.Node)
    panel: cc.Node = null;

    // Reference to the prefab to instantiate (boxSprite with a Label as its first child)
    @property(cc.Prefab)
    boxSprite: cc.Prefab = null;

    // Counter used to assign a unique number to each instantiated box
    counter: number = 0;

    // LIFE-CYCLE CALLBACKS

    // Called once when the script is first enabled
    start() {
        // Initialization logic can be added here if needed
    }

    // Method to be called when a button is clicked
    // It instantiates a new boxSprite prefab, adds it to the panel,
    // and updates the label of the box with the current counter value
    onClick() {
        // Create a new instance of the prefab
        let a = cc.instantiate(this.boxSprite);

        // Set its parent to the panel so it appears in the UI
        a.parent = this.panel;

        // Get the first child of the prefab (assumed to be a node with a Label component)
        let label = a.children[0];

        // Update the label's string to the current counter value
        label.getComponent(cc.Label).string = "" + this.counter++;

        // Optional: If needed, you can use a.getChildByName("boxSpriteLabel") for more robust access
    }

    // update (dt) {
    //     // Called every frame, can be used for continuous updates
    // }
}
