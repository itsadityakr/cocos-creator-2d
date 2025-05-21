// ColorManager.ts

import NumberGenerator from "./NumberGenerator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ColorManager extends cc.Component {
    static instance: ColorManager = null;

    colorMap = new Map();

    onLoad() {
        ColorManager.instance = this;
    }

    initializeColorPalette() {
        const colorList = [
            new cc.Color().fromHEX("#FF3232"), // Red
            new cc.Color().fromHEX("#FFD92E"), // Yellow
            new cc.Color().fromHEX("#8040FF"), // Purple
            new cc.Color().fromHEX("#41FF61"), // Green
            new cc.Color().fromHEX("#3CFFE2"), // Cyan
            new cc.Color().fromHEX("#388EFF"), // Blue
            new cc.Color().fromHEX("#FF4ED6"), // Pink
            new cc.Color().fromHEX("#E52B75"), // Magenta
            new cc.Color().fromHEX("#FF7300"), // Orange
            new cc.Color().fromHEX("#2EFFA1"), // Mint
            new cc.Color().fromHEX("#A040FF"), // Violet
            new cc.Color().fromHEX("#FF8A40"), // Deep Orange
            new cc.Color().fromHEX("#40FFDA"), // Turquoise
            new cc.Color().fromHEX("#FFE540"), // Gold
            new cc.Color().fromHEX("#407FFF"), // Royal Blue
            new cc.Color().fromHEX("#AAFF40"), // Lime Green
            new cc.Color().fromHEX("#FF40B7"), // Hot Pink
            new cc.Color().fromHEX("#40FFC7"), // Aquamarine
            new cc.Color().fromHEX("#FF4040"), // Crimson
            new cc.Color().fromHEX("#75E52B")  // Olive Green
        ];


        // for (let i = colorList.length - 1; i > 0; i--) {
        //     const randomIndex = Math.floor(Math.random() * (i + 1));
        //     [colorList[i], colorList[randomIndex]] = [colorList[randomIndex], colorList[i]];
        // }

        for (let value = 0; value <= NumberGenerator.instance.gridEndNumber; value++) {
            this.colorMap.set(value, colorList[value]);
        }
    }
}
