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

  startGame() {

    // Arrête les parties en cour
    //this.stopGame();

    // Démarre une nouvelle partie
    this.playerProviderService.setPlayer("Lea", 20000, 15500);
    this.playerProviderService.getPlayer().updateMana(-7000);
    this.initializeHealthBar();
    this.initializeManaBar();
    this.playerProviderService.startPlayerManaRegen();
    this.raidProviderService.generateRaid();
    this.bossProviderService.setBoss(new Boss("THEBOSS", 100000, "hard"));
    this.bossProviderService.startBossPattern();
    this.bossProviderService.startRaidDmgOnBoss();
    
  }

  stopGame(){
    this.playerProviderService.stopPlayerManaRegen(); 
    this.raidDmgService.stopChangeHeroHealthOnTime();
    this.bossProviderService.stopBossPaternSubscription();
    this.bossProviderService.stopRaidDmgOnBoss();
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
