// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

// Import the necessary decorators from the Cocos Creator framework
const { ccclass, property } = cc._decorator;

// Use the @ccclass decorator to define a class that extends cc.Component,
// making it a script that can be attached to a node in Cocos Creator
@ccclass
export default class rotationLogic extends cc.Component {

    // Define properties that reference different nodes in the scene

    // rotatingNode: The node that will rotate around another node
    @property(cc.Node) rotatingNode: cc.Node = null;

    // centerPlayPauseBtn: The node that serves as the center of rotation
    @property(cc.Node) centerPlayPauseBtn: cc.Node = null;

    // increaseSpeed: A button that increases the rotation speed
    @property(cc.Node) increaseSpeed: cc.Node = null;

    // decreaseSpeed: A button that decreases the rotation speed
    @property(cc.Node) decreaseSpeed: cc.Node = null;

    // Boolean flag to indicate whether the rotation is active or not
    isRotating: boolean = false; // Initially set to false (not rotating)

    // Variable to track the current rotation angle in degrees
    angle: number = 0; // Starts at 0, meaning no rotation has occurred

    // Variable to store the distance between rotatingNode and centerPlayPauseBtn
    radius: number = 0; // Initially set to 0, will be calculated later

    // Variable to store the rotation speed (default value set to 50)
    speed: number = 50; // Defines how fast the rotation happens

    // Lifecycle method that runs once when the script starts
    protected start(): void {
        // Get the position of the centerPlayPauseBtn node
        let centerPos = this.centerPlayPauseBtn.getPosition();

        // Get the position of the rotatingNode node
        let rotatingPos = this.rotatingNode.getPosition();

        // Calculate the radius as the absolute difference between x-coordinates
        // This determines how far the rotatingNode is from the centerPlayPauseBtn
        this.radius = Math.abs(rotatingPos.x - centerPos.x);

        // Log the calculated radius value to the console for debugging
        console.log(`Calculated Radius:`, this.radius);

        // Add event listener to increaseSpeed button, calling increaseRotationSpeed when clicked
        this.increaseSpeed.on(cc.Node.EventType.TOUCH_END, this.increaseRotationSpeed, this);

        // Add event listener to decreaseSpeed button, calling decreaseRotationSpeed when clicked
        this.decreaseSpeed.on(cc.Node.EventType.TOUCH_END, this.decreaseRotationSpeed, this);
    }

    // Method to toggle rotation on or off when called
    onClick() {
        // If isRotating is true, it becomes false, stopping rotation
        // If isRotating is false, it becomes true, starting rotation
        this.isRotating = !this.isRotating;
    }

    // Method that increases the rotation speed
    increaseRotationSpeed() {
        // Increase speed by 10 units
        this.speed += 10;

        // Log the new speed value to the console
        console.log(`Increased Speed: ${this.speed}`);
    }

    // Method that decreases the rotation speed
    decreaseRotationSpeed() {
        // Reduce the speed by 10 units, but ensure it never goes below 10
        this.speed = Math.max(10, this.speed - 10);

        // Log the new speed value to the console
        console.log(`Decreased Speed: ${this.speed}`);
    }

    // Lifecycle method that runs every frame
    update(dt: number) {
        // Only perform rotation calculations if rotation is enabled
        if (this.isRotating && this.centerPlayPauseBtn && this.rotatingNode) {
            // Increase the angle based on the speed multiplied by delta time (dt)
            this.angle += this.speed * dt;

            // Compute the new position based on circular movement
            const newPosition = getCirclePoint(this.radius, this.angle);

            // Get the position of the centerPlayPauseBtn to use as a reference
            let centerPos = this.centerPlayPauseBtn.getPosition();

            // Set the rotatingNode's new position relative to the centerPlayPauseBtn
            this.rotatingNode.setPosition(cc.v3(centerPos.x + newPosition.x, centerPos.y + newPosition.y));
        }
    }
}

// Function to compute the position of a point along a circular path
function getCirclePoint(radius: number, angleDegrees: number): { x: number, y: number } {
    // Convert the angle from degrees to radians since trigonometric functions use radians
    const angleRadians = (Math.PI / 180) * angleDegrees;

    // Compute the x-coordinate using the cosine function
    const x = radius * Math.cos(angleRadians);

    // Compute the y-coordinate using the sine function
    const y = radius * Math.sin(angleRadians);

    // Return the calculated x and y coordinates in an object
    return { x, y };
}