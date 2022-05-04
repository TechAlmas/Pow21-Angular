import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../../models/city';
import { Strain } from '../../models/strain';
import { Ret } from '../../models/ret';
import {PriceAlert} from '../../models/price-alert';
import { CookieService } from 'ngx-cookie-service';
import {Globals} from '../../models/globals';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;

@Component({
  selector: 'mio-price-alert',
  templateUrl: './price-alert.component.html',
  styles: [],
  providers: []
})

export class PriceAlertComponent implements OnInit {

  waitLayer = false;
  isValidFormSubmitted = false;
  validateEmail = true;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  selectedLocation: any;
  selectedStrain: any;

  selectedLocName: string;
  strainName: string;

  locations = [];
  strains = [];
  message: string;  
  exists:boolean;

  expiredDate: any;
  user_data: any;

  defaultStrain = [{strain_id: 0, name: 'Marijuana'}];

  price_alert = new PriceAlert();

  display_data = 0;
  display_fields = true;

  locationSes: any;
  nearByCities = true;
  nearByOtherCities = true;

  constructor(private _http: HttpClient, private cookieService: CookieService, private globals: Globals) {

    this.user_data = JSON.parse(localStorage.getItem('userData'));

    //console.log(this.cookieService.get('_mio_user_email'));

    if(this.user_data && this.user_data['email']){

      this.price_alert.email = this.user_data['email'];
      this.price_alert.name = this.user_data['name'];

      this.display_data = 1;
      this.display_fields = false;

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.price_alert.email = this.cookieService.get('_mio_user_email');
        this.price_alert.name = this.cookieService.get('_mio_user_name');

        this.display_data = 2;
        this.display_fields = false;

    }else{
      this.price_alert.email = "";
      this.price_alert.name = "";

      this.display_data = 0;
      this.display_fields = true;
    }

  }

  ngOnInit() { 

    if(localStorage.getItem('locationData')!= null)
    {
      
      this.locationSes = JSON.parse(localStorage.getItem('locationData'));
      this.price_alert.city = this.locationSes["id"];
      this.selectedLocation = 0;
      this.price_alert.state = this.locationSes['state_id'];

      this.loadLocations();
    }

    

  }

  postPriceAlert(){
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
        this.message = data['api_message'];

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

        this.price_alert.city = this.locationSes["id"];
        this.selectedLocation = 0;

        if(this.locationSes["city_level"]){
          this.selectedLocName = this.locationSes["name"];
        }else{
          this.selectedLocName = this.locationSes["state"]+", "+this.locationSes["country"];
        }

        setTimeout(function() {
          jQuery('#price-alert-location').select2();
        }, 100);
        jQuery('#price-alert-location').on(
            'change',
            (e) => {

              var data1 = $('#price-alert-location').select2('data');
              this.price_alert.city = jQuery(e.target).val();
              this.selectedLocName = data1[0].text;
              this.selectedLocation = jQuery(e.target).val();

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
        this.message = data['api_message'];
        this.price_alert.strain = '0';
        this.strainName = "Marijuana";

        setTimeout(function() {
          jQuery('#price-alert-strn').select2();
        }, 100);
        jQuery('#price-alert-strn').on(
            'change',
            (e) => {
              var data1 = $('#price-alert-strn').select2('data');
              this.price_alert.strain = jQuery(e.target).val();
              this.strainName = data1[0].text;
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
     this.price_alert.status = 1;

     if(this.user_data && this.user_data['email']){

      this.price_alert.email = this.user_data['email'];
      this.price_alert.name = this.user_data['name'];
      this.price_alert.user_id = this.user_data['id'];

      this.display_data = 1;
      this.display_fields = false;

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.price_alert.email = this.cookieService.get('_mio_user_email');
        this.price_alert.name = this.cookieService.get('_mio_user_name');
        this.price_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));

        this.display_data = 2;
        this.display_fields = false;

    }else{
        this.price_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
    }

     //console.log(this.price_alert);

     this.expiredDate = new Date();
     this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

     this.cookieService.set( '_mio_user_name', this.price_alert['name'], this.expiredDate,"/" );
     this.cookieService.set( '_mio_user_email', this.price_alert['email'], this.expiredDate,"/" );

     this.postPriceAlert().subscribe(
      (data => {

        this.exists = data['exists'];

        
        this.cookieService.set('_mio_user_id', data['user_id'], this.expiredDate,"/");

        
      }),
      (err: any) => console.log(err),
      () => {

        if(this.exists){         

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strainName+' in '+this.selectedLocName+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strainName+' in '+this.selectedLocName+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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
    // form.resetForm();
     this.loadLocations();
     this.selectedLocation = 0;
  }
 
} 