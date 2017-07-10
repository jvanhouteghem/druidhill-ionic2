import { Character } from './character';
import * as moment from 'moment/moment';

export class Player extends Character {

    private baseMana: number;
    private currentMana: number;

    // Global cooldown
    // When use a spell it compare lastTimeSpellUsed and currentTime then if coooldown delta is ok register currentTime in lastTimeSpellUsed
    private lastTimeSpellUsed: any; // timestamp

    constructor(name: string, baseHealth: number, baseMana: number) {
        super(name, baseHealth);
        this.baseMana = baseMana;
        this.currentMana = this.baseMana;

        this.lastTimeSpellUsed = moment().startOf('day');
    }

    // negative to reduce current mana / positive to increase current mana
    updateMana(mana) {
        if (this.currentMana + mana > this.baseMana) {
            this.currentMana = this.baseMana;
        } else {
            this.currentMana += mana;
        }
    }

    getCurrentMana() {
        return this.currentMana;
    }

    getBaseMana() {
        return this.baseMana;
    }

    getCurrentManaInPercent() {
        return this.currentMana / this.baseMana * 100;
    }

    isDead() {
        if ((this.getCurrentHealth() <= 0)) {
            return true;
        } else {
            return false;
        }
    }

    getRegenManaPerSecond() {
        return 500;
    }


    isEnoughMana(manaCost:number){
        return this.getCurrentMana() >= Math.abs(manaCost) ? true : false;
    }

}