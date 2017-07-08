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
import { GameState } from '../../models/game-state.enum';
import { AppComponent } from './../../app/app.component';

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
    public modalCtrl: ModalController
  ) {
    'ngInject';
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

  ngOnInit() {
    this._startGame();
    this.skip = true;
  }

  _startGame() {
    console.log("startgame");
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

  private skip:boolean;

  getSkip(){
    return this.skip;
  }

  toggleSkip(){
    this.skip = !this.skip;
  }

  slides = [
    {
      title: "Bienvenue sur le tutoriel!",
      description: "DruidHill (DH) est un jeu d'action refléxion dans lequel vous aller devoir garder en vie un groupe d'aventurier pendant leur combats contre des boss redoutables.",
      image: "assets/images/book.svg",
    },
    {
      title: "But du jeu ?",
      description: "Vous allez affronter de nombreux boss ayant chacun un panel de techniques aussi variées que dangereuse. Pour gagner vous devez garder suffisament longtemps votre raid en vie pour qu'il puisse tuer le boss.",
      image: "assets/images/boss10.svg",
    },
    {
      title: "Déroulement d'une partie ?",
      description: "Au cours de la partie vous allez devoir utiliser de nombreux sort de soin. Ces sorts coûtent du <strong>mana</strong> et ont chacun <strong>un temps de recharge</strong>.",
      image: "assets/images/heartplayer11.svg",
    },{
      title: "Comment jouer ?",
      description: "Chacun de vos sort est affecté à une commande ...",
      image: "assets/images/heartplayer11.svg",
    }

    //assets/images/ica-slidebox-img-1.png
  ];


}
