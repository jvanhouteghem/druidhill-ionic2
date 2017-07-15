import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import * as moment from 'moment/moment';
import * as Rx from "rxjs/Rx";
import { RaidProviderService } from './../../services/raid-provider.service';
import { RaidDmgService } from './../../services/raid-dmg.service';
import { BossProviderService } from './../../services/boss-provider.service';
import { PlayerProviderService } from './../../services/player-provider.service';
import { SpellProviderService } from './../../services/spell-provider.service';
import { Hero } from './../../models/characters/hero';
import { ResumeGamePage } from '../resumegame/resumegame';
import { EndGamePage } from '../endgame/endgame';
import { BossInformationPage } from '../bossinformation/bossinformation';
import { TutorialPage } from '../tutorial/tutorial';
import { AppComponent } from './../../app/app.component';
import { Boss } from '../../models/characters/boss';
import { Player } from '../../models/characters/player';
import { Subscription } from 'rxjs/Subscription';
import { GameMessagerService, GameState } from './../../services/game-messager.service';

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
    this.subscription = this.gameMessagerService.getGameResultMessage().subscribe(message => { this.message = message, this.gameResultMessageDispatcher(this.message.text) });
  }

  gameResultMessageDispatcher(message){
      switch (message) {
        case GameState.GAME_STATUS_RESUME: {
          this.resumeGame();
          break;
        }
        case GameState.GAME_STATUS_START: {
          this.startGame();
          break;
        }
        case GameState.GAME_STATUS_STOP: {
          this.stopGame();
          this.raidProviderService.cleanRaid();
          this.gameMessagerService.cleanMessages();
          this.navCtrl.push(AppComponent);
          break;
        }
        case GameState.GAME_RESULT_WIN: {
          this.stopGame();
          this.openGameResultModal(message);//this.gameResultAlert(message);
          break;
        }
        case GameState.GAME_RESULT_LOOSE: {
          this.stopGame();
          this.openGameResultModal(message);//this.gameResultAlert(message);
          break;
        }
      }
  }

  ngOnInit() {
    this.tutorialAlert();
  }

  startGame() {
    this.playerProviderService.setPlayer(new Player('Lea', 20000, 15500));
    this.playerProviderService.updateHealthBar(100);
    this.playerProviderService.updateManaBar(100);
    this.playerProviderService.startPlayerManaRegen();
    this.raidProviderService.generateRaid();
    this.bossProviderService.setBoss(new Boss('THEBOSS', 30000, 'hard'));
    this.bossProviderService.updateHealthBar(100);
    this.bossProviderService.startBossPattern();
    this.bossProviderService.startRaidDmgOnBoss();
  }

  stopGame() {
    this.playerProviderService.stopPlayerManaRegen();
    this.raidDmgService.stopChangeHeroHealthOnTime();
    this.bossProviderService.stopBossPaternSubscription();
    this.bossProviderService.stopRaidDmgOnBoss();

    this.saveGame();
  }

  resumeGame() {
    this.playerProviderService.setPlayer(this.game.player);
    this.playerProviderService.startPlayerManaRegen();
    this.raidProviderService.setRaid(this.game.raid);
    this.bossProviderService.setBoss(this.game.boss);
    this.bossProviderService.startBossPattern();
    this.bossProviderService.startRaidDmgOnBoss();
  }

  saveGame() {
    this.game = {
      player: this.playerProviderService.getPlayer(),
      raid: this.raidProviderService.getRaid(),
      boss: this.bossProviderService.getBoss()
    }
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
          that.gameMessagerService.sendSpellMessage("0002");
        }
        // single click
        else {
          let hero = that.raidProviderService.getRaid()[heroId];
          that.raidDmgService.rejuvenation(hero);
          that.gameMessagerService.sendSpellMessage("0001");
        }
        that.leftClickCount = 0;
        that.pendingLeftClick = false;
      }, 250);
    }
  }

  rightClickOnHero(evt, heroId) {
    this.raidDmgService.wildGrowth(heroId);
    this.gameMessagerService.sendSpellMessage("0003");
  }

  getPlayer() {
    return this.playerProviderService.getPlayer();
  }


  openResumeGameModal() {
    this.stopGame();
    let myModal = this.modalCtrl.create(ResumeGamePage);
    myModal.present();
  }

  openBossInformationModal() {
    let myModal = this.modalCtrl.create(BossInformationPage);
    myModal.present();
  }

  openTutorialModal() {
    let myModal = this.modalCtrl.create(TutorialPage);
    myModal.onDidDismiss(() => { this.startGame(); });
    myModal.present();
  }

  openGameResultModal(message:string) {
    let obj = {gameResult: message};
    let myModal = this.modalCtrl.create(EndGamePage, obj);
    //myModal.onDidDismiss(() => { this.startGame(); });
    myModal.present();
  }

  /*gameResultAlert(message) {
    let gameResult = message == GameState.GAME_RESULT_WIN ? "Victory" : "Defeat";
    let confirm = this.alertCtrl.create({
      title: gameResult + ' !!',
      message: 'Rejouer ?',
      buttons: [
        { text: 'Oui', handler: () => { this.startGame(); } },
        { text: 'Non merci', handler: () => { console.log('Rejouer ? Non merci'); } }
      ]
    });
    confirm.present();
  }*/

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
            this.gameMessagerService.sendGameResultMessage(GameState.GAME_STATUS_START);
          }
        }
      ]
    });
    confirm.present();
  }

  // A mettre dans directive score
  /*countUp() {
    let score = 523;
    let scoreDisplayed:number = 0;
    let log = document.getElementById('score');

    let int = setInterval(function () {
        scoreDisplayed += scoreDisplayed + (Math.round(score * 0.005));
        if (scoreDisplayed >= score){
          scoreDisplayed = score;
          clearInterval(int);
        }
        log.innerHTML = "" + scoreDisplayed;
    }, 100);
  }*/

}
