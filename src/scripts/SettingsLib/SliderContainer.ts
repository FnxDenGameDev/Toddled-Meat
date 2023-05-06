import { Container, Graphics, InteractionEvent, Sprite } from "pixi.js";
import { config } from "../appConfig";

import { TextLabel } from "../TextLabel";
import { clamp, fetchGlobalPosition, getMousePosition } from "../Utilities";
import { Globals } from "../Globals";





export class SliderContainer extends Container {


    graphicBG: Graphics;
    itemHolder: Container = new Container();

    minSliderValue: number = 0;
    lastMousePosition: number = 0;

    sliderBG: Graphics;
    slider: Graphics;

    offset: number = 0;


    constructor(width: number, height: number, snapToLeft: boolean) {
        super();


        this.graphicBG = new Graphics();
        this.graphicBG.beginFill(0x3c3c3c, 0.3);
        this.graphicBG.drawRect(0, 0, width, height);
        this.graphicBG.endFill();
        this.addChild(this.graphicBG);

        this.sliderBG = new Graphics();
        this.sliderBG.beginFill(0x3c3c3c, 0.2);
        this.sliderBG.drawRect(width - 20, 0, 20, height);
        this.sliderBG.endFill();
        this.addChild(this.sliderBG);

        this.slider = new Graphics();

        this.addChild(this.slider);


        this.addChild(this.itemHolder);

        if (!snapToLeft)
            this.x = config.logicalWidth - width;


        // for (let i = 0; i < AchievementsData.length; i++) {
        //     const data = AchievementsData[i];
        //     let item;
        //     if (data.spriteName) {
        //         item = new SliderItem(data.name, width * 0.8, 100, data.description, data.isUnlocked, data.spriteName);
        //     }
        //     else
        //         item = new SliderItem(data.name, width * 0.8, 100, data.description, data.isUnlocked, undefined);

        //     item.x = width / 2;
        //     item.y = 10 + i * 120;
        //     this.itemHolder.addChild(item);
        // }

        this.slider.beginFill(0x3c3c3c, 0.5);
        // this.slider.drawRect(width - 20, 0, 20, 100);
        this.slider.drawRect(width - 20, 0, 20, Math.min(height * (height / this.itemHolder.height), height));
        this.slider.endFill();

        this.minSliderValue = -(this.itemHolder.height - height + 20);

        this.addInterectivity();
    }

    isPointerDown: boolean = false;

    addInterectivity() {
        this.interactive = true;

        this.on("pointerdown", (e: InteractionEvent) => {
            this.isPointerDown = true;
            // console.log("pointerdown");
            // console.log(e.data.global.y);
            this.lastMousePosition = e.data.global.y;
        });

        this.on("pointerup", (e) => {
            // console.log("pointerup");
            this.isPointerDown = false;
        });

        this.on("pointerupoutside", (e) => {
            this.isPointerDown = false;
        });

        this.on("pointermove", (e) => {
            if (this.isPointerDown) {
                // console.log("pointermove");
                // console.log(e.data.global.y);
                const delta = this.lastMousePosition - e.data.global.y;
                this.lastMousePosition = e.data.global.y;

                // console.log(delta);

                this.onWheelMove(delta * 10);

            }
        });


        this.slider.interactive = true;

        this.slider.on("pointerdown", (e: InteractionEvent) => {
            this.isPointerDown = true;
            this.lastMousePosition = this.slider.y;
            this.offset = e.data.getLocalPosition(this.sliderBG).y;

            // console.log("slider pointerdown" + this.offset + " " + this.slider.y);
        });

        this.slider.on("pointerup", (e) => {
            // console.log("pointerup");
            this.isPointerDown = false;

        });

        this.slider.on("pointerupoutside", (e) => {
            this.isPointerDown = false;
        });

        this.slider.on("pointermove", (e) => {
            if (this.isPointerDown) {
                // console.log("pointermove");
                // console.log(e.data.global.y);


                // this.slider.y = 

                // this.onWheelMove(-delta * 5);

            }
        });




    }

    onWheelMove(e: any) {
        // console.log(e);
        const mousePos = getMousePosition();

        const globalPos = fetchGlobalPosition(this);

        if (mousePos.x > globalPos.x && mousePos.x < globalPos.x + this.graphicBG.width &&
            mousePos.y > globalPos.y && mousePos.y < globalPos.y + this.graphicBG.height) {
            this.itemHolder.y -= e / 10;



            this.itemHolder.y = clamp(this.itemHolder.y, this.minSliderValue, 0)


            this.slider.y = (this.itemHolder.y / this.minSliderValue) * (this.sliderBG.height - this.slider.height);

        }
    }
}




class SliderItem extends Container {
    graphicBG: Graphics;
    name: string;
    title: TextLabel;
    unlockedText!: TextLabel;
    isUnlocked: boolean = false;
    achievementSprite !: Sprite;



    constructor(name: string, width: number, height: number, descriptionText: string, isUnlocked: boolean, spriteName: string | undefined) {
        super();
        this.sortableChildren = true;
        this.isUnlocked = isUnlocked;

        this.graphicBG = new Graphics();
        this.graphicBG.beginFill(0x00000);
        this.graphicBG.drawRect(-width / 2, 0, width, height);
        this.graphicBG.endFill();
        this.addChild(this.graphicBG);




        this.name = name;

        this.title = new TextLabel(0, 0, 0, this.isUnlocked ? this.name : "???", 35, 0xFFFFFF);
        this.title.anchor.set(0.5, 0);

        if (this.isUnlocked) {
            this.title.position.set(-45, 10);
        }
        else {
            this.title.position.set(-width / 2 + 70, 0);
            this.title.style.fontSize = 80;
        }

        this.unlockedText = new TextLabel(60, 0, 0, this.isUnlocked ? "[UNLOCKED]" : "[LOCKED]", 20, 0xFFFFFF);
        if (this.isUnlocked && spriteName) {
            const sprite = new Sprite(Globals.resources[spriteName].texture);
            sprite.scale.set(0.15);
            sprite.position.set(-this.width / 1.25, this.height / 2 - sprite.height / 2)
            this.unlockedText.scale.set(0.8);
            sprite.zIndex = 1;
            const description = new TextLabel(this.title.position.x - this.title.width * 1.2, this.height - 20, 0, descriptionText, 27, 0xFFFFFF);
            this.unlockedText.addChild(sprite, description);

        }


        this.addChild(this.title, this.unlockedText);



        this.interactive = true;
    }
}