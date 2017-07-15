import { Component, forwardRef, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { GameMessagerService, GameState } from './../../services/game-messager.service';
import { GameRegisterService, GameRegister} from './../../services/game-register.service';

@Component({
  selector: 'page-endgame',
  templateUrl: 'endgame.html'
})
export class EndGamePage {

  gameResult: GameState = this.navParams.get('gameResult');
  gameRegister: GameRegister;

  private displayInfos:boolean;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private gameMessagerService: GameMessagerService,
    private gameRegisterService: GameRegisterService
  ) {
    'ngInject';
    this.gameRegister = this.gameRegisterService.getGameRegister();
  }

  getGameResultTemplate(gameResult: GameState){
      let templateResult = "empty";
      switch (this.gameResult) {
        case GameState.GAME_RESULT_WIN: {
          templateResult = "Victoire";
          break;
        }
        case GameState.GAME_RESULT_LOOSE: {
          templateResult = "Défaite";
          break;
        }
      }
      return templateResult;
  }

  closeModalAndRestart() {
    this.gameMessagerService.sendGameResultMessage(GameState.GAME_STATUS_START);
    this.viewCtrl.dismiss();
  }

  closeModalAndQuit(){
    this.gameMessagerService.sendGameResultMessage(GameState.GAME_STATUS_STOP);
    this.viewCtrl.dismiss();
  }

}
