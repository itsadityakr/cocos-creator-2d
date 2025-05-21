// FeedbackManager.ts

const { ccclass, property } = cc._decorator;

@ccclass
export default class FeedbackManager extends cc.Component {

    @property (cc.Label)
    ConsoleUpdateLabel : cc.Label = null;

    static instance: FeedbackManager = null;

    onLoad() {
        FeedbackManager.instance = this;
    }

    console(message: string){
        this.ConsoleUpdateLabel.string = `${message}`;
    }

}
