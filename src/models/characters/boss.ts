import { Character } from './character';
import { Hero } from './hero';

export class Boss extends Character {

    private difficulty: string;

    constructor(name: string, baseHealth: number, difficulty: string) {
        super(name, baseHealth);
        this.difficulty = difficulty;
    }

    getDifficulty() {
        return this.difficulty;
    }

    setFocus(hero: Hero) {
        hero.setIsFocusByBoss(true);
        hero.setTankValue(true); // If tank is dead then the next target become the tank even if she is weak
    }

    getAttacks(difficulty) {
        let attacks = null;
        switch (difficulty) {
            case "easy":
                attacks = this.attacks().easy;
                break;
            case "normal":
                attacks = this.attacks().normal;
                break;
            case "hard":
                attacks = this.attacks().hard;
                break;
        }
        return attacks;
    }

    attacks() {
        return {
            easy: [
                {
                    //id: "001", // le type d'attaque, exemple simple damage pour 001
                    type: ["N"], // N normal, D débuff, 
                    target: ["T", "R"], // T tank, R Random, P Player, L Lower, H Higher, ZC zone cross
                    damages: 2000,
                    period: 1000,
                    addFocus: true
                }],
            normal: [
                {
                    type: ["N"],
                    target: ["T"], // T tank, R Random, P Player, L Lower, H Higher
                    damages: 500, // todo replace max min [500, 2500] and add random
                    period: 500,
                    addFocus: true
                    // todo add critick chances
                },
                {
                    type: ["N"],
                    target: ["R"],
                    damages: 1000,
                    period: 1000,
                    addFocus: false
                }],
            hard: [
                {
                    type: ["N"],
                    target: ["T"],
                    damages: 500,
                    period: 500,
                    addFocus: true
                    // todo add critick chances
                },
                {
                    type: ["N"],
                    target: ["R"],
                    damages: 1000,
                    period: 1000,
                    addFocus: false
                },
                {
                    type: ["N"],
                    target: ["R"],
                    damages: 7000,
                    period: 3500,
                    addFocus: false
                },
                {
                    type: ["N"],
                    target: ["R"], // T tank, R Random, P Player, L Lower, H Higher
                    damages: 250,
                    period: 250,
                    addFocus: false
                }
            ]
        }
    }

    /*getSpeech(){
        return [
            {id: 'face', text:'Ne touchez pas à mon visage !'},
            {id: 'resume', text: 'Déjà de retour ? Je vous ai gardé quelques baffes en réserve.'},
            {id: 'greetings', text: 'Salut bande de canailles ! Alors .. Prêt à jouer ?'}
        ];
    }*/

}