import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  groceries: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {

      this.groceries = [
          'Bread',
          'Milk',
          'Cheese',
          'Snacks',
          'Apples',
          'Bananas',
          'Peanut Butter',
          'Chocolate',
          'Avocada',
          'Vegemite',
          'Muffins',
          'Paper towels'
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

}
