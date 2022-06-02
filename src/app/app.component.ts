import { Component, HostListener,OnInit, OnDestroy, Input} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Globals } from './models/globals';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router,NavigationEnd, NavigationStart, Event } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {   

  user_data: any[];
  navigationSubscription;
  locations = [];
  geoLocations = "";
  display_title = "";
  display_messge = "";
  expiredDate: Date;
  expiredDate1: Date;
  og_local:any;
  loadContent = false;
  showLoadingIndicator = true;



  constructor(private globals: Globals,private route: ActivatedRoute,private routes: Router,private platformLocation: PlatformLocation, private title: Title, private meta: Meta,private _http: HttpClient,private cookieService: CookieService,@Inject(DOCUMENT) private dom){

    this.routes.events.subscribe((routerEvent: Event) => {
        if(routerEvent instanceof NavigationStart){
          this.showLoadingIndicator = true;
        }

        if(routerEvent instanceof NavigationEnd){
          this.showLoadingIndicator = false;
        }

      
    });

  }

  initialiseInvites() {  

    window.scrollTo(0, 0);

    this.route.params.subscribe(params => { 

          if(typeof params['country'] === "undefined")
          {  
            let locationSes = [];
            //console.log('Harsh12')

            if(localStorage.getItem('locationData')!= null)
              {

                 locationSes = JSON.parse(localStorage.getItem('locationData'));
                 if(typeof locationSes['country'] === "undefined")
                 {
                       //this.loadLocations();  

                 }else{
                    this.geoLocations = locationSes['country'].toLowerCase();
                    this.globals.location_global_url = locationSes['country'].toLowerCase();  

                    if(this.geoLocations == "us"){
                      this.og_local = "en_US";
                      this.display_title = "Are you 21 or older?";
                      this.display_messge = "If you're located in USA you must be 21 or older to enter.";
                    }else if(this.geoLocations == "canada"){
                      this.og_local = "en_CA";
                      if(locationSes['state'] == "Alberta" || locationSes['state'] == "Quebec" || locationSes['state'] == "Manitoba"){
                        this.display_title = "Are you 18 or older?";
                        this.display_messge = "If you're located in Alberta, Manitoba, Quebec  \n you must be 18 or older to enter.";
                      }else{
                        this.display_title = "Are you 19 or older?";
                        this.display_messge = "If you're located in Canada you must be 19 or older to enter.";
                      }

                    }else{
                      this.display_title = "Are you 19 or older?";
                      this.display_messge = "If you're not in USA you must be 19 or older.";
                    }      
                 }

                      if(!this.cookieService.get('_mio_age_validation') || this.cookieService.get('_mio_age_validation')=="")
        {            
              setTimeout(function(){ 
                $('#ageValid').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: false
              });
        }, 1);
        }  
              } 
              else{
                     //  this.loadLocations();  
              }   
          }            

               
        
        })

    this.loadMetaData();
  }

  actionAgeValid(answer){

    if(answer == 0){
      window.location.href = 'https://www.google.com';
      return;
    }

    $('#ageValid').modal('hide');

    this.user_data = JSON.parse(localStorage.getItem('userData'));   

    var userId = "0";

    if(this.user_data && this.user_data['id']!= '')
    {
        userId = this.user_data['id'];
    }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id')!="")
    {
        userId = this.cookieService.get('_mio_user_id');
    }

    this.updateAgeValidation(userId,answer).subscribe(

      (data => {
       // console.log(data);
        
        this.expiredDate = new Date();
        this.expiredDate.setDate( this.expiredDate.getDate() + 30 );

        this.expiredDate1 = new Date();
        this.expiredDate1.setDate( this.expiredDate1.getDate() + 1000 );

        if(data && data['id']){
          this.cookieService.set( '_mio_user_id', data['id'], this.expiredDate1,"/" );
        }
        
        this.cookieService.set( '_mio_age_validation', answer, this.expiredDate,"/" );

       // localStorage.setItem('userData',JSON.stringify(data["data"])); 
      }),
      (err: any) => console.log(err),
      () => {
        $('#ageValid').modal('hide');
      }
    ); 
  }

  updateAgeValidation (user_id,answer): Observable<any[]> {
    return this._http.get<any[]>('update_age_validation?id='+user_id+'&age_validation='+answer);
  }

  loadMetaData(){

    //console.log((this.platformLocation as any).location.pathname);
    var replaceString = (this.platformLocation as any).location.pathname;
    var replaceWord = "/" + this.globals.location_global_url + "/";
    var currentUrl =replaceString.replace(replaceWord, "/");

    const link = <HTMLLinkElement> this.dom.head.querySelector("link[rel='canonical']")
      || this.dom.head.appendChild(this.dom.createElement("link"));


   // let link: HTMLLinkElement = this.dom.createElement('link');
    /*link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', this.dom.URL);*/
     var link1 = document.getElementById("canonical");
     link1.setAttribute('href', this.dom.URL);
       


    if(currentUrl.includes('compare-medical-marijuana')){
      //currentUrl = "/compare-medical-marijuana";
      return;
    }

    if(currentUrl.includes('compare-marijuana-moods')){
      //currentUrl = "/compare-marijuana-moods";
      return;
    }

    if(currentUrl.includes('compare-price')){
      //currentUrl = "/compare-marijuana-moods";
      return;
    }

    //console.log(currentUrl);

    this.getMetaData(currentUrl).subscribe(

      (data => {        

      //console.log(this.og_local)
        this.title.setTitle(data['title']);        
        this.meta.updateTag({name: 'keywords', content: data['keywords']});
        this.meta.updateTag({name: 'description', content: data['description']});        
        this.meta.updateTag({name: 'og:title', content: data['title']});
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

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }  

  ngOnInit() {

    this.navigationSubscription = this.routes.events.subscribe((e: any) => {
       if (e instanceof NavigationEnd) {
         this.initialiseInvites();
       }
     });

  }


}
