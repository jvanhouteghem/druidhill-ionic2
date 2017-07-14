import { Component, OnInit } from '@angular/core';
import { BossProviderService } from './../../services/boss-provider.service';
import { Subscription } from 'rxjs/Subscription';
import { GameMessagerService, GameState, GameResult } from './../../services/game-messager.service';
import { ConfigProviderService } from './../../services/config-provider.service';

@Component({
  selector: 'boss-bars',
  templateUrl: './boss-bars.html'
})
export class BossBarsComponent /*implements OnInit*/ {

  subscription: Subscription;
  bossSpeech:string;
  bossSpeechDisplay:boolean = false;

  constructor(
    private bossProviderService:BossProviderService,
    private gameMessagerService: GameMessagerService,
    private configProviderService: ConfigProviderService
  ) { 
    this.subscription = this.gameMessagerService.getGameResultMessage().subscribe(message => { this.gameResultMessageDispatcher(message.text) });
  }

  _getBossFormatHealth(){
    return this.bossProviderService.getBoss() ? this.bossProviderService.getBoss().getCurrentHealth() + "/" + this.bossProviderService.getBoss().getBaseHealth() : "";
  }

  gameResultMessageDispatcher(message){
      switch (message) {
        case GameState.GAME_STATUS_RESUME: {
          this.bossSpeechPop("Déjà de retour ? Je vous ai gardé quelques baffes en réserve.");
          break;
        }
        case GameState.GAME_STATUS_START: {
          this.bossSpeechPop("Salut bande de canailles ! Alors .. Prêt à jouer ?");
          break;
        }
        /*case GameState.GAME_STATUS_STOP: {
          break;
        }*/
      }
  }

  bossSpeechPop(speech:string){
    this.bossSpeech = speech;
    this.bossSpeechDisplay = true;
    setTimeout(() => {
      this.bossSpeechDisplay = false;
    }, 1200);
  }

}
