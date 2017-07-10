import { Injectable } from '@angular/core';
import { GameConfig } from './../models/game-config.interface';

@Injectable()
export class ConfigProviderService {

  private gameConfig:GameConfig;

  constructor() {
    this.gameConfig = {
      globalCooldown: 100
    }
  }

  getConfig(){
    return this.gameConfig;
  }

}
