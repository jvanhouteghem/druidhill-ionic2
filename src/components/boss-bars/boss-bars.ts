import { Component, OnInit } from '@angular/core';
import { BossProviderService } from './../../services/boss-provider.service';

@Component({
  selector: 'boss-bars',
  templateUrl: './boss-bars.html'
})
export class BossBarsComponent /*implements OnInit*/ {

  constructor(
    private bossProviderService:BossProviderService
  ) { }

  /*ngOnInit() {
    this.bossProviderService.startRaidDmgOnBoss();
  }*/

  /*_getBossCurrentHealth(){
    return this.bossProviderService.getBoss().getCurrentHealth();
  }

  _getBossBaseHealth(){
    return this.bossProviderService.getBoss().getBaseHealth();
  }*/

  _getBossFormatHealth(){
    return this.bossProviderService.getBoss() ? this.bossProviderService.getBoss().getCurrentHealth() + "/" + this.bossProviderService.getBoss().getCurrentHealth() : "";
  }

}
