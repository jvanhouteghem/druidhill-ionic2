import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RaidProviderService } from './../../services/raid-provider.service';
import { RaidDmgService } from './../../services/raid-dmg.service';
import { BossProviderService } from './../../services/boss-provider.service';
import { PlayerProviderService } from './../../services/player-provider.service';
import { SpellProviderService } from './../../services/spell-provider.service';
import { Hero } from './../../models/characters/hero';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import * as moment from 'moment/moment';
import * as Rx from "rxjs/Rx";
import { ModalController } from 'ionic-angular';
import { ResumeGamePage } from '../resumegame/resumegame';
import { BossInformationPage } from '../bossinformation/bossinformation';
import { TutorialPage } from '../tutorial/tutorial';
import { GameState, GameResult } from '../../models/game-state.enum';
import { AppComponent } from './../../app/app.component';
import { AlertController } from 'ionic-angular';
import { Boss } from '../../models/characters/boss';
import {Player} from '../../models/characters/player';
import { Subscription } from 'rxjs/Subscription';
import { GameMessagerService } from './../../services/game-messager.service';

@Component({
  selector: 'page-grid',
  templateUrl: 'grid.html'
})
export class GridPage {

  private pendingLeftClick = false; // used to wait if left click is single or double
  private leftClickCount = 0; // used to wait if left click is single or double
    message: any;
    subscription: Subscription;
    private game;

  // Only for event and display
  constructor(
    public navCtrl: NavController,
    private raidProviderService: RaidProviderService,
    private raidDmgService: RaidDmgService,
    private bossProviderService: BossProviderService,
    private playerProviderService: PlayerProviderService,
    private spellProviderService: SpellProviderService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private gameMessagerService: GameMessagerService
  ) {
    'ngInject';
    this.subscription = this.gameMessagerService.getMessage().subscribe(message => { this.message = message, this.gameEvents(this.message) });
  }

  gameEvents(message){
    this.winOrLooseAlert(message.text);
  }

  ngOnInit() {
     this.tutorialAlert();
  }

  openResumeGameModal() {
    this.stopGame();
    let myModal = this.modalCtrl.create(ResumeGamePage);

    myModal.onDidDismiss( data => {
      switch(data) { 
        case GameState.GAME_STATUS_RESUME: {
            this.resumeGame();
            break; 
        }
        case GameState.GAME_STATUS_START: {
            this.startGame();
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

  openBossInformationModal() {
    console.log("try open boss information page");
    let myModal = this.modalCtrl.create(BossInformationPage);

    myModal.onDidDismiss( data => {
      console.log("close boss information page");
    });

    myModal.present();
  }

  openTutorialModal() {
    let myModal = this.modalCtrl.create(TutorialPage);

    myModal.onDidDismiss( () => {
      this.startGame();
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
            this.startGame();
          }
        }
      ]
    });
    confirm.present();
  }

  winOrLooseAlert(message) {

    let gameResult = message == GameResult.GAME_RESULT_WIN ? "Victory" : "Defeat";

    let confirm = this.alertCtrl.create({
      title: gameResult + ' !!',
      message: 'Rejouer ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.startGame();
          }
        },
        {
          text: 'Non merci',
          handler: () => {
            console.log('Rejouer ? Non merci');
          }
        }
      ]
    });
    confirm.present();
  }


  startGame() {
    //this.setGameStatus(GameState.GAME_STATUS_START);
    // Démarre une nouvelle partie
    this.playerProviderService.setPlayer(new Player('Lea', 20000, 15500));
    this.playerProviderService.getPlayer().updateMana(-7000);
    //this.setHealthBar(100);
    //this.setManaBar(100);
    this.playerProviderService.startPlayerManaRegen();
    this.raidProviderService.generateRaid();
    this.bossProviderService.setBoss(new Boss('THEBOSS', 50000, 'hard'));
    this.bossProviderService.startBossPattern();
    this.bossProviderService.startRaidDmgOnBoss();
  }

  stopGame(){
    //this.setGameStatus(GameState.GAME_STATUS_PAUSE);
    this.playerProviderService.stopPlayerManaRegen(); 
    this.raidDmgService.stopChangeHeroHealthOnTime();
    this.bossProviderService.stopBossPaternSubscription();
    this.bossProviderService.stopRaidDmgOnBoss();

    this.saveGame();
  }

  resumeGame(){
    //this.setGameStatus(GameState.GAME_STATUS_RESUME);
    this.playerProviderService.setPlayer(this.game.player);
    //this.playerProviderService.getPlayer().updateMana(-7000);
    this.playerProviderService.startPlayerManaRegen();
    this.raidProviderService.setRaid(this.game.raid);
    this.bossProviderService.setBoss(this.game.boss);
    this.bossProviderService.startBossPattern();
    this.bossProviderService.startRaidDmgOnBoss();
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

  /*getGame() {
    return this.game;
  }*/

  saveGame(){
    this.game = {
      player: this.playerProviderService.getPlayer(),
      raid: this.raidProviderService.getRaid(),
      boss: this.bossProviderService.getBoss()
    }
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
          let hero = that.raidProviderService.getRaid()[heroId];
          that.raidDmgService.healingTouch(hero);
        }
        // single click
        else {
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
