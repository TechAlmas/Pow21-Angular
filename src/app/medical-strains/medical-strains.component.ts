import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { City } from '../models/city';
import { Strain } from '../models/strain';
import { Attribute } from '../models/attribute';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Globals } from '../models/globals';
import { CookieService } from 'ngx-cookie-service';
import {PlatformLocation } from '@angular/common';
import { PriceAlert } from '../models/price-alert';
import { Favstrain } from '../models/fav-strain';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;

@Component({
  selector: 'mio-feel-like',
  templateUrl: './medical-strains.component.html',
  styleUrls: ['./medical-strains.component.css'],
  providers: []
})

export class MedicalStainsComponent implements OnInit, OnDestroy {

  waitLayer = true;
  locations = new City();
  geoLocations = "";

  isValidFormSubmitted = false;
  validateEmail = true;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  converter_alert = new PriceAlert();
  favstrain = new Favstrain();
  check_price_alert = false;

  expiredDate: any;
  user_data : any;
  
  strains = [];
  postive = [];
  negative = [];
  medical = [];
  flavour = [];

  selectedLocation: any;
  selectedPositive = [];
  selectedNegative = [];
  selectedMedical = [];
  selectedFlavour = [];
  sendData = [];
  posData = [];

  guestPush: any[] = new Array;

  selPos = [];
  selNeg = [];
  selFav = [];
  selMed = [];

  posUrl = "";
  negUrl = "";
  favUrl = "";
  finalUrl = "";
  feel_like_title = "";
  sub_text = "";

  page = 1;
  total_count = 0;
  loadMoreButton = false;
  total_count_flag = false;

  selPost: any;

  navigationSubscription;

  checkUser = false;

  strain: any;
  strainName = "";
  strLocationname = "";
  locationSes: any;
  exists:boolean;
  alert_id = 0;
  fav_id = 0;
  og_local:any;

  constructor(private platformLocation: PlatformLocation,private cookieService: CookieService,private globals: Globals,private route: ActivatedRoute,private routes: Router,private title: Title, private meta: Meta, private _http: HttpClient) {

    this.user_data = JSON.parse(localStorage.getItem('userData'));
    this.navigationSubscription = this.routes.events.subscribe((e: any) => {
     // If it is a NavigationEnd event re-initalise the component
     if (e instanceof NavigationEnd) {
       this.initialiseInvites();
     }
   });

  }

  initialiseInvites() {

    if(localStorage.getItem('locationData')!= null)
    {      
      this.locationSes = JSON.parse(localStorage.getItem('locationData'));
    }

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

     window.scrollTo(0, 0);
     // Set default values and re-fetch any data you need.
    
      this.selectedMedical = [];
      this.selectedFlavour = [];

    this.route.params.subscribe(params => {
          
          this.globals.location_global_url = params['country'];

          if(typeof params['attr1'] !== "undefined")
          {
            if(params['attr1'].startsWith("medical-")){
                var tmp_attr1 = params['attr1'].replace("medical-","");
                var tmp_attr1_val = tmp_attr1.split(",");
                this.selectedMedical = tmp_attr1_val;
            }

            if(params['attr1'].startsWith("flavour-")){
                var tmp_attr1 = params['attr1'].replace("flavour-","");
                var tmp_attr1_val = tmp_attr1.split(",");
                this.selectedFlavour = tmp_attr1_val;
            }

          }

          if(typeof params['attr2'] !== "undefined")
          {

            if(params['attr2'].startsWith("medical-")){
                var tmp_attr2 = params['attr2'].replace("medical-","");
                var tmp_attr2_val = tmp_attr2.split(",");
                this.selectedMedical = tmp_attr2_val;
            }



            if(params['attr2'].startsWith("flavour-")){
                var tmp_attr2 = params['attr2'].replace("flavour-","");                
                var tmp_attr2_val = tmp_attr2.split(",");
                this.selectedFlavour = tmp_attr2_val;
//                console.log(this.selectedFlavour);
            }

          }      
        
        })        

        this.loadAttributes();

        this.loadStrains();

        $(".select-tags").select2({
          tags: true
        });

        var $el = $('.select-tags');
        $el.on('select2:opening', function(e) {
            if ($el.data('unselecting')) {    
                $el.removeData('unselecting');
                setTimeout(function() {
                    $el.select2('close');
                }, 1);
            }
        }).on('select2:unselecting', function(e) {
            $el.data('unselecting', true);
        });
   }

   ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {

    if(this.globals.location_global_url == 'canada')
    {
      this.og_local = "en_CA"
    }
    if(this.globals.location_global_url == 'us')
    {
      this.og_local = "en_US"
    }

    //console.log(this.globals.location_global_url)

    $('body').addClass('i-feel-like');      

    this.loadMetaData();
  }

  onConverterAlertSubmit(form: NgForm) {  

     this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }

     this.isValidFormSubmitted = true;
     this.converter_alert = form.value;

     this.converter_alert.city = this.locationSes["id"];
     this.converter_alert.strain = this.strain.id;

     this.converter_alert.status = 1;

    if(this.user_data && this.user_data['email']){

      this.converter_alert.email = this.user_data['email'];
      this.converter_alert.name = this.user_data['name'];
      this.converter_alert.user_id = this.user_data["id"];

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.converter_alert.email = this.cookieService.get('_mio_user_email');
        this.converter_alert.name = this.cookieService.get('_mio_user_name');
        this.converter_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
    }else{
      this.converter_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
    }


    this.expiredDate = new Date();
    this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

    this.cookieService.set( '_mio_user_name', this.converter_alert.name, this.expiredDate,"/" );
    this.cookieService.set( '_mio_user_email', this.converter_alert.email, this.expiredDate,"/" );     

     this.postPriceAlert().subscribe(
      (data => {

        this.exists = data['exists'];
        this.alert_id = data['id'];
        
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
        this.checkUser = true;
      }),
      (err: any) => console.log(err),
      () => {
        if(this.alert_id == 0){

          toastr.error('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Oops! your requested strain '+this.strain.name+' not available at '+this.locationSes.name+'.', "", {
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
          

          $("#alert_"+this.strain.id+"_active").removeClass("iact");
          $("#alert_"+this.strain.id+"_active").addClass("act");

          $("#alert_"+this.strain.id).removeClass("act");
          $("#alert_"+this.strain.id).addClass("iact");

          $("#alert_"+this.strain.id+"_active").removeAttr("data-id");
          $("#alert_"+this.strain.id).removeAttr("data-id");           

          $("#alert_"+this.strain.id+"_active").attr("data-id",this.alert_id);
          $("#alert_"+this.strain.id).attr("data-id",this.alert_id);


          if(this.exists){   

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strain.name+' in '+this.locationSes.name+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", { 
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
            toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strain.name+' in '+this.locationSes.name+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", { 
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

        }
        
     });

     //this.converter_alert = new PriceAlert();   
     $('#myModal').modal('hide');
  }

  postPriceAlert(){
    return this._http.post<any[]>('set_price_alert',this.converter_alert);
  }

  addPriceAlertPost(strain){

    this.converter_alert.city = this.locationSes["id"];
    this.converter_alert.strain = this.strain.id;

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

    this.postPriceAlert().subscribe(
      (data => {

        this.exists = data['exists'];
        this.alert_id = data['id'];
      }),
      (err: any) => console.log(err),
      () => {

        if(this.alert_id == 0){

          toastr.error('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Oops! your requested strain '+this.strain.name+' not available at '+this.locationSes.name+'.', "", {
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
          

          $("#alert_"+strain.id+"_active").removeClass("iact");
          $("#alert_"+strain.id+"_active").addClass("act");

          $("#alert_"+strain.id).removeClass("act");
          $("#alert_"+strain.id).addClass("iact");

          $("#alert_"+strain.id+"_active").removeAttr("data-id");
          $("#alert_"+strain.id).removeAttr("data-id");           

          $("#alert_"+strain.id+"_active").attr("data-id",this.alert_id);
          $("#alert_"+strain.id).attr("data-id",this.alert_id);


          if(this.exists){         

            toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strain.name+' in '+this.locationSes.name+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", { 
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
            toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strain.name+' in '+this.locationSes.name+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", { 
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
        }
        
     });
  }

  removeFavStn(fav_id){
    return this._http.get<any[]>('remove_fav_strain?id='+fav_id);
  }

  favStrainDelete(strain){
    Swal({
      title: 'Are you sure?',
      text: strain.name + ' strain will be removed from your favorite list.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        let favId = $("#fav_"+strain.id+"_active").data("id");

        //console.log(strain.fav_id);

        this.removeFavStn(favId).subscribe(
          data =>{
            
            $("#fav_"+strain.id+"_active").removeClass("act");
            $("#fav_"+strain.id+"_active").addClass("iact");

            $("#fav_"+strain.id).removeClass("iact");
            $("#fav_"+strain.id).addClass("act");

            $("#fav_"+strain.id+"_active").removeAttr("data-id");
            $("#fav_"+strain.id).removeAttr("data-id");           

            $("#fav_"+strain.id+"_active").attr("data-id","0");
            $("#fav_"+strain.id).attr("data-id","0");

          },
          (err) => {}
        );

        toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;"+strain.name+" is now removed from your Favourite Strains list", "", {
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
          'Your strain has been deleted.',
          'success'
        )*/
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      }/* else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }*/
    });
  }

  addFavStrain(strain){

    this.favstrain.city = this.locationSes["id"];
     this.favstrain.strain = this.strain.id;

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
        if(this.fav_id == 0){

        }else{
          $("#fav_"+strain.id+"_active").removeClass("iact");
          $("#fav_"+strain.id+"_active").addClass("act");

          $("#fav_"+strain.id).removeClass("act");
          $("#fav_"+strain.id).addClass("iact");

          $("#fav_"+strain.id+"_active").removeAttr("data-id");
          $("#fav_"+strain.id).removeAttr("data-id");           

          $("#fav_"+strain.id+"_active").attr("data-id",this.fav_id);
          $("#fav_"+strain.id).attr("data-id",this.fav_id);

            if(this.exists){         

               toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strain.name+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
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
                toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strain.name+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
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

        }
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
     this.favstrain.strain = this.strain.id;

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

        if(this.fav_id == 0){

        }else{
          
          $("#fav_"+this.strain.id+"_active").removeClass("iact");
          $("#fav_"+this.strain.id+"_active").addClass("act");

          $("#fav_"+this.strain.id).removeClass("act");
          $("#fav_"+this.strain.id).addClass("iact");

          $("#fav_"+this.strain.id+"_active").removeAttr("data-id");
          $("#fav_"+this.strain.id).removeAttr("data-id");           

          $("#fav_"+this.strain.id+"_active").attr("data-id",this.fav_id);
          $("#fav_"+this.strain.id).attr("data-id",this.fav_id);

          if(this.exists){         

              toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strain.name+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
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
              toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Pu-Pow, '+this.strain.name+' is now in your Favourite Strain list. Quickly access all your <a href="/members/strain-favorites">favourite strains here</a>.', "", {
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
        }
      }
     );

     $('#myModal_fav').modal('hide');

  }

  postfavstrain(){
    return this._http.post<any[]>('set_favorite_strain',this.favstrain);
  }

  addToFavoriteList(strain){    

    if(localStorage.getItem('locationData')!= null)
    {
      this.strain = strain;

      if(this.checkUser){
        this.addFavStrain(strain);
      }else{
          $('#myModal_fav').modal('show');
      }

    }    
    
  }

  addPriceAlert(strain){    

    if(localStorage.getItem('locationData')!= null)
    {
      this.strain = strain;

      if(this.checkUser){
        this.addPriceAlertPost(strain);
      }else{
          $('#myModal').modal('show');
      }

    }    
    
  }

  loadMetaData(){
   //console.log((this.platformLocation as any).location.pathname);
   //console.log(this.globals.location_global_url);
   //this.finalUrl.replace("/", "&"); 
   var replaceString = (this.platformLocation as any).location.pathname;
   var replaceWord = "/" + this.globals.location_global_url + "/";
   var currentUrl =replaceString.replace(replaceWord, "/");

   //console.log(replaceString);   console.log(replaceWord);      console.log(currentUrl);

   
    this.getMetaData("/compare-medical-marijuana").subscribe(

      (data => {        
        
        if(this.feel_like_title != ""){
          this.title.setTitle("Marijuana strains "+this.feel_like_title);
          this.meta.updateTag({name: 'og:title', content: "Marijuana strains "+this.feel_like_title});
        }
        else{
          this.title.setTitle(data['title']);          
          this.meta.updateTag({name: 'og:title', content: data['title']});
        }
        //console.log(this.og_local)
        
        this.meta.updateTag({name: 'keywords', content: data['keywords']});
        this.meta.updateTag({name: 'description', content: data['description']});
        this.meta.updateTag({name: 'og:description', content: data['description']});
        this.meta.updateTag({name: 'og:locale', content: this.og_local});
               
      }),
      (err: any) => console.log(err),
      () => {}

    );
  }

  getMetaData(currentUrl): Observable<any[]> {
    var postData = {"url":currentUrl};
    return this._http.post<any[]>('getmetadata',postData);
  }  

  loadStrains() {    
    this.waitLayer = true;
    this.getStrains().subscribe(

      (data => {
        if(this.page == 1){
          this.strains = data['data'];
        }else{
          this.strains = this.strains.concat(data['data']);
        }      
        //console.log(this.strains);  
        this.total_count = data["total_count"];

        this.total_count_flag = true;

        //this.total_count =  200;

        let total_pages = Math.ceil(this.total_count/48);

        (this.page >= total_pages) ? this.loadMoreButton = false : this.loadMoreButton = true;
        

      }),
      (err: any) => console.log(err),
      () => {}
    );    
  }

  addFilterByLink(type,value){

    //console.log(type);

    var redirect = true;

    if(type == "medical"){

      if(this.selectedMedical.indexOf(value) == -1) {
        this.selectedMedical.push(value);
      }else{
        redirect = false;
      }
       
    }else if(type == "flavour"){
        if(this.selectedFlavour.indexOf(value) == -1) {
        this.selectedFlavour.push(value);
      }else{
        redirect = false;
      }
    }

    if(redirect){
      this.finalUrl = this.getFInalUrl();
      this.routes.navigate(['/'+ this.globals.location_global_url +'/compare-medical-marijuana/'+this.finalUrl]);
    }


    
    this.finalUrl = this.getFInalUrl();

    this.routes.navigate(['/'+ this.globals.location_global_url +'/compare-medical-marijuana/'+this.finalUrl]);
  }

  getFInalUrl(flag=0){

    var fu = "";
    var title = "";
    var subText = "";

    if(this.selectedMedical.length > 0){
      
      this.selectedMedical.forEach((item, index) => {

        item = item.split(":"); 
        if(item[0] && !item[1]){
          item = item[0];
        }else{
          item = item[1];
          item = item.replace(/['"]+/g, '');
        } 
       // console.log(item);     
       
        item = $.trim(item);

         if(index == 0){
           fu = "/medical-" +  item;
           title = "that helps with " + item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
           subText = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
         }else{
           fu = fu + ","+ item;
           title = title + ", " + item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();

           subText = subText + ", " + item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
         }

      });
    }

    if(this.selectedFlavour.length > 0){
      
      this.selectedFlavour.forEach((item, index) => {

        item = item.split(":"); 
        if(item[0] && !item[1]){
          item = item[0];
        }else{
          item = item[1];
          item = item.replace(/['"]+/g, '');
        } 
        //console.log(item);     
       
        item = $.trim(item);

        if(index == 0){
           fu = fu + "/flavour-" +   item;
           title = title+ " and smells like "+ item;
         }else{
           fu = fu + ","+ item;
           title = title + ", "+ item;
         }
      });
    }

    fu = fu.replace(/\s+/g, '-').toLowerCase();
    fu = fu.replace(/^\/|\/$/g, '');

    this.feel_like_title = title;

    if(subText == ""){
      subText = "any medical purpose"; 
    }
    this.sub_text = subText;

    return fu;
  }

  loadAttributes(){      

    this.getAttributes(2).subscribe(

      (data => {
        this.medical = data['data'];

        /*setTimeout(function() {
          $("#feel-like-medical").select2();
        }, 2000);*/

        jQuery('#feel-like-medical').on(
            'change',
            (e) => {
              
              if($("#feel-like-medical").val().length > 0){

                this.selectedMedical = $("#feel-like-medical").val();
                
              }else{
                this.selectedMedical = [];
               
              }
              this.page = 1;
              this.finalUrl = this.getFInalUrl();
              //console.log(this.finalUrl);

              this.routes.navigate(['/'+ this.globals.location_global_url +'/compare-medical-marijuana/'+this.finalUrl]); 


            }
        );

      }),
      (err: any) => console.log(err),
      () => {}
    );

    this.getAttributes(8).subscribe(

      (data => {
        this.flavour = data['data'];
       
       /* setTimeout(function() {
          $("#feel-like-flavour").select2();
        }, 2000);*/

        jQuery('#feel-like-flavour').on(
            'change',
            (e) => {

              if($("#feel-like-flavour").val().length > 0){

                this.selectedFlavour = $("#feel-like-flavour").val();
                
              }else{
                this.selectedFlavour = [];
               
              }

              this.page = 1;

              this.finalUrl = this.getFInalUrl();
              //console.log(this.finalUrl);

              this.routes.navigate(['/'+ this.globals.location_global_url +'/compare-medical-marijuana/'+this.finalUrl]);       
            }
        );
      }),
      (err: any) => console.log(err),
      () => {}
    );

  }

  getCities (): Observable<City[]> {
    return this._http.get<City[]>('locations');
  }

  getAttributes (parent_id): Observable<Attribute[]> {
    return this._http.get<Attribute[]>('attributes?attribute_id='+parent_id);
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
    if(this.finalUrl!="")
    {
       details = this.finalUrl;
    }
    

    var description = "Medical Cannabis";


    postdata = {'url' : url , 'description' : description, 'user_id' :userId , 'details': details};
   
    return this._http.post<any[]>('set_user_log',postdata);
  }




  removePriceAlert(type,alert_id){
    return this._http.get<any[]>('remove_price_alert?type='+type+'&id='+alert_id);
  }

  priceAlertDelete(strain){
    Swal({
      title: 'Are you sure?',
      text: 'You will not receive a Price Alert notifications for '+strain.name+' strain in '+ this.locationSes.name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        let alertId = $("#alert_"+strain.id+"_active").data("id");

        this.removePriceAlert(1,alertId).subscribe(
          data =>{
            
            $("#alert_"+strain.id+"_active").removeClass("act");
            $("#alert_"+strain.id+"_active").addClass("iact");

            $("#alert_"+strain.id).removeClass("iact");
            $("#alert_"+strain.id).addClass("act");

            $("#alert_"+strain.id+"_active").removeAttr("data-id");
            $("#alert_"+strain.id).removeAttr("data-id");           

            $("#alert_"+strain.id+"_active").attr("data-id","0");
            $("#alert_"+strain.id).attr("data-id","0");


          },
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

  loadMoreStrain(){
    console.log("Test");
    this.page = this.page + 1;

    this.loadStrains();

  }

  getStrains (): Observable<Strain[]> {
    this.total_count_flag = false;
    this.finalUrl = this.getFInalUrl();   

    if(this.page == 1){

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

    var res = this.finalUrl.replace("/", "&");  
    res = res.replace("medical-", "medical=");
    res = res.replace("flavour-", "flavour=");
    res = res.replace("/", "&"); 

     var  userID = 0;

     if(this.user_data && this.user_data['email']){

        userID = this.user_data["id"];

      }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id') != ""){

          userID = parseInt(this.cookieService.get('_mio_user_id'));
      }

    //return this._http.get<Strain[]>('strains?attributes='+ this.finalUrl);
    return this._http.get<Strain[]>('strains?'+res+"&city_id="+this.locationSes["id"]+'&user_id='+userID+'&page='+ this.page);

  }


}
