import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ret} from '../../models/ret';
import {Router} from "@angular/router";
import {Globals} from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';
import {PlatformLocation } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;


@Component({
  selector: 'mio-favstrain',
  templateUrl: './favstrain.component.html',
  styleUrls: ['./profile.component.css']
})
export class FavstrainComponent implements OnInit {
	
user_data: any;
  favstrain: any;
   isValid = false;
   user_data_email: any;
   user_email:any;
  no_data = false;
  locationSes:any;



  constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation,private cookieService: CookieService,private _http: HttpClient,private router: Router,private globals: Globals) {

      this.user_data = JSON.parse(localStorage.getItem('userData'));
     this.locationSes = JSON.parse(localStorage.getItem('locationData'));
      //this.user_data_email = this.cookieService.get('_mio_user_email');
      //console.log(this.locationSes.state);

      if(this.user_data == null)
      {
        this.user_email = this.cookieService.get('_mio_user_email');


      }else{
        this.user_email = this.user_data.email;
      }
      this.getpricealertData();


   }
  getFavstrain(){
 
    return this._http.get<Ret[]>('get_favorite_strains?email='+this.user_email);
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

  removeFavStrain(fav_id,strain,location){

    Swal({
      title: 'Are you sure?',
      text: 'You want to delete '+strain+' strain in '+ location + ' from your favorite list.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        this.removeFavStn(fav_id).subscribe(
          data =>{
            this.getpricealertData();

              toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, "+strain+" strain in "+location+" removed successfully from your favorite list.", "", {
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

    console.log(fav_id);

    

  }

  removeFavStn(fav_id){
    return this._http.get<any[]>('remove_fav_strain?id='+fav_id);
  }

  getpricealertData(){

    this.getFavstrain().subscribe(data => 
            {
            //console.log(data['data']);

           this.favstrain = data['data'];
           console.log(this.favstrain);

           if(this.favstrain.length == 0){

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
