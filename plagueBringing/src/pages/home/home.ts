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
        title: 'Add Note',
        inputs: [{
            name: 'title'
        }],
        buttons: [
            {
                text: 'Cancel'
            },
            {
                text: 'Add',
                handler: data => {
                    this.groceries.push(data);
                }
            }
        ]
    });

    prompt.present();
}

}
