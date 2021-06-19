import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor(private http: HttpClient) {
    	this.initAllBreeds();
  }
  baseURL: string = "https://dog.ceo/api/";
  loading: boolean = false;
  errorMessage;
  data;
  allbreednames = [];
  place;
  specific_breed: boolean = false;

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
  

  getAllBreeds(): Observable<any>{
    this.data = this.http.get(this.baseURL + 'breeds/list/all')
    return this.data;
  }

  getSpecificDog(breed: string): Observable<any> {
    return this.http.get(this.baseURL + 'breed/' + breed + '/images/random')
  }
  getallDogs(): Observable<any> {
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
}
 