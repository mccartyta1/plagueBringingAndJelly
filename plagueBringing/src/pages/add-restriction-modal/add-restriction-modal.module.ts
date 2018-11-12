import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddRestrictionModalPage } from './add-restriction-modal';

@NgModule({
  declarations: [
    AddRestrictionModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddRestrictionModalPage),
  ],
})
export class AddRestrictionModalPageModule { }
