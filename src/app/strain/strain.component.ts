import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PriceAlert } from '../models/price-alert';
import { Favstrain } from '../models/fav-strain';
import { City } from '../models/city';
import { Review } from '../models/review';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../models/globals';
import { CookieService } from 'ngx-cookie-service';
import { PlatformLocation } from '@angular/common';
import { StrainDetail } from '../models/strain-detail';
import {Login} from '../models/login';


declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;
declare var SEMICOLON: any;

@Component({
  selector: 'strain-details',
  templateUrl: './strain.component.html',
  styleUrls: ['./strain.component.css'],
  providers: []
})

export class StrainComponent implements OnInit {

  review = new Review();
  write_review = false;
  adbanner = false;
  convertModel = true;
  user_data : any;
  expiredDate: any;
  exists:boolean;
  isValidFormSubmitted = false;
  validateEmail = true;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  converter_alert = new PriceAlert();
  favstrain = new Favstrain();
  strainDetails = new StrainDetail();
  strainHistory = [];
  locationSes = [];
  strainSocial = [];
  positiveEffects = [];
  negativeEffects = [];
  medicalEffects = [];
  flavourList = [];
  postiveDisplay = false;
  strainPricesDetail = [];
  priceDataAvailable = false;
  alert_id = 0;
  fav_id = 0;
  check_price_alert = false;
  check_fav_strain = false;
  checkUser = false;
  positive_effects: any;
  negative_effects: any;
  medical_effects: any;
  review_id = 0;
  rating_req = false;
  reviews = [];

  locations = [];
  mass = [];
  selectedLabName = "";
  selectedPaidLocation: any;
  selectedPaidStrain: any;
  selectedPaidMass: any;
  selectedPaidQuality: number;
  waitLayer = false;
  checkPaid = false;
  message = "";
  nearByCities = true;
  nearByOtherCities = true;
  quality = [];
  image_strain:any = "";
  redirectToPage:any;
  strainName: any;
  selectedLocName: any;
  paidPrice: any;
 negative_message:any;
 positive_message:any;
 medical_message: any;
 flavour_message:any;
// is_review_emai = false;
 login_alert = new Login();

 constructor(private cookieService: CookieService,public globals: Globals,private route: ActivatedRoute,private routes: Router,private _http: HttpClient,private platformLocation: PlatformLocation, private title: Title, private meta: Meta) {window.scrollTo(0, 0);}

  ngOnInit() {

    this.selectedPaidQuality = 1;
    this.quality = [{id:1,name:"High Quality"},{id:2,name:"Medium Quality"},{id:3,name:"Low Quality"}];

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

    

    /*$('nav-tabs > a[href*="#"]').on('click', function (e) {
      e.preventDefault();

      $('html, body').animate({
          scrollTop: $($(this).attr('href')).offset().top
      }, 500, 'linear');
    });

    $(".tab-content").on("click", "h3.mob-tab-title", function(){
      if($(this).next(".tab-pane").hasClass("in active")){
        $(this).next(".tab-pane").removeClass("in active");
      }else{
        $(this).parent(".tab-content").find(".in.active").removeClass("in active");
        $(this).next(".tab-pane").addClass("in active");
      }
    });*/

    


    this.locationSes = JSON.parse(localStorage.getItem('locationData'));
   // console.log(this.locationSes['id']);
    this.cookieService.set('selcted_city_id', this.locationSes['id']);
  		this.route.params.subscribe(params => {


  			if(typeof params['strainName'] === "undefined")
          	{ 
          		//console.log(params['strainName']);

          		 this.routes.navigate(['/']);
          	}else
          	{
              if(typeof params['id'] !== "undefined")
              { 
                this.getStrainDetail(params['strainName'],params['id']); 
              }else{
                this.getStrainDetail(params['strainName'],""); 
              }         		             
              
          		
          	}


  		});

      $("#starrating").rating();
      $("#apperance").rating();
      $("#aroma").rating();
      $("#high").rating();
      $("#quality").rating();
      $("#flavor").rating();
      $("#value").rating();

      $("#starrating").on("change", function(event) {
        //this.rating_req = true;
        console.log("Change");
      });/*
      $("#rating").on("rating.change", function(event, value, caption) {
        console.log(value);
      });*/

      this.loadLocations();
      this.loadMass();

  }

  checkPriceValue(event){

      var number = $("#priceCheck").val().split('.');      

      if($("#priceCheck").val() >= 101) {
          $("#priceCheck").val(100);
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

  getMass (): Observable<any[]> {
    return this._http.get<any[]>('mass?cityId=' + this.locationSes["id"] + '&strain_id=0');
  }

  loadMass() {
//    console.log(scrollFlag);
    this.waitLayer = true;
    this.getMass().subscribe(

      (data => {

        this.mass = data['data'];

        this.message = data['api_message'];
        this.selectedPaidMass = this.mass[0]["mass_id"];
        this.selectedLabName = this.mass[0]["name"];        

        jQuery('#paid-for-mass').on(
            'change',
            (e) => {
              this.selectedPaidMass = jQuery(e.target).val();
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

  loadLocations(){

//    console.log(scrollFlag);

    this.waitLayer = true;
    this.getCities().subscribe(

      (data => {
        this.locations = data['data'];
        this.message = data['api_message'];
        //console.log(this.locations);

        var myLoc = {'id':this.locationSes["id"],'name':this.locationSes["name"]};
        
        this.locations["user_location"] = [myLoc];

        if(this.locations["near_cities"].length == 0){
          this.nearByCities = false;
        }

        if(this.locations["near_other_cities"].length == 0){
          this.nearByOtherCities = false;
        }
        
        this.selectedPaidLocation = this.locationSes["id"];        

        
        jQuery('#paid-for-location').on(
            'change',
            (e) => {              
              this.selectedPaidLocation = jQuery(e.target).val();
            }
        );

      }),
      (err: any) => console.log(err),
      () => {
         
         this.waitLayer = false;
      }

    );
  }

  getCities (): Observable<any[]> {    
    var cid = JSON.stringify(this.locationSes);
      return this._http.get<any[]>('locations?userCityData='+cid);
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

    var postdata = {"city" : this.selectedPaidLocation,"strain":this.strainDetails['id'],"mass":this.selectedPaidMass,"quality":qty,'price':paid_price,'user_id':userId/*, 'email':this.converter_alert.email*/};

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
    return this._http.post<any[]>('set_paid_for',postdata);

  }

  enableReviewForm(){
    this.write_review = true;
   setTimeout(function(){ $("#starrating").rating(); }, 1);
    setTimeout(function(){ $("#apperance").rating(); }, 1);
    setTimeout(function(){ $("#aroma").rating(); }, 1);
     setTimeout(function(){ $("#high").rating(); }, 1);
     setTimeout(function(){ $("#quality").rating(); }, 1);
     setTimeout(function(){ $("#flavor").rating(); }, 1);
     setTimeout(function(){ $("#value").rating(); }, 1);
    
  }

  linkClicked(id){
    
    var trgt = $("#"+id);
     $('html, body').animate({
          scrollTop: $("#"+id).offset().top - 150
      }, 500, 'linear');

     if(id == "reviews"){
       this.enableReviewForm();
     }
  }

  getPrices (): Observable<any[]> {
//    console.log(this.locationSes);
    return this._http.get<any[]>('prices?city='+ this.locationSes['id'] +'&strain=' + this.strainDetails['id'] + '&mass=1&type=avg1&country='+this.locationSes['country']);

  }

getStrainDetailData(strainName): Observable<any> {
   // var postData = {"url":currentUrl};
    return this._http.get<any>('getstraindetail?slug='+strainName);
  }

   getSocial (): Observable<any[]> {
    return this._http.get<any[]>('get_social_price?city=' + this.locationSes['id']);
  }

  checkFavStrain (): Observable<any[]> {
    return this._http.get<any[]>('check_fav_strain?city=' + this.locationSes['id'] + '&strain='+ this.strainDetails["id"]+'&email='+this.converter_alert.email);
  }

  checkPriceAlert (): Observable<any[]> {
    return this._http.get<any[]>('check_price_alert?city=' + this.locationSes['id'] + '&strain='+ this.strainDetails["id"]+'&email='+this.converter_alert.email);
  }

  postPriceAlert(){
    return this._http.post<any[]>('set_price_alert',this.converter_alert);
  }

  trackBucttonClick(id){
    console.log($("#track_price_alert"+id).is(":checked"));
    if(this.alert_id == 0){
      if(this.checkUser){
        this.addPriceAlert();
      }else{
        $('#myModal').modal('show');
      }
    }else{
      this.priceAlertDelete();
    }
  }

  addPriceAlert(){

    this.converter_alert.city = this.locationSes["id"];
    this.converter_alert.strain = this.strainDetails.id;

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

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.locationSes["name"]+' in '+this.strainDetails["name"]+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.locationSes["name"]+' in '+this.strainDetails["name"]+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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

  priceAlertDelete(){
    Swal({
      title: 'Are you sure?',
      text: 'You will not receive a Price Alert notifications for '+this.strainDetails["name"]+' strain in '+ this.locationSes["name"],
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        this.removePriceAlert(1,this.alert_id).subscribe(
          data =>{this.check_price_alert =  false; this.alert_id = 0;},
          (err) => {console.log(err.message);}
        );

        toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;"+this.strainDetails["name"]+" in "+this.locationSes["name"]+" is now removed from your Price Alert list", "", {
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

 

  onSubmitReviewForm(form: NgForm) {  

     if($("#starrating").val() == "" || $("#starrating").val() == null){
       console.log("Not set");
       this.rating_req = true;
       return;
     }else{
       this.rating_req = false;
     }

     

     this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }

     /*console.log("Test"+ $("#starrating").val());
     return; */

     this.isValidFormSubmitted = true;
     this.review = form.value;
     this.login_alert.email = form.value.email

     this.review.status = 0;

     if(this.user_data && this.user_data['email']){

      this.review.email = this.user_data['email'];
      this.review.name = this.user_data['name'];
      this.review.user_id = this.user_data["id"];

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.review.email = this.cookieService.get('_mio_user_email');
        this.review.name = this.cookieService.get('_mio_user_name');
        this.review.user_id = parseInt(this.cookieService.get('_mio_user_id'));

    }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id') != ""){

      this.review.user_id = parseInt(this.cookieService.get('_mio_user_id'));
      
    }

    $("#rating").val()

   // console.log($("#rating").val());
    this.review.rating = $("#starrating").val();
    this.review.rating_apperance = $("#apperance").val();
    if(this.review.rating_apperance == "")
    {
      this.review.rating_apperance =0
    }
    this.review.rating_aroma = $("#aroma").val();
    if(this.review.rating_aroma == "")
    {
      this.review.rating_aroma =0
    }
    this.review.rating_high = $("#high").val();
    if(this.review.rating_high == "")
    {
      this.review.rating_high =0
    }
    this.review.rating_quality = $("#quality").val();
    if(this.review.rating_quality == "")
    {
      this.review.rating_quality =0
    }
    this.review.rating_flavor = $("#flavor").val();
    if(this.review.rating_flavor == "")
    {
      this.review.rating_flavor =0
    }
    this.review.rating_value = $("#value").val();
    if(this.review.rating_value == "")
    {
      this.review.rating_value =0
    }
    this.review.strain_id = this.strainDetails["id"];

   // console.log(this.review);return;

    this.expiredDate = new Date();
    this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

   //
   //      

    if(this.checkUser)
    {
     // this.cookieService.set( '_mio_user_name', this.review.name, this.expiredDate,"/" );
     // this.cookieService.set( '_mio_user_email', this.review.email, this.expiredDate ,"/");
      this.postReview().subscribe(
      (data => {    
        this.review_id = data["id"];        
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
        this.checkUser = true;
      }),
      (err: any) => console.log(err),
      () => {              
          if(this.review_id > 0){
            this.review_id  = 0;
            toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp; Awesome! The POW Team has received your review. If it meets the community guidelines, it will be published momentarily. <a href="/members/reviews">Manage Reviews</a>. ', "", {
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

            this.write_review =  false;

            this.review = new Review();   
            form.resetForm();
          }
          
     });
    }
    else
    {
      
      this.review_check_email().subscribe(
      (data => {    
           if(data['data'] > 0)
           {
             console.log(data['data'])
             setTimeout(function(){ 
                $('#login_modal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: false
              });
        }, 1);
           }
           else
           {
             this.postReview().subscribe(
      (data => {    
        this.review_id = data["id"];        
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
        this.checkUser = true;
      }),
      (err: any) => console.log(err),
      () => {              
          if(this.review_id > 0){
            this.cookieService.set( '_mio_user_name', this.review.name, this.expiredDate,"/" );
     this.cookieService.set( '_mio_user_email', this.review.email, this.expiredDate ,"/");
            this.review_id  = 0;
            toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome! The POW Team has received your review. If it meets the community guidelines, it will be published momentarily. <a href="/members/reviews">Manage Reviews</a>. ', "", {
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

            this.write_review =  false;

            this.review = new Review();   
            form.resetForm();
          }
          
     });
           }
      }),
      (err: any) => console.log(err),
      () => {              
          
          
     });
    }
     
  }

  onConverterAlertSubmit(form: NgForm) {  


     this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }

     this.isValidFormSubmitted = true;
     this.converter_alert = form.value;

     this.converter_alert.city = this.locationSes["id"];
     this.converter_alert.strain = this.strainDetails["id"];

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

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strainDetails["name"]+' in '+this.locationSes["name"]+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strainDetails["name"]+' in '+this.locationSes["name"]+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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

  removePriceAlert(type,alert_id){
    return this._http.get<any[]>('remove_price_alert?type='+type+'&id='+alert_id);
  }

  removeFavStn(fav_id){
    return this._http.get<any[]>('remove_fav_strain?id='+fav_id);
  }

  postReview(){
    return this._http.post<any[]>('create_review',this.review);
  }
  review_check_email(){
    return this._http.get<any[]>('review_check_email?email='+this.review.email);
  }

  postfavstrain(){
    return this._http.post<any[]>('set_favorite_strain',this.favstrain);
  }
  addFavDispensary(){
    
  }
  addFavStrain(){

    this.favstrain.city = this.locationSes["id"];
    this.favstrain.strain = this.strainDetails["id"];

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

    this.postfavstrain().subscribe(
      (data => {
        this.exists = data['exists'];
        this.fav_id = data['id'];
      }),
      (err: any) => console.log(err),
      () => {

        if(this.exists){
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strainDetails["name"]+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
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
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strainDetails["name"]+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
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

     this.favstrain.city = this.locationSes["id"];
     this.favstrain.strain = this.strainDetails["id"];

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

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strainDetails["name"]+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
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
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strainDetails["name"]+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
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

  favStrainDelete(){
    Swal({
      title: 'Are you sure?',
      text: this.strainDetails["name"] + ' strain will be removed from your favorite list.',
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

        toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;"+this.strainDetails["name"]+" is now removed from your Favourite Strains list", "", {
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

  getStrainDetail(strainName,id)
  {


  	this.getStrainDetailData(strainName).subscribe(

      (data => {        
      	this.strainDetails = data;   
        //console.log(this.strainDetails)

        if (this.strainDetails.api_status == "0")
        {
            this.routes.navigate(['/']);
        }

        this.image_strain = this.strainDetails["image"];
       // console.log(image);

      }),
      (err: any) => console.log(err),
      () => {


        this.getSocial().subscribe(

              (data => {        
                this.strainSocial = data['data'];                
              //  console.log(this.strainHistory);
                 
              }),
              (err: any) => console.log(err),
              () => {}

    );
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

     this.getStrainReviews().subscribe(

          (data => {        
            this.reviews = data['data'];                
//            console.log(this.reviews);
             
          }),
          (err: any) => console.log(err),
          () => {}

    );

        this.getStrainAttributesInDetail(1).subscribe(

            (data => {        
              this.positiveEffects = data['data'];
              var tt = "";

              if(this.positiveEffects.length > 0){
                
                this.positiveEffects.forEach(function(element,index) {                 
                  if(index < 3 && element.name != "") tt =  tt + element.name + ", ";
                }); 
                
                tt = tt.replace(/, \s*$/, "");
                this.positive_effects = tt;
                //console.log(this.positive_effects);
              }

              if(this.positiveEffects.length == 0)
              {
              	this.positive_message = "No positive effects are available yet.";
              }                           

                this.getStrainAttributesInDetail(2).subscribe(

                  (data => {        
                    this.medicalEffects = data['data'];
                    var tt = "";
                    if(this.medicalEffects.length > 0){
                      
                      this.medicalEffects.forEach(function(element,index) {                 
                        if(index < 3 && element.name != "") tt =  tt + element.name + ", ";
                      }); 
                      
                      tt = tt.replace(/, \s*$/, "");
                      this.medical_effects = tt;
                    }

                     if(this.positiveEffects.length == 0)
              		{
              			this.medical_message = "No medical effects are available yet.";
             		 }                            

                    this.getStrainAttributesInDetail(3).subscribe(

                      (data => {        
                        this.negativeEffects = data['data'];

                       // console.log(this.negativeEffects);
                       if(this.negativeEffects.length == 0)
                       {
                       		this.negative_message = "No negative effects are available yet.";
                       }

                        var tt = "";
                    if(this.negativeEffects.length > 0){
                      
                      this.negativeEffects.forEach(function(element,index) {                 
                        if(index < 3 && element.name != "") tt =  tt + element.name + ", ";
                      }); 
                      
                      tt = tt.replace(/, \s*$/, "");
                      this.negative_effects = tt;
                    } 
                        
                      // console.log(this.positiveEffects);

                       setTimeout(function(){ 
                          SEMICOLON.widget.progress();
                        }, 1);                       
                      
                      }),
                      (err: any) => console.log(err),
                      () => {

                        this.getStrainAttributesInDetail(8).subscribe(

                          (data => {        
                            this.flavourList = data['data'];

                            if(this.flavourList.length == 0)
                            {
                            	this.flavour_message = "No flavours are available yet."
                            }

//                            console.log(this.flavourList);                 
                          
                          }),
                          (err: any) => console.log(err),
                          () => {}

                      );

                      }

                  );
                    
                  // console.log(this.positiveEffects);

                   setTimeout(function(){ 
                      SEMICOLON.widget.progress();
                    }, 1);

                   
                  
                  }),
                  (err: any) => console.log(err),
                  () => {}

              );
              
             //console.log(this.positiveEffects);

             setTimeout(function(){ 
                SEMICOLON.widget.progress();
              }, 1);

             
            
            }),
            (err: any) => console.log(err),
            () => {}

        );        

      	this.getPrices().subscribe(

				      (datanew => {      
				      	if(datanew['data'] != null){
				      		this.strainHistory = datanew['data'];
//                  console.log(this.strainHistory)
				      		this.priceDataAvailable = true;

                  this.getStrainPricesDetail().subscribe(

                          (data => {        
                            this.strainPricesDetail = data['data'];                
                            //console.log([this.strainPricesDetail]);
                             
                          }),
                          (err: any) => console.log(err),
                          () => {}

                  );

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
				      
				      }),
				      (err: any) => console.log(err),
				      () => {}

		    );

        var title = this.strainDetails["name"]+' ( '+this.strainDetails['category'].charAt(0).toUpperCase()+ this.strainDetails['category'].slice(1).toLowerCase()+' ) '+' Marijuana Strain | POW';

        this.title.setTitle(title);

        if(id != ""){
          this.linkClicked(id);
        }


      }

    );     

     

     


  }



  getStrainAttributesInDetail(attr_id): Observable<any[]> {
    return this._http.get<any[]>('get_strain_attribute_in_detail?strain_id='+this.strainDetails["id"]+'&attribute_id=' + attr_id);
  }

  getStrainReviews(): Observable<any[]> {
    return this._http.get<any[]>('get_strain_reviews?strain_id='+this.strainDetails["id"]);
  }

  getStrainPricesDetail(): Observable<any[]> {
    return this._http.get<any[]>('get_strain_prices_detail?strain_id='+this.strainDetails["id"]+'&city_id=' + this.locationSes["id"]);
  }

addUserLog (): Observable<any[]> {
    
    var postdata: any;
    var userId: any;

    userId = 0;

    if(this.user_data && this.user_data['id']!= '')
    {
        userId = this.user_data['id'];
    }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id')!="")
    {
        userId = this.cookieService.get('_mio_user_id');
    }

    //var url = (this.platformLocation as any).location.origin ;
    var url = (this.platformLocation as any).location.href;

    //var detailstmp = {'location' : this.selectedLocation,'strain' : this.selectedStrain, 'mass' : this.selectedMass };
    
    //console.log((this.platformLocation as any).location);
    var details = "NA";
    
    

    var description = "I Feel Like-"+this.strainDetails['name'];


    postdata = {'url' : url , 'description' : description, 'user_id' :userId , 'details': details};
   
    return this._http.post<any[]>('set_user_log',postdata);
  }

  onLogin(form: NgForm)
  {
    this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }
     this.isValidFormSubmitted = true;
     this.login_alert.email = form.value.email;
     this.login_alert.password = form.value.password;

     this.postLogin().subscribe(data => 
            {
            //console.log(data);
            if (data["api_status"]==1)
                {
                   toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Login sucess fully !", "", {
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
                  // window.location.href = '/user-profile';
                   $('#login_modal').modal('hide');

                   this.expiredDate = new Date();
    this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

    //this.cookieService.set( '_mio_user_name', this.converter_alert.name, this.expiredDate,"/" );
    this.cookieService.set( '_mio_user_email', this.login_alert.email, this.expiredDate,"/" );
     this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );      
                   
                   localStorage.setItem('userData',JSON.stringify(data));   
                   this.checkUser = true;
                   this.user_data = data;                
                   this.globals.user_data = true;
                   this.globals.user_name = data["name"];
                   this.globals.user_email = data["email"];
                   //this.getpricealertCount();

                   this.addUserLog().subscribe(
                      (data => {}),
                      (err: any) => console.log(err),
                      () => {}
                    ); 
                   form.resetForm();
                  // this.router.navigate(['/members/dashboard']);

                   //localStorage.setItem('remember_token',data["remember_token"]);
                //form.resetForm();

                  

                }
                else
                {
                    toastr.error("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Please provide valid details !", "", {
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
                
            }, (err) => {
               
                console.log(err.message);
            });
  }

   postLogin(){
    return this._http.post<any[]>('userlogin',this.login_alert);
  }
  offpricealert()
  {
    $("#track_price_alert"). prop("checked", false);
  }
}
