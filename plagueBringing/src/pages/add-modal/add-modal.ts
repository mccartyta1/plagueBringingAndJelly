import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

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

  userProvidedData = { type: 0, value: 0};
  data = { name:"", calories:0, protein:0, fat:0, carbs:0, sugar:0 };


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private sqlite: SQLite, private toast: Toast) {
    this.userProvidedData.type = -1;
  }

  saveData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO groceries VALUES(NULL,?,?,?,?,?,?)',[this.data.name, this.data.calories, this.data.protein, this.data.fat, this.data.carbs, this.data.sugar])
        .then(res => {
          console.log(res);
          this.toast.show('Data saved', '5000', 'center').subscribe(
            toast => {
              this.navCtrl.popToRoot();
            }
          );
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
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
