import { Injectable } from '@angular/core';
import { RaidProviderService } from './raid-provider.service';
import { RaidDmgService } from './raid-dmg.service';
import { BossProviderService } from './boss-provider.service';
import { PlayerProviderService } from './player-provider.service';
import { SpellProviderService } from './spell-provider.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment/moment';
import {Pause} from '../models/pause';
import { Boss } from '../models/characters/boss';
import {Player} from './../models/characters/player';

@Injectable()
export class GameProviderService extends Pause{

  constructor(
    private raidProviderService: RaidProviderService,
    private bossProviderService: BossProviderService,
    private playerProviderService: PlayerProviderService,
    private raidDmgService: RaidDmgService
  ) { 
    'ngInject';
    super();
  }

  private game;

  private gameStatus;
  public static readonly GAME_STATUS_START = 0;
  public static readonly GAME_STATUS_PAUSE = 1;
  public static readonly GAME_STATUS_STOP = 2;
  public static readonly GAME_STATUS_RESUME = 3;

  getGameStatus(){
    return this.gameStatus;
  }

  setGameStatus(gameStatus){
    this.gameStatus = gameStatus;
  }

  getGame(){
    return this.game;
  }

  startGame() {

    this.setGameStatus(GameProviderService.GAME_STATUS_START);

    // Arrête les parties en cour
    //this.stopGame();

    // Démarre une nouvelle partie
    this.playerProviderService.setPlayer(new Player("Lea", 20000, 15500));
    this.playerProviderService.getPlayer().updateMana(-7000);
    this.initializeHealthBar();
    this.initializeManaBar();
    this.playerProviderService.startPlayerManaRegen();
    this.raidProviderService.generateRaid();
    this.bossProviderService.setBoss(new Boss("THEBOSS", 100000, "hard"));
    this.bossProviderService.startBossPattern();
    this.bossProviderService.startRaidDmgOnBoss();
    
  }

  isPlaying(){
    return this.gameStatus === GameProviderService.GAME_STATUS_START || this.gameStatus === GameProviderService.GAME_STATUS_RESUME;
  }

  stopGame(){

    this.setGameStatus(GameProviderService.GAME_STATUS_PAUSE);

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

    this.setGameStatus(GameProviderService.GAME_STATUS_RESUME);

    this.playerProviderService.setPlayer(this.game.player);
    //this.playerProviderService.getPlayer().updateMana(-7000);
    this.initializeHealthBar();
    this.initializeManaBar();
    this.playerProviderService.startPlayerManaRegen();
    this.raidProviderService.setRaid(this.game.raid);
    this.bossProviderService.setBoss(this.game.boss);
    this.bossProviderService.startBossPattern();
    this.bossProviderService.startRaidDmgOnBoss();
  }

  initializeHealthBar() {
    var elem = document.getElementById("healthBar");
    elem.style.width = '100%';
  }

  initializeManaBar() {
    var elem = document.getElementById("manaBar");
    elem.style.width = '100%';
  }

}
