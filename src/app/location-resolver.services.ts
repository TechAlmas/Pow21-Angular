import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LocationResolver implements Resolve<any> {

  constructor(private http: HttpClient) { }

  public locations: any = undefined;

  resolve(): Observable<any> {

    //console.log(localStorage.getItem('locationData'));

    //console.log(localStorage.getItem('locationData'));

    if(!JSON.parse(localStorage.getItem('locationData'))){     
      //console.log("Remote Data");
      return this.http.get("getusergeolocation")
        .pipe(
            map( (dataFromApi) => {
              //console.log(dataFromApi);
              localStorage.setItem('locationData',JSON.stringify(dataFromApi["data"]));              
            } ),
            catchError( (err) => Observable.throw(err.json().error) )
        )
       // return JSON.parse(localStorage.getItem('locationData'));

    }
    
  }
}