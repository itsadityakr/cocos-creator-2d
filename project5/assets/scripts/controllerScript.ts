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
