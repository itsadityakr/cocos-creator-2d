// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    panel: cc.Node = null;

    @property(cc.Prefab)
    boxSprite: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    counter: number = 0;
    start () {

    }

    onClick() {
        let a = cc.instantiate(this.boxSprite);
        a.parent = this.panel;
        let label = a.children[0];
        // this.node.getChildByName("boxSpriteLabel");
        label.getComponent(cc.Label).string = "" + this.counter++;
    }

    // update (dt) {}
}
