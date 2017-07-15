import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

export enum GameState {
    GAME_STATUS_START,
    GAME_STATUS_STOP,
    GAME_STATUS_RESUME,
    GAME_RESULT_WIN,
    GAME_RESULT_LOOSE,
    GAME_STATUS_CLOSE
}

export enum InGameEvents{
    INGAME_DEATH
}

@Injectable()
export class GameMessagerService{

    // Win / loose ...
    private gameResultSubject = new Subject<any>();
    // Spell 1 used, spell 2 used ...
    private spellSubject = new Subject<any>();
    // A Death, game duration etc
    private inGameEventsSubject = new Subject<any>();
    // Heal done (after previous filters)
    private healDoneEventsSubject = new Subject<any>();

    constructor(){
        this.gameResultSubject = new Subject<any>();
        this.spellSubject = new Subject<any>();
    }

    cleanMessages(){
        this.gameResultSubject = new Subject<any>();
        this.spellSubject = new Subject<any>();
        this.inGameEventsSubject = new Subject<any>();
        this.healDoneEventsSubject = new Subject<any>();
    }

 
    sendGameResultMessage(message: string | number) {
        this.gameResultSubject.next({ text: message });
    }
    getGameResultMessage(): Observable<any> {
        return this.gameResultSubject.asObservable();
    }


    sendSpellMessage(message: string | number) {
        this.spellSubject.next({ text: message }); 
    }
    getSpellMessage(): Observable<any> {
        return this.spellSubject.asObservable();
    }


    sendInGameEventMessage(message: string | number) {
        this.inGameEventsSubject.next({ text: message }); 
    }
    getInGameEventMessage(): Observable<any> {
        return this.inGameEventsSubject.asObservable();
    }


    sendHealDoneEventMessage(message: string | number) {
        this.healDoneEventsSubject.next({ text: message }); 
    }

    getHealDoneEventMessage(): Observable<any> {
        return this.healDoneEventsSubject.asObservable();
    }

}
