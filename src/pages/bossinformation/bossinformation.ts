import { Component, forwardRef, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { TutorialPage } from '../tutorial/tutorial';
import { GameMessagerService, GameState, GameResult } from './../../services/game-messager.service';

@Component({
  selector: 'page-bossinformation',
  templateUrl: 'bossinformation.html'
})
export class BossInformationPage {

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
  }

  closeModalAndQuit(){
    this.gameMessagerService.sendGameResultMessage(GameState.GAME_STATUS_STOP);
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

  goback() {
    this.navCtrl.pop();
  }

}
