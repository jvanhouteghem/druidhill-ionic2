import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AppComponent } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { GridPage } from '../pages/grid/grid';
import { ResumeGamePage } from '../pages/resumegame/resumegame';
import { EndGamePage } from '../pages/endgame/endgame';
import { BossInformationPage } from '../pages/bossinformation/bossinformation';

import {RaidProviderService} from './../services/raid-provider.service';
import {RaidDmgService} from './../services/raid-dmg.service';
import {BossProviderService} from './../services/boss-provider.service';
import {ConfigProviderService} from './../services/config-provider.service';
import {PlayerProviderService} from './../services/player-provider.service';
import {SpellProviderService} from './../services/spell-provider.service';
import {GameMessagerService} from './../services/game-messager.service';
import {GameRegisterService} from './../services/game-register.service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BossBarsComponent } from '../components/boss-bars/boss-bars';
import { PlayerBarsComponent } from '../components/player-bars/player-bars';
import { SpellIconsComponent } from '../components/spell-icons/spell-icons.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    ListPage,
    TutorialPage,
    GridPage,
    ResumeGamePage,
    EndGamePage,
    BossInformationPage,
    BossBarsComponent,
    PlayerBarsComponent,
    SpellIconsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    HomePage,
    ListPage,
    TutorialPage,
    GridPage,
    ResumeGamePage,
    EndGamePage,
    BossInformationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RaidProviderService,
    RaidDmgService,
    BossProviderService,
    ConfigProviderService,
    PlayerProviderService,
    SpellProviderService, 
    GameMessagerService,
    GameRegisterService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
