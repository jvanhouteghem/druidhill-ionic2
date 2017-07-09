import { Injectable } from '@angular/core';
import { RaidProviderService } from './raid-provider.service';
import { RaidDmgService } from './raid-dmg.service';
import { BossProviderService } from './boss-provider.service';
import { PlayerProviderService } from './player-provider.service';
import { SpellProviderService } from './spell-provider.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment/moment';
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

  isPlaying(){
    return this.gameState === GameState.GAME_STATUS_START || this.gameState === GameState.GAME_STATUS_RESUME;
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
