import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AddModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-modal',
  templateUrl: 'add-modal.html',
})
export class AddModalPage {

  userProvidedData = { type: "Type", value: "Value"};

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.userProvidedData.type = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddModalPage');
  }

  closeModal() {
    this.viewCtrl.dismiss(this.userProvidedData);
  }

  optionsFn(type: any) {
    this.userProvidedData.type = type;
  }

  numberTextChanged(value: any) {
    this.userProvidedData.value = value;
  }

}
