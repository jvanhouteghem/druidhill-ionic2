import { Injectable } from '@angular/core';
import { GameConfig } from './../models/game-config.interface';
import { Subscription } from 'rxjs/Subscription';
import { GameMessagerService, GameState, InGameEvents } from './../services/game-messager.service';
import * as moment from 'moment/moment';

export interface GameRegister {
  healDone: number;
  gameLastStartedMoment: any;
  duration: number;
  nbDeath: number;
}

// Used to save game, game events (for example : a death, game duration etc).
@Injectable()
export class GameRegisterService {

  gameResultSubscription: Subscription;
  healsDoneSubscription: Subscription;
  inGameEventsSubscription: Subscription;
  gameRegister: GameRegister;

  subscription: Subscription;

  constructor(
    private gameMessagerService: GameMessagerService
  ) {
    // Init
    this.initGameRegister();
    // Register start and end for duration
    this.gameResultSubscription = this.gameMessagerService.getGameResultMessage().subscribe(message => { this.gameResultDispatcher(message.text) });
    // Register total heals done
    this.healsDoneSubscription = this.gameMessagerService.getHealDoneEventMessage().subscribe(message => {this.healsDoneDispatcher(message.text)});
    // Register total heals done
    this.inGameEventsSubscription = this.gameMessagerService.getInGameEventMessage().subscribe(message => {this.inGameEventsDispatcher(message.text)});
  }

  getGameRegister(){
    return this.gameRegister;
  }

  initGameRegister(){
    this.gameRegister = {healDone: 0, gameLastStartedMoment: moment().clone(), duration: 0, nbDeath: 0};
  }

  gameResultDispatcher(message) {
    switch (message) {
      case GameState.GAME_STATUS_START: {
        this.initGameRegister();
        break;
      }
      case GameState.GAME_STATUS_STOP: {
        var now = moment().clone(); //todays date
        var lastTime = this.gameRegister.gameLastStartedMoment;
        this.gameRegister.duration = this.gameRegister.duration + moment.duration(now.diff(lastTime)).asMilliseconds();
        break;
      }
      case GameState.GAME_STATUS_RESUME: {
        this.gameRegister.gameLastStartedMoment = moment().clone();
        break;
      }
      case GameState.GAME_RESULT_WIN: {
        var now = moment().clone(); //todays date
        var lastTime = this.gameRegister.gameLastStartedMoment;
        this.gameRegister.duration = this.gameRegister.duration + moment.duration(now.diff(lastTime)).asMilliseconds();
        break;
      }
      case GameState.GAME_RESULT_LOOSE: {
        var now = moment().clone(); //todays date
        var lastTime = this.gameRegister.gameLastStartedMoment;
        this.gameRegister.duration = this.gameRegister.duration + moment.duration(now.diff(lastTime)).asMilliseconds();
        break;
      }
    }
  }

  healsDoneDispatcher(message:number){
    this.gameRegister.healDone = this.gameRegister.healDone + (message * -1);
  }

  inGameEventsDispatcher(message){
    switch (message) {
      case InGameEvents.INGAME_DEATH: {
        this.gameRegister.nbDeath++;
        break;
      }
    }
  }

}
