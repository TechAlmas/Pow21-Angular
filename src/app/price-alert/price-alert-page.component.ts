import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../models/city';
import { Strain } from '../models/strain';
import { Ret } from '../models/ret';
import { PriceAlert } from '../models/price-alert';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {Globals} from '../models/globals';
import { PlatformLocation } from '@angular/common';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;


@Component({
  selector: 'mio-price-alert-page',
  templateUrl: './price-alert-page.component.html',
  styleUrls: ['./price-alert-page.component.css'],
  providers: []
})

export class PriceAlertPageComponent implements OnInit {  

  waitLayer = false;

  isValidFormSubmitted = false;
  validateEmail = true;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  expiredDate: any;
  geoLocations = "";
  locations = [];
  strains = [];

  selectedLocation: any;
  selectedStrain: any;

  selectedLocName: string;
  selectedStrName: string;

  defaultStrain = [{strain_id: 0, name: 'Marijuana'}];

  price_alert = new PriceAlert();

  cookieValue = 'UNKNOWN';
  exists: boolean;

  user_data: any;

  display_fields = true;

  locationSes: any;
  nearByCities = true;
  nearByOtherCities = true;
  selctedstrname_label:any;
  selectedlocname_label: any;

  constructor(private platformLocation: PlatformLocation,private route: ActivatedRoute,private routes: Router, private cookieService: CookieService, private title: Title, private meta: Meta, private _http: HttpClient, private globals: Globals) {}

  ngOnInit() {

    this.locationSes = JSON.parse(localStorage.getItem('locationData')); 

    this.user_data = JSON.parse(localStorage.getItem('userData'));

    if(this.user_data && this.user_data['email']){

      this.price_alert.email = this.user_data['email'];
      this.price_alert.name = this.user_data['name'];

      this.display_fields = false;

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.price_alert.email = this.cookieService.get('_mio_user_email');
        this.price_alert.name = this.cookieService.get('_mio_user_name');

        this.display_fields = false;

    }else{
      this.price_alert.email = "";
      this.price_alert.name = "";

      this.display_fields = true;
    }

      
     // this.title.setTitle('Price Alert');
     // this.meta.updateTag({ name: 'author',content: 'test.com'});
     // this.meta.updateTag({name: 'keyword', content: 'angular overview, features'});
     // this.meta.updateTag({name: 'description', content: 'It contains overview of angular application'});

     
        
  
     this.price_alert.state = this.locationSes['state_id'];
     this.price_alert.city = this.locationSes['id'];
     this.selectedLocation = 0;
     this.selectedLocName = this.locationSes['state'];

    

      this.loadLocations();

       
  } 
  

  postPriceAlert(){
  //  console.log(this.price_alert);return;
    return this._http.post<any[]>('set_price_alert',this.price_alert);
  }

  getCities (): Observable<any[]> { 
    
    var cid = JSON.stringify(this.locationSes);
      return this._http.get<any[]>('locations?userCityData='+cid);
  }

  getStrains (): Observable<any[]> {
    return this._http.get<any[]>('strains?cityId=' + this.selectedLocation+"&state_id="+this.locationSes["state_id"]);
  }

  loadLocations(){
    this.waitLayer = true;
    this.getCities().subscribe(

      (data => {

        this.locations = data['data'];

        var myLoc = {'id':this.locationSes["id"],'name':this.locationSes["name"]};
        var myLoc1 = {'id':this.locationSes["id"],'name':this.locationSes["state"]};
         this.locations["user_state"] = [myLoc1];

        this.locations["user_location"] = [myLoc];

        if(this.locations["near_cities"].length == 0){
          this.nearByCities = false;
        }

        if(this.locations["near_other_cities"].length == 0){
          this.nearByOtherCities = false;
        }

        this.selectedLocation = 0;
        this.price_alert.city = this.locationSes["id"];
        


        if(this.locationSes["city_level"]){
          this.selectedLocName = this.locationSes["name"];
        }else{
          this.selectedLocName = this.locationSes["name"]+","+this.locationSes["country"];
        }

         if(this.selectedLocation == 0)
        {
           this.selectedLocName = this.locationSes["state"]+", "+this.locationSes["country"];
        }

        /*this.price_alert.city = this.locations['user_city_id'];
        this.selectedLocation = this.locations['user_city_id'];
        this.selectedLocName = this.locations["user_city"];*/

        //this.selectedStrName = "Marijuana";

//        console.log(this.selectedLocName);

        setTimeout(function() {
          jQuery('#price-alert-location').select2();
        }, 100);
        jQuery('#price-alert-location').on(
            'change',
            (e) => {
              this.price_alert.city = jQuery(e.target).val();
              this.selectedLocation = jQuery(e.target).val();              

              var data1 = $('#price-alert-location').select2('data');
              this.selectedLocName = data1[0].text;
              this.loadStrains();
            }
        );
      }),
      (err: any) => console.log(err),
      () => {
         this.loadStrains();
         this.waitLayer = false;
      }

    );
  }

  loadStrains() {

    this.waitLayer = true;
    this.getStrains().subscribe(

      (data => {

        this.strains = data['data'];        
        this.price_alert.strain = '0';
        this.selectedStrName = "Marijuana";

        setTimeout(function() {
          jQuery('#price-alert-strn').select2();
        }, 100);
        jQuery('#price-alert-strn').on(
            'change',
            (e) => {
              this.price_alert.strain = jQuery(e.target).val();
              var data1 = $('#price-alert-strn').select2('data');
              this.selectedStrName = data1[0].text;
            }
        );

      }),
      (err: any) => console.log(err),
      () => {
         this.waitLayer = false;
      }
    );
    // this.waitLayer = false;
  }

  onFormSubmit(form: NgForm) {   

     this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }
     
     this.isValidFormSubmitted = true;
     this.price_alert = form.value;
     this.price_alert.state = this.locationSes['state_id']
     //console.log(this.price_alert['email']);
     this.price_alert.status = 1;

     this.expiredDate = new Date();
     this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

     if(this.user_data && this.user_data['email']){

      this.price_alert.email = this.user_data['email'];
      this.price_alert.name = this.user_data['name'];
      this.price_alert.user_id = this.user_data['id'];

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.price_alert.email = this.cookieService.get('_mio_user_email');
        this.price_alert.name = this.cookieService.get('_mio_user_name');
        this.price_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
    }else{
        this.price_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
    }

     this.cookieService.set( '_mio_user_name', this.price_alert['name'], this.expiredDate,"/" );
     this.cookieService.set( '_mio_user_email', this.price_alert['email'], this.expiredDate,"/" );
     //this.cookieValue = this.cookieService.get('email');
      //console.log(this.cookieValue);

     /* console.log(this.selectedStrName);

      return;
*/
      this.selctedstrname_label = this.selectedStrName;
      this.selectedlocname_label = this.selectedLocName;

     this.postPriceAlert().subscribe(
      (data => {
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
        this.exists = data['exists'];    
      }),
      (_error: any) => console.log(_error),
      () => {
        if(this.exists){      

        
         toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.selctedstrname_label+' in '+this.selectedlocname_label+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
           "closeButton": true,
            "timeOut": "7000",
            "extendedTImeout": "0",
            "showDuration": "300",
            "hideDuration": "1000",
            "extendedTimeOut": "0",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "positionClass": "toast-top-full-width",
          });  

        }else{
          //this.globals.price_alert_count = this.globals.price_alert_count+1;
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.selctedstrname_label+' in '+this.selectedlocname_label+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
           "closeButton": true,
            "timeOut": "7000",
            "extendedTImeout": "0",
            "showDuration": "300",
            "hideDuration": "1000",
            "extendedTimeOut": "0",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "positionClass": "toast-top-full-width",
          });  
        } 
      }
     );

     this.price_alert = new PriceAlert();   
     //form.resetForm();
     this.loadLocations();
     
  }

}
