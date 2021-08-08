import { Component} from '@angular/core';
import {StorageService, Item} from "../services/storage.service";
import {Router} from "@angular/router";
import { ToastController, AlertController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage {
  anzahlItemsPromise : any;  //Anzahl
  itemsPromise: any;
  constructor(private router: Router,
    private storageService: StorageService,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController  : NavController) { 
    
    this.storageService.getItems().then( (promiseResolved) => {

      this.itemsPromise = promiseResolved.reverse();
      try{
        this.anzahlItemsPromise = promiseResolved.length
      }catch{
        console.log("meh");
        this.anzahlItemsPromise=0;
      }
    });
  }

  //Lösche bestimmtes Item aus der Favoriteliste
  async deleteItem(item: Item){
    await this.storageService.deleteItem(item.id).then(item => {
      this.zeigeToast("Item removed");
      this.loadItems();
      this.anzahlItemsPromise = this.anzahlItemsPromise-1
    })
  }
  //Lösche alle Items aus der Favoriteliste
  async deleteAllItems(){
    await this.storageService.deleteAllItems().then(item => {
      this.zeigeToast("Item removed");
      this.loadItems();
      this.anzahlItemsPromise = 0;
    })
  }
  //Lade Items in die itemsPromise Variable
  loadItems() {
    this.storageService.getItems().then(items => {
      this.itemsPromise = items;
      console.log("itemarray wurde geladen.");
    })
  }
  //Generische Toast Funktion
  async zeigeToast(nachricht: string) {

    const ANZEIGEDAUER_SEKUNDEN = 2;

    const toast =
          await this.toastController.create({
            message: nachricht,
            duration: ANZEIGEDAUER_SEKUNDEN * 1000
          });

    await toast.present();
  }
  //Sicherheitsabfrage für Löschfunktion
  async presentAlertConfirm(event, item: Item | null, alle: Boolean) {
    event.stopPropagation();
    let xyz = "";
   //Check ob alle gelöscht werden oder nur einer, String wird dementsprechend angepasst
    if(alle){
      xyz = "all Doggos"
    }else{
      xyz = "this "+item.breed+ " Doggo"
    }

    const alert = await this.alertController.create({
      header: 'Delete '+xyz+'?',
      message: '<strong> Warning: You can´t revive '+ xyz + ' from deletion.</strong>',
      buttons: [
        {
          text: 'Confirm',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Okay');
            if(alle){
              this.deleteAllItems();
            }else{
              this.deleteItem(item);
            }
          }
        }, {
          text: 'Cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });
    await alert.present();
  }
  presentHelp(){
    this.router.navigate(["help"])
  }
  stopPropagation(event){
    event.stopPropagation();
  }
}
