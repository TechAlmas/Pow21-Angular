export class Dispensary{
  id: number;
  name: string;
  city: string;
  state: string;
  country: string;
  logoUrl: string;  
  price: string;

} 

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { City } from '../models/city';
import { Strain } from '../models/strain';
import { Mass } from '../models/mass';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import {Globals} from '../models/globals';
import {PlatformLocation } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { PriceAlert } from '../models/price-alert';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;
declare var SEMICOLON: any;

@Component({
  selector: 'mio-compare-price',
  templateUrl: './compare-price.component.html',
  styleUrls: ['./compare-price.component.css'],
  providers: []
})

export class ComparePriceComponent implements OnInit, OnDestroy {

  waitLayer = true;
  locations = new City();
  strains = [];
  mass = [];
  dispensaries = [];
  geoLocations = "";

  dispData = [];
  message: string;
  converter_alert = new PriceAlert();

  compare_title = "";
  selectedLocation: any;
  selectedStrain: any;

  selectedLocName: string;
  selectedStrName: string;

  selectedLocation_city:any;
  selectedMass: any;
  defaultStrain = [{strain_id: 0, name: 'Marijuana'}];
  defaultMass = [{mass_id: 1, name: '1 Gram'}];
  strainName: string;
  massName: string;
  total_pages: number;
  loadmore: boolean = false;
  limit: number = 10;
  page: number = 1;

  user_data = [];
  locationSes: any;
  nearByCities = true;
  nearByOtherCities = true;
  route_strain: any;
  route_id: any;
  //category:any;
  strainsid: any;
  strainsidarray: any;
  selectedLocation1: any;
  locationname: any;
  aval_message = false;
  selectedStateName = "";
  expiredDate:any;
  selectedstateid: any;
  route_state:any;
  route_st:any;
  route_statename:any;
  meta_title:any;
  og_local:any;
  route_cityname: any;
  state_label: any;
  strain_slug: any;
  state_label_other: any;
  price_alert_target = false;
  route_id1 :any;
  user_email: any;
  check_price_alert = false;
  alert_id = 0;
  checkUser = false;
  exists:boolean;
  isValidFormSubmitted = false;


  navigationSubscription;

  constructor(private platformLocation: PlatformLocation,private cookieService: CookieService,private route: ActivatedRoute,private routes: Router,private title: Title, private meta: Meta, private _http: HttpClient, private globals: Globals,private router: Router) {
    //this.getStrainid();

    this.navigationSubscription = this.routes.events.subscribe((e: any) => {
     if (e instanceof NavigationEnd) {
       this.initialiseInvites();
     }
   });

  this.route.paramMap.subscribe(params => {


       
        this.strain_slug = params['params']['strainName'];
        
        if(params['params']['strainName'] != null && params['params']['cityName'] != null )
        {
          //console.log(params)
          this.price_alert_target = true;
         

          //console.log(this.route_id)

        }

       
  })
  

  // this.getStrainid();

  

  //console.log(this.price_alert_target);

   


  }  

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  getGeoLocation (): Observable<any[]> {
    return this._http.get<any[]>('getusergeolocation');
  }

  initialiseInvites() {

   // window.scrollTo(0, 0);

this.locationSes = JSON.parse(localStorage.getItem('locationData'));

   
    //console.log(this.locationSes.country)
    this.selectedstateid=this.locationSes["state_id"];
    
    this.user_data = JSON.parse(localStorage.getItem('userData'));


    if(this.user_data && this.user_data['email']){

      this.converter_alert.email = this.user_data['email'];
      this.converter_alert.user_id = this.user_data["id"];
      this.converter_alert.name = this.user_data['name'];
      this.checkUser = true;
      

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

       this.converter_alert.email = this.cookieService.get('_mio_user_email');
        this.converter_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
         this.converter_alert.name = this.cookieService.get('_mio_user_name');
        this.checkUser = true;
       
      
    }
//    console.log(this.user_data);

    this.selectedLocation = 0;
    
    this.selectedStrain = 0;

    this.loadLocations();    
    //this.check_price_alert_data();
     

  }

  ngOnInit() {

     this.locationSes = JSON.parse(localStorage.getItem('locationData'));
    if(this.locationSes == null)
    {
       this.getGeoLocation().subscribe(

      (data => {        
        localStorage.setItem('locationData',JSON.stringify(data['data']));
      

      
      }),
      (err: any) => console.log(err),
      () => {}

    );
    }

//console.log(this.selectedLocation)

    if(this.locationSes.country == 'Canada')
    {
      this.state_label = "My Province";
      this.state_label_other ="Other Province";
    }
    else
    {
      this.state_label = "My State";
      this.state_label_other ="Other State";
    }
    

    //console.log(this.state_label);

    if(this.globals.location_global_url == 'canada')
    {
      this.og_local = "en_CA"
    }
    if(this.globals.location_global_url == 'us')
    {
      this.og_local = "en_US"
    }

    jQuery('#converter-location').on(
            'change',
            (e) => {            

              this.selectedLocation = jQuery(e.target).val();
              //console.log(this.selectedLocation); return;
              var data1 = $('#converter-location').select2('data');
              //console.log(data1)
              this.selectedLocName = data1[0].text;
             // console.log(this.selectedLocName)
              this.expiredDate = new Date();
              // console.log(this.selectedLocation);
               this.getstate_name(this.selectedLocation).subscribe(data => {
                // console.log(data)
               
                 this.cookieService.set('selcted_city_id', this.selectedLocation);

                 //console.log('/'+ this.globals.location_global_url +'/'+data['data'][0].state.replace(/\s+/g, '-').toLowerCase()+'/compare-price');
                 //console.log(this.selectedLocation.startsWith("0_"));
                 if(this.selectedLocation == 0){
                   this.routes.navigate(['/'+ this.globals.location_global_url +'/'+this.locationSes["state"].replace(/\s+/g, '-').toLowerCase()+'/compare-price']);
                 }else if (this.selectedLocation.startsWith("0_")){

                  // console.log(data['data'][0])
                    this.routes.navigate(['/'+ this.globals.location_global_url +'/'+this.selectedLocName.replace(/\s+/g, '-').toLowerCase()+'/compare-price']);
                 }else{
                   this.routes.navigate(['/'+ this.globals.location_global_url +'/'+data['data'][0].state.replace(/\s+/g, '-').toLowerCase()+'/'+data['data'][0].city.replace(/\s+/g, '-').toLowerCase()+'/compare-price']);
                 }

                 

               });

            }
        );

    jQuery('#converter-strn').on(
            'change',
            (e) => {
              var data1 = $('#converter-strn').select2('data');
              this.selectedStrain = jQuery(e.target).val();
              this.strainName = data1[0].text;
             // console.log(this.strainName);
              this.dispensaries = [];
              this.page = 1;
              var slug =  this.strains.filter(
              loc => loc.name === this.strainName);
              // console.log(this.route_statename); return;
              if(this.route_statename == undefined)
              {
                this.route_statename = this.locationSes["state"].replace(/\s+/g, '-').toLowerCase();
              }
              if(this.route_cityname == undefined)
              {
                this.route_cityname = this.locationSes["city"].replace(/\s+/g, '-').toLowerCase();
                
              }
             

             // console.log(['/'+ this.globals.location_global_url +'/'+this.route_statename+'/'+this.route_cityname+'/compare-price/'+slug[0].slug]); return;

              //console.log(slug[0].slug)
               //this.cookieService.set('selcted_city_id', this.selectedLocation);

               this.routes.navigate(['/'+ this.globals.location_global_url +'/'+this.route_statename+'/'+this.route_cityname+'/compare-price/'+slug[0].slug]);

              //this.loadDispensaries();
            }
        );
    


   

  }

  getStrainDetailData(strainName): Observable<any[]> {
  //  console.log(strainName);
    return this._http.get<any[]>('getstraindetail?slug='+strainName);
  }

  getStrainid(strain_slug){
    //console.log(this.route_strain)
     this.getStrainDetailData(strain_slug).subscribe(
         (data => {
          // console.log(data)

           this.route_id1 = data["id"] || 0;
          // console.log(this.route_id1);

         }),
         (err: any) => console.log(err),
          () => {}
      );

    

  }

  trackBucttonClick(id)
  {
    //console.log(this.alert_id)
    if(this.alert_id == 0){
      if(this.checkUser){
       this.addPriceAlert()
      
      }else{
        $('#myModal').modal('show');
      }
    }else{
      this.priceAlertDelete();
    }
  }
  addPriceAlert(){
    this.converter_alert.city = this.selectedLocation;
    this.converter_alert.state =this.locationSes["state_id"];
    this.converter_alert.strain =this.route_id;
    if(this.converter_alert.strain == undefined)
    {
      this.converter_alert.strain = '0';
    }
         this.postPriceAlert().subscribe(
      (data => {
        //console.log(data)
        this.exists = data['exists'];
        this.alert_id = data['id'];        
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
        this.checkUser = true;
      }),
      (err: any) => console.log(err),
      () => {
        if(this.exists){         

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for'+this.strainName+'<a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for'+this.strainName+'<a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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
   // console.log(this.converter_alert);

     /*console.log(this.selectedLocation);
       console.log(this.route_id);*/
   }
   priceAlertDelete(){
    Swal({
      title: 'Are you sure?',
      text: 'You will not receive a Price Alert notifications for'+this.strainName,
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

        toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;removed from your Price Alert list"+this.strainName, "", {
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

  loadLocations(){

    this.waitLayer = true;
    this.getCities().subscribe(

      (data => {

        this.locations = data['data'];
        //console.log(this.locations);
       

        var myLoc = {'id':this.locationSes["id"],'name':this.locationSes["name"]};
        var myLoc1 = {'id':this.locationSes["id"],'name':this.locationSes["state"]};
        this.locations["user_location"] = [myLoc];
        this.locations["user_state"] = [myLoc1];
//         console.log(this.locations)

        if(this.locations["near_cities"].length == 0){
          this.nearByCities = false;
        }

        if(this.locations["near_other_cities"].length == 0){
          this.nearByOtherCities = false;
        }

        if(this.cookieService.get('selcted_city_id') != ""){

           this.selectedLocation = this.cookieService.get('selcted_city_id');
        }
        else
        {
          this.selectedLocation = 0;
        }

      //  console.log(this.selectedLocation);

        /*if(this.locationSes["city_level"]){
          this.selectedLocName = this.locationSes["name"];
        }else{
          this.selectedLocName = this.locationSes["state"]+", "+this.locationSes["country"];
        }*/

        this.route.params.subscribe(params => {

        this.globals.location_global_url = params['country'];

        if(typeof params['cityName'] !== "undefined")
        {
          this.route_cityname = params['cityName'];
          //console.log(this.locations)

          var selectedCity = [];

          selectedCity = this.locations["rest_cities"].filter(
              loc => loc.city.replace(/\s+/g, '-').toLowerCase() === params['cityName']);

          if(selectedCity.length == 0){
            selectedCity = this.locations["near_cities"].filter(
              loc => loc.city.replace(/\s+/g, '-').toLowerCase() === params['cityName']);
          }

          if(selectedCity.length == 0){
            selectedCity = this.locations["near_other_cities"].filter(
              loc => loc.city.replace(/\s+/g, '-').toLowerCase() === params['cityName']);
          }

          if(this.cookieService.get('selcted_city_id') != ""){

            //console.log(selectedCity)

            this.selectedLocation = this.cookieService.get('selcted_city_id')
          }else if(selectedCity.length == 0){
            //console.log('default')
            this.selectedLocation = this.locationSes["id"]
          }else{
           // console.log('selected')
            this.selectedLocation = selectedCity[0].id; 
          }     
          

        }
        else if(typeof params['stateName'] !== "undefined")
        {
            var selectedState = [];
            selectedState = this.locations["state"].filter(
              loc => loc.state.replace(/\s+/g, '-').toLowerCase() === params['stateName']);
            if(selectedState.length != 0){
              this.selectedLocation = selectedState[0].state_id;
            }
        }

        else{
         

          this.selectedStateName = this.locationSes["state"];
          this.selectedstateid = this.locationSes["state_id"];
        }

        if(typeof params['strainName'] !== "undefined")
        {

          this.route_strain = params['strainName'];
          //this.getStrainid(this.route_strain)
        }else{
          this.selectedStrName = "Marijuana";
          this.selectedStrain = 0;
        }
        if(typeof params['stateName'] !== "undefined")
        {
          this.route_statename = params['stateName'];


        }


    

      });
        

        setTimeout(function() {
          jQuery('#converter-location').select2();
        }, 100);
        
        

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

         this.selectedStrain = 0;
        this.strainName = "";  

        this.message = data['api_message'];

        //console.log(this.route_strain)
        if(this.route_strain == undefined)
        {
         // console.log("Harsh")
          this.route_strain = 0;
        }

        if(this.route_strain){
          console.log(this.route_strain)

          this.getStrainDetailData(this.route_strain).subscribe(

               (data => {

                   this.route_id = data["id"] || 0;
                    
//console.log(this.route_id)


                   var selectedCounty = this.strains.filter(strain => strain.strain_id === this.route_id);
                   if(selectedCounty.length == 1){
                       this.selectedStrain = parseInt(data["id"]);
                       this.strainName = data["name"];
                   }else{
                     this.selectedStrain = 0;
                     toastr.error("<i class='icon-warning-sign'></i>&nbsp;&nbsp;Pu-Pow, Sorry, we can't find this strains availability in your city or province at this time. When it becomes available at a local dispensary or retailer, we'll show you the price comparison", "", {
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

                    this.checkPriceAlert().subscribe(

                      (data => {
                        //console.log(data["exists"]);
                        this.check_price_alert = data['exists'];
                        this.alert_id = data['id'];
                        /*console.log(this.selectedLocation);
                        console.log(this.route_id);*/
                        //console.log(this.check_price_alert);
                      }),
                      (err: any) => console.log(err),
                      () => {}
                    );  
               }),
               (err: any) => console.log(err),
                  () => {

                    setTimeout(function() {
                      jQuery('#converter-strn').select2();
                    }, 100);
                   this.dispensaries = [];
                   this.page = 1;
                   this.loadDispensaries();
                   this.waitLayer = false;
                  }
               );

         

        }else{
          setTimeout(function() {
            jQuery('#converter-strn').select2();
          }, 100);
         this.dispensaries = [];
         this.page = 1;
         this.loadDispensaries();
         this.waitLayer = false;
         this.route_id = 0;
         this.checkPriceAlert().subscribe(

                      (data => {
                        //console.log(data["exists"]);
                        this.check_price_alert = data['exists'];
                        this.alert_id = data['id'];
                        /*console.log(this.selectedLocation);
                        console.log(this.route_id);*/
                        //console.log(this.check_price_alert);
                      }),
                      (err: any) => console.log(err),
                      () => {}
                    );
        }

        //this.selectedStrain = this.route_id;

        //this.strainName = this.route_strain. split('-').join(' ').toUpperCase();       

        
        
        
        
      }),

      (err: any) => console.log(err),
      () => {
         //this.loadMass();
         
      }
    );
    // this.waitLayer = false;
  }
  loadMoreData(){
    this.loadDispensaries();
  }

  loadDispensaries() {

   // this.cookieService.set("selcted_city_id","");

    this.waitLayer = true;
    this.getDispensaries().subscribe(

      (data => {
        this.dispData = data['data'];
         if(this.cookieService.get('selcted_city_id') != ""){
               this.cookieService.set("selcted_city_id","");
          }
        
          //console.log('call api');
        this.dispData.map(item => {
            return {
                id: item.id,
                name: item.name,
                city: item.city,
                state: item.state,
                country: item.country,
                logoUrl: item.logoUrl,
                price: item.price,
                ratings: item.ratings,
                reviews: item.reviews,
                slug: item.slug,
                category: item.category
                
            }
        }).forEach(item => this.dispensaries.push(item));

//        console.log(this.strainName);
        if(this.route_cityname == undefined)
        {
          this.route_cityname = "";
        }

        if(this.strainName == "" || this.strainName == "Marijuana"){
          if(this.route_cityname == "")
          {
            this.compare_title = "Find the best deals. Compare marijuana strains in "+data['state'];
            this.meta_title = "Find the best deals. Compare marijuana strains in "+data['state'];
          }
          else
          {
          this.compare_title = "Find the best deals. Compare marijuana strains in "+this.route_cityname.charAt(0).toUpperCase() + this.route_cityname.replace('-',' ').slice(1)+", "+data['state'];   
          this.meta_title = "Compare marijuana strains in "+this.route_cityname.charAt(0).toUpperCase() + this.route_cityname.replace('-',' ').slice(1)+" "+data['state'];
          }        
        }else{
          if(this.route_cityname == "")
          {
            this.compare_title = "Find the best deals. Compare "+this.strainName+ " marijuana strains in "+data['state'];
            this.meta_title = "Find the best deals. Compare "+this.strainName+ " marijuana strains in "+data['state'];
          }else{
          this.compare_title = "Find the best deals. Compare "+this.strainName+ " marijuana strains in "+this.route_cityname.charAt(0).toUpperCase() + this.route_cityname.replace('-',' ').slice(1)+", "+data['state'];      
          this.meta_title = "Compare "+this.strainName+ " marijuana strains in "+this.route_cityname.charAt(0).toUpperCase() + this.route_cityname.replace('-',' ').slice(1)+" "+data['state'];
        }

        }
        //this.selectedStateName = data["state"];
        this.loadMetaData();
        
        this.message = data['api_message'];
        this.total_pages = Math.ceil(data['total_data']/this.limit);
        
      }),
      (err: any) => console.log(err),
      () => {   
        if(this.page>=this.total_pages){
          this.loadmore = false;
        } else{
          this.loadmore = true;
        }       
        this.page = this.page + 1;
        this.waitLayer = false;
      }
    );
    // this.waitLayer = false;
  }

  loadMetaData(){
   //console.log((this.platformLocation as any).location.pathname);
   //console.log(this.globals.location_global_url);
   //this.finalUrl.replace("/", "&"); 
   var replaceString = (this.platformLocation as any).location.pathname;
   var replaceWord = "/" + this.globals.location_global_url + "/";
   var currentUrl =replaceString.replace(replaceWord, "/");

   //console.log(replaceString);   console.log(replaceWord);      

//   console.log(currentUrl);

   
    this.getMetaData("/compare-price").subscribe(

      (data => {

       
        
//        console.log("Load Meta");
        if(this.meta_title != ""){
          this.title.setTitle(this.meta_title + " | POW21.com");
          this.meta.updateTag({name: 'og:title', content: this.meta_title + " | POW21.com"});
        }
        else{
          this.title.setTitle(data['title']);
          this.meta.updateTag({name: 'og:title', content: data['title']});
        }
        
        this.meta.updateTag({name: 'keywords', content: data['keywords']});
        this.meta.updateTag({name: 'description', content: data['description']});
        //this.meta.updateTag({name: 'og:title', content: data['title']});
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

  getDispensaries (): Observable<Dispensary[]> {
    //console.log(this.selectedStrain);
    if(this.selectedLocation == 0){
      var cityId = this.locationSes["id"];
    }else{
      var cityId = this.selectedLocation;
    }
    return this._http.get<Dispensary[]>('dispensaries?city=' + cityId + '&state='+this.selectedstateid+'&strain=' + this.selectedStrain + '&page=' + this.page + '&limit=' + this.limit);
  }

  getCities (): Observable<any[]> { 
    
    var cid = JSON.stringify(this.locationSes);
      return this._http.get<any[]>('locations?userCityData='+cid);
  }

  getstate_name(id){
    return this._http.get<any[]>('getstatename?id='+id);
  }

  getstate_id(state){
    return this._http.get<any[]>('getstateid?state='+state);
  }

  getStrains (): Observable<Strain[]> {
    return this._http.get<Strain[]>('strains?cityId=' + this.selectedLocation + '&state_id='+this.locationSes["state_id"]);
  }

  getMass (): Observable<Mass[]> {
    return this._http.get<Mass[]>('mass?city=' + this.selectedLocation + '&strain_id=' + this.selectedStrain);
  }

  redirect_data(city,state)
  {
  
    this.routes.navigate(['/'+ this.globals.location_global_url +'/'+state.replace(/\s+/g, '-').toLowerCase()+'/'+city.replace(/\s+/g, '-').toLowerCase()+'/compare-price']);
  }

  redirect_data_strain(slug)
  {
      if(this.route_statename == undefined)
      {
        this.route_statename = this.locationSes["state"].replace(/\s+/g, '-').toLowerCase();
      }
      if(this.route_cityname == undefined)
      {
        this.route_cityname = this.locationSes["city"].replace(/\s+/g, '-').toLowerCase();

      }
     
      this.routes.navigate(['/'+ this.globals.location_global_url +'/'+this.route_statename+'/'+this.route_cityname+'/compare-price/'+slug]);
  }

  onConverterAlertSubmit(form: NgForm) {  


     this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }

     this.isValidFormSubmitted = true;
     this.converter_alert = form.value;

      this.converter_alert.city = this.selectedLocation;
    this.converter_alert.strain =this.route_id;

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

          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strainName+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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
          toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, you created a Price Alert for '+this.strainName+'. <a href="/members/price-alert">Manage Price Alerts</a>. ', "", {
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

  checkPriceAlert (): Observable<any[]> {

    return this._http.get<any[]>('check_price_alert?city=' + this.selectedLocation + '&strain='+ this.route_id+'&email='+this.converter_alert.email+'&state='+this.locationSes["state_id"]);
  }
  postPriceAlert(){
    return this._http.post<any[]>('set_price_alert',this.converter_alert);
  }
 removePriceAlert(type,alert_id){
    return this._http.get<any[]>('remove_price_alert?type='+type+'&id='+alert_id);
  }

  redirectToPage(login,modal)
  {
    
  }

  offpricealert()
  {
    $("#track_price_alert"). prop("checked", false);
  }


}
