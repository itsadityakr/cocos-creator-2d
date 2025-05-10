# Rotating Object around A Central Node and Button to Increase Decrease Speed

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge\&logo=typescript\&logoColor=white)

---

![project preview](thumbnail.gif)

## Overview

This project creates a rotating object (node) that moves in a circular path around a central button (node). The rotation can be toggled on or off, and the speed of rotation can be adjusted using two buttons: one to increase the speed and one to decrease it. The movement follows a simple mathematical model, using trigonometric functions to calculate the position of the rotating object.

---

## What This Project Does

* **Rotating Node**: A node (e.g., sprite or other object) rotates around a central point (another node).
* **Rotation Toggle**: The user can start or stop the rotation by clicking a button.
* **Speed Adjustment**: The user can increase or decrease the speed of the rotation with buttons.
* **Mathematical Calculation**: Uses trigonometry to compute the position of the rotating node along a circular path.

---

## Code Explanation (Explain Each Word in Depth and Easy Way)

```ts
const { ccclass, property } = cc._decorator;
```

* `const`: Defines a constant, a variable whose value cannot be reassigned.
* `{ ccclass, property }`: Destructures the `ccclass` and `property` decorators from `cc._decorator`, making them easier to use in the code.

  * `ccclass`: Used to define a class as a Cocos Creator component, which can be attached to nodes.
  * `property`: A decorator to expose a variable to the Cocos Creator Editor for easy editing.

---

```ts
@ccclass
```

* `@ccclass`: A decorator that marks the class as a Cocos component, making it usable in the Cocos Creator editor.

---

```ts
export default class rotationLogic extends cc.Component {
```

* `export default`: This exports the class as the default export from the module.
* `class rotationLogic`: Declares a class named `rotationLogic`.
* `extends cc.Component`: Inherits from `cc.Component`, making this class a valid Cocos Creator component.

---

```ts
@property(cc.Node) rotatingNode: cc.Node = null;
```

* `@property(cc.Node)`: Exposes this variable to the Cocos Creator editor and makes it editable in the Inspector panel.
* `rotatingNode`: The node that will rotate around another node.
* `cc.Node`: The type of the variable, indicating it's a node.
* `= null`: Initializes the variable as null until it's set in the editor.

---

```ts
@property(cc.Node) centerPlayPauseBtn: cc.Node = null;
```

* `@property(cc.Node)`: Exposes the node representing the center of rotation to the editor.
* `centerPlayPauseBtn`: The button (node) at the center of the rotation.
* `cc.Node`: The type of the variable, a node.
* `= null`: Initializes it as null.

---

```ts
@property(cc.Node) increaseSpeed: cc.Node = null;
```

* `@property(cc.Node)`: Exposes the node that increases the speed to the editor.
* `increaseSpeed`: The button to increase rotation speed.
* `cc.Node`: The type of the variable, a node.
* `= null`: Initializes it as null.

---

```ts
@property(cc.Node) decreaseSpeed: cc.Node = null;
```

* `@property(cc.Node)`: Exposes the node that decreases the speed to the editor.
* `decreaseSpeed`: The button to decrease rotation speed.
* `cc.Node`: The type of the variable, a node.
* `= null`: Initializes it as null.

---

```ts
isRotating: boolean = false;
```

* `isRotating`: A flag (boolean) that determines whether the rotation is active.
* `boolean`: The data type indicating this variable will hold a true/false value.
* `= false`: Initializes the flag as `false`, meaning the rotation is initially stopped.

---

```ts
angle: number = 0;
```

* `angle`: Tracks the current angle of rotation.
* `number`: The data type indicating the variable will hold a numeric value.
* `= 0`: Initializes the angle to 0 degrees, meaning no rotation has occurred.

---

```ts
radius: number = 0;
```

* `radius`: The distance from the rotating node to the center of rotation.
* `number`: The data type indicating the variable will hold a numeric value.
* `= 0`: Initializes the radius to 0 until it's calculated.

---

```ts
speed: number = 50;
```

* `speed`: The rotation speed in units per second.
* `number`: The data type indicating the variable will hold a numeric value.
* `= 50`: Initializes the speed to 50, which is the default speed.

---

```ts
protected start(): void {
```

* `start()`: A lifecycle method that runs once when the component is initialized.
* `protected`: This access modifier means that the method can only be called from within the class or derived classes.

---

```ts
let centerPos = this.centerPlayPauseBtn.getPosition();
let rotatingPos = this.rotatingNode.getPosition();
```

* `getPosition()`: A method that gets the current position of a node in the scene.
* `centerPos`: The position of the center node (the one around which the rotation happens).
* `rotatingPos`: The position of the rotating node.

---

```ts
this.radius = Math.abs(rotatingPos.x - centerPos.x);
```

* `Math.abs()`: A JavaScript function that returns the absolute value of a number.
* `this.radius`: Stores the radius, which is the absolute horizontal distance between the rotating node and the center node.

---

```ts
this.increaseSpeed.on(cc.Node.EventType.TOUCH_END, this.increaseRotationSpeed, this);
this.decreaseSpeed.on(cc.Node.EventType.TOUCH_END, this.decreaseRotationSpeed, this);
```

* `.on()`: Adds an event listener to a node.
* `cc.Node.EventType.TOUCH_END`: The event type when the button is released.
* `this.increaseRotationSpeed`: The function that increases the speed when the button is clicked.
* `this.decreaseRotationSpeed`: The function that decreases the speed when the button is clicked.

---

```ts
onClick() {
    this.isRotating = !this.isRotating;
}
```

* `onClick()`: A method to toggle the rotation on and off.
* `this.isRotating = !this.isRotating`: Changes the value of `isRotating` to the opposite of its current value, starting or stopping the rotation.

---

```ts
increaseRotationSpeed() {
    this.speed += 10;
    console.log(`Increased Speed: ${this.speed}`);
}
```

* `increaseRotationSpeed()`: A method that increases the rotation speed.
* `this.speed += 10`: Increases the speed by 10 units.
* `console.log()`: Logs the new speed to the console.

---

```ts
decreaseRotationSpeed() {
    this.speed = Math.max(10, this.speed - 10);
    console.log(`Decreased Speed: ${this.speed}`);
}
```

* `decreaseRotationSpeed()`: A method that decreases the rotation speed.
* `Math.max(10, this.speed - 10)`: Ensures that the speed never goes below 10 units.
* `console.log()`: Logs the new speed to the console.

---

```ts
update(dt: number) {
    if (this.isRotating && this.centerPlayPauseBtn && this.rotatingNode) {
        this.angle += this.speed * dt;
        const newPosition = getCirclePoint(this.radius, this.angle);
        let centerPos = this.centerPlayPauseBtn.getPosition();
        this.rotatingNode.setPosition(cc.v3(centerPos.x + newPosition.x, centerPos.y + newPosition.y));
    }
}
```

* `update(dt)`: A lifecycle method that runs every frame, used for continuous updates.
* `this.angle += this.speed * dt`: Increases the angle based on the speed and time between frames (delta time `dt`).
* `getCirclePoint()`: A helper function that calculates the new position on the circle based on the current angle.
* `this.rotatingNode.setPosition()`: Sets the new position of the rotating node.

---

## What We Learned

1. **How to rotate a node around another node** using trigonometric functions and a radius.
2. **How to expose variables to the editor** using `@property`.
3. **How to use the update method** for continuous changes every frame.
4. **How to adjust rotation speed** with buttons.
5. **How to toggle actions (like rotation)** using boolean flags.

---

## Glossary of Key Terms

| Term / Symbol                 | Meaning                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| `@property`                   | A decorator to expose class variables to the Cocos Editor       |
| `@ccclass`                    | Marks the class as a usable Cocos component                     |
| `cc.Node`                     | A general-purpose container for game objects in Cocos Creator   |
| `update()`                    | A lifecycle callback that runs continuously every frame         |
| `Math.abs()`                  | Returns the absolute value of a number                          |
| `Math.max()`                  | Returns the largest value from a set of numbers                 |
| `cc.v3()`                     | Creates a 3D vector (even though this is used for 2D positions) |
| `cc.Node.EventType.TOUCH_END` | Event type that triggers when a touch ends (button release)     |

---

![Static Badge](https://img.shields.io/badge/Aditya%20Kumar-black?style=for-the-badge\&logo=atlasos\&logoColor=%23ffffff)

