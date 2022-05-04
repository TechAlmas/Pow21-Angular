import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ret} from '../../models/ret';
import { ActivatedRoute } from '@angular/router';
import {Router} from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

import {Globals} from '../../models/globals';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;

@Component({
  selector: 'mio-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user_data: any;
  favstrain: any;
  user_email: any;
  locations: any;
  isValid : any;
  isUserLoggedIn: boolean;
  dispContent: boolean;
  flagImage: any;  
  dispCountry: string;
  location_data: any;
 // mio_session_count : any;

  constructor(private cookieService: CookieService,private _http: HttpClient, public globals: Globals,private routes: Router, private route: ActivatedRoute) {
     

  }

  ngOnInit() {
    
    this.globals.location_global_url = "canada";
    this.location_data = JSON.parse(localStorage.getItem('locationData'));

    this.user_data = JSON.parse(localStorage.getItem('userData'));

      if(this.user_data == null){
        this.globals.user_name = this.cookieService.get('_mio_user_name');
        this.globals.user_email = this.cookieService.get('_mio_user_email');
        this.user_email = this.cookieService.get('_mio_user_email');
        this.globals.user_data = false;
      }else{
        this.globals.user_data = true;
        this.globals.user_name = this.user_data.name;
        this.user_email = this.user_data.email;
      }
      this.getpricealertCount();
      this.strian_count();

  }

  redirectTo(parm){
    console.log(parm);
    this.dispContent = false;
    this.routes.navigate(['/'+parm]);
  }

  getcount(){
    return this._http.get<Ret[]>('pricealertcount?email='+this.user_email);
  }

  getpricealertCount(){


    if(this.user_email){

      this.getcount().subscribe(count_data =>
          {
          
          this.globals.price_alert_count = count_data['price_alert_count'];
          //console.log(this.globals.price_alert_count);

         if(this.globals.price_alert_count == null){
           //console.log(this.user_data_email);

           this.globals.price_alert_count = 0;
        }           
        //this.mio_session_count = localStorage.getItem('_mio_count');
        }, (err) => {
            console.log(err.message);
        });

    }        }

  getFavstrain(){
   
      return this._http.get<Ret[]>('get_favorite_strains?email='+this.user_email);
  }

  strian_count()
  {
    if(this.user_email){
        this.getFavstrain().subscribe(data => 
        {
        //console.log(data);
        if(data['data'] != null){
        //alert('Hii');
        this.favstrain = data['data'].length;
        }
        else
        {
        this.favstrain = null;
        }

        }, (err) => {

        console.log(err.message);
        });
      }
  }
}