import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventListPage } from './event-list';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    EventListPage,
  ],
  imports: [
    IonicPageModule.forChild(EventListPage),
    HttpClientModule
  ],
})
export class EventListPageModule {}
