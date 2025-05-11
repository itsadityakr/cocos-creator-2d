# Spawning Prefabs In A Grid and Setting Label using Counter

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge\&logo=typescript\&logoColor=white)

---

![project preview](thumbnail.gif)

## Overview

This project is made using **Cocos Creator with TypeScript**. It demonstrates how to dynamically **spawn a prefab** each time a button is clicked, and how to update the text inside that prefab using a **counter**.

---

## What This Project Does

* When the button is clicked:

  * It creates (instantiates) a new box using a **Prefab**.
  * That box is added into a **UI panel**.
  * The number on the box is updated using a **Label component**.
* Each box is labeled with a unique number based on an internal counter.
* This is useful for making dynamic UI lists, item generators, or runtime-created content.

---

## Code Explanation (Explain Each Word in Depth and Easy Way)

```ts
const { ccclass, property } = cc._decorator;
```

* `const`: A way to define a variable that won’t be changed.
* `{ ccclass, property }`: Pulls two useful tools from `cc._decorator`. These are decorators that tell Cocos how to treat our class and variables.
* `cc._decorator`: Cocos Creator's built-in area where decorators live.

---

```ts
@ccclass
```

* `@ccclass`: Tells Cocos Creator, “This is a custom script you can attach to game objects.”

---

```ts
export default class NewClass extends cc.Component {
```

* `export`: Makes this class usable in other files.
* `default`: This is the main thing being exported from the file.
* `class NewClass`: We're creating a new class called `NewClass`. You can rename it.
* `extends cc.Component`: This means our class inherits features from Cocos's base class `cc.Component`.

---

```ts
@property(cc.Node)
panel: cc.Node = null;
```

* `@property(cc.Node)`: Makes this variable show up in the editor so we can set it there.
* `panel`: The name we give to this variable. It represents a UI element where new boxes will go.
* `cc.Node`: The type. A `Node` is any object in the scene (like UI, sprites, etc.).
* `= null`: The variable is empty for now. We'll set it in the editor.

---

```ts
@property(cc.Prefab)
boxSprite: cc.Prefab = null;
```

* `@property(cc.Prefab)`: This tells Cocos that we will assign a prefab (reusable template) from the editor.
* `boxSprite`: The variable holding the prefab.
* `cc.Prefab`: Type of the object — a saved template.
* `= null`: Not yet set.

---

```ts
counter: number = 0;
```

* `counter`: A variable that keeps track of how many boxes we have made.
* `: number`: Type annotation saying it must be a number.
* `= 0`: Starts at 0.

---

```ts
start() {
    // Initialization logic can be added here if needed
}
```

* `start()`: A special function in Cocos Creator. Runs once when the game starts.
* Inside this block, you could put setup code, but here it's empty.

---

```ts
onClick() {
```

* `onClick()`: This function is called when a button is pressed. It will create a new box.

---

```ts
let a = cc.instantiate(this.boxSprite);
```

* `let a`: Declares a variable named `a`.
* `cc.instantiate(...)`: Creates a new object from a prefab.
* `this.boxSprite`: Refers to the prefab we set in the editor.

---

```ts
a.parent = this.panel;
```

* `a.parent`: We're saying where this new object should go.
* `= this.panel`: We're adding it to the panel node in the scene.

---

```ts
let label = a.children[0];
```

* `let label`: New variable to store the label node.
* `a.children[0]`: Gets the first child of the new prefab (assumed to have the label).

---

```ts
label.getComponent(cc.Label).string = "" + this.counter++;
```

* `label.getComponent(cc.Label)`: Finds the Label component on the node.
* `.string`: The text shown in the label.
* `= "" + this.counter++`: Converts the number to text and increases the counter by 1.

---

```ts
// update (dt) {
//     // Called every frame, can be used for continuous updates
// }
```

* This is an optional method in Cocos called every frame. We're not using it here, so it's commented out.

---

## What We Learned

1. **How to use the `@property` decorator** to expose script variables in the Cocos Editor.
2. **How to instantiate prefabs** dynamically using `cc.instantiate`.
3. **How to parent objects** using `.parent =`.
4. **How to find child nodes** using `.children[0]`.
5. **How to update label text** using `.getComponent(cc.Label).string`.
6. **How to auto-increment numbers** using `counter++`.

---

## Glossary of Key Terms

| Term / Symbol    | Meaning                                                   |
| ---------------- | --------------------------------------------------------- |
| `@property`      | A decorator to expose class variables in the Cocos Editor |
| `@ccclass`       | Marks the class as a usable Cocos component               |
| `cc.Node`        | A generic scene node; can represent UI, 2D, 3D, etc.      |
| `cc.Prefab`      | A reusable template for creating new objects in the scene |
| `cc.instantiate` | Creates a copy of a prefab                                |
| `.parent`        | Defines where in the scene tree the object should appear  |
| `.children`      | A list of a node’s child elements                         |
| `getComponent()` | Used to access a component like Label, Sprite, etc.       |
| `.string`        | The actual text shown in a Label                          |
| `counter++`      | Increases the counter after using its current value       |

---

![Static Badge](https://img.shields.io/badge/Aditya%20Kumar-black?style=for-the-badge\&logo=atlasos\&logoColor=%23ffffff)