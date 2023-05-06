import * as PIXI from 'pixi.js';
import { Container, DisplayObject, Graphics, InteractionEvent, Sprite } from 'pixi.js';
import { stringify } from 'querystring';
import { config } from '../appConfig';
import { Globals } from '../Globals';
import { TextLabel } from '../TextLabel';
import { achievementToggleDataType, CallbackEvents, musicToggleDataType, noOfCandiesToggleDataType, OnSettingsCallback, particleToggleDataType } from './SettingTaskBar';
import { currentSettings } from './SettingVariables';


export class Settings extends Container {
    overlayBG !: Graphics;



    constructor() {
        super();

        this.addOverlay();
        this.backIcon()
    }

    addOverlay() {

        this.overlayBG = new Graphics;
        this.overlayBG.beginFill(0x000003, 0.9);
        this.overlayBG.drawRect(0, 0, config.logicalWidth, config.logicalHeight);
        this.overlayBG.endFill();
        this.overlayBG.interactive = true;
        const settingText = new TextLabel(config.logicalWidth / 2, config.topY + 120, 0.5, "Settings", 50, 0xFFFFFF);
        const generalText = new TextLabel(config.logicalWidth / 2 - 650, settingText.position.y + 105, 0.5, "General", 30, 0xFFFFFF);

        this.overlayBG.addChild(settingText, generalText);

        const line1 = new Graphics;
        line1.beginFill(0x3c3c3c);
        line1.drawRect(config.logicalWidth / 2 - 750, config.topY + 190, settingText.width * 8, 10);
        const line2 = new Graphics;
        line2.beginFill(0x3c3c3c);
        line2.drawRect(config.logicalWidth / 2 - 750, config.topY + 250, settingText.width * 8, 10);
        const line3 = new Graphics;
        line3.beginFill(0x3c3c3c);
        line3.drawRect(config.logicalWidth / 2 - 750, generalText.position.y + 300, settingText.width * 8, 10);
        this.overlayBG.addChild(line1, line2, line3);

        this.overlayBG.addChild(this.saveButton());
        this.overlayBG.addChild(this.wipeSaveButton());
        this.overlayBG.addChild(this.resetButton());
        this.makeSlider();
        this.overlayBG.addChild(this.musicButton());
        this.overlayBG.addChild(this.noCandiesButton());
        this.overlayBG.addChild(this.particleButton());
        this.overlayBG.addChild(this.achievementButton());

        this.addChild(this.overlayBG);
    }

    saveButton() {
        const saveBox = new Graphics;
        saveBox.beginFill(0x3c3c3c3c, 0.3);
        saveBox.drawRoundedRect(0, 0, 200, 60, 10);
        saveBox.endFill();
        saveBox.position.y = config.topY + 320;
        saveBox.position.x = config.logicalWidth / 2 - 750;

        saveBox.interactive = true;
        const saveBoxText = new TextLabel(saveBox.width / 2, saveBox.height / 2, 0.5, "Save", 30, 0xFFFFFF);
        const saveBoxDiscription = new TextLabel(saveBox.width * 1.3 + saveBox.position.x, config.topY + 320, 0, "Saves progress (autosaves every 30 seconds)", 30, 0xFFFFFF);
        saveBox.addChild(saveBoxText);
        this.overlayBG.addChild(saveBoxDiscription);
        saveBox.on("pointerdown", () => { console.log("SAVE"); saveBox.alpha = 0.5; });
        saveBox.on('pointerup', () => { saveBox.alpha = 1; });
        saveBox.on('pointerupoutside', () => { saveBox.alpha = 1; });
        return saveBox;
    }
    wipeSaveButton() {

        const delBox = new Graphics;
        delBox.beginFill(0x3c3c3c3c, 0.3);
        delBox.drawRoundedRect(0, 0, 200, 60, 10);
        delBox.position.y = config.topY + 400;
        delBox.position.x = config.logicalWidth / 2 - 750;

        delBox.endFill();
        delBox.interactive = true;
        const delBoxText = new TextLabel(delBox.width / 2, delBox.height / 2, 0.5, "Wipe Save", 30, 0xFF0000);
        const delBoxDiscription = new TextLabel(delBox.width * 1.3 + delBox.position.x, config.topY + 400, 0, "Saves progress (autosaves every 30 seconds)", 30, 0xFFFFFF);
        delBox.addChild(delBoxText, delBoxDiscription);
        this.overlayBG.addChild(delBoxDiscription);
        delBox.on("pointerdown", () => { console.log("REMOVE"); delBox.alpha = 0.5; delBoxDiscription: this.alpha = 1 });
        delBox.on('pointerup', () => { delBox.alpha = 1; });
        delBox.on('pointerupoutside', () => { delBox.alpha = 1; });
        return delBox;
    }

    resetButton() {
        const resetBox = new Graphics;
        resetBox.beginFill(0x3c3c3c3c, 0.3);
        resetBox.drawRoundedRect(0, 0, 200, 65, 10);
        resetBox.endFill();
        resetBox.position.y = config.topY + 545;
        resetBox.position.x = config.logicalWidth / 2 - 750;
        resetBox.interactive = true;
        resetBox.on("pointerdown", () => { console.log("RESET"); resetBox.alpha = 0.5; });
        resetBox.on('pointerup', () => { resetBox.alpha = 1; });
        resetBox.on('pointerupoutside', () => { resetBox.alpha = 1; });
        const resetBoxText = new TextLabel(resetBox.width / 2, resetBox.height / 2, 0.5, "Reset", 30, 0xFF0000);
        const resetBoxDiscription = new TextLabel(resetBox.width * 1.2 + resetBox.position.x + resetBox.width / 2, config.topY + 545, 0, "Reset all settings to base values", 30, 0xFFFFFF);
        resetBox.addChild(resetBoxText);
        this.overlayBG.addChild(resetBoxDiscription);
        return resetBox;
    }
    makeSlider() {

        const graphicRect = new PIXI.Graphics();
        graphicRect.beginFill(0x3c3c3c3c, 0.5);
        graphicRect.drawRect(0, 0, 600, 25);
        graphicRect.endFill();
        graphicRect.x = config.logicalWidth / 2 - 750;
        graphicRect.y = config.topY + 645;
        const handle: any = new PIXI.Graphics();
        handle.beginFill(0x3c3c3c3c);
        handle.drawRoundedRect(0, 0, 25, 75, 10);
        handle.endFill();

        handle.x = config.logicalWidth / 2 - 170;
        handle.y = config.topY + 620;
        handle.interactive = true;
        if (handle.x < (graphicRect.x - handle.width)) {
            handle.x = graphicRect.x - handle.width;
        } else if (handle.x > graphicRect.x + graphicRect.width - handle.width / 2) {
            handle.x = graphicRect.x + graphicRect.width - handle.width / 2;
        }
        //slider value
        currentSettings.volume = ((((handle.x - handle.width) - graphicRect.x + graphicRect.width * 2) / graphicRect.width) - 1.931);
        if (currentSettings.volume < 0) {
            currentSettings.volume = 0;
        }

        const audioDescription = new TextLabel(graphicRect.width * 1.2 + graphicRect.position.x, config.topY + 640, 0, `Volume : ${Math.ceil(currentSettings.volume * 100)}%`, 30, 0xFFFFFF);
        this.overlayBG.addChild(audioDescription);
        handle.on('pointerdown', (event: PIXI.InteractionEvent) => {
            handle.data = event.data;
            handle.alpha = 0.5;
            handle.dragging = true;
            handle.on('pointermove', (event: PIXI.InteractionEvent) => {
                if (handle.dragging) {
                    const newPosition = handle.data.getLocalPosition(handle.parent);
                    handle.x = newPosition.x;
                    // handle.y = newPosition.y;
                    //set bounds

                    if (handle.x < (graphicRect.x - handle.width)) {
                        handle.x = graphicRect.x - handle.width;
                    } else if (handle.x > graphicRect.x + graphicRect.width - handle.width / 2) {
                        handle.x = graphicRect.x + graphicRect.width - handle.width / 2;
                    }

                    //slider value
                    currentSettings.volume = ((((handle.x - handle.width) - graphicRect.x + graphicRect.width * 2) / graphicRect.width) - 1.931);
                    if (currentSettings.volume < 0) {
                        currentSettings.volume = 0;
                    }
                    audioDescription.updateLabelText(`Volume : ${Math.floor(currentSettings.volume * 100)}%`);
                }
            });
        });
        handle.on('point erup', () => {
            handle.alpha = 1;
            handle.dragging = false;
            handle.data = null;
        });
        handle.on('pointerupoutside', () => {
            handle.alpha = 1;
            handle.dragging = false;
            handle.data = null;
        });
        this.overlayBG.addChild(graphicRect);
        this.overlayBG.addChild(handle);


    }

    achievementButton() {
        const achievments = new Graphics;
        achievments.beginFill(0x3c3c3c3c, 0.3);
        achievments.drawRoundedRect(0, 0, 280, 60, 10);
        achievments.endFill();
        achievments.position.y = config.topY + 995;
        achievments.position.x = config.logicalWidth / 2 - 750;
        achievments.interactive = true;
        const achievmentsText = new TextLabel(achievments.width / 2, achievments.height / 2, 0.5, `Achievments: ${(currentSettings.achievementsOn == true) ? "On" : "Off"}`, 30, 0xFF0000);
        const achievmentsDiscription = new TextLabel(achievments.width * 1.3 + achievments.position.x, config.topY + 995, 0, "Popups when unlocking an achievment", 30, 0xFFFFFF);
        achievments.addChild(achievmentsText);
        this.overlayBG.addChild(achievmentsDiscription);

        achievments.on("pointerdown", () => {
            currentSettings.achievementsOn = !currentSettings.achievementsOn;

            if (OnSettingsCallback)
                OnSettingsCallback<achievementToggleDataType>(CallbackEvents.ACHIEVMENT, { value: currentSettings.achievementsOn });

            achievmentsText.updateLabelText(`Achievments: ${currentSettings.achievementsOn == true ? "On" : "Off"}`);
            achievments.alpha = 0.5;
        });
        achievments.on('pointerup', () => { achievments.alpha = 1; });
        achievments.on('pointerupoutside', () => { achievments.alpha = 1; });
        return achievments;
    }
    musicButton() {

        const soundBox = new Graphics;
        soundBox.beginFill(0x3c3c3c3c, 0.3);
        soundBox.drawRoundedRect(0, 0, 200, 60, 10);
        soundBox.endFill();
        soundBox.position.y = config.topY + 695;
        soundBox.position.x = config.logicalWidth / 2 - 750;
        soundBox.interactive = true;
        const soundBoxText = new TextLabel(soundBox.width / 2, soundBox.height / 2, 0.5, `Music: ${currentSettings.musicOn == true ? "On" : "Off"}`, 30, 0xFF0000);
        const soundBoxDiscription = new TextLabel(soundBox.width * 1.3 + soundBox.position.x, config.topY + 695, 0, "Turn off or on the music", 30, 0xFFFFFF);
        soundBox.addChild(soundBoxText);
        this.overlayBG.addChild(soundBoxDiscription);

        soundBox.on("pointerdown", () => {
            currentSettings.musicOn = !currentSettings.musicOn;

            if (OnSettingsCallback)
                OnSettingsCallback<musicToggleDataType>(CallbackEvents.MUSIC, { value: currentSettings.musicOn });

            soundBoxText.updateLabelText(`Music: ${currentSettings.musicOn == true ? "On" : "Off"}`);
            soundBox.alpha = 0.5;
        });
        soundBox.on('pointerup', () => { soundBox.alpha = 1; });
        soundBox.on('pointerupoutside', () => { soundBox.alpha = 1; });
        return soundBox;
    }
    particleButton() {
        const particles = new Graphics;
        particles.beginFill(0x3c3c3c3c, 0.3);
        particles.drawRoundedRect(0, 0, 300, 60, 10);
        particles.endFill();
        particles.position.y = config.topY + 895;
        particles.position.x = config.logicalWidth / 2 - 750;
        particles.interactive = true;
        const particlesText = new TextLabel(particles.width / 2, particles.height / 2, 0.5, `Particles: ${(currentSettings.particlesOn == true) ? "On" : "Off"}`, 30, 0xFF0000);
        const particlesDiscription = new TextLabel(particles.width * 1.3 + particles.position.x, config.topY + 895, 0, "Candies that fly when you click etc", 30, 0xFFFFFF);
        particles.addChild(particlesText);
        this.overlayBG.addChild(particlesDiscription);
        particles.on("pointerdown", () => {
            currentSettings.particlesOn = !currentSettings.particlesOn;

            if (OnSettingsCallback)
                OnSettingsCallback<particleToggleDataType>(CallbackEvents.PARTICLES, { value: currentSettings.particlesOn });

            particlesText.updateLabelText(`Particles: ${currentSettings.particlesOn == true ? "On" : "Off"}`);
            particles.alpha = 0.5;
        });
        particles.on('pointerup', () => { particles.alpha = 1; });
        particles.on('pointerupoutside', () => { particles.alpha = 1; });
        return particles;
    }
    noCandiesButton() {
        const numbersCandies = new Graphics;
        numbersCandies.beginFill(0x3c3c3c3c, 0.3);
        numbersCandies.drawRoundedRect(0, 0, 250, 60, 10);
        numbersCandies.position.y = config.topY + 795;
        numbersCandies.position.x = config.logicalWidth / 2 - 750
        numbersCandies.endFill();
        numbersCandies.interactive = true;
        const numbersCandiesText = new TextLabel(numbersCandies.width / 2, numbersCandies.height / 2, 0.5, `Numbers: ${(currentSettings.numbersOn == true) ? "On" : "Off"}`, 30, 0xFF0000);
        const numbersCandiesDiscription = new TextLabel(numbersCandies.width * 1.3 + numbersCandies.position.x, config.topY + 795, 0, "The numbers that popup when you make candies", 30, 0xFFFFFF);
        numbersCandies.addChild(numbersCandiesText);
        this.overlayBG.addChild(numbersCandiesDiscription);

        numbersCandies.on("pointerdown", () => {
            // this.numbersOn = this.callBack(CallbackEvents.NUMBER_CANDIES, this.numbersOn);
            currentSettings.numbersOn = !currentSettings.numbersOn;

            if (OnSettingsCallback)
                OnSettingsCallback<noOfCandiesToggleDataType>(CallbackEvents.NUMBER_CANDIES, { value: currentSettings.numbersOn });

            numbersCandiesText.updateLabelText(`Numbers: ${currentSettings.numbersOn == true ? "On" : "Off"}`);
            numbersCandies.alpha = 0.5;
        });

        numbersCandies.on('pointerup', () => { numbersCandies.alpha = 1; });
        numbersCandies.on('pointerupoutside', () => { numbersCandies.alpha = 1; });
        return numbersCandies;
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
    callBack(name: string, value: any) {
        // console.log(!value);

        Globals.emitter?.Call(name, !value)
        return !value;
    }

}
