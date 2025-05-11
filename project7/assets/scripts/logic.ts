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