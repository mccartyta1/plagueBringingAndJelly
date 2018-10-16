import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ViewController, ModalController, NavController, AlertController } from 'ionic-angular';
import { AddModalPage } from '../add-modal/add-modal';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  groceries: any = [];
  goals: any;
  goalTypes: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, private sqlite: SQLite, private toast: Toast) {
      // this.grocery = [
      //     "The Ol' Turkey",
      //     'Big Boy Glass of Milk',
      //     'Half Pound of Sausage',
      //     'Bowl of Captain Crunch',
      //     'Squirrel'
      // ];

      this.goals = [];
      this.goalTypes = ["Calories", "Protein", "Fat", "Carbs", "Sugar" ];
  }

  ionViewDidLoad() {
  this.getData();
  }

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS groceries(rowid INTEGER PRIMARY KEY, name TEXT, calories INT, protein INT, fat INT, carbs INT, sugar INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('SELECT * FROM groceries ORDER BY rowid DESC', [])
      .then(res => {
        this.groceries = [];
        for(var i=0; i<res.rows.length; i++) {
          this.groceries.push({rowid:res.rows.item(i).rowid, name:res.rows.item(i).name, calories:res.rows.item(i).calories,
            protein:res.rows.item(i).protein, fat:res.rows.item(i).fat, carbs:res.rows.item(i).carbs, sugar:res.rows.item(i).sugar})
        }
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
   }

  addData() {
    this.navCtrl.push(AddModalPage);
  }

  deleteData(rowid) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM groceries WHERE rowid=?', [rowid])
      .then(res => {
        console.log(res);
        this.getData();
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  // editData(rowid) {
  //   this.navCtrl.push(EditModalPage, {
  //     rowid:rowid
  //   });
  // }

  addLog(){
    let prompt = this.alertCtrl.create({
        title: 'Add Food',
        message: "Enter the food you've eaten!",
        inputs: [
          { name: 'name', placeholder: 'Hamburger' },
          { name: 'calories', placeholder: 'calories', type: 'number' },
          { name: 'protein', placeholder: 'protein', type: 'number' },
          { name: 'fat', placeholder: 'fat', type: 'number' },
          { name: 'carbs', placeholder: 'carbs', type: 'number' },
          { name: 'sugar', placeholder: 'sugars', type: 'number'}
        ],
        buttons: [
            {
                text: 'Cancel'
            },
            {
                text: 'Add',
                handler: data => {
                    //this.groceries.push(data.name + " - " + data.calories);
                    this.saveData(data);
                }
            }
        ]
    });

    prompt.present();
}

saveData(data) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO groceries VALUES(NULL,?,?,?,?,?,?)',[data.name, data.calories, data.protein, data.fat, data.carbs, data.sugar])
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

addGoal(){
  let myModal = this.modalCtrl.create(AddModalPage);
  myModal.present();

  myModal.onDidDismiss(data => {
    if (data.type >= 0) {
      this.goals.push(this.goalTypes[data.type] + " : " + data.value);
    }
  });
}

}
