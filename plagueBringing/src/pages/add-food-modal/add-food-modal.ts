import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AddFoodModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-food-modal',
  templateUrl: 'add-food-modal.html',
})
export class AddFoodModalPage {

  userProvidedData = { name: "", calories: 0};
  addFat = false;
  addProtein = false;
  addCarbs = false;
  addSugar = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.userProvidedData.name = "Hmmm...";
    this.goalTypes = ["calories", "protein", "fat", "carbs", "sugar" ];
    this.selectedType = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFoodModalPage');
  }

  closeModal() {
    if (!this.addProtein) { this.userProvidedData.protein = 0; }
    if (!this.addFat) { this.userProvidedData.fat = 0; }
    if (!this.addCarbs) { this.userProvidedData.carbs = 0; }
    if (!this.addSugar) { this.userProvidedData.sugar = 0; }
    this.viewCtrl.dismiss(this.userProvidedData);
  }

  optionsFn(type: any) {
    this.selectedType = type;
  }

  numberTextChanged(value: any) {
    console.log(value);
  }

  addTextbox() {
    console.log(this.type);
    if (this.type == 1) { this.addProtein = true; }
    if (this.type == 2) { this.addFat = true; }
    if (this.type == 3) { this.addCarbs = true; }
    if (this.type == 4) { this.addSugar = true; }
  }

}
