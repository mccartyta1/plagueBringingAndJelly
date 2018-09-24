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

  userProvidedData: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.userProvidedData = "dsf";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddModalPage');
  }

  closeModal() {
    this.viewCtrl.dismiss(this.userProvidedData);
  }

}
