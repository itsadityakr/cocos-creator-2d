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