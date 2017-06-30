import { Injectable } from '@angular/core';
import {Player} from './../models/characters/player';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import * as Rx from "rxjs/Rx";

@Injectable()
export class PlayerProviderService {

  private player:Player;
  private playerManaRegenSubscription;

  constructor() { }

  setPlayer(player:Player){
    this.player = player;
  }

  getPlayer(){
    return this.player;
  }

  getSubscription(){
    return this.playerManaRegenSubscription;
  }

  startPlayerManaRegen(){
    // Interval
    let timer = Rx.Observable.timer(0,1000);

    var observer = {
      next: () => {
        this.updateMana(this.getPlayer().getRegenManaPerSecond());
        this.updateManaBar(this.getPlayer().getCurrentManaInPercent());      
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification : heal done'),
    };
    this.playerManaRegenSubscription = timer.subscribe(observer);
  }

  stopPlayerManaRegen(){
    if (this.getSubscription()){
      this.getSubscription().unsubscribe();
    } else {
      console.log("stopPlayerManaRegen : this.getSubscription()", this.getSubscription());
    }
  }

  updateBothManaAndBar(mana){
    this.updateMana(mana);
    this.updateManaBar(this.getPlayer().getCurrentManaInPercent());
  }

  updateMana(mana){
    this.getPlayer().updateMana(mana);
  }

  updateManaBar(manaInPercent){
    var elem = document.getElementById("manaBar");
    elem.style.width = manaInPercent + '%';
  }

  updateHealthBar(healthInPercent){
    var elem = document.getElementById("healthBar");
    elem.style.width = healthInPercent + '%';
  }

}
