// InteractionManager.ts

const { ccclass, property } = cc._decorator;

import FeedbackManager from "./FeedbackManager";

@ccclass
export default class InteractionManager extends cc.Component {

    static instance: InteractionManager = null;

    onLoad() {
        InteractionManager.instance = this;
    }

    reloadBtn() {
        cc.director.loadScene('game');
        FeedbackManager.instance.console("Reset Done !")
    }
}
