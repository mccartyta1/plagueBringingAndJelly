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

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController) {
      this.groceries = [
          "The Ol' Turkey",
          'Big Boy Glass of Milk',
          'Half Pound of Sausage',
          'Bowl of Captain Crunch',
          'Squirrel'
      ];

      this.goals = [
        2000,
        0,
        0,
        0
      ];
  }

  addNote(){
    let prompt = this.alertCtrl.create({
        title: 'Add Food',
        message: "Enter the food's name and calories!",
        inputs: [{
            name: 'name',
            placeholder: "Hamburger"
        }, { name: 'calories', placeholder: "9001", type: "number"}],
        buttons: [
            {
                text: 'Cancel'
            },
            {
                text: 'Add',
                handler: data => {
                    this.groceries.push(data.name + " - " + data.calories);
                }
            }
        ]
    });

    prompt.present();
}

addGoal(){
  let myModal = this.modalCtrl.create(AddModalPage);
  myModal.present(myModal);

  myModal.onDidDismiss(data => {
    this.goals.push(data.userName);
  });
}

}
