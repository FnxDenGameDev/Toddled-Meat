import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { config } from "../appConfig";
import { purchaseBall, useBall } from "../DataHandler";
import { Globals, skinsData } from "../Globals";
import { TextLabel } from "../TextLabel";
export class Skins extends Container {

    overlayBG!: Graphics;
    currentIndex: number = 0;
    currentObject!: any;
    currentObjectText!: TextLabel;
    buyButton!: Graphics;
    buyButtonText!: TextLabel;

    allSkins: buyObjects[] = [];

    constructor() {
        super();

        this.initSkins();

        this.addChild(this.addOverlay());
        this.uiOverlay();
        this.makeBuyButton();
        this.movingButtons();
        this.nextObject(0);
        this.backIcon();

        this.sortableChildren = true;
    }

    initSkins() {
        for (let skin in skinsData) {
            let data = skinsData[skin];
            this.allSkins.push(new buyObjects(data.name, data.price, data.canBuy, data.unlocked));
        }
    }


    addOverlay() {
        this.overlayBG = new Graphics;
        this.overlayBG.beginFill(0x000003, 0.9);
        this.overlayBG.drawRect(0, 0, config.logicalWidth, config.logicalHeight);
        this.overlayBG.endFill();
        this.overlayBG.interactive = true;
        return this.overlayBG;
    }
    uiOverlay() {
        const skinText = new TextLabel(config.logicalWidth / 2, config.topY + 120, 0.5, "Skins", 60, 0xFFFFFF);
        const skinDescription1 = new TextLabel(config.logicalWidth / 2 - 200, config.topY + 200, 0, "Changes the apperance", 40, 0xFFFFFF);
        const skinDescription2 = new TextLabel(config.logicalWidth / 2 - 250, config.topY + 250, 0, "of the candy you click and ", 40, 0xFFFFFF);
        const skinDescription3 = new TextLabel(config.logicalWidth / 2 - 200, config.topY + 300, 0, "the candy particles.", 40, 0xFFFFFF);
        skinDescription1.alpha = skinDescription2.alpha = skinDescription3.alpha = 0.3;
        this.overlayBG.addChild(skinDescription1, skinDescription2, skinDescription3, skinText);
    }
    nextObject(value: number) {
        this.buyButton.interactive = false;
        if (this.currentObject != null) {
            this.removeChild(this.currentObject);
        }

        this.currentIndex += value;

        if (this.currentIndex >= this.allSkins.length) {
            this.currentIndex = 0;
        }
        if (this.currentIndex < 0) {
            this.currentIndex = this.allSkins.length - 1;
        }

        this.currentObject = this.addChild(this.allSkins[this.currentIndex]);
        this.currentObject.position.set(config.logicalWidth / 2 - 50, config.logicalHeight / 2 - 100);

        if (this.currentObjectText == null) {
            this.currentObjectText = new TextLabel(config.logicalWidth / 2 - 70, config.logicalHeight / 2 + 70, 0, this.allSkins[this.currentIndex].name, 50, 0xFFFFFF);
            this.addChild(this.currentObjectText);
        }
        else
            this.currentObjectText.updateLabelText(this.allSkins[this.currentIndex].name);

        this.buybuttonChange();
    }
    buybuttonChange() {
        this.buyButton.interactive = true;

        if (this.allSkins[this.currentIndex].canBuy && !this.allSkins[this.currentIndex].isUnlocked) {
            // Can BUY
            this.buyButtonText.updateLabelText("BUY");
            this.allSkins[this.currentIndex].alpha = 0.5;

        }
        if (!this.allSkins[this.currentIndex].canBuy && this.allSkins[this.currentIndex].isUnlocked) {
            //ALREADY BOUGHT
            this.buyButtonText.updateLabelText("Choose");
            this.allSkins[this.currentIndex].alpha = 1;

        }
    }
    makeBuyButton() {
        this.buyButton = new Graphics;
        this.buyButton.beginFill(0x3c3c3c3c, 0.3);
        this.buyButton.drawRoundedRect(0, 0, 200, 80, 10);
        this.buyButton.endFill();
        this.buyButton.position.y = config.logicalHeight / 2 + 150;
        this.buyButton.position.x = config.logicalWidth / 2 - 80;
        this.buyButtonText = new TextLabel(this.buyButton.width / 2, this.buyButton.height / 2, 0.5, "", 30, 0xFFFFFF);
        this.buyButton.addChild(this.buyButtonText);
        this.addChild(this.buyButton);
        this.buyButton.on("pointerdown", () => {
            this.buyButton.alpha = 0.5;
            if (this.buyButtonText.text == "BUY") {
                if (purchaseBall(this.currentIndex)) {
                    this.buyButton.alpha = 1;
                    this.buyButtonText.text = "Choose";
                }
            } else useBall(this.currentIndex);
        });
        this.buyButton.on('pointerup', () => { this.buyButton.alpha = 1; });
        this.buyButton.on('pointerupoutside', () => { this.buyButton.alpha = 1; });
        this.buybuttonChange();
    }
    movingButtons() {
        const leftButton = new Sprite(Globals.resources.leftArrow.texture);
        leftButton.position.y = config.logicalHeight / 2 - 50;
        leftButton.position.x = config.logicalWidth / 2 - 300;
        leftButton.scale.set(0.2);
        leftButton.interactive = true;
        leftButton.on("pointerdown", () => { leftButton.alpha = 0.5; this.nextObject(-1); });
        leftButton.on('pointerup', () => { leftButton.alpha = 1; });
        leftButton.on('pointerupoutside', () => { leftButton.alpha = 1; });

        const rightButton = new Sprite(Globals.resources.leftArrow.texture);
        rightButton.position.y = config.logicalHeight / 2 + 50;
        rightButton.position.x = config.logicalWidth / 2 + 300;
        rightButton.scale.set(-0.2);
        rightButton.interactive = true;
        rightButton.on("pointerdown", () => { rightButton.alpha = 0.5; this.nextObject(1); });
        rightButton.on('pointerup', () => { rightButton.alpha = 1; });
        rightButton.on('pointerupoutside', () => { rightButton.alpha = 1; });
        this.addChild(leftButton, rightButton);
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
    checkBuy() {

    }

}
export class buyObjects extends Sprite {

    constructor(
        public name: string,
        public price: number,
        public canBuy: boolean,
        public isUnlocked: boolean,
    ) {
        console.log(name);
        
        super(Globals.resources[name].texture);
    }
    checkCondition() {
        if (this.canBuy) return false;

        if (!this.canBuy) return true;

        // console.log("Check Condition");

        if (!this.canBuy && this.isUnlocked && this.price < 0) {

            // this.onComplete();
            return true;
        }

        return false;
    }
    claim() {
        this.canBuy = false;
        this.isUnlocked = true;
        this.price = -1;
    }
    tween() {

    }
    stopTween() {

    }
}
