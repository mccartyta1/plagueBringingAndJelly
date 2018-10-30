import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFoodModalPage } from './add-food-modal';

@NgModule({
  declarations: [
    AddFoodModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFoodModalPage),
  ],
})
export class AddFoodModalPageModule {}
