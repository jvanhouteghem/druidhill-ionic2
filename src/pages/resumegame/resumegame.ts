import { Component, forwardRef, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { TutorialPage } from '../tutorial/tutorial';
import { GameMessagerService, GameState } from './../../services/game-messager.service';

@Component({
  selector: 'page-resumegame',
  templateUrl: 'resumegame.html'
})
export class ResumeGamePage {

  private displayInfos:boolean;

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private gameMessagerService: GameMessagerService
  ) {
    'ngInject';
    this.displayInfos = true;
  }

  closeModalAndResume() {
    this.gameMessagerService.sendGameResultMessage(GameState.GAME_STATUS_RESUME);
    this.viewCtrl.dismiss();
  }

  closeModalAndRestart() {
    this.gameMessagerService.sendGameResultMessage(GameState.GAME_STATUS_START);
    this.viewCtrl.dismiss();
  }

  closeModalAndQuit(){
    this.gameMessagerService.sendGameResultMessage(GameState.GAME_STATUS_CLOSE);
    this.viewCtrl.dismiss();
  }

  closeModalAndOpenTutorial() {
    let myModal = this.modalCtrl.create(TutorialPage);
    myModal.present();
  }

  toggleDisplayInfos(){
    this.displayInfos = !this.displayInfos;
  }

  getDisplayInfos(){
    return this.displayInfos;
  }

}
