import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'mio-referral',
  templateUrl: './app.component.html',  
  styleUrls: [],
  providers: []
})

export class ReferralComponent implements OnInit {

  locations = [];
  geoLocations = "";
  expiredDate: any;
  actionAgeValid: any;
  display_messge: any;
  display_title: any;

  constructor(private cookieService: CookieService,private route: ActivatedRoute,private routes: Router,private _http: HttpClient, private title: Title, private meta: Meta) {}

  ngOnInit() {

    //console.log('home');

     this.route.params.subscribe(params => {

         // console.log(params);
         // localStorage.removeItem('locationData');
      if(typeof params['referralId'] !== "undefined")//{}else
        {

           //console.log("Referral code");
            this.expiredDate = new Date();
            this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );
            this.cookieService.set( '_mio_user_referral_id', params['referralId'], this.expiredDate ,"/" );

          }

          this.routes.navigate(['/']);
          //console.log("bypass");
        
        })
     
     
  }

  
  
  


}
