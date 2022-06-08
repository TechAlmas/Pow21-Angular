import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ret} from '../../models/ret';
import {Login} from '../../models/login';
import {Router} from "@angular/router";
import {Globals} from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';


declare var $: any;
declare var toastr: any;

@Component({
  selector: 'mio-user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	isValidFormSubmitted = false;
	login_alert = new Login();
  user_data: any;
  expiredDate:any;

  constructor(private globals: Globals, private _http: HttpClient,private router: Router,private cookieService: CookieService) { 
   
   }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  postLogin(){
    return this._http.post<Ret[]>('userlogin',this.login_alert);
  }


  onFormSubmit(form: NgForm){

  	this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }
     this.isValidFormSubmitted = true;
     this.login_alert.email = form.value.email;
     this.login_alert.password = form.value.password;

     //alert(this.login_alert.upassword);

      this.postLogin().subscribe(data => 
      			{
      			console.log(data);
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

                   this.expiredDate = new Date();
    this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

    //this.cookieService.set( '_mio_user_name', this.converter_alert.name, this.expiredDate,"/" );
    this.cookieService.set( '_mio_user_email', this.login_alert.email, this.expiredDate,"/" );
     this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );      
                   
                   localStorage.setItem('userData',JSON.stringify(data));   
                   this.user_data = data;                
                   this.globals.user_data = true;
                   this.globals.user_name = data["name"];
                   this.globals.user_email = data["email"];
                   this.globals.id_cms_privileges = data["id_cms_privileges"];
                   this.getpricealertCount();

                   this.addUserLog().subscribe(
                      (data => {}),
                      (err: any) => console.log(err),
                      () => {}
                    ); 
                   console.log(this.user_data);
                   if(this.user_data['id_cms_privileges'] == 6 || this.user_data['id_cms_privileges'] == 7){
                    this.router.navigate(['/members/business']);
                   }else{
                    this.router.navigate(['/members/dashboard']);
                   }

                   //localStorage.setItem('remember_token',data["remember_token"]);
          		  form.resetForm();

                  

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

      addUserLog (): Observable<any[]> {

    
        var postdata: any;
        var userId: any;

        userId = this.user_data['id'];       

       var url = '/login' ;
       var details = '';
         // " Location : " + this.selectedLocation + " Strain : "+this.selectedStrain + " Mass : " this.selectedMass;

        var description = this.user_data['email'] + " Logged in successfully";


        postdata = {'url' : url , 'description' : description, 'user_id' :userId , 'details': details};
        //console.log(postdata);

        //'set_user_log?url=' + url + '&description='+ description+'&id_cms_users='+ userId +'&details='+ details+'&email='+this.converter_alert.email

        return this._http.post<any[]>('set_user_log',postdata);
      }
      /*signingoogle(){
        let socialPlatformProvider;
        let socialPlatform = "google";
        socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        //console.log(socialPlatformProvider);
        this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {

        console.log(socialPlatform+" sign in data : " , userData);
        // Now sign-in with userData
        // ...
            
      }
    );
      }*/


     /*this.postLogin().subscribe(
      (data => {
         //console.log(data);
         if(data["api_status"] == 1){


         }
         else
         {


         }
      }),
      (err: any) => console.log(err),
      () => {
        toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Price alert added Successfully !", "", {
           "closeButton": true,
            "timeOut": "0",
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


     );


     


  }*/

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
