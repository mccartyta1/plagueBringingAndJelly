import { Component } from '@angular/core';
import { ViewController, ModalController, NavController, AlertController } from 'ionic-angular';
import { AddModalPage } from '../add-modal/add-modal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  groceries: any;
  goals: any;
  goalTypes: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController) {
      this.groceries = [
          {name: "The Ol' Turkey", calories: 4000},
          {name: "Glass of Milk", calories: 200},
          {name: "Fried Squirrel", calories: 600},
          {name: "Glass of Milk", calories: 200},
          {name: "Boiled Squirrel", calories: 600}
      ];

      this.goals = [];
      this.goalTypes = ["Calories", "Protein", "Fat", "Carbs", "Sugar" ];
  }

  addNote(){
    let prompt = this.alertCtrl.create({
        title: 'Add Food',
        message: "Enter the food's name and calories!",
        inputs: [{
            name: 'name',
            placeholder: "Hamburger"
        }, { name: 'calories', placeholder: '100', type: "number"}],
        buttons: [
            {
                text: 'Cancel'
            },
            {
                text: 'Add',
                handler: data => {
                    this.groceries.push({name: data.name, calories: +data.calories});
                }
            }
        ]
    });

    prompt.present();
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

caloriesForDay() {
  var sum = 0;
  for (let entry of this.groceries) {
    sum += entry.calories;
  }
  return sum;
}

}
