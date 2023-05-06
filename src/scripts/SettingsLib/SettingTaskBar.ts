import * as PIXI from 'pixi.js';
import { Container, Sprite } from 'pixi.js';
import { config } from '../appConfig';
import { Globals } from '../Globals';
import { BonusClass } from './BonusLib';
import { Settings } from './Settings';
import { Skins } from './Skins';






export class SettingsTaskBar extends Container {

    currentPage!: any;
    settingsOption!: Sprite;
    shopOption!: Sprite;
    bonusOptions!: Sprite;
    statusOption!: PIXI.Sprite;

    constructor() {
        super();


        this.settingsOption = new Sprite(Globals.resources.Settings.texture);
        this.settingsOption.scale.set(0.2);
        this.settingsOption.position.set(500, 1100);
    
        this.settingsOption.on("pointerdown", () => {

            if (!this.currentPage) {
                this.currentPage = new Settings();
                this.addChild(this.currentPage);
                this.statusOption.interactive = this.bonusOptions.interactive = this.settingsOption.interactive = this.shopOption.interactive = false;
                this.statusOption.visible = this.bonusOptions.visible = this.settingsOption.visible = this.shopOption.visible = false;
            }
        });

        this.shopOption = new Sprite(Globals.resources.Shop.texture);
        this.shopOption.scale.set(0.2);
        this.shopOption.position.set(500, 1300 )
        this.shopOption.on("pointerdown", () => {
            if (!this.currentPage) {
                this.currentPage = new Skins();
                this.addChild(this.currentPage);
                this.statusOption.interactive = this.bonusOptions.interactive = this.settingsOption.interactive = this.shopOption.interactive = false;
                this.statusOption.visible = this.bonusOptions.visible = this.settingsOption.visible = this.shopOption.visible = false;
            }
        });

        this.statusOption = new Sprite(Globals.resources.status.texture);
        this.statusOption.scale.set(0.2);
        this.statusOption.position.set(500, 1500);
        this.statusOption.on("pointerdown", () => {

            if (!this.currentPage) {
                this.currentPage = new Stats();
                this.addChild(this.currentPage);
                this.statusOption.interactive = this.bonusOptions.interactive = this.settingsOption.interactive = this.shopOption.interactive = false;
                this.statusOption.visible = this.bonusOptions.visible = this.settingsOption.visible = this.shopOption.visible = false;
            }
        });



        this.bonusOptions = new Sprite(Globals.resources.Bonus.texture);
        this.bonusOptions.position.set(500, 1700);
        this.bonusOptions.scale.set(0.2);
        this.bonusOptions.on("pointerdown", () => {

            if (!this.currentPage) {
                this.currentPage = new BonusClass();
                this.addChild(this.currentPage);
                this.statusOption.interactive = this.bonusOptions.interactive = this.settingsOption.interactive = this.shopOption.interactive = false;
                this.statusOption.visible = this.bonusOptions.visible = this.settingsOption.visible = this.shopOption.visible = false;
            }
        });
        this.statusOption.interactive = this.bonusOptions.interactive = this.settingsOption.interactive = this.shopOption.interactive = true;
        this.addChild(this.shopOption, this.settingsOption, this.bonusOptions, this.statusOption);


    }

    moveTomain() {
        this.currentPage.destroy();
        this.currentPage = null;
        this.statusOption.interactive = this.bonusOptions.interactive = this.settingsOption.interactive = this.shopOption.interactive = true;
        this.statusOption.visible = this.bonusOptions.visible = this.settingsOption.visible = this.shopOption.visible = true;
    }

}








export enum CallbackEvents {
    NUMBER_CANDIES = "numbersCandies",
    MUSIC = "musicOn",
    PARTICLES = "particlesOn",
    ACHIEVMENT = "achievementsOn",
    PAGEOPEN = "PAGEOPEN",
    BUYBALL = "BUYBALL"
}

export type noOfCandiesToggleDataType = {
    value: boolean
}
export type musicToggleDataType = {
    value: boolean
}
export type particleToggleDataType = {
    value: boolean
}
export type achievementToggleDataType = {
    value: boolean
}
export type ballPurchasedDataType = {
    value: number
}
export let OnSettingsCallback: (<T>(evnt: CallbackEvents, data: T) => void) | undefined = undefined;

export function assignToSettingCallback(callback: (<T>(evnt: CallbackEvents, data: T) => void)) {
    OnSettingsCallback = callback;
    console.log("INIT SETTINGS");
}
