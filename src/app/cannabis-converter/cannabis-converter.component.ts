import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PlatformLocation } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { City } from '../models/city';
import { HttpClient } from '@angular/common/http';
import {Globals} from '../models/globals';

declare var $: any;
declare var jQuery: any; 

@Component({
  selector: 'mio-cannabis-converter',
  templateUrl: './cannabis-converter.component.html',
  styleUrls: ['./cannabis-converter.component.css'],
  providers: []
})

export class CannabisConverterComponent implements OnInit {

geoLocations = "";
locations = [];

  constructor(private platformLocation: PlatformLocation,private route: ActivatedRoute,private routes: Router,private _http: HttpClient,private title: Title, private meta: Meta, public globals: Globals) {}

  ngOnInit() {
      /*window.scrollTo(0, 0);
      this.route.params.subscribe(params => {

          if(typeof params['country'] === "undefined")
          {   
            let locationSes = [];

            if(localStorage.getItem('locationData')!= null)
              {
                  locationSes = JSON.parse(localStorage.getItem('locationData'));
                 if(typeof locationSes['country'] === "undefined")
                 {
                       this.loadLocations();  

                 }else{
                      this.geoLocations = locationSes['country'].toLowerCase();
                      this.routes.navigate(['/'+ this.geoLocations +'/cannabis-converter']);
                         
                 }  
              } 
              else{
                       this.loadLocations();  
              }   
          }
          this.globals.location_global_url = params['country'];
        
        })
       this.loadMetaData();*/
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
  
  getGeoLocation (): Observable<City[]> {
    return this._http.get<City[]>('getusergeolocation');
  }

  loadLocations(){
    
    this.getGeoLocation().subscribe(

      (data => {
        
        this.locations = data['data'];
        //console.log(this.locations)
        this.geoLocations = this.locations['country'].toLowerCase();;
        data['data']['country'] = data['data']['country'].toLowerCase();
        localStorage.setItem('locationData',JSON.stringify(data['data']));


        this.routes.navigate(['/'+ this.geoLocations +'/cannabis-converter']);
               
      }),
      (err: any) => console.log(err),
      () => {}

    );
  }
  ngAfterViewInit() {

    if( !$().tabs ) {
        console.log('tabs: Tabs not Defined.');
        return true;
      }

      var $tabs = $('.tabs:not(.customjs)');
      if( $tabs.length > 0 ) {
        $tabs.each( function(){
          var element = $(this),
            elementSpeed = element.attr('data-speed'),
            tabActive = element.attr('data-active');

          if( !elementSpeed ) { elementSpeed = 400; }
          if( !tabActive ) { tabActive = 0; } else { tabActive = tabActive - 1; }

          var windowHash = window.location.hash;
          if( jQuery(windowHash).length > 0 ) {
            var windowHashText = windowHash.split('#'),
              tabItem = document.getElementById( windowHashText[1] );
            tabActive = jQuery( ".tab-content" ).index( tabItem );
          }

          element.tabs({
            active: Number(tabActive),
            show: {
              effect: "fade",
              duration: Number(elementSpeed)
            }
          });
        });
      }

  }


}
