import { Component, forwardRef, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { GameState } from '../../models/game-state.enum';
import { ModalController } from 'ionic-angular';
import { TutorialPage } from '../tutorial/tutorial';

@Component({
  selector: 'page-resumegame',
  templateUrl: 'resumegame.html'
})
export class ResumeGamePage {

  private displayInfos:boolean;

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {
    //'ngInject';
    this.displayInfos = true;
  }

  closeModalAndResume() {
    this.viewCtrl.dismiss(GameState.GAME_STATUS_RESUME);
  }

  closeModalAndRestart() {
    this.viewCtrl.dismiss(GameState.GAME_STATUS_START);
  }

  closeModalAndQuit(){
    this.viewCtrl.dismiss(GameState.GAME_STATUS_STOP);
  }

  closeModalAndOpenTutorial() {
    let myModal = this.modalCtrl.create(TutorialPage);
    /*myModal.onDidDismiss( () => {
      this.viewCtrl.dismiss(GameState.GAME_STATUS_START)
    });*/
    myModal.present();
  }

  toggleDisplayInfos(){
    this.displayInfos = !this.displayInfos;
  }

  getDisplayInfos(){
    return this.displayInfos;
  }

}
