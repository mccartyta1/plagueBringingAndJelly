import { Component } from '@angular/core';
import { ViewController, ModalController, NavController, AlertController, Platform } from 'ionic-angular';
import { AddModalPage } from '../add-modal/add-modal';
import { AddFoodModalPage } from '../add-food-modal/add-food-modal';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  groceries: any = [];
  goals: any;
  restrictions: any;
  goalTypes: any;
  notification: boolean;
  shownGrocery: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, 
    private sqlite: SQLite, private toast: Toast, private localNotifications: LocalNotifications, private platform: Platform) {
      this.goalTypes = ["calories", "protein", "fat", "carbs", "sugar" ];
      this.groceries = [
          {name: "Turkey Sandwich", calories: 200, protein: 15, carbs: 40, fat: 20, sugar: 10, date: this.getFormattedDate()},
          {name: "Glass of Milk", calories: 10, sugar: 20, carbs: 2, fat: 8, protein: 6, date: this.getFormattedDate()}
      ];
      // this.goals = [
      //     {goalOrRestriction: goal, macronutrient: 'calories', amount: 2000, protein: 10}];

      this.goals = {  };
      this.restrictions = {calories: 6000};
      
      this.platform.ready().then((rdy) => {
        this.localNotifications.on('click').subscribe(notification => {
          let json = JSON.parse(notification.data);

          let alert = this.alertCtrl.create({
            title: notification.title,
            subTitle: json.mydata
          });
        alert.present();
        });
      });

      this.notification = false;

      this.shownGrocery = null;
  }

onViewDidLoad() {
  this.getData();
  }

ionViewWillEnter() {
  this.getData();
  this.scheduleNotification();
}

getData() {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    // db.executeSql('DROP TABLE IF EXISTS groceries', [])
    // .catch(e => console.log('ERROR DROPPING TABLE', e));

    db.executeSql('DELETE FROM groceries WHERE date!=?', [this.getFormattedDate()])
    .catch(e => console.log('ERROR DELETING TABLE', JSON.stringify(e)));

    db.executeSql('CREATE TABLE IF NOT EXISTS groceries(rowid INTEGER PRIMARY KEY, name TEXT, calories INT, protein INT, fat INT, carbs INT, sugar INT, date TEXT)', [])
    .catch(e => console.log('-----error is: ------ ', e));


    // db.executeSql('CREATE TABLE IF NOT EXISTS goals(rowid INTEGER PRIMARY KEY, macronutrient TEXT, amount INT, date TEXT)', [])
    // .catch(e => console.log('-----error from goals is: ------ ', e));
    // db.executeSql('SELECT * FROM goals', [])
    // .then(res => {
    //   for(var i=0; i<res.rows.length; i++) {
    //     console.log('ITEMS IN FOR LOOP: ', res.rows.item(i));
    //     // this.goals.push({rowid:res.rows.item(i).rowid,
    //     //  macronutrient:res.rows.item(i).macronutrient, amount:res.rows.item(i).amount,
    //     //  date:res.rows.item(i).date})
    //   }
    // }).catch(e => console.log('ERROR WITH SELECT FROM GOALS', e));


    db.executeSql('SELECT * FROM groceries ORDER BY rowid DESC', [])
    .then(res => {
      for(var i=0; i<res.rows.length; i++) {
        this.groceries.push({rowid:res.rows.item(i).rowid, name:res.rows.item(i).name, calories:res.rows.item(i).calories,
          protein:res.rows.item(i).protein, fat:res.rows.item(i).fat, carbs:res.rows.item(i).carbs, 
          sugar:res.rows.item(i).sugar, date:res.rows.item(i).date})
      }
    }).catch(e => console.log(e));
  }).catch(e => console.log(e));
 }

 getFormattedDate() {
  let now = new Date();
  return now.toString().substring(0,15);
 }

 deleteData() {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('DROP TABLE IF EXISTS groceries', [])
    .then(res => {
      console.log(res);
      this.onViewDidLoad();
    })
    .catch(e => console.log(e));
  }).catch(e => console.log(e));
}

addFoodModal() {
  let myModal = this.modalCtrl.create(AddFoodModalPage);
  myModal.present();

  myModal.onDidDismiss(data => {
    if (data.calories == 0 || data.name == "") { return; };
    var object = {name: '', calories: 0, protein: 0, carbs: 0, sugar: 0, fat: 0};
    object.name = data.name;
    object.calories = +data.calories;
    if (data.fat != 0) object.fat = +data.fat;
    if (data.protein != 0) object.protein = +data.protein;
    if (data.carbs != 0) object.carbs = +data.carbs;
    if (data.sugar != 0) object.sugar = +data.sugar;

    let date = this.getFormattedDate();

    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO groceries VALUES(NULL,?,?,?,?,?,?,?)',[data.name, 
        data.calories, data.protein, data.fat, data.carbs, data.sugar, date])
        .then(res => {
          //console.log(res);
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

  });
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

getSumOfNutrient(nutrient: string) {
  var sum = 0;
  for (let entry of this.groceries) {
    if (!(nutrient in entry)) continue;
    sum += entry[nutrient];
  }
  return sum;
}

caloriesForDay() {
  return this.getSumOfNutrient("calories");
}

getArrayOfGoals() {
  var goalsMet = this.metGoals();
  var totalGoals = this.getTotalGoals();

  var array = [];
  for (let i = 0; i < goalsMet; i++) {
    array.push(true);
  }
  for (let j = goalsMet; j < totalGoals; j++) {
    array.push(false);
  }
  return array;
}

getArrayOfRestrictions() {
  var resMet = this.metRestrictions();
  var totalRes = this.getTotalRestrictions();
  var array = [];
  for (let i = 0; i < resMet; i++) {
    array.push(true);
  }
  for (let j = resMet; j < totalRes; j++) {
    array.push(false);
  }
  return array;
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
  var display = food.name + " - " + food.date;
  return display;
}

showCalories(food: any) {
  if (!food.calories) food.calories == 0;
  var calories = "Calories: " + food.calories;
  return calories;
}
showProtein(food: any) {
  if (food.protein == undefined) food.protein == 0;
  var protein = "Protein: " + food.protein;
  return protein;
}
showFat(food: any) {
  if (!food.fat) food.fat == 0;
  var fat = "Fat: " + food.protein;
  return fat;
}
showCarbs(food: any) {
  if (!food.carbs) food.carbs == 0;
  var carbs = "Carbs: " + food.carbs;
  return carbs;
}
showSugar(food: any) {
  if (!food.sugar) food.sugar == 0;
  var sugar = "Sugar: " + food.sugar;
  return sugar;
}

toggleGrocery(grocery: any) {
    if (this.isGroceryShown(grocery)) {
      this.shownGrocery = null;
    } else {
      this.shownGrocery = grocery;
    }
  };

isGroceryShown(grocery: any) {
  console.log('SHOWN GROCERY: ', this.shownGrocery);
  console.log('GROCERY PASSED IN: ', grocery);
  return this.shownGrocery === grocery;
};

// <ion-item *ngFor="let grocery of groceries">
//         {{getFoodDisplayForFood(grocery)}}
//         </ion-item>


scheduleImmediateNotification() {
  var index = Math.floor(Math.random()*(3-0+1)+0);
  let message = 'A ' + this.groceries[index].name + ' would get you' + this.groceries[index].calories + ' calories closer to your goal!';

  this.localNotifications.schedule({
    id: 1,
    title: 'Have you eaten food today?!',
    text: message,
    trigger: { at: new Date(new Date().getTime() + 5 * 1000) },
    data: { mydata: 'My hidden message is this' }
  });
}

scheduleNotification() {
  var d = new Date();
  d.setHours(16,0o0,0,0);

  if(d.getHours() >= 1) {
    d.setDate(d.getDate() + 1);
  };

  let message = this.groceries[0].name + 'would get you closer to your goal!';

  this.localNotifications.schedule({
    id: 1,
    title: 'Have you eaten food today?!',
    text: message,
    trigger: { at: d },
    data: { mydata: 'My hidden message is this' }
  });
}

}
