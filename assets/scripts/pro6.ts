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