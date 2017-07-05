import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GridPage } from '../grid/grid';
import {Platform} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private platform;

  constructor(
    public navCtrl: NavController,
    platform: Platform
  ) {
    this.platform = platform;
  }

  goGridPage(){
    this.navCtrl.push(GridPage);
  }

  exitApp(){
    this.platform.exitApp();
    window.close();
  }

}
