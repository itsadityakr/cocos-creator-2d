project 1


__________________________________

// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLogic extends cc.Component {

    @property(cc.Node)
    Panel: cc.Node = null;
    @property(cc.Prefab)
    ssplash: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    start() {
    }
    counter: number = 1;
    onclick() {
        let a = cc.instantiate(this.ssplash);
        a.parent = this.Panel; //jo prefab banega woh ki parent ka child hona chahiye toh jo a prefab hai uska parent panel hai
        let label = a.children[0]; //jo a hai uske child ko access kar rahe
        // this.node.getChildByName("sSplashLabel");
        label.getComponent(cc.Label).string = "" + this.counter++;
    }

    // update (dt) {}
}


____________________________________________________---

project 2

______________________________________________

// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLogic extends cc.Component {

    @property(cc.Node)
    Panel: cc.Node = null;
    @property(cc.Prefab)
    ssplash: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    start() {
    }
    counter: number = 1;
    onclick() {
        let a = cc.instantiate(this.ssplash);
        a.parent = this.Panel; //jo prefab banega woh ki parent ka child hona chahiye toh jo a prefab hai uska parent panel hai
        let label = a.children[0]; //jo a hai uske child ko access kar rahe
        // this.node.getChildByName("sSplashLabel");
        label.getComponent(cc.Label).string = "" + this.counter++;

        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const randomColor = new cc.Color(r, g, b);

        const sprite = a.getComponent(cc.Sprite);
        sprite.node.color = randomColor;

        sprite.node.opacity = 255; // (0-256]
    }

    // update (dt) {}
}

__________________________________________

project 3

___________________________________________

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


_________________________________

project 4

__________________________________________

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


______________________________________

project 5

__________________________________________

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

__________________________________

project 6

_________________________________

// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node) bgRed: cc.Node = null;
    @property(cc.Node) bgGreen: cc.Node = null;

    private isRedActive: boolean = true; // Track which color is active

    onLoad() {
        this.bgRed.active = true;
        this.bgGreen.active = false;
    }

    onClick() {
        this.isRedActive = !this.isRedActive;
        this.bgRed.active = this.isRedActive;
        this.bgGreen.active = !this.isRedActive;
    }
}



____________________________

project 7

______________________________

// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class logic extends cc.Component {

    @property(cc.SpriteFrame)
    image1: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    image2: cc.SpriteFrame = null;

    @property(cc.Node)
    imageFrame: cc.Node = null;

    isImage1Active: boolean = true;

    start() {
        this.imageFrame.getComponent(cc.Sprite).spriteFrame = this.image1;
    }

    onClick() {
        const sprite = this.imageFrame.getComponent(cc.Sprite);
        if (this.isImage1Active) {
            sprite.spriteFrame = this.image2;
        } else {
            sprite.spriteFrame = this.image1;
        }
        this.isImage1Active = !this.isImage1Active;
    }
}


_______________________________

project 8

________________________________

const { ccclass, property } = cc._decorator;
@ccclass
export default class DragNResetLogic extends cc.Component {
	@property(cc.Node) draggableOption1: cc.Node = null;
	@property(cc.Node) draggableOption2: cc.Node = null;
	@property(cc.Node) draggableOption3: cc.Node = null;
	@property(cc.Node) draggableOption4: cc.Node = null;
	@property(cc.Node) matchArea1: cc.Node = null;
	@property(cc.Node) matchArea2: cc.Node = null;
	@property(cc.Node) matchArea3: cc.Node = null;
	@property(cc.Node) matchArea4: cc.Node = null;

	private defaultPositions: cc.Vec3[] = [];
	private isDragging: boolean[] = [false, false, false, false];
	private boxOccupants: Map<cc.Node, cc.Node | null> = new Map();

	private colors: cc.Color[] = [
		new cc.Color(255, 160, 160),
		new cc.Color(165, 255, 162),
		new cc.Color(255, 247, 151),
		new cc.Color(252, 112, 240),
	];

	private shuffledNumbers: number[] = [];
	private shuffledAreas: cc.Node[] = [];
	private draggableNodes: cc.Node[] = [];

	onLoad() {
		this.draggableNodes = [
			this.draggableOption1,
			this.draggableOption2,
			this.draggableOption3,
			this.draggableOption4,
		];
		const boxSprites = [
			this.matchArea1,
			this.matchArea2,
			this.matchArea3,
			this.matchArea4,
		];
		this.shuffledNumbers = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
		this.shuffledAreas = boxSprites.sort(() => Math.random() - 0.5);
		for (let i = 0; i < this.shuffledAreas.length; i++) {
			this.shuffledAreas[i].color = this.colors[i];
			this.draggableNodes[i].color = this.colors[i];
			if (this.draggableNodes[i].children.length > 0) {
				let labelNode = this.draggableNodes[i].children[0].getComponent(
					cc.Label
				);
				if (labelNode)
					labelNode.string = this.shuffledNumbers[i].toString();
			}
			if (this.shuffledAreas[i].children.length > 0) {
				let labelNode = this.shuffledAreas[i].children[0].getComponent(
					cc.Label
				);
				if (labelNode)
					labelNode.string = this.shuffledNumbers[i].toString();
			}
			this.defaultPositions[i] = this.draggableNodes[i].position;
		}
		cc.game.canvas.addEventListener(
			"mouseleave",
			this.onMouseLeave.bind(this)
		);
		for (let i = 0; i < this.draggableNodes.length; i++) {
			this.draggableNodes[i].on(
				cc.Node.EventType.TOUCH_START,
				(event) => this.onTouchStart(event, i),
				this
			);
			this.draggableNodes[i].on(
				cc.Node.EventType.TOUCH_MOVE,
				(event) => this.onTouchMove(event, i),
				this
			);
			this.draggableNodes[i].on(
				cc.Node.EventType.TOUCH_END,
				(event) => this.onTouchEnd(event, i),
				this
			);
			this.draggableNodes[i].on(
				cc.Node.EventType.TOUCH_CANCEL,
				(event) => this.onTouchEnd(event, i),
				this
			);
		}
	}

	onTouchStart(event: cc.Event.EventTouch, index: number) {
		this.isDragging[index] = true;
		this.draggableNodes[index].setSiblingIndex(
			this.draggableNodes[index].parent.childrenCount - 1
		);
	}

	onTouchMove(event: cc.Event.EventTouch, index: number) {
		if (!this.isDragging[index]) return;
		let delta = event.getDelta();
		let newPos = this.draggableNodes[index].position.add(
			new cc.Vec3(delta.x, delta.y, 0)
		);
		this.draggableNodes[index].setPosition(newPos);
	}

	onTouchEnd(event: cc.Event.EventTouch, index: number) {
		this.isDragging[index] = false;
		for (let i = 0; i < this.shuffledAreas.length; i++) {
			if (
				this.isInsideDropZone(
					this.draggableNodes[index],
					this.shuffledAreas[i]
				)
			) {
				if (
					this.boxOccupants.get(this.shuffledAreas[i]) !==
					this.draggableNodes[index]
				) {
					this.clearPreviousBox(this.draggableNodes[index]);
					this.boxOccupants.set(
						this.shuffledAreas[i],
						this.draggableNodes[index]
					);
					this.alignToCenter(
						this.draggableNodes[index],
						this.shuffledAreas[i]
					);
					return;
				}
			}
		}
		this.resetPosition(this.draggableNodes[index], index);
	}

	alignToCenter(sprite: cc.Node, box: cc.Node) {
		sprite.setPosition(box.position);
	}

	isInsideDropZone(sprite: cc.Node, box: cc.Node): boolean {
		let spriteBounds = sprite.getBoundingBoxToWorld();
		let boxBounds = box.getBoundingBoxToWorld();
		let spriteArea = spriteBounds.width * spriteBounds.height;
		let overlapWidth = Math.max(
			0,
			Math.min(spriteBounds.xMax, boxBounds.xMax) -
				Math.max(spriteBounds.xMin, boxBounds.xMin)
		);
		let overlapHeight = Math.max(
			0,
			Math.min(spriteBounds.yMax, boxBounds.yMax) -
				Math.max(spriteBounds.yMin, boxBounds.yMin)
		);
		let overlapArea = overlapWidth * overlapHeight;
		return overlapArea / spriteArea >= 0.5;
	}

	resetPosition(sprite: cc.Node, index: number) {
		sprite.setPosition(this.defaultPositions[index]);
		this.clearPreviousBox(sprite);
	}

	clearPreviousBox(sprite: cc.Node) {
		this.boxOccupants.forEach((occupant, box) => {
			if (occupant === sprite) this.boxOccupants.set(box, null);
		});
	}

	onMouseLeave() {
		for (let i = 0; i < this.draggableNodes.length; i++) {
			if (this.isDragging[i]) {
				this.resetPosition(this.draggableNodes[i], i);
				this.isDragging[i] = false;
			}
		}
	}

	resetAllPositions() {
		for (let i = 0; i < this.draggableNodes.length; i++) {
			this.resetPosition(this.draggableNodes[i], i);
		}
	}

	submitAnswer() {
		let allCorrect = true;
		for (let i = 0; i < this.draggableNodes.length; i++) {
			const node = this.draggableNodes[i];
			const assignedBox = this.shuffledAreas[i];
			let draggableLabel = node.children[0]?.getComponent(
				cc.Label
			)?.string;
			let matchAreaLabel = assignedBox.children[0]?.getComponent(
				cc.Label
			)?.string;
			if (
				this.boxOccupants.get(assignedBox) === node &&
				draggableLabel === matchAreaLabel
			) {
				node.color = new cc.Color(0, 255, 0);
			} else {
				node.color = new cc.Color(255, 0, 0);
				allCorrect = false;
			}
			node.off(cc.Node.EventType.TOUCH_START);
			node.off(cc.Node.EventType.TOUCH_MOVE);
			node.off(cc.Node.EventType.TOUCH_END);
			node.off(cc.Node.EventType.TOUCH_CANCEL);
		}
	}

	restartGame() {
		this.resetAllPositions();
		this.onLoad();
	}
}


_____________________________________
DefaultWork.code-profile
_____________________________________

{"name":"DefaultWork","settings":"{\"settings\":\"{\\r\\n    \\\"workbench.iconTheme\\\": \\\"vscode-icons\\\",\\r\\n    \\\"workbench.productIconTheme\\\": \\\"a-file-icon-vscode-product-icon-theme\\\",\\r\\n    \\\"code-runner.saveFileBeforeRun\\\": true,\\r\\n    \\\"workbench.startupEditor\\\": \\\"none\\\",\\r\\n    \\\"[typescript]\\\": {\\r\\n        \\\"editor.defaultFormatter\\\": \\\"vscode.typescript-language-features\\\"\\r\\n    },\\r\\n    \\\"files.autoSave\\\": \\\"afterDelay\\\",\\r\\n    \\\"editor.wordWrap\\\": \\\"on\\\",\\r\\n    \\\"security.workspace.trust.untrustedFiles\\\": \\\"open\\\",\\r\\n    \\\"prettier.tabWidth\\\": 4,\\r\\n    \\\"prettier.useTabs\\\": true,\\r\\n    \\\"window.newWindowProfile\\\": \\\"Default\\\"\\r\\n}\"}","extensions":"[{\"identifier\":{\"id\":\"atommaterial.a-file-icon-vscode\",\"uuid\":\"31d413c3-ee2a-4bac-882e-bead93a22a20\"},\"displayName\":\"Atom Material Icons\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"dbaeumer.vscode-eslint\",\"uuid\":\"583b2b34-2c1e-4634-8c0b-0b82e283ea3a\"},\"displayName\":\"ESLint\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"docode.vscode-remove-final-newlines\",\"uuid\":\"964b7147-1384-4739-97d2-4e0cfa54f94b\"},\"displayName\":\"Remove Final Newlines\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"dsznajder.es7-react-js-snippets\",\"uuid\":\"19804510-b475-4dae-b0f7-6ca08fd1af0c\"},\"displayName\":\"ES7+ React/Redux/React-Native snippets\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"eamodio.gitlens\",\"uuid\":\"4de763bd-505d-4978-9575-2b7696ecf94e\"},\"displayName\":\"GitLens — Git supercharged\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"ecmel.vscode-html-css\",\"uuid\":\"aaee577c-f062-495a-9816-0cbd442f1d25\"},\"displayName\":\"HTML CSS Support\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"esbenp.prettier-vscode\",\"uuid\":\"96fa4707-6983-4489-b7c5-d5ffdfdcce90\"},\"displayName\":\"Prettier - Code formatter\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"formulahendry.auto-rename-tag\",\"uuid\":\"6e440e71-8ed9-4f25-bb78-4b13096b8a03\"},\"displayName\":\"Auto Rename Tag\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"formulahendry.code-runner\",\"uuid\":\"a6a0c5b2-d078-4bf5-a9ee-4e37054414b3\"},\"displayName\":\"Code Runner\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"khayrulloisomiddinov.khayrullo-comment-remover\",\"uuid\":\"3c57945a-859a-488e-a93d-99af2b5c554a\"},\"displayName\":\"comment-remover\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"ms-vscode.vscode-typescript-next\",\"uuid\":\"15305aca-2588-4ca0-8147-ab2c64730b82\"},\"displayName\":\"JavaScript and TypeScript Nightly\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"pkief.material-icon-theme\",\"uuid\":\"5db78037-f674-459f-a236-db622c427c5b\"},\"displayName\":\"Material Icon Theme\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"ritwickdey.liveserver\",\"uuid\":\"46cc5bbd-b098-4568-9b87-f91e07d26f2d\"},\"displayName\":\"Live Server\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"rvest.vs-code-prettier-eslint\",\"uuid\":\"d4b06bd6-36a0-469f-be55-c0a73413b688\"},\"displayName\":\"Prettier ESLint\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"visualstudioexptteam.intellicode-api-usage-examples\",\"uuid\":\"9fa2a00e-3bfa-4c2a-abc4-a865bb2b5cf3\"},\"displayName\":\"IntelliCode API Usage Examples\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"vscode-icons-team.vscode-icons\",\"uuid\":\"9ccc1dd7-7ec4-4a46-bd4f-7d7b8b9d322a\"},\"displayName\":\"vscode-icons\",\"applicationScoped\":false},{\"identifier\":{\"id\":\"yoavbls.pretty-ts-errors\",\"uuid\":\"1e149c89-8f97-447e-863d-1146f0ad1b70\"},\"displayName\":\"Pretty TypeScript Errors\",\"applicationScoped\":false}]","globalState":"{\"storage\":{\"workbench.panel.chat.hidden\":\"[{\\\"id\\\":\\\"workbench.panel.chat.view.copilot\\\",\\\"isHidden\\\":false}]\",\"workbench.explorer.views.state.hidden\":\"[{\\\"id\\\":\\\"outline\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"timeline\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.explorer.openEditorsView\\\",\\\"isHidden\\\":true},{\\\"id\\\":\\\"workbench.explorer.emptyView\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"npm\\\",\\\"isHidden\\\":true},{\\\"id\\\":\\\"workbench.explorer.fileView\\\",\\\"isHidden\\\":false}]\",\"workbench.view.search.state.hidden\":\"[{\\\"id\\\":\\\"workbench.view.search\\\",\\\"isHidden\\\":false}]\",\"workbench.scm.views.state.hidden\":\"[{\\\"id\\\":\\\"workbench.scm.repositories\\\",\\\"isHidden\\\":true},{\\\"id\\\":\\\"workbench.scm\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.scm.history\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.repositories\\\",\\\"isHidden\\\":true},{\\\"id\\\":\\\"gitlens.views.commits\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.branches\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.remotes\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.stashes\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.tags\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.worktrees\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.contributors\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.scm.grouped\\\",\\\"isHidden\\\":false}]\",\"workbench.panel.markers.hidden\":\"[{\\\"id\\\":\\\"workbench.panel.markers.view\\\",\\\"isHidden\\\":false}]\",\"workbench.panel.output.hidden\":\"[{\\\"id\\\":\\\"workbench.panel.output\\\",\\\"isHidden\\\":false}]\",\"terminal.hidden\":\"[{\\\"id\\\":\\\"terminal\\\",\\\"isHidden\\\":false}]\",\"workbench.activityBar.location\":\"default\",\"chatEditsView.hideMovedEditsView\":\"true\",\"workbench.statusbar.hidden\":\"[\\\"GitHub.copilot.status\\\"]\",\"workbench.activity.pinnedViewlets2\":\"[{\\\"id\\\":\\\"workbench.view.explorer\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":0},{\\\"id\\\":\\\"workbench.view.search\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":1},{\\\"id\\\":\\\"workbench.view.scm\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":2},{\\\"id\\\":\\\"workbench.view.debug\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":3},{\\\"id\\\":\\\"workbench.view.remote\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":4},{\\\"id\\\":\\\"workbench.view.extensions\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":4},{\\\"id\\\":\\\"workbench.view.extension.test\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":6},{\\\"id\\\":\\\"workbench.view.extension.references-view\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":7},{\\\"id\\\":\\\"workbench.view.extension.gitlens\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":8},{\\\"id\\\":\\\"workbench.view.extension.gitlensInspect\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":9},{\\\"id\\\":\\\"workbench.view.extension.gitlensPatch\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":10},{\\\"id\\\":\\\"workbench.view.sync\\\",\\\"pinned\\\":true,\\\"visible\\\":false},{\\\"id\\\":\\\"workbench.view.editSessions\\\",\\\"pinned\\\":true,\\\"visible\\\":false}]\",\"workbench.panel.pinnedPanels\":\"[{\\\"id\\\":\\\"workbench.panel.markers\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":0},{\\\"id\\\":\\\"workbench.panel.output\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":1},{\\\"id\\\":\\\"workbench.panel.repl\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":2},{\\\"id\\\":\\\"terminal\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":3},{\\\"id\\\":\\\"workbench.panel.testResults\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":3},{\\\"id\\\":\\\"~remote.forwardedPortsContainer\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":5},{\\\"id\\\":\\\"workbench.view.extension.gitlensPanel\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":6},{\\\"id\\\":\\\"refactorPreview\\\",\\\"pinned\\\":true,\\\"visible\\\":false}]\",\"workbench.auxiliarybar.pinnedPanels\":\"[{\\\"id\\\":\\\"workbench.panel.chat\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":100},{\\\"id\\\":\\\"workbench.panel.chatEditing\\\",\\\"pinned\\\":true,\\\"visible\\\":false,\\\"order\\\":101}]\",\"colorThemeData\":\"{\\\"id\\\":\\\"vs-dark vscode-theme-defaults-themes-dark_modern-json\\\",\\\"label\\\":\\\"Dark Modern\\\",\\\"settingsId\\\":\\\"Default Dark Modern\\\",\\\"themeTokenColors\\\":[{\\\"settings\\\":{\\\"foreground\\\":\\\"#D4D4D4\\\"},\\\"scope\\\":[\\\"meta.embedded\\\",\\\"source.groovy.embedded\\\",\\\"string meta.image.inline.markdown\\\",\\\"variable.legacy.builtin.python\\\"]},{\\\"settings\\\":{\\\"fontStyle\\\":\\\"italic\\\"},\\\"scope\\\":\\\"emphasis\\\"},{\\\"settings\\\":{\\\"fontStyle\\\":\\\"bold\\\"},\\\"scope\\\":\\\"strong\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#000080\\\"},\\\"scope\\\":\\\"header\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#6A9955\\\"},\\\"scope\\\":\\\"comment\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"constant.language\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#b5cea8\\\"},\\\"scope\\\":[\\\"constant.numeric\\\",\\\"variable.other.enummember\\\",\\\"keyword.operator.plus.exponent\\\",\\\"keyword.operator.minus.exponent\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#646695\\\"},\\\"scope\\\":\\\"constant.regexp\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"entity.name.tag\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#d7ba7d\\\"},\\\"scope\\\":[\\\"entity.name.tag.css\\\",\\\"entity.name.tag.less\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#9cdcfe\\\"},\\\"scope\\\":\\\"entity.other.attribute-name\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#d7ba7d\\\"},\\\"scope\\\":[\\\"entity.other.attribute-name.class.css\\\",\\\"source.css entity.other.attribute-name.class\\\",\\\"entity.other.attribute-name.id.css\\\",\\\"entity.other.attribute-name.parent-selector.css\\\",\\\"entity.other.attribute-name.parent.less\\\",\\\"source.css entity.other.attribute-name.pseudo-class\\\",\\\"entity.other.attribute-name.pseudo-element.css\\\",\\\"source.css.less entity.other.attribute-name.id\\\",\\\"entity.other.attribute-name.scss\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#f44747\\\"},\\\"scope\\\":\\\"invalid\\\"},{\\\"settings\\\":{\\\"fontStyle\\\":\\\"underline\\\"},\\\"scope\\\":\\\"markup.underline\\\"},{\\\"settings\\\":{\\\"fontStyle\\\":\\\"bold\\\",\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"markup.bold\\\"},{\\\"settings\\\":{\\\"fontStyle\\\":\\\"bold\\\",\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"markup.heading\\\"},{\\\"settings\\\":{\\\"fontStyle\\\":\\\"italic\\\"},\\\"scope\\\":\\\"markup.italic\\\"},{\\\"settings\\\":{\\\"fontStyle\\\":\\\"strikethrough\\\"},\\\"scope\\\":\\\"markup.strikethrough\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#b5cea8\\\"},\\\"scope\\\":\\\"markup.inserted\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#ce9178\\\"},\\\"scope\\\":\\\"markup.deleted\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"markup.changed\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#6A9955\\\"},\\\"scope\\\":\\\"punctuation.definition.quote.begin.markdown\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#6796e6\\\"},\\\"scope\\\":\\\"punctuation.definition.list.begin.markdown\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#ce9178\\\"},\\\"scope\\\":\\\"markup.inline.raw\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#808080\\\"},\\\"scope\\\":\\\"punctuation.definition.tag\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":[\\\"meta.preprocessor\\\",\\\"entity.name.function.preprocessor\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#ce9178\\\"},\\\"scope\\\":\\\"meta.preprocessor.string\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#b5cea8\\\"},\\\"scope\\\":\\\"meta.preprocessor.numeric\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#9cdcfe\\\"},\\\"scope\\\":\\\"meta.structure.dictionary.key.python\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"meta.diff.header\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"storage\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"storage.type\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":[\\\"storage.modifier\\\",\\\"keyword.operator.noexcept\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#ce9178\\\"},\\\"scope\\\":[\\\"string\\\",\\\"meta.embedded.assembly\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#ce9178\\\"},\\\"scope\\\":\\\"string.tag\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#ce9178\\\"},\\\"scope\\\":\\\"string.value\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#d16969\\\"},\\\"scope\\\":\\\"string.regexp\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":[\\\"punctuation.definition.template-expression.begin\\\",\\\"punctuation.definition.template-expression.end\\\",\\\"punctuation.section.embedded\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#d4d4d4\\\"},\\\"scope\\\":[\\\"meta.template.expression\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#9cdcfe\\\"},\\\"scope\\\":[\\\"support.type.vendored.property-name\\\",\\\"support.type.property-name\\\",\\\"source.css variable\\\",\\\"source.coffee.embedded\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"keyword\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"keyword.control\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#d4d4d4\\\"},\\\"scope\\\":\\\"keyword.operator\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":[\\\"keyword.operator.new\\\",\\\"keyword.operator.expression\\\",\\\"keyword.operator.cast\\\",\\\"keyword.operator.sizeof\\\",\\\"keyword.operator.alignof\\\",\\\"keyword.operator.typeid\\\",\\\"keyword.operator.alignas\\\",\\\"keyword.operator.instanceof\\\",\\\"keyword.operator.logical.python\\\",\\\"keyword.operator.wordlike\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#b5cea8\\\"},\\\"scope\\\":\\\"keyword.other.unit\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":[\\\"punctuation.section.embedded.begin.php\\\",\\\"punctuation.section.embedded.end.php\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#9cdcfe\\\"},\\\"scope\\\":\\\"support.function.git-rebase\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#b5cea8\\\"},\\\"scope\\\":\\\"constant.sha.git-rebase\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#d4d4d4\\\"},\\\"scope\\\":[\\\"storage.modifier.import.java\\\",\\\"variable.language.wildcard.java\\\",\\\"storage.modifier.package.java\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":\\\"variable.language\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#DCDCAA\\\"},\\\"scope\\\":[\\\"entity.name.function\\\",\\\"support.function\\\",\\\"support.constant.handlebars\\\",\\\"source.powershell variable.other.member\\\",\\\"entity.name.operator.custom-literal\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#4EC9B0\\\"},\\\"scope\\\":[\\\"support.class\\\",\\\"support.type\\\",\\\"entity.name.type\\\",\\\"entity.name.namespace\\\",\\\"entity.other.attribute\\\",\\\"entity.name.scope-resolution\\\",\\\"entity.name.class\\\",\\\"storage.type.numeric.go\\\",\\\"storage.type.byte.go\\\",\\\"storage.type.boolean.go\\\",\\\"storage.type.string.go\\\",\\\"storage.type.uintptr.go\\\",\\\"storage.type.error.go\\\",\\\"storage.type.rune.go\\\",\\\"storage.type.cs\\\",\\\"storage.type.generic.cs\\\",\\\"storage.type.modifier.cs\\\",\\\"storage.type.variable.cs\\\",\\\"storage.type.annotation.java\\\",\\\"storage.type.generic.java\\\",\\\"storage.type.java\\\",\\\"storage.type.object.array.java\\\",\\\"storage.type.primitive.array.java\\\",\\\"storage.type.primitive.java\\\",\\\"storage.type.token.java\\\",\\\"storage.type.groovy\\\",\\\"storage.type.annotation.groovy\\\",\\\"storage.type.parameters.groovy\\\",\\\"storage.type.generic.groovy\\\",\\\"storage.type.object.array.groovy\\\",\\\"storage.type.primitive.array.groovy\\\",\\\"storage.type.primitive.groovy\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#4EC9B0\\\"},\\\"scope\\\":[\\\"meta.type.cast.expr\\\",\\\"meta.type.new.expr\\\",\\\"support.constant.math\\\",\\\"support.constant.dom\\\",\\\"support.constant.json\\\",\\\"entity.other.inherited-class\\\",\\\"punctuation.separator.namespace.ruby\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#C586C0\\\"},\\\"scope\\\":[\\\"keyword.control\\\",\\\"source.cpp keyword.operator.new\\\",\\\"keyword.operator.delete\\\",\\\"keyword.other.using\\\",\\\"keyword.other.directive.using\\\",\\\"keyword.other.operator\\\",\\\"entity.name.operator\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#9CDCFE\\\"},\\\"scope\\\":[\\\"variable\\\",\\\"meta.definition.variable.name\\\",\\\"support.variable\\\",\\\"entity.name.variable\\\",\\\"constant.other.placeholder\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#4FC1FF\\\"},\\\"scope\\\":[\\\"variable.other.constant\\\",\\\"variable.other.enummember\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#9CDCFE\\\"},\\\"scope\\\":[\\\"meta.object-literal.key\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#CE9178\\\"},\\\"scope\\\":[\\\"support.constant.property-value\\\",\\\"support.constant.font-name\\\",\\\"support.constant.media-type\\\",\\\"support.constant.media\\\",\\\"constant.other.color.rgb-value\\\",\\\"constant.other.rgb-value\\\",\\\"support.constant.color\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#CE9178\\\"},\\\"scope\\\":[\\\"punctuation.definition.group.regexp\\\",\\\"punctuation.definition.group.assertion.regexp\\\",\\\"punctuation.definition.character-class.regexp\\\",\\\"punctuation.character.set.begin.regexp\\\",\\\"punctuation.character.set.end.regexp\\\",\\\"keyword.operator.negation.regexp\\\",\\\"support.other.parenthesis.regexp\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#d16969\\\"},\\\"scope\\\":[\\\"constant.character.character-class.regexp\\\",\\\"constant.other.character-class.set.regexp\\\",\\\"constant.other.character-class.regexp\\\",\\\"constant.character.set.regexp\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#DCDCAA\\\"},\\\"scope\\\":[\\\"keyword.operator.or.regexp\\\",\\\"keyword.control.anchor.regexp\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#d7ba7d\\\"},\\\"scope\\\":\\\"keyword.operator.quantifier.regexp\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#569cd6\\\"},\\\"scope\\\":[\\\"constant.character\\\",\\\"constant.other.option\\\"]},{\\\"settings\\\":{\\\"foreground\\\":\\\"#d7ba7d\\\"},\\\"scope\\\":\\\"constant.character.escape\\\"},{\\\"settings\\\":{\\\"foreground\\\":\\\"#C8C8C8\\\"},\\\"scope\\\":\\\"entity.name.label\\\"}],\\\"semanticTokenRules\\\":[{\\\"_selector\\\":\\\"newOperator\\\",\\\"_style\\\":{\\\"_foreground\\\":\\\"#d4d4d4\\\",\\\"_bold\\\":null,\\\"_underline\\\":null,\\\"_italic\\\":null,\\\"_strikethrough\\\":null}},{\\\"_selector\\\":\\\"stringLiteral\\\",\\\"_style\\\":{\\\"_foreground\\\":\\\"#ce9178\\\",\\\"_bold\\\":null,\\\"_underline\\\":null,\\\"_italic\\\":null,\\\"_strikethrough\\\":null}},{\\\"_selector\\\":\\\"customLiteral\\\",\\\"_style\\\":{\\\"_foreground\\\":\\\"#d4d4d4\\\",\\\"_bold\\\":null,\\\"_underline\\\":null,\\\"_italic\\\":null,\\\"_strikethrough\\\":null}},{\\\"_selector\\\":\\\"numberLiteral\\\",\\\"_style\\\":{\\\"_foreground\\\":\\\"#b5cea8\\\",\\\"_bold\\\":null,\\\"_underline\\\":null,\\\"_italic\\\":null,\\\"_strikethrough\\\":null}},{\\\"_selector\\\":\\\"newOperator\\\",\\\"_style\\\":{\\\"_foreground\\\":\\\"#c586c0\\\",\\\"_bold\\\":null,\\\"_underline\\\":null,\\\"_italic\\\":null,\\\"_strikethrough\\\":null}},{\\\"_selector\\\":\\\"stringLiteral\\\",\\\"_style\\\":{\\\"_foreground\\\":\\\"#ce9178\\\",\\\"_bold\\\":null,\\\"_underline\\\":null,\\\"_italic\\\":null,\\\"_strikethrough\\\":null}},{\\\"_selector\\\":\\\"customLiteral\\\",\\\"_style\\\":{\\\"_foreground\\\":\\\"#dcdcaa\\\",\\\"_bold\\\":null,\\\"_underline\\\":null,\\\"_italic\\\":null,\\\"_strikethrough\\\":null}},{\\\"_selector\\\":\\\"numberLiteral\\\",\\\"_style\\\":{\\\"_foreground\\\":\\\"#b5cea8\\\",\\\"_bold\\\":null,\\\"_underline\\\":null,\\\"_italic\\\":null,\\\"_strikethrough\\\":null}}],\\\"extensionData\\\":{\\\"_extensionId\\\":\\\"vscode.theme-defaults\\\",\\\"_extensionIsBuiltin\\\":true,\\\"_extensionName\\\":\\\"theme-defaults\\\",\\\"_extensionPublisher\\\":\\\"vscode\\\"},\\\"themeSemanticHighlighting\\\":true,\\\"colorMap\\\":{\\\"checkbox.border\\\":\\\"#3c3c3c\\\",\\\"editor.background\\\":\\\"#1f1f1f\\\",\\\"editor.foreground\\\":\\\"#cccccc\\\",\\\"editor.inactiveSelectionBackground\\\":\\\"#3a3d41\\\",\\\"editorIndentGuide.background1\\\":\\\"#404040\\\",\\\"editorIndentGuide.activeBackground1\\\":\\\"#707070\\\",\\\"editor.selectionHighlightBackground\\\":\\\"#add6ff26\\\",\\\"list.dropBackground\\\":\\\"#383b3d\\\",\\\"activityBarBadge.background\\\":\\\"#0078d4\\\",\\\"sideBarTitle.foreground\\\":\\\"#cccccc\\\",\\\"input.placeholderForeground\\\":\\\"#989898\\\",\\\"menu.background\\\":\\\"#1f1f1f\\\",\\\"menu.foreground\\\":\\\"#cccccc\\\",\\\"menu.separatorBackground\\\":\\\"#454545\\\",\\\"menu.border\\\":\\\"#454545\\\",\\\"menu.selectionBackground\\\":\\\"#0078d4\\\",\\\"statusBarItem.remoteForeground\\\":\\\"#ffffff\\\",\\\"statusBarItem.remoteBackground\\\":\\\"#0078d4\\\",\\\"ports.iconRunningProcessForeground\\\":\\\"#369432\\\",\\\"sideBarSectionHeader.background\\\":\\\"#181818\\\",\\\"sideBarSectionHeader.border\\\":\\\"#2b2b2b\\\",\\\"tab.selectedBackground\\\":\\\"#222222\\\",\\\"tab.selectedForeground\\\":\\\"#ffffffa0\\\",\\\"tab.lastPinnedBorder\\\":\\\"#cccccc33\\\",\\\"list.activeSelectionIconForeground\\\":\\\"#ffffff\\\",\\\"terminal.inactiveSelectionBackground\\\":\\\"#3a3d41\\\",\\\"widget.border\\\":\\\"#313131\\\",\\\"actionBar.toggledBackground\\\":\\\"#383a49\\\",\\\"activityBar.activeBorder\\\":\\\"#0078d4\\\",\\\"activityBar.background\\\":\\\"#181818\\\",\\\"activityBar.border\\\":\\\"#2b2b2b\\\",\\\"activityBar.foreground\\\":\\\"#d7d7d7\\\",\\\"activityBar.inactiveForeground\\\":\\\"#868686\\\",\\\"activityBarBadge.foreground\\\":\\\"#ffffff\\\",\\\"badge.background\\\":\\\"#616161\\\",\\\"badge.foreground\\\":\\\"#f8f8f8\\\",\\\"button.background\\\":\\\"#0078d4\\\",\\\"button.border\\\":\\\"#ffffff12\\\",\\\"button.foreground\\\":\\\"#ffffff\\\",\\\"button.hoverBackground\\\":\\\"#026ec1\\\",\\\"button.secondaryBackground\\\":\\\"#313131\\\",\\\"button.secondaryForeground\\\":\\\"#cccccc\\\",\\\"button.secondaryHoverBackground\\\":\\\"#3c3c3c\\\",\\\"chat.slashCommandBackground\\\":\\\"#34414b\\\",\\\"chat.slashCommandForeground\\\":\\\"#40a6ff\\\",\\\"chat.editedFileForeground\\\":\\\"#e2c08d\\\",\\\"checkbox.background\\\":\\\"#313131\\\",\\\"debugToolBar.background\\\":\\\"#181818\\\",\\\"descriptionForeground\\\":\\\"#9d9d9d\\\",\\\"dropdown.background\\\":\\\"#313131\\\",\\\"dropdown.border\\\":\\\"#3c3c3c\\\",\\\"dropdown.foreground\\\":\\\"#cccccc\\\",\\\"dropdown.listBackground\\\":\\\"#1f1f1f\\\",\\\"editor.findMatchBackground\\\":\\\"#9e6a03\\\",\\\"editorGroup.border\\\":\\\"#ffffff17\\\",\\\"editorGroupHeader.tabsBackground\\\":\\\"#181818\\\",\\\"editorGroupHeader.tabsBorder\\\":\\\"#2b2b2b\\\",\\\"editorGutter.addedBackground\\\":\\\"#2ea043\\\",\\\"editorGutter.deletedBackground\\\":\\\"#f85149\\\",\\\"editorGutter.modifiedBackground\\\":\\\"#0078d4\\\",\\\"editorLineNumber.activeForeground\\\":\\\"#cccccc\\\",\\\"editorLineNumber.foreground\\\":\\\"#6e7681\\\",\\\"editorOverviewRuler.border\\\":\\\"#010409\\\",\\\"editorWidget.background\\\":\\\"#202020\\\",\\\"errorForeground\\\":\\\"#f85149\\\",\\\"focusBorder\\\":\\\"#0078d4\\\",\\\"foreground\\\":\\\"#cccccc\\\",\\\"icon.foreground\\\":\\\"#cccccc\\\",\\\"input.background\\\":\\\"#313131\\\",\\\"input.border\\\":\\\"#3c3c3c\\\",\\\"input.foreground\\\":\\\"#cccccc\\\",\\\"inputOption.activeBackground\\\":\\\"#2489db82\\\",\\\"inputOption.activeBorder\\\":\\\"#2488db\\\",\\\"keybindingLabel.foreground\\\":\\\"#cccccc\\\",\\\"notificationCenterHeader.background\\\":\\\"#1f1f1f\\\",\\\"notificationCenterHeader.foreground\\\":\\\"#cccccc\\\",\\\"notifications.background\\\":\\\"#1f1f1f\\\",\\\"notifications.border\\\":\\\"#2b2b2b\\\",\\\"notifications.foreground\\\":\\\"#cccccc\\\",\\\"panel.background\\\":\\\"#181818\\\",\\\"panel.border\\\":\\\"#2b2b2b\\\",\\\"panelInput.border\\\":\\\"#2b2b2b\\\",\\\"panelTitle.activeBorder\\\":\\\"#0078d4\\\",\\\"panelTitle.activeForeground\\\":\\\"#cccccc\\\",\\\"panelTitle.inactiveForeground\\\":\\\"#9d9d9d\\\",\\\"peekViewEditor.background\\\":\\\"#1f1f1f\\\",\\\"peekViewEditor.matchHighlightBackground\\\":\\\"#bb800966\\\",\\\"peekViewResult.background\\\":\\\"#1f1f1f\\\",\\\"peekViewResult.matchHighlightBackground\\\":\\\"#bb800966\\\",\\\"pickerGroup.border\\\":\\\"#3c3c3c\\\",\\\"progressBar.background\\\":\\\"#0078d4\\\",\\\"quickInput.background\\\":\\\"#222222\\\",\\\"quickInput.foreground\\\":\\\"#cccccc\\\",\\\"settings.dropdownBackground\\\":\\\"#313131\\\",\\\"settings.dropdownBorder\\\":\\\"#3c3c3c\\\",\\\"settings.headerForeground\\\":\\\"#ffffff\\\",\\\"settings.modifiedItemIndicator\\\":\\\"#bb800966\\\",\\\"sideBar.background\\\":\\\"#181818\\\",\\\"sideBar.border\\\":\\\"#2b2b2b\\\",\\\"sideBar.foreground\\\":\\\"#cccccc\\\",\\\"sideBarSectionHeader.foreground\\\":\\\"#cccccc\\\",\\\"statusBar.background\\\":\\\"#181818\\\",\\\"statusBar.border\\\":\\\"#2b2b2b\\\",\\\"statusBar.debuggingBackground\\\":\\\"#0078d4\\\",\\\"statusBar.debuggingForeground\\\":\\\"#ffffff\\\",\\\"statusBar.focusBorder\\\":\\\"#0078d4\\\",\\\"statusBar.foreground\\\":\\\"#cccccc\\\",\\\"statusBar.noFolderBackground\\\":\\\"#1f1f1f\\\",\\\"statusBarItem.focusBorder\\\":\\\"#0078d4\\\",\\\"statusBarItem.prominentBackground\\\":\\\"#6e768166\\\",\\\"tab.activeBackground\\\":\\\"#1f1f1f\\\",\\\"tab.activeBorder\\\":\\\"#1f1f1f\\\",\\\"tab.activeBorderTop\\\":\\\"#0078d4\\\",\\\"tab.activeForeground\\\":\\\"#ffffff\\\",\\\"tab.selectedBorderTop\\\":\\\"#6caddf\\\",\\\"tab.border\\\":\\\"#2b2b2b\\\",\\\"tab.hoverBackground\\\":\\\"#1f1f1f\\\",\\\"tab.inactiveBackground\\\":\\\"#181818\\\",\\\"tab.inactiveForeground\\\":\\\"#9d9d9d\\\",\\\"tab.unfocusedActiveBorder\\\":\\\"#1f1f1f\\\",\\\"tab.unfocusedActiveBorderTop\\\":\\\"#2b2b2b\\\",\\\"tab.unfocusedHoverBackground\\\":\\\"#1f1f1f\\\",\\\"terminal.foreground\\\":\\\"#cccccc\\\",\\\"terminal.tab.activeBorder\\\":\\\"#0078d4\\\",\\\"textBlockQuote.background\\\":\\\"#2b2b2b\\\",\\\"textBlockQuote.border\\\":\\\"#616161\\\",\\\"textCodeBlock.background\\\":\\\"#2b2b2b\\\",\\\"textLink.activeForeground\\\":\\\"#4daafc\\\",\\\"textLink.foreground\\\":\\\"#4daafc\\\",\\\"textPreformat.foreground\\\":\\\"#d0d0d0\\\",\\\"textPreformat.background\\\":\\\"#3c3c3c\\\",\\\"textSeparator.foreground\\\":\\\"#21262d\\\",\\\"titleBar.activeBackground\\\":\\\"#181818\\\",\\\"titleBar.activeForeground\\\":\\\"#cccccc\\\",\\\"titleBar.border\\\":\\\"#2b2b2b\\\",\\\"titleBar.inactiveBackground\\\":\\\"#1f1f1f\\\",\\\"titleBar.inactiveForeground\\\":\\\"#9d9d9d\\\",\\\"welcomePage.tileBackground\\\":\\\"#2b2b2b\\\",\\\"welcomePage.progress.foreground\\\":\\\"#0078d4\\\"},\\\"watch\\\":false}\",\"workbench.view.debug.state.hidden\":\"[{\\\"id\\\":\\\"workbench.debug.welcome\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.debug.variablesView\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.debug.watchExpressionsView\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.debug.callStackView\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.debug.loadedScriptsView\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.debug.breakPointsView\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"jsBrowserBreakpoints\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"jsExcludedCallers\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"jsDebugNetworkTree\\\",\\\"isHidden\\\":false}]\",\"workbench.panel.repl.hidden\":\"[{\\\"id\\\":\\\"workbench.panel.repl.view\\\",\\\"isHidden\\\":false}]\",\"memento/gettingStartedService\":\"{\\\"installGit\\\":{\\\"done\\\":true},\\\"CopilotSetupSignedOut\\\":{\\\"done\\\":true},\\\"CopilotSetupComplete\\\":{\\\"done\\\":true},\\\"CopilotSetupSignedIn\\\":{\\\"done\\\":true},\\\"pickColorTheme\\\":{\\\"done\\\":true},\\\"extensionsWeb\\\":{\\\"done\\\":true},\\\"findLanguageExtensions\\\":{\\\"done\\\":true},\\\"settingsAndSync\\\":{\\\"done\\\":true},\\\"commandPaletteTask\\\":{\\\"done\\\":true},\\\"quickOpen\\\":{\\\"done\\\":true},\\\"videoTutorial\\\":{\\\"done\\\":true}}\",\"workbench.welcomePage.hiddenCategories\":\"[\\\"Setup\\\"]\",\"workbench.panel.alignment\":\"center\",\"workbench.view.extensions.state.hidden\":\"[{\\\"id\\\":\\\"workbench.views.extensions.installed\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.searchOutdated\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.workspaceRecommendations\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.popular\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.searchRecentlyUpdated\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.otherRecommendations\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"extensions.recommendedList\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.enabled\\\",\\\"isHidden\\\":true},{\\\"id\\\":\\\"workbench.views.extensions.disabled\\\",\\\"isHidden\\\":true},{\\\"id\\\":\\\"workbench.views.extensions.marketplace\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.searchInstalled\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.searchEnabled\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.searchDisabled\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.searchBuiltin\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.searchWorkspaceUnsupported\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.builtinFeatureExtensions\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.builtinThemeExtensions\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.builtinProgrammingLanguageExtensions\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.untrustedUnsupportedExtensions\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.untrustedPartiallySupportedExtensions\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.virtualUnsupportedExtensions\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.virtualPartiallySupportedExtensions\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"workbench.views.extensions.deprecatedExtensions\\\",\\\"isHidden\\\":false}]\",\"extensions.trustedPublishers\":\"{\\\"ritwickdey\\\":{\\\"publisher\\\":\\\"ritwickdey\\\",\\\"publisherDisplayName\\\":\\\"Ritwick Dey\\\"},\\\"esbenp\\\":{\\\"publisher\\\":\\\"esbenp\\\",\\\"publisherDisplayName\\\":\\\"Prettier\\\"},\\\"eamodio\\\":{\\\"publisher\\\":\\\"eamodio\\\",\\\"publisherDisplayName\\\":\\\"GitKraken\\\"},\\\"ecmel\\\":{\\\"publisher\\\":\\\"ecmel\\\",\\\"publisherDisplayName\\\":\\\"ecmel\\\"},\\\"formulahendry\\\":{\\\"publisher\\\":\\\"formulahendry\\\",\\\"publisherDisplayName\\\":\\\"Jun Han\\\"},\\\"vscode-icons-team\\\":{\\\"publisher\\\":\\\"vscode-icons-team\\\",\\\"publisherDisplayName\\\":\\\"VSCode Icons Team\\\"},\\\"dsznajder\\\":{\\\"publisher\\\":\\\"dsznajder\\\",\\\"publisherDisplayName\\\":\\\"dsznajder\\\"},\\\"pkief\\\":{\\\"publisher\\\":\\\"PKief\\\",\\\"publisherDisplayName\\\":\\\"Philipp Kief\\\"},\\\"atommaterial\\\":{\\\"publisher\\\":\\\"AtomMaterial\\\",\\\"publisherDisplayName\\\":\\\"Atom Material\\\"},\\\"rvest\\\":{\\\"publisher\\\":\\\"rvest\\\",\\\"publisherDisplayName\\\":\\\"Rebecca Vest\\\"},\\\"yoavbls\\\":{\\\"publisher\\\":\\\"yoavbls\\\",\\\"publisherDisplayName\\\":\\\"yoavbls\\\"},\\\"khayrulloisomiddinov\\\":{\\\"publisher\\\":\\\"KhayrulloIsomiddinov\\\",\\\"publisherDisplayName\\\":\\\"Khayrullo Isomiddinov\\\"},\\\"usernamehw\\\":{\\\"publisher\\\":\\\"usernamehw\\\",\\\"publisherDisplayName\\\":\\\"Alexander\\\"},\\\"docode\\\":{\\\"publisher\\\":\\\"DoCode\\\",\\\"publisherDisplayName\\\":\\\"DoCode\\\"}}\",\"workbench.view.extension.gitlensInspect.state.hidden\":\"[{\\\"id\\\":\\\"gitlens.views.commitDetails\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.pullRequest\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.lineHistory\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.fileHistory\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.timeline\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.searchAndCompare\\\",\\\"isHidden\\\":false}]\",\"workbench.view.extension.gitlens.state.hidden\":\"[{\\\"id\\\":\\\"gitlens.views.home\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.launchpad\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.drafts\\\",\\\"isHidden\\\":false},{\\\"id\\\":\\\"gitlens.views.workspaces\\\",\\\"isHidden\\\":false}]\",\"workbench.welcomePage.walkthroughMetadata\":\"[[\\\"eamodio.gitlens#welcome\\\",{\\\"firstSeen\\\":1746592053837,\\\"stepIDs\\\":[\\\"get-started-community\\\",\\\"welcome-in-trial\\\",\\\"welcome-in-trial-expired\\\",\\\"welcome-in-trial-expired-eligible\\\",\\\"welcome-paid\\\",\\\"welcome-home-view\\\",\\\"visualize-code-history\\\",\\\"accelerate-pr-reviews\\\",\\\"streamline-collaboration\\\",\\\"improve-workflows-with-integrations\\\"],\\\"manaullyOpened\\\":false}]]\",\"typescript.1.editedCount\":\"4\",\"typescript.1.editedDate\":\"Sat May 10 2025\",\"terminal.integrated.showTerminalConfigPrompt\":\"false\",\"nps/lastSessionDate\":\"Sat May 10 2025\",\"nps/sessionCount\":\"4\",\"cpp.1.lastSessionDate\":\"Sat May 10 2025\",\"cpp.1.sessionCount\":\"4\",\"java.2.lastSessionDate\":\"Sat May 10 2025\",\"java.2.sessionCount\":\"4\",\"javascript.1.lastSessionDate\":\"Sat May 10 2025\",\"javascript.1.sessionCount\":\"4\",\"typescript.1.lastSessionDate\":\"Sat May 10 2025\",\"typescript.1.sessionCount\":\"4\",\"csharp.1.lastSessionDate\":\"Sat May 10 2025\",\"csharp.1.sessionCount\":\"4\",\"commandPalette.mru.cache\":\"{\\\"usesLRU\\\":true,\\\"entries\\\":[{\\\"key\\\":\\\"comment-remover.removeComments\\\",\\\"value\\\":5},{\\\"key\\\":\\\"remove-empty-lines.inDocument\\\",\\\"value\\\":6}]}\",\"commandPalette.mru.counter\":\"7\"}}"}


___________________________