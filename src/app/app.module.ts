import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AppComponent } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { GridPage } from '../pages/grid/grid';
import { ResumeGamePage } from '../pages/resumegame/resumegame';

import {RaidProviderService} from './../services/raid-provider.service';
import {RaidDmgService} from './../services/raid-dmg.service';
import {BossProviderService} from './../services/boss-provider.service';
import {ConfigProviderService} from './../services/config-provider.service';
import {PlayerProviderService} from './../services/player-provider.service';
import {SpellProviderService} from './../services/spell-provider.service';
import {GameProviderService} from './../services/game-provider.service';

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
    GridPage,
    ResumeGamePage,
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
    GridPage,
    ResumeGamePage
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
    GameProviderService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
