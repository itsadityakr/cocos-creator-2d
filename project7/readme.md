# Instantiate Prefab with Random Color and Incrementing Label

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge\&logo=typescript\&logoColor=white)

---

![project preview](thumbnail.gif)

## Overview

This project creates and displays multiple instances of a prefab dynamically inside a panel. Each instance is given a **random color** and an **incremental label** when a button is clicked. It’s an excellent example of using prefabs, assigning them dynamically, and applying randomized and interactive behavior in Cocos Creator.

---

## What This Project Does

* **Prefab Instantiation**: Creates a new instance of a prefab every time a button is clicked.
* **Panel Parenting**: Sets the new prefab as a child of a designated panel.
* **Dynamic Labeling**: Assigns a unique number to each prefab using a counter.
* **Random Coloring**: Changes the background color of each prefab randomly.
* **Opacity Control**: Sets each prefab's visibility using opacity.

---

## Code Explanation (Line-by-Line and Easy to Understand)

```ts
const { ccclass, property } = cc._decorator;
```

* Imports `ccclass` and `property` decorators from the `cc._decorator` namespace, used to mark class and properties for the editor.

---

```ts
@ccclass
export default class GameLogic extends cc.Component {
```

* Marks the class as a Cocos Creator component named `GameLogic`, and exports it as the default module.

---

```ts
@property(cc.Node)
Panel: cc.Node = null;
```

* `@property(cc.Node)`: Exposes a Node to the editor for assignment.
* `Panel`: This will hold the parent container where new prefabs will be added.

---

```ts
@property(cc.Prefab)
ssplash: cc.Prefab = null;
```

* `@property(cc.Prefab)`: Exposes a prefab to the editor.
* `ssplash`: The template that will be instantiated during runtime.

---

```ts
counter: number = 1;
```

* A counter to label each new prefab instance (e.g., 1, 2, 3...).

---

```ts
onclick() {
    let a = cc.instantiate(this.ssplash);
```

* `onclick()`: Triggered when the button is clicked.
* `cc.instantiate()`: Creates a new node from the prefab.

---

```ts
a.parent = this.Panel;
```

* Sets the new node's parent to the `Panel`, so it becomes a child and appears in the UI layout.

---

```ts
let label = a.children[0];
label.getComponent(cc.Label).string = "" + this.counter++;
```

* Accesses the first child of the prefab (assumed to be a label).
* Sets the label text to the current counter value, then increments the counter.

---

```ts
const r = Math.floor(Math.random() * 256);
const g = Math.floor(Math.random() * 256);
const b = Math.floor(Math.random() * 256);
const randomColor = new cc.Color(r, g, b);
```

* Generates a random RGB color using `Math.random()` for each channel (0–255).
* Creates a `cc.Color` object from those values.

---

```ts
const sprite = a.getComponent(cc.Sprite);
sprite.node.color = randomColor;
```

* Gets the `cc.Sprite` component from the prefab root and assigns the random color.

---

```ts
sprite.node.opacity = 255;
```

* Sets full opacity (fully visible). Opacity range is from `0` (invisible) to `255` (opaque).

---

## What We Learned

1. **How to instantiate prefabs** at runtime.
2. **How to parent objects** to a specific node (e.g., a UI panel).
3. **How to update label text dynamically** using a counter.
4. **How to create random colors** with JavaScript and apply them.
5. **How to set node visibility** using the `opacity` property.

---

## Glossary of Key Terms

| Term / Symbol       | Meaning                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| `@property`         | Allows a variable to be edited/assigned in the Cocos Editor              |
| `cc.instantiate()`  | Clones a prefab into a new node instance                                 |
| `.parent`           | Sets the parent of a node (determines where it appears in the hierarchy) |
| `.children[0]`      | Accesses the first child of a node                                       |
| `cc.Label`          | Component used for displaying text                                       |
| `cc.Sprite`         | Component used for 2D graphics or colored rectangles                     |
| `cc.Color(r, g, b)` | Creates a color object using RGB values                                  |
| `opacity = 255`     | Sets full visibility (0 = invisible, 255 = opaque)                       |

---

![Static Badge](https://img.shields.io/badge/Aditya%20Kumar-black?style=for-the-badge\&logo=atlasos\&logoColor=%23ffffff)
