import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RaidProviderService } from './../../services/raid-provider.service';
import { RaidDmgService } from './../../services/raid-dmg.service';
import { BossProviderService } from './../../services/boss-provider.service';
import { PlayerProviderService } from './../../services/player-provider.service';
import { SpellProviderService } from './../../services/spell-provider.service';
import { GameProviderService } from './../../services/game-provider.service';
import { Hero } from './../../models/characters/hero';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import * as moment from 'moment/moment';
import * as Rx from "rxjs/Rx";
import { ModalController } from 'ionic-angular';
import { ResumeGamePage } from '../resumegame/resumegame';
import { TutorialPage } from '../tutorial/tutorial';
import { GameState } from '../../models/game-state.enum';
import { AppComponent } from './../../app/app.component';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-grid',
  templateUrl: 'grid.html'
})
export class GridPage {

  private pendingLeftClick = false; // used to wait if left click is single or double
  private leftClickCount = 0; // used to wait if left click is single or double

  // Only for event and display
  constructor(
    public navCtrl: NavController,
    private raidProviderService: RaidProviderService,
    private raidDmgService: RaidDmgService,
    private bossProviderService: BossProviderService,
    private playerProviderService: PlayerProviderService,
    private spellProviderService: SpellProviderService,
    private gameProviderService: GameProviderService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    'ngInject';
  }

  ngOnInit() {
     this.tutorialAlert();
  }

  openResumeGameModal() {
    this.gameProviderService.stopGame();
    let myModal = this.modalCtrl.create(ResumeGamePage);

    myModal.onDidDismiss( data => {
      switch(data) { 
        case GameState.GAME_STATUS_RESUME: {
            this._resumeGame();
            break; 
        }
        case GameState.GAME_STATUS_START: {
            this._startGame();
            break; 
        }
        case GameState.GAME_STATUS_STOP: {
            this.navCtrl.push(AppComponent);
            break; 
        }
      }
    });

    myModal.present();
  }

  openTutorialModal() {
    let myModal = this.modalCtrl.create(TutorialPage);

    myModal.onDidDismiss( () => {
      this._startGame();
    });

    myModal.present();
  }

  tutorialAlert() {
    let confirm = this.alertCtrl.create({
      title: 'Première partie ?',
      message: 'Afficher le tutoriel ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.openTutorialModal();
          }
        },
        {
          text: 'Non merci',
          handler: () => {
            console.log('Agree clicked');
            this._startGame();
          }
        }
      ]
    });
    confirm.present();
  }

  _startGame() {
    this.gameProviderService.startGame();
  }

  _stopGame() {
    this.gameProviderService.stopGame();
  }

  _getRaid() {
    return this.raidProviderService.getRaid();
  }

  getCSSGradient(heroId: number) {
    let result = "";
    let hero = this.raidProviderService.getRaid()[heroId];
    if (hero != undefined) {
      result = "linear-gradient(0deg, " + hero.getClassColor() + " " + this._getHeroHealthInPercent(hero.getId()) + "%, #4a4a4a 0%)"; // Warning, don't add ";" in string // life / background      
    }
    return result;
  }

  _getGame() {
    return this.gameProviderService.getGame();
  }

  _resumeGame() {
    this.gameProviderService.resumeGame();
  }

  _getGameStatus() {
    return this.gameProviderService.getGameStatus();
  }

  _changeHeroHealth(hero: Hero, inputNb: number) {
    this.raidDmgService.changeHeroHealth(hero, inputNb);
  }

  _getHeroHealthInPercent(heroId: number) {
    return this.raidProviderService.getRaid()[heroId].getCurrentHealthInPercent();
  }

  leftClickOnHero(evt, heroId) {
    let that = this;
    this.leftClickCount++;

    if (!that.pendingLeftClick) {
      that.pendingLeftClick = true;
      setTimeout(function () {
        // double click
        if (that.leftClickCount >= 2) {
          console.log("double click");
          let hero = that.raidProviderService.getRaid()[heroId];
          that.raidDmgService.healingTouch(hero);
        }
        // single click
        else {
          console.log("single click");
          let hero = that.raidProviderService.getRaid()[heroId];
          that.raidDmgService.rejuvenation(hero);
        }
        that.leftClickCount = 0;
        that.pendingLeftClick = false;
      }, 250);
    }
  }

  rightClickOnHero(evt, heroId) {
    this.raidDmgService.wildGrowth(heroId);
  }

  getPlayer() {
    return this.playerProviderService.getPlayer();
  }


}
