import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { City } from '../../models/city';
import { Strain } from '../../models/strain';
import { Mass } from '../../models/mass';
import { Price } from '../../models/price';
import { Ret } from '../../models/ret';
import { PriceAlert } from '../../models/price-alert';
import { Favstrain } from '../../models/fav-strain';
import { PaidFor } from '../../models/paidfor';
import { CookieService } from 'ngx-cookie-service';
import {Globals} from '../../models/globals';
import {Router} from "@angular/router";
import {PlatformLocation } from '@angular/common';


declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;
//const Swal = require('sweetalert2')

@Component({
  selector: 'mio-converter-box',
  templateUrl: './converter-box.component.html',
  styleUrls: ['./converter-box.component.css'],
  providers: []
})

export class ConverterBoxComponent implements OnInit {

  

  isValidFormSubmitted = false;
  validateEmail = true;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  converter_alert = new PriceAlert();
  favstrain = new Favstrain();
  paidfor = new PaidFor();

  waitLayer = true;
  calculationBox = false;
  locations = new City();
  strains = [];
  mass = [];
  quality = [];
  prices = new Price();
  dispData: any[];
  message: string;
  selectedLocation: any;
  selectedPaidLocation: any;
  selectedStrain: any;
  selectedMass: any;
  defaultStrain = [{strain_id: 0, name: 'Marijuana'}];
  defaultMass = [{mass_id: 1, name: '1 Gram'}];
  strainName: string;
  massName: string;
  mio_cooki_email :any;
  mio_cooki_name: any;
  user_data : any;
  expiredDate: any;
  exists:boolean;
  selectedLocName: string;
  socialPrice: any;
  currentUTCTime: any;
  selectedPaidStrain: any;
  selectedPaidMass: any;
  selectedPaidQuality: number;
  paidPrice = "1.00";
  check_price_alert = false;
  check_fav_strain = false;
  alert_id = 0;
  fav_id = 0;
  scrollFlag = true;
  checkPaid = false;
  checkUser = false;
  selectedLabName: string;
  locationSes: any;
  nearByCities = true;
  nearByOtherCities = true;
  slug: any;
  stateName = "";
  cityName = "";
  state_label : any;
  state_label_other: any;
  selectedLocation_string: any;

  constructor(private platformLocation: PlatformLocation,private cookieService: CookieService,private _http: HttpClient, public globals: Globals, private router: Router) {

    

    this.user_data = JSON.parse(localStorage.getItem('userData'));    

    //console.log(this.cookieService.get('_mio_user_email'));

    if(this.user_data && this.user_data['email']){

      this.converter_alert.email = this.user_data['email'];
      this.converter_alert.name = this.user_data['name'];

      this.favstrain.email = this.user_data['email'];
      this.favstrain.name = this.user_data['name'];

      this.checkUser = true;

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.converter_alert.email = this.cookieService.get('_mio_user_email');
        this.converter_alert.name = this.cookieService.get('_mio_user_name');

        this.favstrain.email = this.cookieService.get('_mio_user_email');
        this.favstrain.name = this.cookieService.get('_mio_user_name');

        this.checkUser = true;

    }else{
      this.converter_alert.email = "";
      this.converter_alert.name = "";

      this.favstrain.email = "";
      this.favstrain.name = "";

      this.checkUser = false;
    }

  }

  checkPriceValue(event){

    
      var number = $("#priceCheck").val().split('.');      

      if($("#priceCheck").val() >= 1000) {
          $("#priceCheck").val(1000);
      } 

      if($("#priceCheck").val() < 0) {
          $("#priceCheck").val(0);
      } 

      if($("#priceCheck").val() > 0){
          this.checkPaid = false;
      }else{
        this.checkPaid = true;
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

    //console.log("Hello");

     $('#priceCheck').on("cut copy paste",function(e) {
      e.preventDefault();
   });

    $('#priceCheck').keypress(function(event) {

      if ((event.which != 46 || $(this).val().indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
          (event.which != 0 && event.which != 8))) {
        event.preventDefault();
      }

      var text = $(this).val();          

      if ((text.indexOf('.') != -1) &&
        (text.substring(text.indexOf('.')).length > 2) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 2)) {
        //console.log("Test" + text.length);
        event.preventDefault();
      }else if(text.indexOf('.') == -1){
        var c = String.fromCharCode(event.which);
        if(text.length > 2 && c != "."){
          //console.log(lastChar);
          event.preventDefault();
        }
      }

  });

    
     var date = new Date();
    this.currentUTCTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    //console.log(this.currentUTCTime);

   // this.currentUTCTime 

    
    if(localStorage.getItem('locationData')!= null)
    {
      this.locationSes = JSON.parse(localStorage.getItem('locationData')); 
    //  console.log(this.locationSes)
      
      this.selectedLocation = 0;
      this.selectedLocName = this.locationSes['state']; 
      this.stateName =  this.locationSes['state']; 

      this.cityName = "";
      //console.log(this.cityName);
      this.selectedPaidQuality = 1;

      this.quality = [{id:1,name:"High Quality"},{id:2,name:"Medium Quality"},{id:3,name:"Low Quality"}];  

      if(this.router.url.indexOf("cannabis-converter")  !== -1 ){this.scrollFlag = false;}        

      this.loadLocations(this.scrollFlag); 
     if(this.locationSes.country == 'Canada')
    {
      this.state_label = "My Province";
      this.state_label_other = "Other Province";
    }
    else
    {
      this.state_label = "My State";
      this.state_label_other = "Other Province";
    }
    }
    else
    {
      this.state_label = "My State";
      this.state_label_other = "Other Province";
    }
         
   // this.getStrainslugdata();
    
  } 
  
   

  ngAfterViewInit(){}

  removePriceAlert(type,alert_id){
    return this._http.get<any[]>('remove_price_alert?type='+type+'&id='+alert_id);
  }

  priceAlertDelete(){
    Swal({
      title: 'Are you sure?',
      text: 'You will not receive a Price Alert notifications for '+this.strainName+' strain in '+ this.selectedLocName,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        this.removePriceAlert(1,this.alert_id).subscribe(
          data =>{this.check_price_alert =  false;this.alert_id = 0;},
          (err) => {console.log(err.message);}
        );

        toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;"+this.strainName+" in "+this.locationSes["name"]+" is now removed from your Price Alert list", "", {
           "closeButton": true,
            "timeOut": "8000",
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

        /*Swal(
          'Deleted!',
          'Your price alert has been deleted.',
          'success'
        )*/
      }
    });
  }

  removeFavStn(fav_id){
    return this._http.get<any[]>('remove_fav_strain?id='+fav_id);
  }

  favStrainDelete(){
    Swal({
      title: 'Are you sure?',
      text: this.strainName + ' strain will be removed from your favorite list.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        this.removeFavStn(this.fav_id).subscribe(
          data =>{this.check_fav_strain = false;this.fav_id = 0;},
          (err) => {}
        );

        toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;"+this.strainName+" is now removed from your Favourite Strains list", "", {
           "closeButton": true,
            "timeOut": "8000",
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
    });
  }

  redirectToPage(url,modalId=''){

    if(modalId != ''){
      $('#'+modalId).modal('hide');
    }    
    window.scrollTo(0, 0);
    this.router.navigate(['/'+url]);

  }

  postPriceAlert(){
    return this._http.post<any[]>('set_price_alert',this.converter_alert);
  }

  addPriceAlert(){

    this.converter_alert.city = this.selectedLocation;
    this.converter_alert.state =this.locationSes['state_id']
    this.converter_alert.strain = this.selectedStrain;

    this.converter_alert.status = 1;

    if(this.user_data && this.user_data['email']){

      this.converter_alert.email = this.user_data['email'];
      this.converter_alert.name = this.user_data['name'];
      this.converter_alert.user_id = this.user_data["id"];

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

      this.converter_alert.email = this.cookieService.get('_mio_user_email');
      this.converter_alert.name = this.cookieService.get('_mio_user_name');
      this.converter_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));

    }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id') != ""){
      this.converter_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
    }

    /*console.log(this.converter_alert);
    return;*/

    this.postPriceAlert().subscribe(
      (data => {
        this.exists = data['exists'];
        this.alert_id = data['id'];
      }),
      (err: any) => console.log(err),
      () => {
        if(this.exists){         

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strainName+' in '+this.selectedLocName+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
           "closeButton": true,
            "timeOut": "8000",
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
            "timeOut": "8000",
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
        this.check_price_alert =  true;
     });
  }

  onConverterAlertSubmit(form: NgForm) {  


     this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }

     this.isValidFormSubmitted = true;
     this.converter_alert = form.value;

     this.converter_alert.city = this.selectedLocation;
     this.converter_alert.strain = this.selectedStrain;

     this.converter_alert.status = 1;

     if(this.user_data && this.user_data['email']){

      this.converter_alert.email = this.user_data['email'];
      this.converter_alert.name = this.user_data['name'];
      this.converter_alert.user_id = this.user_data["id"];

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.converter_alert.email = this.cookieService.get('_mio_user_email');
        this.converter_alert.name = this.cookieService.get('_mio_user_name');
        this.converter_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));

    }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id') != ""){

      this.converter_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
      
    }


    this.expiredDate = new Date();
    this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

    this.cookieService.set( '_mio_user_name', this.converter_alert.name, this.expiredDate,"/" );
    this.cookieService.set( '_mio_user_email', this.converter_alert.email, this.expiredDate ,"/");     

     this.postPriceAlert().subscribe(
      (data => {
        this.exists = data['exists'];
        this.alert_id = data['id'];        
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
        this.checkUser = true;
      }),
      (err: any) => console.log(err),
      () => {
        if(this.exists){         

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strainName+' in '+this.selectedLocName+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
           "closeButton": true,
            "timeOut": "8000",
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
            "timeOut": "8000",
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
        this.check_price_alert =  true;
     });

     //this.converter_alert = new PriceAlert();   
     $('#myModal').modal('hide');
  }

  onPaidSubmit(){

    var paid_price = $("#priceCheck").val();

    var qty = "High Quality";

    if(paid_price <= 0){
      this.checkPaid = true; 
      return;
    }    

    this.quality.forEach((item, index) => {
        if(item.id == this.selectedPaidQuality){
          qty = item.name;
        }
    });

    var userId;

     if(this.user_data && this.user_data['id']!= '')
      {
          userId = this.user_data['id'];
      }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id')!="")
      {
          userId = this.cookieService.get('_mio_user_id');
      }
      else
      {
          //console.log('sumer');
          userId = '0';
      }

    var postdata = {"city" : this.selectedPaidLocation,"strain":this.selectedPaidStrain,"mass":this.selectedPaidMass,"quality":qty,'price':paid_price,'user_id':userId,'state':this.locationSes['state_id']};

    this.postPaidFor(postdata).subscribe(
      (data => {

          //console.log(data);

          if(data["api_message"] == "success" && data["id"] > 0){
              toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Congrats, you'r provided information received successfully...Thanks", "", {
             "closeButton": true,
              "timeOut": "8000",
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

          this.expiredDate = new Date();
          this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );
          this.cookieService.set( '_mio_user_id', data["user_id"], this.expiredDate,"/" );

          $('#myModal_paid').modal('hide');

      }),
      (err: any) => console.log(err),
      () => {}
     );

     
  }

  postPaidFor(postdata){
    return this._http.post<Ret[]>('set_paid_for',postdata);

  }


  postfavstrain(){
    return this._http.post<Ret[]>('set_favorite_strain',this.favstrain);
  }

  addFavStrain(){

    this.favstrain.city = this.selectedLocation;
    this.favstrain.strain = this.selectedStrain;

    if(this.user_data && this.user_data['email']){

      this.favstrain.email = this.user_data['email'];
      this.favstrain.name = this.user_data['name'];
      this.favstrain.user_id = this.user_data['id'];

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.favstrain.email = this.cookieService.get('_mio_user_email');
        this.favstrain.name = this.cookieService.get('_mio_user_name');
        this.favstrain.user_id = parseInt(this.cookieService.get('_mio_user_id'));
      
    }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id') != ""){
      this.favstrain.user_id = parseInt(this.cookieService.get('_mio_user_id'));
    }

    this.favstrain.status = 1;
    this.favstrain.state = this.locationSes["state_id"];

    this.postfavstrain().subscribe(
      (data => {
        this.exists = data['exists'];
        this.fav_id = data['id'];
      }),
      (err: any) => console.log(err),
      () => {

        if(this.exists){         

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strainName+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
           "closeButton": true,
            "timeOut": "8000",
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
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strainName+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
           "closeButton": true,
            "timeOut": "8000",
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

        this.check_fav_strain = true;
      }
     );

  }


  onFavstrainSubmit(form: NgForm){

    this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }
     this.isValidFormSubmitted = true;
     this.favstrain = form.value;

     this.favstrain.city = this.selectedLocation;
     this.favstrain.strain = this.selectedStrain;

    // console.log(this.favstrain);

    if(this.user_data && this.user_data['email']){

      this.favstrain.email = this.user_data['email'];
      this.favstrain.name = this.user_data['name'];
      this.favstrain.user_id = this.user_data['id'];

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.favstrain.email = this.cookieService.get('_mio_user_email');
        this.favstrain.name = this.cookieService.get('_mio_user_name');
        this.favstrain.user_id = parseInt(this.cookieService.get('_mio_user_id'));
      
    }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id') != ""){
      this.favstrain.user_id = parseInt(this.cookieService.get('_mio_user_id'));
    }


     this.favstrain.status = 1;

     this.expiredDate = new Date();
     this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );  

     this.cookieService.set('_mio_user_name', this.favstrain['name'], this.expiredDate,"/");
     this.cookieService.set('_mio_user_email', this.favstrain['email'], this.expiredDate,"/");  


     this.postfavstrain().subscribe(
      (data => {
        this.exists = data['exists'];
        this.fav_id = data['id'];
        
        this.cookieService.set('_mio_user_id', data['user_id'], this.expiredDate,"/");
        this.checkUser = true;
      }),
      (err: any) => console.log(err),
      () => {

        if(this.exists){         

          toastr.error('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strainName+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
           "closeButton": true,
            "timeOut": "8000",
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
          toastr.error('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strainName+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
           "closeButton": true,
            "timeOut": "8000",
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

        this.check_fav_strain = true;
      }
     );

     $('#myModal_fav').modal('hide');

  }

  loadLocations(scrollFlag){

   //console.log(scrollFlag);

    this.waitLayer = true;
    this.getCities().subscribe(

      (data => {
        this.locations = data['data'];
        //console.log(this.locations);
        this.message = data['api_message'];
        //console.log(this.locations);

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
        this.selectedPaidLocation = 0;

        if(!this.locationSes["city_level"]){
          this.selectedLocName = this.locationSes["state"];
        }else{
          this.selectedLocName = this.locationSes["state"]+", "+this.locationSes["country"];
        }
        

        //this.selectedLocation = this.locations['user_city_id'];
        //this.selectedPaidLocation = this.locations['user_city_id'];
        //this.selectedLocName = this.locations["user_city"];

        //console.log(this.locations);

        setTimeout(function() {
          jQuery('#converter-location').select2();
        }, 1);

        jQuery('#converter-location').on(
            'change',
            (e) => {
              scrollFlag = true;
              this.calculationBox = false;
              var data1 = $('#converter-location').select2('data');
              //this.selectedLocation_string = $('#converter-location').select2('data');
             // console.log(data1);
              this.selectedLocation = jQuery(e.target).val();
              this.selectedLocName = data1[0].text;
              this.loadStrains(scrollFlag,1);
            

              //console.log(this.selectedLocation)
             //  this.expiredDate = new Date();
    //this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

   // this.cookieService.set('selcted_city_id', this.selectedLocation);
   // console.log(this.cookieService.get('selcted_city_id'));
            }
        );

        jQuery('#paid-for-location').on(
            'change',
            (e) => {
              scrollFlag = true;
              this.calculationBox = false;
              //var data1 = $('#paid-for-location').select2('data');
              this.selectedPaidLocation = jQuery(e.target).val();
              this.loadStrains(scrollFlag,2);
              console.log(this.selectedPaidLocation)


            }
        );

      }),
      (err: any) => console.log(err),
      () => {
         this.loadStrains(scrollFlag,0);
         this.waitLayer = false;
      }

    );
  }

  getCities (): Observable<any[]> {    
    var cid = JSON.stringify(this.locationSes);
   // console.log(cid)
      return this._http.get<any[]>('locations?userCityData='+cid);
  }

  loadResultBox(flag) {

    /*var data1 = $('#converter-strn').select2('data');
    this.strainName = data1[0].text;
    
    var data2 = $('#converter-location').select2('data');
    this.selectedLocName = data2[0].text;

    var data3 = $('#converter-mass').select2('data');
    this.selectedLabName = data3[0].text;*/

    this.scrollFlag = flag;

    this.waitLayer = true;
    this.calculationBox = true;

    if(this.scrollFlag){

	    setTimeout(function(){ 

	      var topp = $('#converter-result').position().top;
	      //alert(topp);
	      topp = topp + 250;

	      $('html, body').animate({
	        scrollTop: topp
	      },1000);

	      /*$('#converter-result').children().each(function() { 
	      	$(this).hide();
	      });*/

	    }, 1);  
	   
	    
	  } 
    this.getStrainslugdata();
   // return;

    this.getPrices().subscribe(

      (data => {

        this.prices = data['data'];
        this.message = data['api_message'];
        
        /*if(this.selectedStrain == 0){
          this.strainName = "Marijuana";
        }*/

         console.log(this.prices);
      }),
      (err: any) => console.log(err),
      () => {

         this.waitLayer = false;
         if (this.prices == null) {
          this.calculationBox = false;
         } else {
          this.calculationBox = true;

          $('#converter-result').children().each(function() { 
	      	$(this).show();
	      });

          /*if(this.scrollFlag){

            setTimeout(function(){ 

              var topp = $('#converter-result').position().top;
             
              topp = topp + 250;

              $('html, body').animate({
                scrollTop: topp
              },2000);

            }, 1);  
           
            
          }  */        

         }
      }
    );

    this.getDispData().subscribe(

      (data => {
        console.log(data);
        this.dispData = data['data'];
        this.message = data['api_message'];
        this.stateName = data['state'];
        if(this.selectedLocation == 0)
        {
          this.cityName = "";
        }else if(this.selectedLocName.indexOf(',') == -1)
        {
          
          
          this.cityName = "";
        }
        else
        {
          this.cityName = data['city'];
        }
        

        //console.log(this.dispData);
      }),
      (err: any) => console.log(err),
      () => {}
    );

    this.getSocial().subscribe(

      (data => {

        this.socialPrice = data['data'];
//        console.log(this.socialPrice);
      }),
      (err: any) => console.log(err),
      () => {}
    );

    if(this.converter_alert.email){

        this.checkPriceAlert().subscribe(

        (data => {
         // console.log(data["exists"]);
          this.check_price_alert = data['exists'];
          this.alert_id = data['id'];
          //console.log(this.check_price_alert);
        }),
        (err: any) => console.log(err),
        () => {}
      );  

      this.checkFavStrain().subscribe(

        (data => {
         // console.log(data["exists"]);
         if(data){
           this.check_fav_strain = data['exists'];
           this.fav_id = data['id'];
         }
          
          //console.log(this.check_price_alert);
        }),
        (err: any) => console.log(err),
        () => {}
      ); 

    }

    if(flag){
     this.addUserLog().subscribe(

        (data => {
         // console.log(data);
          this.expiredDate = new Date();
          this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

          this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );

         // localStorage.setItem('userData',JSON.stringify(data["data"])); 
        }),
        (err: any) => console.log(err),
        () => {}
      ); 
   }

   this.waitLayer = false;
  }

  loadStrains(scrollFlag,no) {
    //console.log('harsh shaha')
    this.waitLayer = true;
    this.getStrains(no).subscribe(

      (data => {

        this.strains = data['data'];
      //  console.log(this.strains)
        this.message = data['api_message'];
        if(no == 1){
          this.selectedStrain = 0;
          this.strainName = "Marijuana";
          setTimeout(function() {
            jQuery('#converter-strn').select2();
          }, 1);
        }else if(no == 2){
          this.selectedPaidStrain = 0;
        }else{
          this.selectedStrain = 0;
          this.selectedPaidStrain = 0;
          this.strainName = "Marijuana";

          setTimeout(function() {
            jQuery('#converter-strn').select2();
          }, 1);
        }        

        jQuery('#converter-strn').on(
            'change',
            (e) => {
              scrollFlag = true;
              this.calculationBox = false;
              var data1 = $('#converter-strn').select2('data');
              this.selectedStrain = jQuery(e.target).val();
              this.selectedPaidStrain = jQuery(e.target).val();
              //console.log(data1);
              this.strainName = data1[0].text;
              this.loadMass(scrollFlag);
            }
        );

        jQuery('#paid-for-strn').on(
            'change',
            (e) => {              
              this.selectedPaidStrain = jQuery(e.target).val();
              //console.log(this.selectedStrain);
            }
        );

      }),
      (err: any) => console.log(err),
      () => {
         if(no == 1 || no == 0){
           this.loadMass(scrollFlag);
         }         
         this.waitLayer = false;
      }
    );
    // this.waitLayer = false;
    
  }
  
  getStrainslugdata(){
     //console.log(this.selectedStrain);
     this.getStrainslug().subscribe(
       (data => {
         this.slug = data["slug"];
         //console.log(this.slug);
       }),
             (err: any) => console.log(err),
      () => {
         
      }
       );
  }

  loadMass(scrollFlag) {
//    console.log(scrollFlag);
    this.waitLayer = true;
    this.getMass().subscribe(

      (data => {

        this.mass = data['data'];

        /*if(this.mass.length == 0){   
        	this.massName = [['1' : '1 Gram'}];
        }*/

        this.message = data['api_message'];
        this.selectedMass = this.mass[0]["mass_id"];
        this.selectedPaidMass = this.mass[0]["mass_id"];
        this.selectedLabName = this.mass[0]["name"];

        setTimeout(function() {
          jQuery('#converter-mass').select2();          
        }, 1);

        jQuery('#converter-mass').on(
            'change',
            (e) => {
              scrollFlag = true;
              this.calculationBox = false;
              this.selectedMass = jQuery(e.target).val();
              var data3 = $('#converter-mass').select2('data');
              this.selectedLabName = data3[0].text;
            }
        );
      }),
      (err: any) => console.log(err),
      () => {
        if(!scrollFlag){
          this.loadResultBox(scrollFlag);
        }        
        this.waitLayer = false;
      }
    );
    // this.waitLayer = false;
  }

  checkFavStrain (): Observable<any[]> {
    return this._http.get<any[]>('check_fav_strain?city=' + this.selectedLocation + '&strain='+ this.selectedStrain+'&email='+this.converter_alert.email+'&state='+this.locationSes["state_id"]);
  }

  checkPriceAlert (): Observable<any[]> {
    return this._http.get<any[]>('check_price_alert?city=' + this.selectedLocation + '&strain='+ this.selectedStrain+'&email='+this.converter_alert.email+'&state='+this.locationSes["state_id"]);
  }

  addUserLog (): Observable<any[]> {

    
    var postdata: any;
    var userId: any;

    userId = 0;
// this.user_data['email']!= '' && 

    if(this.user_data && this.user_data['id']!= '')
    {
        userId = this.user_data['id'];
    }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id')!="")
    {
        userId = this.cookieService.get('_mio_user_id');
    }
   
//_mio_user_unique_id
    

     var url = (this.platformLocation as any).location.href ;
     var detailstmp = {'location' : this.selectedLocName,'strain' : this.strainName, 'mass' : this.selectedLabName };
    
     var details = JSON.stringify(detailstmp);

     // " Location : " + this.selectedLocation + " Strain : "+this.selectedStrain + " Mass : " this.selectedMass;

    var description = "Cannabis converter search";


    postdata = {'url' : url , 'description' : description, 'user_id' :userId , 'details': details};
    //console.log(postdata);

    //'set_user_log?url=' + url + '&description='+ description+'&id_cms_users='+ userId +'&details='+ details+'&email='+this.converter_alert.email

    return this._http.post<any[]>('set_user_log',postdata);
  }
 

  checkFavorite (): Observable<any[]> {
    return this._http.get<any[]>('get_social_price?city=' + this.selectedLocation);
  }

  getSocial (): Observable<any[]> {
    return this._http.get<any[]>('get_social_price?city=' + this.selectedLocation);
  }

  getStrains (no): Observable<any[]> {
    if(no == 1 || no == 0){
      return this._http.get<any[]>('strains?cityId=' + this.selectedLocation+"&state_id="+this.locationSes["state_id"]);
    }else{
      return this._http.get<any[]>('strains?cityId=' + this.selectedPaidLocation+"&state_id="+this.locationSes["state_id"]);
    }
    
  }

  getMass (): Observable<any[]> {
    return this._http.get<any[]>('mass?cityId=' + this.selectedLocation + '&strain_id=' + this.selectedStrain + '&state='+this.locationSes["state_id"]);
  }

  getPrices (): Observable<Price[]> {

    return this._http.get<Price[]>('prices?state='+this.locationSes["state_id"]+'&city=' + this.selectedLocation + '&strain=' + this.selectedStrain + '&mass=' + this.selectedMass + '&type=avg');
  }

  getDispData (): Observable<any[]> {
    if(this.selectedLocation == 0){
      var cityId = this.locationSes["id"];
    }else{
      var cityId = this.selectedLocation;
    }
    return this._http.get<any[]>('prices?state='+this.locationSes["state_id"]+'&city=' + cityId + '&strain=' + this.selectedStrain + '&mass=' + this.selectedMass + '&type=dispensaries');
  }
  getStrainslug (): Observable<any[]> {
   // console.log(this.selectedStrain)
    return this._http.get<any[]>('getstrainslugbyid?id=' + this.selectedStrain);
  }

  

}
