import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {}

  closeModal() {
    this.viewCtrl.dismiss();
  }

  slides = [
    {
      title: "Bienvenue sur le tutoriel!",
      description: "DruidHill (DH) est un jeu d'action refléxion dans lequel vous aller devoir garder en vie un groupe d'aventurier pendant leur combats contre des boss redoutables.",
      image: "assets/images/book.svg",
    },
    {
      title: "But du jeu ?",
      description: "Vous allez affronter de nombreux boss ayant chacun un panel de techniques aussi variées que dangereuse. Pour gagner vous devez garder suffisament longtemps votre raid en vie pour qu'il puisse tuer le boss.",
      image: "assets/images/boss10.svg",
    },
    {
      title: "Déroulement d'une partie ?",
      description: "Au cours de la partie vous allez devoir utiliser de nombreux sort de soin. Ces sorts coûtent du <strong>mana</strong> et ont chacun <strong>un temps de recharge</strong>.",
      image: "assets/images/heartplayer11.svg",
    },{
      title: "Comment jouer ?",
      description: "Chacun de vos sort est affecté à une commande ...",
      image: "assets/images/heartplayer11.svg",
    }
  ];

}
