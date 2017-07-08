import { Injectable } from '@angular/core';
import { RaidProviderService } from './raid-provider.service';
import { RaidDmgService } from './raid-dmg.service';
import { BossProviderService } from './boss-provider.service';
import { PlayerProviderService } from './player-provider.service';
import { SpellProviderService } from './spell-provider.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment/moment';
import { Boss } from '../models/characters/boss';
import {Player} from './../models/characters/player';
import { GameState } from '../models/game-state.enum';

@Injectable()
export class GameProviderService{

  constructor(
    private raidProviderService: RaidProviderService,
    private bossProviderService: BossProviderService,
    private playerProviderService: PlayerProviderService,
    private raidDmgService: RaidDmgService
  ) { 
    'ngInject';
  }

  private game;
  private gameState;

  getGameStatus(){
    return this.gameState;
  }

  setGameStatus(gameStatus){
    this.gameState = gameStatus;
  }

  getGame(){
    return this.game;
  }

  startGame() {
    this.setGameStatus(GameState.GAME_STATUS_START);

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

  isPlaying(){
    return this.gameState === GameState.GAME_STATUS_START || this.gameState === GameState.GAME_STATUS_RESUME;
  }

  stopGame(){

    this.setGameStatus(GameState.GAME_STATUS_PAUSE);

    this.playerProviderService.stopPlayerManaRegen(); 
    this.raidDmgService.stopChangeHeroHealthOnTime();
    this.bossProviderService.stopBossPaternSubscription();
    this.bossProviderService.stopRaidDmgOnBoss();

    this.saveGame();
  }

  saveGame(){
    this.game = {
      player: this.playerProviderService.getPlayer(),
      raid: this.raidProviderService.getRaid(),
      boss: this.bossProviderService.getBoss()
    }
  }

  resumeGame(){

    this.setGameStatus(GameState.GAME_STATUS_RESUME);

    this.playerProviderService.setPlayer(this.game.player);
    //this.playerProviderService.getPlayer().updateMana(-7000);
    this.playerProviderService.startPlayerManaRegen();
    this.raidProviderService.setRaid(this.game.raid);
    this.bossProviderService.setBoss(this.game.boss);
    this.bossProviderService.startBossPattern();
    this.bossProviderService.startRaidDmgOnBoss();
  }

  // Todo move
  /*setHealthBar(health:number) {
    console.log('sethealthbar');
    var elem = document.getElementById('healthBar');
    elem.style.width = health+'%';
  }

  // Todo move
  setManaBar(mana:number) {
    var elem = document.getElementById('manaBar');
    elem.style.width = mana+'%';
  }*/

}
