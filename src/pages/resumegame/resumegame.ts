import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { GameState } from '../../models/game-state.enum';

@Component({
  selector: 'page-resumegame',
  templateUrl: 'resumegame.html'
})
export class ResumeGamePage {

  constructor(
    public navCtrl: NavController, public viewCtrl: ViewController
  ) {

  }

  closeModalAndResume() {
    this.viewCtrl.dismiss(GameState.GAME_STATUS_RESUME);
  }

  closeModalAndRestart() {
    this.viewCtrl.dismiss(GameState.GAME_STATUS_START);
  }

}
