import { Component } from '@angular/core';
import { ViewController, ModalController, NavController, AlertController } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

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

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, private localNotifications: LocalNotifications) {
    this.groceries = [
      { name: "The Ol' Turkey", calories: 4000, protein: 15 },
      { name: "Glass of Milk", calories: 200, sugar: 20 },
      { name: "Fried Squirrel", calories: 600 },
      { name: "Glass of Milk", calories: 200 },
      { name: "Boiled Squirrel", calories: 600 }
    ];

    this.goals = { calories: 2000 };
    this.restrictions = { calories: 6000 };
    this.goalTypes = ["calories", "protein", "fat", "carbs", "sugar"];
  }

  addNote() {
    let prompt = this.alertCtrl.create({
      title: 'Add Food',
      message: "Enter the food's name and calories!",
      inputs: [{
        name: 'name',
        placeholder: "Hamburger"
      }, { name: 'calories', placeholder: '100', type: "number" }],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add',
          handler: data => {
            this.groceries.push({ name: data.name, calories: +data.calories });
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

          this.setGoalNotification();
        } else {
          this.restrictions[this.goalTypes[data.type]] = data.value;
        }
      }
    });
  }
  addGoal() {
    this.addModal(true);
  }

  addRestriction() {
    this.addModal(false);
  }

  // Try to create a goals-based notification
  // Based on https://stackoverflow.com/q/49860955 and https://ionicframework.com/docs/native/local-notifications/
  setGoalNotification() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();

    let notifyTime = new Date(year, month, day, 16, 0);

    this.localNotifications.schedule([
      {
        id: 1,
        title: 'My first notification',
        text: "It's 4 pm, eat something!",
        trigger: { firstAt: new Date(notifyTime) },
        data: { "id": 1, "name": "Name for testing" }
      }
    ]);
    // TODO: customize the notification

    //firstAt: new Date(notifyTime),
    //every: "day",
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

  metGoals() {
    var goalsMet = 0;
    for (let entry of this.goalTypes) {
      if (!(entry in this.goals)) continue;
      if (this.getSumOfNutrient(entry) >= this.goals[entry]) goalsMet++
    }
    return goalsMet;
  }

  metRestrictions() {
    var goalsMet = 0;
    for (let entry of this.goalTypes) {
      if (!(entry in this.restrictions)) continue;
      if (this.getSumOfNutrient(entry) <= this.restrictions[entry]) goalsMet++
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
    if (food.name == undefined || food.calories == undefined) return "ew";
    var display = food.name + " -";
    for (let entry of this.goalTypes) {
      if (!(entry in food)) continue;
      display = display + " " + entry + ": " + food[entry];
    }
    return display;
  }

}
