import { Component, OnInit } from '@angular/core';
import {PlayerProviderService} from './../../services/player-provider.service';
import {SpellProviderService} from './../../services/spell-provider.service';

@Component({
  selector: 'player-bars',
  templateUrl: './player-bars.html',
  //styleUrls: ['./player-bars.scss']
})
export class PlayerBarsComponent implements OnInit {

  constructor(
    private playerProviderService:PlayerProviderService,
    private spellProviderService:SpellProviderService
  ) {}

  ngOnInit() {
  }

  getPlayer(){
    return this.playerProviderService.getPlayer();
  }

  _isLoadingSpell(){
    return this.spellProviderService.getIsLoadingSpell();
  }

  getPlayerFormatHealth(){
    // {{getPlayer().getCurrentHealth()}}/{{getPlayer().getBaseHealth()}}
    return this.getPlayer() ? this.getPlayer().getCurrentHealth() + "/" + this.getPlayer().getBaseHealth() : "";
  }

  getPlayerFormatMana(){
    //{{getPlayer().getCurrentMana()}}/{{getPlayer().getBaseMana()}}
    return this.getPlayer() ? this.getPlayer().getCurrentMana() + "/" + this.getPlayer().getBaseMana() : "";
  }

}
