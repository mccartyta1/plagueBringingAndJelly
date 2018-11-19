import { Component } from '@angular/core';
import { ViewController, ModalController, NavController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { AddModalPage } from '../add-modal/add-modal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  groceries: any = [];
  goals: any;
  restrictions: any;
  goalTypes: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, private sqlite: SQLite, private toast: Toast) {
      this.groceries = [
          {name: "The Ol' Turkey", calories: 4000, protein: 25},
          {name: "Glass of Milk", calories: 200, sugar: 20},
          {name: "Fried Squirrel", calories: 600},
          {name: "Glass of Milk", calories: 200},
          {name: "Boiled Squirrel", calories: 600}
      ];

      this.goals = {calories: 2000};
      this.restrictions = {calories: 6000};
      this.goalTypes = ["calories", "protein", "fat", "carbs", "sugar" ];
  }

  onViewDidLoad() {
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
      .then(res => console.log('Executed SQL - Woohoo!!'))
      .catch(e => console.log('-----error is: ------ ', e));
      db.executeSql('SELECT * FROM groceries ORDER BY rowid DESC', [])
      .then(res => {
        // this.groceries = [
        //     {name: "The Ol' Turkey", calories: 4000, protein: 15},
        //     {name: "Glass of Milk", calories: 200, sugar: 20},
        //     {name: "Fried Squirrel", calories: 600},
        //     {name: "Glass of Milk", calories: 200},
        //     {name: "Boiled Squirrel", calories: 600}
        // ];
        for(var i=0; i<res.rows.length; i++) {
          this.groceries.push({rowid:res.rows.item(i).rowid, name:res.rows.item(i).name, calories:res.rows.item(i).calories,
            protein:res.rows.item(i).protein, fat:res.rows.item(i).fat, carbs:res.rows.item(i).carbs, sugar:res.rows.item(i).sugar})
        }
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
   }

  addNote(){
    let prompt = this.alertCtrl.create({
        title: 'Add Food',
        message: "Enter the food's name and calories! All other fields are optional.",
        inputs: [
            { name: 'name', placeholder: "Name of Food !!!*" }, 
            { name: 'calories', placeholder: 'Calories*', type: "number"},
            { name: 'protein', placeholder: 'Protein', type: "number"},
            { name: 'fat', placeholder: 'Fat', type: "number"},
            { name: 'carbs', placeholder: 'Carbohydrates', type: "number"},
            { name: 'sugar', placeholder: 'Sugar', type: "number"}

        ],
        buttons: [
            {
                text: 'Cancel'
            },
            {
                text: 'Add',
                handler: data => {
                    //this.groceries.push({name: data.name, calories: data.calories});
                  this.sqlite.create({
                      name: 'ionicdb.db',
                      location: 'default'
                    }).then((db: SQLiteObject) => {
                      db.executeSql('INSERT INTO groceries VALUES(NULL,?,?,?,?,?,?)',[data.name, 
                        data.calories, data.protein, data.fat, data.carbs, data.sugar])
                        .then(res => {
                          console.log(res);
                          this.toast.show('Data saved', '5000', 'center').subscribe(
                            toast => {
                              this.navCtrl.popToRoot();
                            }
                          );
                          this.getData();
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
            }
        ]
    });

    prompt.present();
}

addModal(isGoal: boolean) {
  let myModal = this.modalCtrl.create(AddModalPage);
  myModal.present();

  myModal.onDidDismiss(data => {
    if (data.type >= 0) {
      if (isGoal) {
        this.goals[this.goalTypes[data.type]] = data.value;
      } else {
        this.restrictions[this.goalTypes[data.type]] = data.value;
      }
    }
  });
}
addGoal(){
  this.addModal(true);
}

addRestriction() {
  this.addModal(false);
}

getSumOfNutrient(nutrient: String) {
  var sum = 0;
  for (let entry of this.groceries) {
    if (!(String(nutrient) in entry)) continue;
    //sum += entry[nutrient];
  }
  return sum;
}

caloriesForDay() {
  return this.getSumOfNutrient("calories");
}

metGoals() {
  var goalsMet = 0;
  for (let entry of this.goalTypes) {
    if (!(entry in this.goals)) continue;
    if (this.getSumOfNutrient(entry) >= this.goals[entry] ) goalsMet++
  }
  return goalsMet;
}

metRestrictions() {
  var goalsMet = 0;
  for (let entry of this.goalTypes) {
    if (!(entry in this.restrictions)) continue;
    if (this.getSumOfNutrient(entry) <= this.restrictions[entry] ) goalsMet++
  }
  return goalsMet;
}

getTotalGoals() {
  return Object.keys(this.goals).length;
}

getTotalRestrictions() {
  return Object.keys(this.restrictions).length;
}

getFoodDisplayForFood(food: any) {
  if (food.name==undefined || food.calories==undefined) return "ew";
  var display = food.name + " -";
  for (let entry of this.goalTypes) {
    if (!(entry in food)) continue;
    display = display + " " + entry + ": " + food[entry];
  }
  return display;
}

}
