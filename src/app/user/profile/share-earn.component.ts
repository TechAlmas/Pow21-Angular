import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ret} from '../../models/ret';
import {Router} from "@angular/router";
import {PlatformLocation } from '@angular/common';
import {Globals} from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';


declare var toastr: any;

@Component({
  selector: 'mio-share-earn',
  templateUrl: './share-earn.component.html',
  styleUrls: ['./profile.component.css']
})
export class ShareearnComponent implements OnInit {

user_data: any;
name : string;
email: string;
phone :string;
referral_url :string;
referral_id :string;

  constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation, private _http: HttpClient,private router: Router, private globals: Globals,private cookieService: CookieService) { 
	
	//console.log(this.user);
	this.user_data = JSON.parse(localStorage.getItem('userData'));
	if(this.user_data == null)
  {
     this.router.navigate(['/']);

  }
	this.getuserdata();
  }

  
 getUser(){
 	//console.log(this.user_data['remember_token']);
    return this._http.get<Ret[]>('users?id='+this.user_data['id']+'&remember_token='+this.user_data['remember_token']);
  }
  ngOnInit() {
window.scrollTo(0, 0);
  //this.loadMetaData();
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

  
  getuserdata()
  {
  		this.getUser().subscribe(data => 
            {

               // console.log(data);
                this.name = data['name'];
                this.email = data['email'];
                this.phone = data['phone'];
                this.referral_id = data['referral_id'];
                this.referral_url = (this.platformLocation as any).location.origin + "/referral/" + data['referral_id'];


            }, (err) => {
               
                console.log(err.message);
            });
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
