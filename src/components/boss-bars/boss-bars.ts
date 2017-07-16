import { Component, OnInit } from '@angular/core';
import { BossProviderService } from './../../services/boss-provider.service';
import { Subscription } from 'rxjs/Subscription';
import { GameMessagerService, GameState } from './../../services/game-messager.service';
import { ConfigProviderService } from './../../services/config-provider.service';

@Component({
  selector: 'boss-bars',
  templateUrl: './boss-bars.html'
})
export class BossBarsComponent /*implements OnInit*/ {

  subscription: Subscription;
  bossSpeech:string;
  bossSpeechList;
  bossSpeechDisplay:boolean = false;

  constructor(
    private bossProviderService:BossProviderService,
    private gameMessagerService: GameMessagerService,
    private configProviderService: ConfigProviderService
  ) { 
    this.subscription = this.gameMessagerService.getGameResultMessage().subscribe(message => { this.gameResultMessageDispatcher(message.text) });
    this.bossSpeechList = [
      {id: 'face', text:['Ne touchez pas à mon visage !', 'Vous êtes sourd ?']},
      {id: 'resume', text: 'Déjà de retour ? Je vous ai gardé quelques baffes en réserve.'},
      {id: 'greetings', text: 'Salut bande de canailles ! Alors .. Prêt à jouer ?'}
    ]
  }

  _getBossFormatHealth(){
    return this.bossProviderService.getBoss() ? this.bossProviderService.getBoss().getCurrentHealth() + "/" + this.bossProviderService.getBoss().getBaseHealth() : "";
  }

  gameResultMessageDispatcher(message){
      switch (message) {
        case GameState.GAME_STATUS_RESUME: {
          this.bossSpeechPopDelay(this.getBossSpeechById('resume'));
          break;
        }
        case GameState.GAME_STATUS_START: {
          this.bossSpeechPopDelay(this.getBossSpeechById('greetings'));
          break;
        }
        /*case GameState.GAME_STATUS_STOP: {
          break;
        }*/
      }
  }


  bossSpeechPopDelay(speech:string){
    this.bossSpeech = speech;
    this.bossSpeechDisplay = true;
      setTimeout(() => {
        this.bossSpeechDisplay = false;
      }, this.configProviderService.getConfig().bossSpeechTimeDisplay);
  }

  bossSpeechPop(speechId:string, display:boolean){
    this.bossSpeech = this.getBossSpeechById(speechId);
    this.bossSpeechDisplay = display;
  }

  getBossSpeechById(speechId:string){
    for (let i = 0 ; i < this.bossSpeechList.length ; i++){
      if (speechId === this.bossSpeechList[i].id){
        return this.bossSpeechList[i].text;
      }
    }
    throw "Boss Speech Id not found";
  }

}
