import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
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
  newItem: Item = <Item>{}  // Neues Storage Item wird erstellt
  // Konstruktor-Klasse werden die Controller, der Storage-Service und der Router/die Plattform übergeben.
  constructor(private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private plt: Platform,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController) {
    this.auswahl = "random";
    	this.initAllBreeds(); // Die möglichen Hunderassen werden von der API abgefragt
      this.getDogImage(); // Ein erstes Bild wird beim Starten der Klasse geladen
  }
  auswahl;  // String Variable, entweder random oder specific
  baseURL: string = "https://dog.ceo/api/"; // Die baseURL der API für Abfragen
  loading: boolean = false; // bool-Variable um festzustellen, ob gerade eine Anfrage durchgeführt wird
  errorMessage; //String Variable für Error-Beschreibungen
  data; // Variable zur Speicherung des JSON-Objekts mit Inhalt aller Hunderassen
  allbreednames = [];  // Array mit Hunderassen, jetzt nutzbar für die Selection mit ion-select-option
  place; //Variable zur Speicherung der ausgewählten Hunderasse bei einer Specific Breed Abfrage
  specific_breed: boolean = false; //Bool zur Unterscheidung der Rest-Anfrage
  path; //img-url
  breedname; // Rasse des angezeigten Hundebilds
  breed; //ausgewählte hunderasse bei specific dog abfrage
  response_url; //
  buttondisabled=false;

  //Funktion um alle möglichen Hunderassen von der WEB-API zu erhalten
  initAllBreeds(){
    this.loading = true;
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
  
  //Funktion um ein Hundebild von der WEB-API zu erhalten
  getDogImage(){
    this.loading = true;
    this.errorMessage = "";
    this.buttondisabled = false;
    if(this.specific_breed){                      //1. Fall -> spezifische Rasse Abfrage
      this.getSpecificDog(this.place)
      .subscribe(
        (response) => {                           //next() callback
          this.path = response.message;
          console.log('response received');
          this.breedname= this.place;
          console.log(response);
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
    }else if(!this.specific_breed){              //2. Fall -> random Rasse Abfrage
      this.getAllDogs()
      .subscribe(
        (response) => {                           //next() callback
          console.log(response);
          this.path = response.message;
          var url = response.message;
          var parts = url.split('/');
          console.log(parts[4]);
          this.breedname= parts[4];
          this.breed = this.breedname;

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
  
  //Funktion für die Abfrage aller Hunderassen von der WEB-API
  getAllBreeds(): Observable<any>{
    this.data = this.http.get(this.baseURL + 'breeds/list/all')
    return this.data;
  }
  //Funktion für die Abfrage eines Bilds einer bestimmten Hunderasse von der WEB-API
  getSpecificDog(breed: string): Observable<any> {
    return this.http.get(this.baseURL + 'breed/' + breed + '/images/random')
  }
  //Funktion für die Abfrage eines Bilds einer unbestimmten Hunderasse von der WEB-API
  getAllDogs(): Observable<any> {
    return this.http.get(this.baseURL + 'breeds/image/random')
  }
  //Debug Funktion, zeigt an welche Rasse ausgewählt wurde
  breedselected(){
   console.log(this.place);
  }
  //Ion-Segment-button Auswahl Funktion
  segmentChanged(ev: any){
    if (ev.detail.value == "specific"){
      this.specific_breed= true;
    }else if (ev.detail.value =="random"){
      this.specific_breed= false;
    }else{
      console.log("something went wrong while changing segment");
    }
  }
  //Funktion zur Speicherung des angezeigten Hundebilds
  saveDogImage(){
    console.log("saving Dog got clicked");
      this.buttondisabled = true;
      this.newItem.datum = new Date().toLocaleString();
      this.newItem.id = Date.now();
      this.newItem.url = this.path;
      this.newItem.breed = this.breedname;
      this.storageService.addItem(this.newItem);
      this.zeigeToast("Doggo was saved!")
  }
    //Router Navigation Funktion zur Favoritenliste
  goToFavourites(){
    this.router.navigate(["list"]);
  }
    //Generic Toast Funktion
  async zeigeToast(nachricht: string) {
    const ANZEIGEDAUER_SEKUNDEN = 2;
    const toast =
          await this.toastController.create({
            message: nachricht,
            duration: ANZEIGEDAUER_SEKUNDEN * 1000
          });
    await toast.present();
  }
      //Router Navigation Funktion zur Hilfe-Seite
  presentHelp(){
    this.router.navigate(["help"])
  }
  }
  