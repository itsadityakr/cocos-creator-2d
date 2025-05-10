# Spawn Prefabs Randomly withing a Area and Remove All Prefabs

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge\&logo=typescript\&logoColor=white)

---

## Overview

This Cocos Creator project demonstrates how to spawn prefabs randomly within a defined spawn area and how to remove all spawned prefabs when needed. The project includes two buttons: one to spawn the prefabs and another to remove all prefabs from the scene.

---

## What This Project Does

* When the "Spawn" button is clicked:

  * A prefab (reusable object) is created and placed inside a specified spawn area.
  * The prefab is positioned randomly within the spawn area.
* When the "Remove All" button is clicked:

  * All prefabs are removed from the spawn area.

This is useful for dynamically generating game objects, such as enemies, obstacles, or items, and controlling their removal.

---

## Code Explanation (Explain Each Word in Depth and Easy Way)

```ts
const { ccclass, property } = cc._decorator;
```

* `const`: Defines a variable that cannot be reassigned.
* `{ ccclass, property }`: Destructures two decorators from `cc._decorator`.

  * `ccclass`: Used to define a new Cocos component class.
  * `property`: Used to expose class variables to the Cocos Creator editor for easy assignment.

---

```ts
@ccclass
```

* `@ccclass`: A decorator that marks the class as a component, making it usable in the Cocos Creator editor and attached to nodes.

---

```ts
export default class NewClass extends cc.Component {
```

* `export default`: Makes this class the default export of the file, meaning it can be imported elsewhere.
* `class NewClass`: The name of the class. You can change it to any name that fits the project.
* `extends cc.Component`: Inherits all the functionality of the base Cocos component class, so it can interact with the scene.

---

```ts
@property(cc.Prefab) prefabSprite: cc.Prefab = null;
```

* `@property(cc.Prefab)`: Exposes this variable to the Cocos Creator editor, making it editable in the inspector.
* `prefabSprite`: The variable holding the prefab template that will be instantiated.
* `cc.Prefab`: The type of the variable. Prefabs are templates of objects in the game that can be reused.
* `= null`: Initializes the variable to null (no value) until it's set in the editor.

---

```ts
@property(cc.Node) spawnArea: cc.Node = null;
```

* `@property(cc.Node)`: Exposes a variable that represents a scene node (a place where prefabs will be spawned).
* `spawnArea`: The area where the prefabs will appear.
* `cc.Node`: The type of the variable. A Node in Cocos is a general-purpose container for various components like sprites or scripts.
* `= null`: Initializes the variable as null, and it will be set in the editor.

---

```ts
@property(cc.Node) spawnBtn: cc.Node = null;
```

* `@property(cc.Node)`: Exposes the button that triggers the spawning of prefabs.
* `spawnBtn`: The button node that will trigger the spawn action.
* `cc.Node`: The type of the variable, which is a button (or any clickable UI element).
* `= null`: Initializes it as null.

---

```ts
@property(cc.Node) removeAllBtn: cc.Node = null;
```

* `@property(cc.Node)`: Exposes the button to remove all prefabs.
* `removeAllBtn`: The button node for removing prefabs from the spawn area.
* `cc.Node`: The type of the button.
* `= null`: Initialized as null.

---

```ts
private spawnAreaSizeHeight: number;
private spawnAreaSizeWidth: number;
```

* `private`: These variables are only accessible within the class.
* `spawnAreaSizeHeight`: Stores the height of the spawn area.
* `spawnAreaSizeWidth`: Stores the width of the spawn area.
* `number`: The data type indicating that these variables will hold numeric values.

---

```ts
start() {
    if (this.spawnArea) {
        this.spawnAreaSizeHeight = this.spawnArea.height;
        this.spawnAreaSizeWidth = this.spawnArea.width;
    }
}
```

* `start()`: A special lifecycle method in Cocos Creator that runs once when the component is first initialized.
* `if (this.spawnArea)`: Checks if the spawn area is set.
* `this.spawnArea.height`: Gets the height of the spawn area.
* `this.spawnArea.width`: Gets the width of the spawn area.

---

```ts
removeAllPrefabs() {
    this.spawnArea.removeAllChildren();
}
```

* `removeAllPrefabs()`: A method to remove all child nodes (prefabs) from the spawn area.
* `this.spawnArea.removeAllChildren()`: This removes every child node from the `spawnArea`, effectively deleting all spawned prefabs.

---

```ts
spawnPrefabs() {
    let createdPrefab = cc.instantiate(this.prefabSprite);
    createdPrefab.parent = this.spawnArea;
    createdPrefab.setPosition(this.getRandomPrefabPositions());
}
```

* `spawnPrefabs()`: A method that spawns a new prefab inside the spawn area.
* `let createdPrefab`: Declares a variable to hold the newly created prefab.
* `cc.instantiate(this.prefabSprite)`: Creates an instance (copy) of the prefab.
* `createdPrefab.parent = this.spawnArea`: Sets the parent of the new prefab to the `spawnArea` so it appears in the correct location.
* `createdPrefab.setPosition(this.getRandomPrefabPositions())`: Sets a random position for the prefab inside the spawn area.

---

```ts
getRandomPrefabPositions(): cc.Vec2 {
    let halfWidth = this.spawnArea.width / 2;
    let halfHeight = this.spawnArea.height / 2;
    let x = (Math.random() * (this.spawnArea.width - 20)) - (halfWidth - 10);
    let y = (Math.random() * (this.spawnArea.height - 20)) - (halfHeight - 10);
    return new cc.Vec2(x, y);
}
```

* `getRandomPrefabPositions()`: A method to generate random coordinates for the prefab.
* `let halfWidth = this.spawnArea.width / 2`: Calculates half of the spawn area’s width.
* `let halfHeight = this.spawnArea.height / 2`: Calculates half of the spawn area’s height.
* `let x = (Math.random() * (this.spawnArea.width - 20)) - (halfWidth - 10)`: Generates a random X-coordinate.
* `let y = (Math.random() * (this.spawnArea.height - 20)) - (halfHeight - 10)`: Generates a random Y-coordinate.
* `new cc.Vec2(x, y)`: Returns a `Vec2` (a 2D point) with the generated coordinates.

---

```ts
onClickSpawnBtn() {
    this.spawnPrefabs();
}
```

* `onClickSpawnBtn()`: A method that is triggered when the spawn button is clicked.
* `this.spawnPrefabs()`: Calls the method to spawn a prefab when the button is clicked.

---

```ts
onClickRemoveAllBtn() {
    this.removeAllPrefabs();
}
```

* `onClickRemoveAllBtn()`: A method triggered when the remove-all button is clicked.
* `this.removeAllPrefabs()`: Calls the method to remove all spawned prefabs.

---

## What We Learned

1. **How to expose variables to the Cocos Creator editor** using `@property`.
2. **How to spawn prefabs dynamically** using `cc.instantiate`.
3. **How to manage a spawn area** by calculating its size and using random positions.
4. **How to remove all children from a node** with `removeAllChildren()`.
5. **How to link UI buttons to functions** for interactive gameplay.

---

## Glossary of Key Terms

| Term / Symbol         | Meaning                                                       |
| --------------------- | ------------------------------------------------------------- |
| `@property`           | A decorator to expose class variables to the Cocos Editor     |
| `@ccclass`            | Marks the class as a usable Cocos component                   |
| `cc.Prefab`           | A reusable template for creating new objects in the scene     |
| `cc.Node`             | A general-purpose container for game objects in Cocos Creator |
| `cc.instantiate`      | Creates a new copy of a prefab object                         |
| `removeAllChildren()` | Removes all child nodes (e.g., prefabs) from a node           |
| `getComponent()`      | Used to access components attached to a node                  |
| `Vec2`                | Represents a 2D vector (coordinate) in Cocos Creator          |

---

![Static Badge](https://img.shields.io/badge/Aditya%20Kumar-black?style=for-the-badge\&logo=atlasos\&logoColor=%23ffffff)

---
