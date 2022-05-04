import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { City } from '../models/city';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../models/globals';
import { CookieService } from 'ngx-cookie-service';
import { PlatformLocation } from '@angular/common';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'mio-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})

export class HomeComponent implements OnInit {

  locations = [];
  geoLocations = "";
  
  //locationSes: any;

  constructor(private cookieService: CookieService,private globals: Globals,private route: ActivatedRoute,private routes: Router,private _http: HttpClient,private platformLocation: PlatformLocation, private title: Title, private meta: Meta) {window.scrollTo(0, 0);}

  ngOnInit() {}  
  
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
          //console.log(tabActive);
          element.tabs({
            active: Number(tabActive),
            show: {
              effect: "fade",
              duration: Number(elementSpeed)
            }
          });
        });
      }
      
      // Tab Change to Accordion    
      jQuery(".tab-container").on("click", "span.mob-tabs", function(){
        var getID = jQuery(this).attr("id");
        
        if(jQuery(getID).css("display") == "block"){
          jQuery("span.mob-tabs").removeClass("active");
          jQuery(getID).hide();
        }else{
          jQuery(".tab-content").hide();
          jQuery("span.mob-tabs").removeClass("active");
          jQuery(this).addClass("active");
          jQuery(getID).show();
        }
      });

  }


}
