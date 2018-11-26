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

  userProvidedData = { name: "", calories: 0, protein: 0, fat: 0, carbs: 0, sugar: 0};
  addFat = false;
  addProtein = false;
  addCarbs = false;
  addSugar = false;
  goalTypes: any;
  selectedType: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.userProvidedData.name = "Burger";
    this.goalTypes = ["calories", "protein", "fat", "carbs", "sugar" ];
    this.selectedType = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFoodModalPage');
  }

  closeModal() {
    if (!(this.userProvidedData.protein > 0)) { this.userProvidedData.protein = 0; }
    if (!(this.userProvidedData.fat > 0)) { this.userProvidedData.fat = 0; }
    if (!(this.userProvidedData.carbs > 0)) { this.userProvidedData.carbs = 0; }
    if (!(this.userProvidedData.sugar > 0)) { this.userProvidedData.sugar = 0; }
    this.viewCtrl.dismiss(this.userProvidedData);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  optionsFn(type: any) {
    this.selectedType = type;
  }

  numberTextChanged(value: any) {
    console.log(value);
  }

  addTextbox() {
    if (this.selectedType == 1) { this.addProtein = true; }
    if (this.selectedType == 2) { this.addFat = true; }
    if (this.selectedType == 3) { this.addCarbs = true; }
    if (this.selectedType == 4) { this.addSugar = true; }
  }

}
