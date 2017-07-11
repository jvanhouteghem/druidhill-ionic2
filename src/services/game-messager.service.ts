import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GameMessagerService {

    private gameResultSubject = new Subject<any>();
 
    sendMessage(message: string | number) {
        this.gameResultSubject.next({ text: message });
    }
 
    clearMessage() {
        this.gameResultSubject.next();
    }
 
    getGameResultMessage(): Observable<any> {
        return this.gameResultSubject.asObservable();
    }

}
