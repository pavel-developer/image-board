import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './views/board/board.component';
import { ImagesListComponent } from './components/images-list/images-list.component';
import {NgbModalModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BoardsService} from "./services/boards.service";
import {ImagesService} from "./services/images.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ImagesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbModalModule,
    HttpClientModule
  ],
  providers: [
    BoardsService,
    ImagesService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
