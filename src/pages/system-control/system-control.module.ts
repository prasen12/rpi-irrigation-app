import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SystemControlPage } from './system-control';

@NgModule({
  declarations: [
    SystemControlPage,
  ],
  imports: [
    IonicPageModule.forChild(SystemControlPage),
  ],
})
export class SystemControlPageModule {}
