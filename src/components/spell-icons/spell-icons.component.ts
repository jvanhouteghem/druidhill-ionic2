import { Component, OnInit } from '@angular/core';
import { SpellProviderService } from './../../services/spell-provider.service';
import { PlayerProviderService } from './../../services/player-provider.service';
import { RaidDmgService } from './../../services/raid-dmg.service';
import * as moment from 'moment/moment';
import { Subscription } from 'rxjs/Subscription';
import { GameMessagerService } from './../../services/game-messager.service';

@Component({
  selector: 'spell-icons',
  templateUrl: './spell-icons.component.html',
  //styleUrls: ['./spell-icons.component.css']
})
export class SpellIconsComponent implements OnInit {

  subscription: Subscription;

  constructor(
    private spellProviderService: SpellProviderService,
    private playerProviderService:PlayerProviderService,
    private raidDmgService:RaidDmgService,
    private gameMessagerService: GameMessagerService
    ) {
      this.subscription = this.gameMessagerService.getSpellMessage().subscribe(message => { this.spellMessagerDispatcher(message.text)});
    }

  ngOnInit() {
  }

  spellMessagerDispatcher(spellId){
    this.animateIcon(this.getSpellIndexAnimateById(spellId));
  }

  public animation = [
    {
      spellId: '0001',
      animate: false
    },{
      spellId: '0002',
      animate: false
    },{
      spellId: '0003',
      animate: false
    },{
      spellId: '0004',
      animate: false
    },{
      spellId: '0005',
      animate: false
    }    
  ];

  getSpellIndexAnimateById(spellId){
    for (let i = 0 ; i < this.animation.length ; i++){
      if (this.animation[i].spellId === spellId){
        return i; 
      }
    }
    throw "no index found for the spellId " + spellId;
  }

  _isHealOnCooldown(healId: string) {
    return this.spellProviderService.isHealOnCooldown(healId, moment());
  }

  _getHealCooldown(healId: string) {
    return this.spellProviderService.getHealCooldown(healId, moment());
  }

  _innervate() {
    let hero = this.playerProviderService;
    this.raidDmgService.innervate();
  }

  _tranquility(){
    this.raidDmgService.tranquility();
  }

  animateIcon(spellId){
    this.animation[spellId].animate = true;
    setTimeout(() => {
      this.animation[spellId].animate = false;
    }, 1500)
  }


}
