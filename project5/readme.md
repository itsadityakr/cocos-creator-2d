# Toggle Between Two Images on Click using Sprite Frame

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge\&logo=typescript\&logoColor=white)

---

![project preview](thumbnail.gif)

## Overview

This project demonstrates how to **toggle between two images (sprites)** on a node in Cocos Creator using TypeScript. When the user clicks a button (or the node), the image displayed switches between two predefined sprite frames (`image1` and `image2`). This is a great beginner-level project to understand component access, properties, and click event handling.

---

## What This Project Does

* **Sprite Toggling**: Switches between two images each time the user clicks.
* **Editor-Exposed Variables**: Uses the `@property` decorator to expose image assets and a display node to the Cocos Creator editor.
* **Component Access**: Dynamically changes the sprite frame via the `Sprite` component.
* **State Management**: Maintains a flag to track which image is currently active.

---

## Code Explanation (Explain Each Word in Depth and Easy Way)

```ts
const { ccclass, property } = cc._decorator;
```

* `const`: Declares a constant value.
* `{ ccclass, property }`: Destructures decorators from `cc._decorator`.

  * `ccclass`: Marks the class as a Cocos Creator component.
  * `property`: Exposes variables to the editor UI.

---

```ts
@ccclass
export default class logic extends cc.Component {
```

* `@ccclass`: Decorator to define this class as a component.
* `export default class logic`: Declares and exports the component named `logic`.
* `extends cc.Component`: Inherits from the base Cocos component class.

---

```ts
@property(cc.SpriteFrame)
image1: cc.SpriteFrame = null;
```

* `@property(cc.SpriteFrame)`: Makes this property editable in the Cocos Creator Inspector.
* `image1`: Holds the first image to display.
* `= null`: Initialized as null until assigned via the editor.

---

```ts
@property(cc.SpriteFrame)
image2: cc.SpriteFrame = null;
```

* `image2`: Stores the second image to switch to.
* Same structure and purpose as `image1`.

---

```ts
@property(cc.Node)
imageFrame: cc.Node = null;
```

* `imageFrame`: The node that displays the sprite.
* `cc.Node`: Represents a generic object in the scene.
* Will be used to swap images dynamically.

---

```ts
isImage1Active: boolean = true;
```

* `isImage1Active`: Boolean flag to track which image is currently displayed.
* Starts as `true` to show `image1` initially.

---

```ts
start() {
    this.imageFrame.getComponent(cc.Sprite).spriteFrame = this.image1;
}
```

* `start()`: Lifecycle method that runs once after the component initializes.
* `getComponent(cc.Sprite)`: Gets the `Sprite` component attached to `imageFrame`.
* `spriteFrame = this.image1`: Sets the initial sprite image.

---

```ts
onClick() {
    const sprite = this.imageFrame.getComponent(cc.Sprite);
```

* `onClick()`: Called when the user clicks (linked via UI event system).
* `const sprite`: Caches the reference to the Sprite component for efficiency.

---

```ts
if (this.isImage1Active) {
    sprite.spriteFrame = this.image2;
} else {
    sprite.spriteFrame = this.image1;
}
```

* Conditional logic to switch between the two images.

---

```ts
this.isImage1Active = !this.isImage1Active;
```

* Flips the boolean flag to toggle for the next click.

---

## What We Learned

1. **How to switch between two images** dynamically using sprite frames.
2. **How to expose assets and nodes to the editor** using `@property`.
3. **How to get a component from a node** using `getComponent()`.
4. **How to handle a click event** to trigger interactivity.
5. **How to manage a toggle state** using a boolean variable.

---

## Glossary of Key Terms

| Term / Symbol                | Meaning                                                     |
| ---------------------------- | ----------------------------------------------------------- |
| `@property`                  | Makes variables editable in the Cocos Editor                |
| `cc.SpriteFrame`             | Represents an image resource (texture)                      |
| `cc.Sprite`                  | A component that renders a `SpriteFrame` on screen          |
| `cc.Node`                    | A scene object that can hold components                     |
| `getComponent()`             | Accesses a component on a node                              |
| `spriteFrame`                | The property of the `Sprite` component that holds the image |
| `onClick()`                  | A method you link to a click event in the editor            |
| `this.isImage1Active = !...` | Inverts a boolean value to toggle state                     |

---

![Static Badge](https://img.shields.io/badge/Aditya%20Kumar-black?style=for-the-badge\&logo=atlasos\&logoColor=%23ffffff)

Let me know if you'd like a diagram or editor setup instructions added!
