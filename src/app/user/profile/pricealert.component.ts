import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ret} from '../../models/ret';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Globals } from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';
import { City } from '../../models/city';
import {PlatformLocation } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;

@Component({
  selector: 'mio-pricealertprofile',
  templateUrl: './pricealert.component.html',
  styleUrls: ['./profile.component.css']
})
export class PricealertComponent implements OnInit {
  user_data: any;
  strain: any;
  isValid = false;
  user_data_email: any;
  user_email:any;
  change_display = false;

  locations = new City();
  geoLocations = "";
  no_data = false;

  constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation,private cookieService: CookieService,private _http: HttpClient,private globals: Globals,private route: ActivatedRoute,private routes: Router) {

      this.route.params.subscribe(params => {


          if(typeof params['country'] === "undefined")
          {   
            let locationSes = [];

            if(localStorage.getItem('locationData')!= null)
              {
                 // console.log("main if");
                  locationSes = JSON.parse(localStorage.getItem('locationData'));
                 if(typeof locationSes['country'] === "undefined")
                 {
                       // console.log("If");
                       this.loadLocationsIp();  

                 }else{
                      //console.log("else");
                      this.geoLocations = locationSes['country'].toLowerCase();
                      this.globals.location_global_url = locationSes['country'].toLowerCase();
                      this.routes.navigate(['/members/price-alert']);
                         
                 }  
              } 
              else{

                   //console.log("main else");
                       this.loadLocationsIp();  
              }   
          }else{
            let locationSes = [];
             locationSes = JSON.parse(localStorage.getItem('locationData'));
             this.geoLocations = locationSes['country'].toLowerCase();

          }  
        
        })

  		this.user_data = JSON.parse(localStorage.getItem('userData'));

      //this.user_data_email = this.cookieService.get('_mio_user_email');
     // console.log(this.cookieService.get('_mio_user_email'));

      if(this.user_data == null)
      {
        this.user_email = this.cookieService.get('_mio_user_email');


      }else{
        this.user_email = this.user_data.email;
      }

  		this.getpricealertData();


   }

   getGeoLocation (): Observable<City[]> {
    return this._http.get<City[]>('getusergeolocation');
  }

  loadLocationsIp(){
    
    this.getGeoLocation().subscribe(

      (data => {
        this.locations = data['data'];
        this.geoLocations = this.locations['country'].toLowerCase();;
        data['data']['country'] = data['data']['country'].toLowerCase();
        localStorage.setItem('locationData',JSON.stringify(data['data']));

        this.globals.location_global_url = data['data']['country'].toLowerCase();
        this.routes.navigate(['/'+ this.geoLocations +'/feel-like']);
               
      }),
      (err: any) => console.log(err),
      () => {}

    );
  }

  getprice(){ 
    return this._http.get<any[]>('get_price_alert_detail?email='+this.user_email);
  }
  ngOnInit(){window.scrollTo(0, 0); //this.loadMetaData();
  }
  loadMetaData(){
   //console.log((this.platformLocation as any).location.pathname);
   //console.log(this.globals.location_global_url);
   //this.finalUrl.replace("/", "&"); 
   var replaceString = (this.platformLocation as any).location.pathname;
   var replaceWord = "/" + this.globals.location_global_url + "/";
   var currentUrl =replaceString.replace(replaceWord, "/");

   //console.log(replaceString);   console.log(replaceWord);      console.log(currentUrl);

   
    this.getMetaData(currentUrl).subscribe(

      (data => {
        

        this.title.setTitle(data['title']);
        
        this.meta.updateTag({name: 'keywords', content: data['keywords']});
        this.meta.updateTag({name: 'description', content: data['description']});

               
      }),
      (err: any) => console.log(err),
      () => {}

    );
  }

  getMetaData(currentUrl): Observable<any[]> {
    var postData = {"url":currentUrl};
    return this._http.post<any[]>('getmetadata',postData);
  }

  changePrice(alert_id){

    var price = $("#priceCheck_"+alert_id).val();  
    var action = $("#action_"+alert_id).val();

    if(price <= 0){
      $("#priceCheck_"+alert_id).css("border","1px solid red");
      return;
    }   

    var frmData = {'id': alert_id,'action':action,'price':price};

    this.updatePriceAlert(frmData).subscribe(
          data =>{
            if(data["api_message"] = "success"){
              toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Price Alert updated sucessfully !", "", {
                 "closeButton": true,
                  "timeOut": "1000",
                  "extendedTImeout": "0",
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "extendedTimeOut": "0",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut",
                  "positionClass": "toast-top-full-width",});

                 

               this.change_display = false;
               setTimeout(function(){ 
                 $("span#view_action_"+alert_id).html(action);
                 $("span#view_price_"+alert_id).html('$'+price);
               }, 1000);
                
            }
            
          },
          (err) => {console.log(err.message);}
        );
  }

  updatePriceAlert(postdata){
    return this._http.post<Ret[]>('update_price_alert',postdata);

  }

  checkPriceValue(event,alert_id){

      var number = $("#priceCheck_"+alert_id).val().split('.');      

      if($("#priceCheck_"+alert_id).val() > 100) {
          $("#priceCheck_"+alert_id).val(100);
      } 

      if($("#priceCheck_"+alert_id).val() < 0) {
          $("#priceCheck_"+alert_id).val(0);          
      }   

      if($("#priceCheck_"+alert_id).val() > 0){
          $("#priceCheck_"+alert_id).css("border","1px solid #ced4da");
      }else{
        $("#priceCheck_"+alert_id).css("border","1px solid red");
      }  

      var index = $("#priceCheck_"+alert_id).val().split('.');

      if(index[1] && index[1].length > 2){
        var tmp = $("#priceCheck_"+alert_id).val();
        //console.log(tmp.slice(0,-1));
        $("#priceCheck_"+alert_id).val(tmp.slice(0,-1));
        //event.preventDefault();
      }

  }

  removeAlert(type,alert_id,strain,location){

    Swal({
      title: 'Are you sure?',
      text: 'You will not receive a Price Alert notifications for '+strain+' strain in '+ location,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        this.removePriceAlert(type,alert_id).subscribe(
          data =>{
            this.getpricealertData();

            toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, You will not receive a Price Alert notifications for "+strain+" strain in "+location+".", "", {
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

          },
          (err) => {console.log(err.message);}
        );

        

        /*Swal(
          'Deleted!',
          'Your price alert has been deleted.',
          'success'
        )*/
      }
    });

    

  }

  removePriceAlert(type,alert_id){
    return this._http.get<any[]>('remove_price_alert?type='+type+'&id='+alert_id);
  }

  getpricealertData(){

  	this.getprice().subscribe(data => 
            {
            //console.log(data['data']);

           this.strain = data['data'];

           if(this.strain && this.strain.length == 0){

             this.isValid = true;
             this.no_data = true;

           }             

            }, (err) => {
               
                console.log(err.message);
            });
  }
    Logout(){
     // alert('hello');
       toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Logout sucess fully !", "", {
                 "closeButton": true,
                  "timeOut": "1000",
                  "extendedTImeout": "0",
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "extendedTimeOut": "0",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut",
                  "positionClass": "toast-top-full-width",});
   localStorage.removeItem('userData');
   this.globals.user_data = false;
   this.globals.user_name = this.cookieService.get('_mio_user_name');
   this.globals.user_email = this.cookieService.get('_mio_user_email');
   this.getpricealertCount();
   //window.location.href = '/';

   //this.router.navigate(['/user-login']);
  }
  getcount(){
    return this._http.get<Ret[]>('pricealertcount?email='+this.globals.user_email);
  }
  getpricealertCount(){

        this.getcount().subscribe(count_data =>
          {
          
          this.globals.price_alert_count = count_data['price_alert_count'];
          console.log(this.globals.price_alert_count);

         if(this.globals.price_alert_count == null){
           //console.log(this.user_data_email);

           this.globals.price_alert_count = 0;
        }           
        //this.mio_session_count = localStorage.getItem('_mio_count');
        }, (err) => {
            console.log(err.message);
        });


}


}
