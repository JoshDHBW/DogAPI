import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage {
  hideMe: boolean;
  FAQS = [
    {id: 1, 
    question:'What´s the DOG-API App?',
    answer:'The DOG-API App allows you to view pictures of your favourite dog breeds!',
    bool:false,
    },
    {id: 2, 
      question:'How can i view the pictures?',
      answer:'  You can choose between viewing pictures of random breeds or a specific one. Just choose your prefered option through the selection bar on top of the home screen.',  
      bool:false,},
    {id: 3, 
      question:'How do I save a picture?',
      answer:'You can save pictures by clicking on the "Save Dog" Button. If it successfully saved the picture, you will see a toast pop up at the bottom of your screen.',
      bool:false},
      {id: 4, 
        question:'Where are the dog pictures from?',
        answer:'The dog pictures are submitted by private people to the website https://dog.ceo/dog-api/',
        bool:false,},
  ];
  
  constructor() { }

  showDetails(item: Object){
    this.hideMe = true;
  }
}
