import { Component } from '@angular/core';
import { ViewController, ModalController, NavController, AlertController } from 'ionic-angular';
import { AddModalPage } from '../add-modal/add-modal';
import { AddFoodModalPage } from '../add-food-modal/add-food-modal';


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

addFoodModal() {
  let myModal = this.modalCtrl.create(AddFoodModalPage);
  myModal.present();

  myModal.onDidDismiss(data => {
    if (data.calories == 0 || data.name == "") { return; };

    var object = {};
    object.name = data.name;
    object.calories = +data.calories;
    if (data.fat != 0) object.fat = +data.fat;
    if (data.protein != 0) object.protein = +data.protein;
    if (data.carbs != 0) object.carbs = +data.carbs;
    if (data.sugar != 0) object.sugar = +data.sugar;

    this.groceries.push(object);
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
  console.log(this.goals);
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
