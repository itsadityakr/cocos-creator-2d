// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

// Import necessary decorators from Cocos Creator
const { ccclass, property } = cc._decorator;

@ccclass
export default class dragNResetLogic extends cc.Component {

    // Define properties to reference specific nodes within the scene
    @property(cc.Node)
    draggableSpriteSplash: cc.Node = null; // The sprite node that will be draggable

    @property(cc.Node)
    boxSpriteSplash: cc.Node = null; // The target drop zone where the sprite can align to center

    private isDragging: boolean = false; // Flag to track whether the node is being dragged
    private defaultPosition: cc.Vec3 = null; // Stores the original/default position of the draggable node

    /**
     * Called when the script instance is loaded. Initializes the event listeners.
     */
    onLoad() {
        // Store the default position of the sprite so it can be reset if needed
        this.defaultPosition = this.draggableSpriteSplash.position;

        // Register touch event listeners to enable dragging functionality
        this.draggableSpriteSplash.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this); // Called when touch starts
        this.draggableSpriteSplash.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this); // Called continuously when dragging
        this.draggableSpriteSplash.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this); // Called when touch ends
        this.draggableSpriteSplash.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this); // Called if touch is interrupted

        // Detect when the mouse pointer exits the canvas, triggering a reset
        cc.game.canvas.addEventListener("mouseleave", this.onMouseLeave.bind(this));
    }

    /**
     * Called when the user starts touching the draggable node.
     * Enables dragging mode.
     */
    onTouchStart(event: cc.Event.EventTouch) {
        this.isDragging = true; // Activate dragging mode
    }

    /**
     * Called continuously while the user moves their finger or mouse across the screen.
     * Updates the position of the draggable node based on touch movement.
     */
    onTouchMove(event: cc.Event.EventTouch) {
        if (this.isDragging) {
            let delta = event.getDelta(); // Get the movement change from the previous frame
            let deltaVec3 = new cc.Vec3(delta.x, delta.y, 0); // Convert Vec2 delta into Vec3 for compatibility
            let newPos = this.draggableSpriteSplash.position.add(deltaVec3); // Calculate new position
            this.draggableSpriteSplash.setPosition(newPos); // Apply the new position to the sprite
        }
    }

    /**
     * Called when the user releases the touch or the drag action is canceled.
     * Determines whether the sprite should align to a target or remain where dropped.
     */
    onTouchEnd(event: cc.Event.EventTouch) {
        this.isDragging = false; // Disable dragging mode

        // Check if the sprite is within the target drop zone
        if (this.isInsideDropZone()) {
            this.alignToCenter(); // Snap the sprite to the center of the drop zone
        }
    }

    /**
     * Moves the draggable sprite to the center of the drop zone.
     */
    alignToCenter() {
        let boxCenter = this.boxSpriteSplash.position; // Retrieve the center position of the drop zone
        this.draggableSpriteSplash.setPosition(boxCenter); // Assign the new position to the sprite
    }

    /**
     * Checks whether the draggable sprite is inside the bounding box of the drop zone.
     * Returns true if they overlap.
     */
    isInsideDropZone(): boolean {
        let draggablePos = this.draggableSpriteSplash.getBoundingBoxToWorld(); // Get global bounding box of the draggable sprite
        let dropZonePos = this.boxSpriteSplash.getBoundingBoxToWorld(); // Get global bounding box of the drop zone
        return dropZonePos.intersects(draggablePos); // Check if the two bounding boxes overlap
    }

    /**
     * Resets the draggable sprite’s position back to its original default position.
     */
    resetPosition() {
        this.draggableSpriteSplash.setPosition(this.defaultPosition); // Restore the sprite's initial position
    }

    /**
     * Detects when the mouse pointer leaves the canvas.
     * This event triggers a reset to the default position of the draggable sprite.
     */
    onMouseLeave() {
        this.resetPosition(); // Reset the sprite’s position when the cursor exits the game area
    }
}