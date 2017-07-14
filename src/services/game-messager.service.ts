import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

export enum GameState {
    GAME_STATUS_START,
    GAME_STATUS_PAUSE,
    GAME_STATUS_RESUME,
    GAME_STATUS_STOP,
    GAME_RESULT_WIN,
    GAME_RESULT_LOOSE,
}

@Injectable()
export class GameMessagerService {

    // Win / loose ...
    private gameResultSubject = new Subject<any>();
 
    sendGameResultMessage(message: string | number) {
        this.gameResultSubject.next({ text: message });
    }
 
    getGameResultMessage(): Observable<any> {
        return this.gameResultSubject.asObservable();
    }
    

    // Spell 1 used, spell 2 used ...
    private spellSubject = new Subject<any>();

    sendSpellMessage(message: string | number) {
        this.spellSubject.next({ text: message }); 
    }

    getSpellMessage(): Observable<any> {
        return this.spellSubject.asObservable();
    }

}
