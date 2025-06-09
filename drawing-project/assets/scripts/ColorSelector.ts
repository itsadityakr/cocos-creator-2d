const { ccclass, property } = cc._decorator;

@ccclass
export default class DrawOnBg extends cc.Component {

    @property([cc.Node]) bgNodes: cc.Node[] = [];
    @property([cc.Node]) drawLayerNodes: cc.Node[] = [];

    @property(cc.Node) brushSizeDisplay: cc.Node = null;
    @property(cc.Button) increaseBrushSizeButton: cc.Button = null;
    @property(cc.Button) decreaseBrushSizeButton: cc.Button = null;
    @property([cc.Button]) colorsButton: cc.Button[] = [];
    @property([cc.Button]) colorsTexButton: cc.Button[] = [];
    @property(cc.Button) eraser: cc.Button = null;

    private currentBrushColor: cc.Color = new cc.Color(0, 0, 0);
    private brushSize: number = 10;

    private readonly colorList: cc.Color[] = [
        new cc.Color(0, 0, 0), new cc.Color(255, 0, 0), new cc.Color(0, 255, 0),
        new cc.Color(0, 0, 255), new cc.Color(255, 255, 0), new cc.Color(255, 165, 0),
        new cc.Color(255, 0, 255), new cc.Color(0, 255, 255),
    ];

    private drawing: boolean = false;
    private lastPos: cc.Vec2 = null;

    private activeDrawLayer: cc.Node = null;
    private activeGraphics: cc.Graphics = null;
    private activeBgNode: cc.Node = null;

    onLoad() {
        if (this.bgNodes.length === 0 || this.drawLayerNodes.length === 0) {
            cc.error("Background and draw layers must be assigned.");
            return;
        }

        this.node.on(cc.Node.EventType.TOUCH_START, this.onDrawStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onDrawMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onDrawEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onDrawEnd, this);

        this.increaseBrushSizeButton?.node.on('click', this.increaseBrushSize, this);
        this.decreaseBrushSizeButton?.node.on('click', this.decreaseBrushSize, this);
        this.eraser?.node.on('click', this.setEraserMode, this);

        this.updateColorPalette();
        this.updateBrushSizeDisplay();
    }

    private findAndSetActiveDrawLayer(worldPos: cc.Vec2): boolean {
        // Check from topmost to backmost (last to first)
        for (let i = this.bgNodes.length - 1; i >= 0; i--) {
            const bgNode = this.bgNodes[i];
            if (this.isInside(bgNode, worldPos)) {
                this.activeBgNode = bgNode;
                this.activeDrawLayer = this.drawLayerNodes[i];
                this.activeGraphics = this.activeDrawLayer.getComponent(cc.Graphics) || this.activeDrawLayer.addComponent(cc.Graphics);
                this.activeGraphics.lineWidth = this.brushSize;
                this.activeGraphics.strokeColor = this.currentBrushColor;
                return true;
            }
        }
        return false;
    }

    private isInside(node: cc.Node, worldPos: cc.Vec2): boolean {
        const localPos = node.convertToNodeSpaceAR(worldPos);
        const size = node.getContentSize();
        const anchor = node.getAnchorPoint();
        const brushRadius = this.brushSize / 2;

        const left = -size.width * anchor.x + brushRadius;
        const right = size.width * (1 - anchor.x) - brushRadius;
        const bottom = -size.height * anchor.y + brushRadius;
        const top = size.height * (1 - anchor.y) - brushRadius;

        return localPos.x >= left && localPos.x <= right && localPos.y >= bottom && localPos.y <= top;
    }


    onDrawStart(event: cc.Event.EventTouch) {
        const worldPos = event.getLocation();
        if (!this.findAndSetActiveDrawLayer(worldPos)) {
            this.drawing = false;
            return;
        }
        this.drawing = true;
        this.lastPos = this.activeDrawLayer.convertToNodeSpaceAR(worldPos);
        this.activeGraphics.moveTo(this.lastPos.x, this.lastPos.y);
    }

    onDrawMove(event: cc.Event.EventTouch) {
        if (!this.drawing || !this.activeGraphics || !this.activeDrawLayer || !this.activeBgNode) return;

        const worldPos = event.getLocation();

        // Prevent switching background mid-draw
        if (!this.isInside(this.activeBgNode, worldPos)) return;

        const newPos = this.activeDrawLayer.convertToNodeSpaceAR(worldPos);
        if (newPos.sub(this.lastPos).mag() > 0.01) {
            this.activeGraphics.lineTo(newPos.x, newPos.y);
            this.activeGraphics.stroke();
            this.activeGraphics.moveTo(newPos.x, newPos.y);
            this.lastPos = newPos;
        }
    }

    onDrawEnd(event: cc.Event.EventTouch) {
        if (this.drawing && this.activeGraphics) {
            this.activeGraphics.stroke();
        }
        this.drawing = false;
        this.activeGraphics = null;
        this.activeDrawLayer = null;
        this.activeBgNode = null;
    }

    increaseBrushSize() {
        this.brushSize = Math.min(50, this.brushSize + 2);
        this.updateBrushSizeDisplay();
        cc.log("Brush size increased to", this.brushSize);
    }

    decreaseBrushSize() {
        this.brushSize = Math.max(5, this.brushSize - 2);
        this.updateBrushSizeDisplay();
        cc.log("Brush size decreased to", this.brushSize);
    }

    private updateBrushSizeDisplay() {
        if (!this.brushSizeDisplay) return;
        this.brushSizeDisplay.setContentSize(this.brushSizeDisplay.width, this.brushSize);
        const sprite = this.brushSizeDisplay.getComponent(cc.Sprite);
        if (sprite) sprite.node.color = this.currentBrushColor;
    }

    public setBrushColor(color: cc.Color) {
        if (!(color instanceof cc.Color)) return;
        this.currentBrushColor = color;
        const sprite = this.brushSizeDisplay?.getComponent(cc.Sprite);
        if (sprite) sprite.node.color = color;
    }

    public setEraserMode() {
        this.setBrushColor(new cc.Color(255, 255, 255));
        cc.log("Eraser mode activated.");
    }

    private updateColorPalette() {
        for (let i = 0; i < this.colorsButton.length && i < this.colorList.length; i++) {
            const button = this.colorsButton[i];
            const color = this.colorList[i];
            const sprite = button?.getComponentInChildren(cc.Sprite);
            if (sprite) sprite.node.color = color;

            button?.node.off('click');
            button?.node.on('click', () => this.setBrushColor(color), this);
        }
    }
}
