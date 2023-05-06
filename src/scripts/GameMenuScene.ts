import { Graphics } from "pixi.js";
import { Globals } from "./Globals";
import { Scene } from "./Scene";
import { CallbackEvents, SettingsTaskBar, achievementToggleDataType, assignToSettingCallback, ballPurchasedDataType, musicToggleDataType, noOfCandiesToggleDataType, particleToggleDataType } from "./SettingsLib/SettingTaskBar";
import { TextLabel } from "./TextLabel";
import { SceneManager } from "./SceneManager";
import { MainScene } from "./MainScene";
import { levelGenerator } from "./LevelLib/GenerateLevels";

export class GameMenuScene extends Scene {
    settings!: SettingsTaskBar;
    levelGameButton!: Graphics;
    unlimitedPlayButton!: Graphics;
    constructor() {
        let textures: any = [];
        for (let i = 0; i < 8; i++) {
			textures.push(Globals.resources[`backGroundSprite${i}`].texture);
		}
        super(textures);
        this.changeBackgroundSprite(7);

        this.settings = new SettingsTaskBar();
        this.addToScene(this.settings);

        assignToSettingCallback(this.testMethod);
        this.makePlayButton();

    }
    makePlayButton()
    {
    
        this.levelGameButton = new Graphics();
        this.levelGameButton.lineStyle(10, 0x808080, 1);
        this.levelGameButton.beginFill(0x00000, 0.7);
        this.levelGameButton.drawRoundedRect(0, 0, 500, 150, 16);
        this.levelGameButton.endFill();

        this.levelGameButton.position.x = 300;
        this.levelGameButton.position.y = 600;

        this.levelGameButton.interactive= true;
        this.levelGameButton.buttonMode = true;
        
        this.levelGameButton.on("pointerdown",()=>{SceneManager.instance!.start(new levelGenerator());});
        const levelText = new TextLabel(this.levelGameButton.width/2,this.levelGameButton.height/2,0.5,"Level Game",40,0xFFFFFF);
        this.levelGameButton.addChild(levelText);

        this.mainContainer.addChild(this.levelGameButton); 
        
        this.unlimitedPlayButton = new Graphics();
        this.unlimitedPlayButton.lineStyle(10, 0x808080, 1);
        this.unlimitedPlayButton.beginFill(0x00000, 0.7);
        this.unlimitedPlayButton.drawRoundedRect(0, 0, 500, 150, 16);
        this.unlimitedPlayButton.endFill();
        
        this.unlimitedPlayButton.position.x = 300;
        this.unlimitedPlayButton.position.y = 900;
        
        this.unlimitedPlayButton.interactive= true;
        this.unlimitedPlayButton.buttonMode = true;

        this.unlimitedPlayButton.on("pointerdown",()=>{SceneManager.instance!.start(new MainScene(false));});
  


        const unlimitedLevelText = new TextLabel(this.unlimitedPlayButton.width/2,this.unlimitedPlayButton.height/2,0.5,"unlimited Level Game",40,0xFFFFFF);
        this.unlimitedPlayButton.addChild(unlimitedLevelText);

        this.mainContainer.addChild(this.unlimitedPlayButton)
    }
 

    testMethod<T>(evnt: CallbackEvents, data: T): void {

        if (evnt == CallbackEvents.NUMBER_CANDIES) {
            let args = data as unknown as noOfCandiesToggleDataType;

            console.log("====")
            console.log(args.value);
            console.log("====")
        }
        if (evnt == CallbackEvents.MUSIC) {

            let args = data as unknown as musicToggleDataType;

            console.log("====")
            console.log(args.value);
            console.log("====")
        }
        if (evnt == CallbackEvents.ACHIEVMENT) {
            let args = data as unknown as achievementToggleDataType;

            console.log("====")
            console.log(args.value);
            console.log("====")
        }
        if (evnt == CallbackEvents.PARTICLES) {
            let args = data as unknown as particleToggleDataType;

            console.log("====")
            console.log(args.value);
            console.log("====")
        }
        if (evnt == CallbackEvents.PAGEOPEN) {

            console.log("====")
            console.log("args.value");
            console.log("====")
        }
        if (evnt == CallbackEvents.BUYBALL) {
            let args = data as unknown as ballPurchasedDataType;

            console.log("====")
            console.log(args.value);
            console.log("====")
        }
    }

    update(dt: number): void {
        // throw new Error('Method not implemented.');
    }
    recievedMessage(msgType: string, msgParams: any): void {
        // throw new Error('Method not implemented.');
        if (msgType == "closePage") {
            this.settings.moveTomain();
        }
        if (msgType == "onWheelMoved") {
            this.settings.currentPage.emit("onWheelMoved", msgParams);
            // console.log(Math.abs(msgParams) / msgParams)
        }
    }


}


