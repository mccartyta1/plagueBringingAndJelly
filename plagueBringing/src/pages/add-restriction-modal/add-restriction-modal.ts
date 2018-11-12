import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AddRestrictionModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-restriction-modal',
  templateUrl: 'add-restriction-modal.html',
})
export class AddRestrictionModalPage {

  userProvidedData = { type: 0, value: 0 };

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.userProvidedData.type = -1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRestrictionModalPage');
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
