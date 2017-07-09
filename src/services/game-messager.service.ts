import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GameMessagerService {

    private subject = new Subject<any>();
 
    sendMessage(message: string | number) {
        this.subject.next({ text: message });
    }
 
    clearMessage() {
        this.subject.next();
    }
 
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

}
