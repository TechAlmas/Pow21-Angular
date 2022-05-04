import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../../models/city';
import { Strain } from '../../models/strain';
import { Ret } from '../../models/ret';
import {PriceAlertDetail} from '../../models/price-alert-detail';
import { CookieService } from 'ngx-cookie-service';
import {Globals} from '../../models/globals';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;

@Component({
  selector: 'mio-price-alert-detail',
  templateUrl: './price-alert-detail.component.html',
  styles: [],
  providers: []
})

export class PriceAlertDetailComponent implements OnInit {

  waitLayer = false;

  isValidFormSubmitted = false;
  validateEmail = true;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  pricePattern = "/^[0-9]+(\.[0-9]{1,2})?$/";

  selectedLocation: any;
  selectedStrain: any;

  selectedLocName: string;
  selectedStrName: string;

  locations = [];
  strains = [];
  message: string;
  exists: boolean;
  defaultStrain = [{strain_id: 0, name: 'Marijuana'}];
  defaultAction = [{'label': 'Up', 'value': 'Up'}, {'label': 'Down', 'value': 'Down'}];
  defaultPrice = [{'label': '1', 'value': '1'}, {'label': '2', 'value': '2'}, {'label': '3', 'value': '3'}];
  expiredDate: any;

  price_alert = new PriceAlertDetail();
  user_data: any;

  display_fields = true;

  locationSes: any;
  nearByCities = true;
  nearByOtherCities = true;
  selctedstrname_label:any;
  selectedlocname_label: any;

  constructor(private _http: HttpClient, private cookieService: CookieService, private globals: Globals) {}

  checkPriceValue(event){

    //console.log(event);

      //console.log($("#priceCheck").val());

     // console.log(event);

      var number = $("#priceCheck").val().split('.');      

      if($("#priceCheck").val() > 100) {
          $("#priceCheck").val(100);
      } 

      var index = $("#priceCheck").val().split('.');

      if(index[1] && index[1].length > 2){
        var tmp = $("#priceCheck").val();
        //console.log(tmp.slice(0,-1));
        $("#priceCheck").val(tmp.slice(0,-1));
        //event.preventDefault();
      }

  }

  ngOnInit() {

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
    }
    
    this.price_alert.action = "Up";
    this.price_alert.price = "1";

    this.locationSes = JSON.parse(localStorage.getItem('locationData'));   
    this.price_alert.state = this.locationSes['state_id'] ;

     this.price_alert.city = this.locationSes['id'];
     this.selectedLocation = 0;
    // console.log(this.price_alert.city);

    this.loadLocations();

    /*$("#priceCheck").on("keypress keyup blur",function (event) {
            //this.value = this.value.replace(/[^0-9\.]/g,'');
        $(this).val($(this).val().replace(/[^0-9\.]/g,''));
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) 
        {
          
          event.preventDefault();
        }       

        if($(this).val() > 100) {
          $(this).val(100);
        }

     });  */  

  }

  checkPrice(){

  }

  postPriceAlert(){
    return this._http.post<any[]>('set_price_alert_detail',this.price_alert);
  }

  getCities (): Observable<any[]> { 
    
    var cid = JSON.stringify(this.locationSes);
      return this._http.get<any[]>('locations?userCityData='+cid);
  }

  getStrains (): Observable<any[]> {
    return this._http.get<any[]>('strains?cityId=' + this.selectedLocation+"&state_id="+this.locationSes["state_id"]);
  }

 /* onKey(event: any){
    if(event.target.value < 0.01){
      console.log("Less");
    }
    if(event.target.value > 100){
      console.log("High");
    }
  }*/

  loadLocations(){
    this.waitLayer = true;
    this.getCities().subscribe(

      (data => {
        this.locations = data['data'];
        this.message = data['api_message'];

        var myLoc = {'id':this.locationSes["id"],'name':this.locationSes["name"]};
        var myLoc1 = {'id':this.locationSes["id"],'name':this.locationSes["state"]};

        this.locations["user_location"] = [myLoc];
          this.locations["user_state"] = [myLoc1];

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
          this.selectedLocName = this.locationSes["name"]+", "+this.locationSes["country"];
        }

         if(this.selectedLocation == 0)
        {
           this.selectedLocName = this.locationSes["state"]+", "+this.locationSes["country"];
        }
        
       // this.selectedStrName = "Marijuana";

        setTimeout(function() {
          jQuery('#price-alert-detail-location').select2({
            dropdownAutoWidth : true,
            width: 'auto'
          });
        }, 100);
        jQuery('#price-alert-detail-location').on(
            'change',
            (e) => {
              this.price_alert.city = jQuery(e.target).val();
              this.selectedLocation = jQuery(e.target).val();

              var data1 = $('#price-alert-detail-location').select2('data');
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
        //console.log(this.strains);
        this.message = data['api_message'];
        this.price_alert.strain = '0';
       // this.selectedStrName = "Marijuana";

        setTimeout(function() {
          jQuery('#price-alert-detail-strn').select2({
            dropdownAutoWidth : true,
            width: 'auto'
          });
        }, 100);
        jQuery('#price-alert-detail-strn').on(
            'change',
            (e) => {
              this.price_alert.strain = jQuery(e.target).val();
              var data1 = $('#price-alert-detail-strn').select2('data');
              //console.log(data1);
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

  onFormSubmitDetail(form: NgForm) {

    
    
     this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }
     
     this.isValidFormSubmitted = true;
     this.price_alert = form.value;
     this.price_alert.state = this.locationSes['state_id'] ;
     //console.log(this.price_alert['email']);
     this.price_alert.status = 1;

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

     //console.log(this.price_alert);

     this.expiredDate = new Date();
     this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

     this.cookieService.set( '_mio_user_name', this.price_alert['name'], this.expiredDate,"/" );
     this.cookieService.set( '_mio_user_email', this.price_alert['email'], this.expiredDate,"/" );
     //this.cookieValue = this.cookieService.get('email');
      //console.log(this.cookieValue);
      this.selctedstrname_label = this.selectedStrName;
      this.selectedlocname_label = this.selectedLocName;

     this.postPriceAlert().subscribe(
      (data => {
        this.exists = data['exists'];
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
      }),
      (err: any) => console.log(err),
      () => {
         if(this.exists){

        var str_name = "Test";
        var loc_name = "sdfsad";

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+ this.selctedstrname_label+' in '+this.selectedlocname_label+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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

     this.price_alert = new PriceAlertDetail();   
     //form.resetForm();
     this.price_alert.action = "Up";
     this.price_alert.price = "1";
     this.loadLocations();
  }
 
} 