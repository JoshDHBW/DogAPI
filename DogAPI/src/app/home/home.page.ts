import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {Router} from "@angular/router";
import { Platform } from '@ionic/angular';
import {StorageService, Item} from "../services/storage.service";
import { ToastController, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  newItem: Item = <Item>{}
  constructor(private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private plt: Platform,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController) {
    this.auswahl = "random";
    	this.initAllBreeds();
  }
  auswahl;
  baseURL: string = "https://dog.ceo/api/";
  loading: boolean = false;
  errorMessage;
  data;
  allbreednames = [];
  place;
  specific_breed: boolean = false;
  random: boolean = false;
  specific: boolean = false;
  path;
  breedname;
  breed;
  response_url;
  buttondisabled=false;

  initAllBreeds(){
    this.loading;
    this.loading = true;
    this.errorMessage = "";
    this.getAllBreeds()
      .subscribe(
        (response) => {                           //next() callback
          console.log('response received')
          for (var key in response.message) {
            this.allbreednames.push(key);
          }
          console.log(this.allbreednames);
        },
        (error) => {                              //error() callback
          console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        },
        () => {                                   //complete() callback
          console.error('Request completed')      //This is actually not needed 
          this.loading = false; 
        })
  }

  getDogImage(){
    this.loading;
    this.loading = true;
    this.errorMessage = "";
    if(this.specific_breed){
      this.getSpecificDog(this.place)
      .subscribe(
        (response) => {                           //next() callback
          this.response_url = response.message;
          console.log('response received');
          this.breedname= this.place;
          console.log(response);
          this.path = response.message;
        },
        (error) => {                              //error() callback
          console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        },
        () => {                                   //complete() callback
          console.error('Request completed')      //This is actually not needed 
          this.loading = false; 
        })
    }else if(!this.specific_breed){
      this.getAllDogs()
      .subscribe(
        (response) => {                           //next() callback
          this.response_url = response.message;
          console.log(response);
          var url = response.message;
          var parts = url.split('/');
          console.log(parts[4]);
          this.breedname= parts[4];
          this.breed = this.breedname;
          this.path = response.message;
        },
        (error) => {                              //error() callback
          console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        },
        () => {                                   //complete() callback
          console.error('Request completed')      //This is actually not needed 
          this.loading = false; 
        })
    }

  }
  

  getAllBreeds(): Observable<any>{
    this.data = this.http.get(this.baseURL + 'breeds/list/all')
    return this.data;
  }

  getSpecificDog(breed: string): Observable<any> {
    return this.http.get(this.baseURL + 'breed/' + breed + '/images/random')
  }
  getAllDogs(): Observable<any> {
    return this.http.get(this.baseURL + 'breeds/image/random')
  }

   json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}
breedselected(){
  console.log(this.place);
}

segmentChanged(ev: any){
  if (ev.detail.value == "specific"){
    this.specific_breed= true;
  }else if (ev.detail.value =="random"){
    this.specific_breed= false;
  }else{
    console.log("irgendwas ging schief beim segmentchanged");
  }
}
saveDogImage(){
  console.log("Berechnen wurde geklickt");
    this.buttondisabled = true;
    this.newItem.datum = new Date().toLocaleString();
    this.newItem.id = Date.now();
    this.newItem.url = this.response_url;
    this.newItem.breed = this.breedname;
    this.storageService.addItem(this.newItem);
    this.zeigeToast("Doggo wurde gespeichert!")
}
goToFavourites(){
  this.router.navigate(["ergebnis"])
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
}
 