import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleFormPage } from './schedule-form';

@NgModule({
  declarations: [
    ScheduleFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleFormPage),
  ],
})
export class ScheduleFormPageModule {}
