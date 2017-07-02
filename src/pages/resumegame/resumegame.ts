import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-resumegame',
  templateUrl: 'resumegame.html'
})
export class ResumeGamePage {

  constructor(
    public navCtrl: NavController, public viewCtrl: ViewController
  ) {

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
