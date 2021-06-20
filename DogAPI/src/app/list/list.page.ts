import { Component, OnInit } from '@angular/core';
import {StorageService, Item} from "../services/storage.service";
import {Router} from "@angular/router";
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons/faTwitterSquare';
import { faPinterest } from '@fortawesome/free-brands-svg-icons/faPinterest';


@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  fbIcon = faFacebookSquare;
  pinIcon = faPinterest;
  tweetIcon = faTwitterSquare;
  private anzahlBerechnungenPromise : any;
  private itemsPromise: any;
  constructor(private router: Router,
    private storageService: StorageService,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController  : NavController) { 
    
    this.storageService.getItems().then( (promiseResolved) => {

      this.itemsPromise = promiseResolved.reverse();
      try{
        this.anzahlBerechnungenPromise = promiseResolved.length
      }catch{
        console.log("meh");
        this.anzahlBerechnungenPromise=0;
      }
    });
  }

  ngOnInit() {
  }

  async deleteItem(item: Item){
    await this.storageService.deleteItem(item.id).then(item => {
      this.zeigeToast("Item removed");
      this.loadItems();
      this.anzahlBerechnungenPromise = this.anzahlBerechnungenPromise-1
    })
  }
  async deleteAllItems(){
    await this.storageService.deleteAllItems().then(item => {
      this.zeigeToast("Item removed");
      this.loadItems();
      this.anzahlBerechnungenPromise = 0;
    })
  }
  loadItems() {
    this.storageService.getItems().then(items => {
      this.itemsPromise = items;
      console.log("itemarray wurde geladen.");
    })
  }
  async zeigeToast(nachricht: string) {

    const ANZEIGEDAUER_SEKUNDEN = 2;

    const toast =
          await this.toastController.create({
            message: nachricht,
            duration: ANZEIGEDAUER_SEKUNDEN * 1000
          });

    await toast.present();
  }
  async presentAlertConfirm(event, item: Item, alle: Boolean) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Ladezeit(en) löschen?',
      message: '<strong> Achtung: Diese Aktion lässt sich nicht rückgängig machen.</strong>',
      buttons: [
        {
          text: 'Bestätigen',
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
          text: 'Abbrechen',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }
  showDetails(item: Item){
    
  }
}
