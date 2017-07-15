import { Injectable, OnDestroy } from '@angular/core';
import { Boss } from '../models/characters/boss';
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
import { RaidProviderService } from './raid-provider.service';
import { ConfigProviderService } from './config-provider.service';
import { RaidDmgService } from './raid-dmg.service';
import { Hero } from '../models/characters/hero';
import * as Rx from "rxjs/Rx";
import { ResumeGamePage } from '../pages/resumegame/resumegame';
import { AlertController } from 'ionic-angular';
import { GameMessagerService, GameState} from './../services/game-messager.service';

@Injectable()
export class BossProviderService /*implements OnDestroy*/{

  private boss: Boss;
  private bossPaternSubscriptions = [];
  private raidDmgOnBossSubscription;

  constructor(
    private raidProviderService: RaidProviderService,
    private raidDmgService: RaidDmgService,
    private configProviderService: ConfigProviderService,
    private alertCtrl: AlertController,
    private gameMessagerService: GameMessagerService
  ) {
  }

  /*ngOnDestroy() {
    this.stopRaidDmgOnBoss();
    this.stopBossPaternSubscription();
  }*/

  setBoss(boss: Boss) {
    this.boss = boss;
  }

  getBoss() {
    return this.boss;
  }

  startRaidDmgOnBoss() {
    this.initializeHealthBar();
    let timer = Observable.timer(1000, 500);
    var observer = {
      next: () => {
        let raidAliveLength = this.raidProviderService.getNbHeroAlive();
        let minRaidDmg = 10 * raidAliveLength; // todo moove value into game config
        let maxRaidDmg = 35 * raidAliveLength; // todo moove value into game config
        let raidFinalDmg = Math.floor((Math.random() * maxRaidDmg) + minRaidDmg);
        this.getBoss().setDmgTaken(this.getBoss().getDmgTaken() + raidFinalDmg)
        this.updateHealthBar(this.getBoss().getCurrentHealthInPercent());
        
        //isDead?
        if(this.getBoss().isDead()){
          observer.complete();
        }
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => {
          this.stopRaidDmgOnBoss();
          this.stopBossPaternSubscription();
          this.gameMessagerService.sendGameResultMessage(GameState.GAME_RESULT_WIN);        
      },
    };

    this.raidDmgOnBossSubscription = timer.subscribe(observer);
  }

  getRaidDmgOnBossSubscription() {
    return this.raidDmgOnBossSubscription;
  }

  stopRaidDmgOnBoss() {
    this.getRaidDmgOnBossSubscription().unsubscribe();
  }

  initializeHealthBar() {
    var elem = document.getElementById("bossHealthBar");
    elem.style.width = '100%';
  }

  updateHealthBar(healthInPercent) {
    var elem = document.getElementById("bossHealthBar");
    elem.style.width = healthInPercent + '%';
  }

  // =======================
  // Boss attacks
  // =======================

  getTarget(targetId: String) {
    let target = null;
    switch (targetId) {
      case "T":
        target = this.raidProviderService.getTankIfAliveOrElseHero();
        break;
      case "R":
        target = this.raidProviderService.getRandomAliveHero();
        break;
    }
    return target;
  }

  attackDispatcher(attack) {
    switch (attack.type[0]) {
      case "N":
        this.normalAttack(attack);
        break;
    }
    //isWipe ?
    if (this.raidProviderService.isWipe()) {
      this.gameMessagerService.sendGameResultMessage(GameState.GAME_RESULT_LOOSE); // todo enum
      this.stopBossPaternSubscription();
    }
  }


  normalAttack(attack) {
    let target = this.getTarget(attack.target[0]);
    if (target != null) {
      if (attack.target[0] == "T" && attack.addFocus) {
        this.getBoss().setFocus(target);
      }
      this.raidDmgService.changeHeroHealth(target, attack.damages);     
    }
  }

  startBossPattern() {
    let attacks = this.boss.getAttacks(this.boss.getDifficulty());
    for (let i = 0; i < attacks.length; i++) {
      this.bossPaternSubscriptions.push(this.doBossAttack(attacks[i]));
    }
  }

  doBossAttack(attack) {
    let timer = Rx.Observable.timer(500, attack.period);
    var observer = {
      next: () => this.attackDispatcher(attack),
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification : heal done'),
    };
    return timer.subscribe(observer);
  }

  getBossPaternSubscriptions() {
    return this.bossPaternSubscriptions;
  }

  stopBossPaternSubscription() {
    for (let i = 0; this.getBossPaternSubscriptions() && i < this.getBossPaternSubscriptions().length; i++) {
      this.getBossPaternSubscriptions()[i].unsubscribe();
    }
  }

}
