import { stat } from "fs";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { config } from "../appConfig";
import { Globals } from "../Globals";
import { TextLabel } from "../TextLabel";

export class BonusClass extends Container {
    overlayBG!: Graphics;
    constructor() {
        super();
        this.addOverlay();
        this.backIcon();
        this.addbuttons();

    }

    backIcon() {
        const backIcon = new Sprite(Globals.resources.backIcon.texture);
        backIcon.position.y = config.logicalHeight / 8 - 100;
        backIcon.position.x = config.logicalWidth / 4 - 400;
        backIcon.interactive = true;
        backIcon.on('pointerdown', () => { Globals.emitter?.Call("closePage") });
        backIcon.scale.set(0.5);
        this.addChild(backIcon);
    }

    addOverlay() {
        this.overlayBG = new Graphics;
        this.overlayBG.beginFill(0x000003, 0.9);
        this.overlayBG.drawRect(0, 0, config.logicalWidth, config.logicalHeight);
        this.overlayBG.endFill();
        this.overlayBG.interactive = true;
        const BonusText = new TextLabel(config.logicalWidth / 2, 0, 0.5, "Bonus", 80, 0xFFFFFF);
        BonusText.position.x = config.logicalWidth / 2;
        BonusText.position.y = config.logicalHeight / 5;

        const descText = new TextLabel(config.logicalWidth / 2, 0, 0.5, "Do you want to watch a short video and get a 2X candy boost for 30 seconds", 90, 0xFFFFFF);
        descText.position.y = config.logicalHeight / 3 + 50;
        BonusText.position.x = config.logicalWidth / 2;
        const style = {
            breakWords: true,
            fill: "#d1d1d1",
            fontSize: 50,
            wordWrap: true,
            wordWrapWidth: 700
        }
        descText.style = style;
        descText.style.align = "center";

        this.overlayBG.addChild(BonusText, descText);
        this.addChild(this.overlayBG);
    }

    addbuttons() {
        const noBox = new Graphics;
        noBox.beginFill(0x3c3c3c3c, 0.3);
        noBox.drawRoundedRect(0, 0, 230, 100, 10);
        noBox.endFill();
        noBox.position.y = config.logicalHeight / 2 + 100;
        noBox.position.x = config.logicalWidth / 2 - 400
        noBox.interactive = true;
        const noBoxText = new TextLabel(noBox.width / 2, noBox.height / 2, 0.5, "No", 30, 0xFFFFFF);
        noBox.addChild(noBoxText);
        noBox.on("pointerdown", () => { Globals.emitter?.Call("closePage"); noBox.alpha = 0.5; });

        const yesBox = new Graphics;
        yesBox.beginFill(0x3c3c3c3c, 0.3);
        yesBox.drawRoundedRect(0, 0, 230, 100, 10);
        yesBox.endFill();
        yesBox.position.x = config.logicalWidth / 2 + 100;
        yesBox.position.y = config.logicalHeight / 2 + 100;
        yesBox.interactive = true;
        const yesBoxText = new TextLabel(yesBox.width / 2, yesBox.height / 2, 0.5, "Yes", 30, 0xFFFFFF);
        yesBox.addChild(yesBoxText);
        this.addChild(noBox, yesBox);
        yesBox.on("pointerdown", () => { console.log("YESS"); yesBox.alpha = 0.5; });
        yesBox.on('pointerup', () => { yesBox.alpha = 1; });
        yesBox.on('pointerupoutside', () => { yesBox.alpha = 1; });
    }

}