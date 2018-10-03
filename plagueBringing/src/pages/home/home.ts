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
  restrictions: any;
  goalTypes: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController) {
      this.groceries = [
          {name: "The Ol' Turkey", calories: 4000, protein: 15},
          {name: "Glass of Milk", calories: 200, sugar: 20},
          {name: "Fried Squirrel", calories: 600},
          {name: "Glass of Milk", calories: 200},
          {name: "Boiled Squirrel", calories: 600}
      ];

      this.goals = {calories: 2000};
      this.restrictions = {calories: 6000};
      this.goalTypes = ["calories", "protein", "fat", "carbs", "sugar" ];
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
      this.goals[data.type] = data.value;
    }
  });
}

getSumOfNutrient(nutrient: String) {
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

metGoals() {
  var goalsMet = 0;
  for (let entry of this.goalTypes) {
    if (!(entry in this.goals)) continue;
    console.log(entry);
    if (this.getSumOfNutrient(entry) >= this.goals[entry] ) goalsMet++
  }
  return goalsMet;
}

metRestrictions() {
  var goalsMet = 0;
  for (let entry of this.goalTypes) {
    if (!(entry in this.restrictions)) continue;
    console.log(entry);
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

}
