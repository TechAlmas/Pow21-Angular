import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Register} from '../../models/register';
import {Ret} from '../../models/ret';
import {Router} from "@angular/router";
import {Globals} from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';


declare var toastr: any;
declare var $: any;

@Component({
  selector: 'mio-user-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	register_alert = new Register();
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  isValidFormSubmitted = false;
  validateEqual = false;
  user_data : any;
  expiredDate: any;
  
  constructor(private cookieService: CookieService,private globals: Globals, private _http: HttpClient,private router: Router) {

    this.user_data = JSON.parse(localStorage.getItem('userData')); 

   }

  ngOnInit() {window.scrollTo(0, 0);}

  postRegister(){
    return this._http.post<Ret[]>('usersignup',this.register_alert);
  }
 postCheckEmail(){
    var postData = {"email":this.register_alert.email};
   
    return this._http.post<any[]>('checkemailexit',postData);
  }
  onCheckEmail(form: NgForm)
  {

    this.register_alert.email = form.value.email;

    this.postCheckEmail().subscribe(data => 
     {
        //console.log(data);
        if (data["api_status"]==1)
        {
            this.validateEqual = false;
            $('#email_error').show();      

         }else
         {
           $('#email_error').hide();
         }
      }, (err) => {
               
                console.log(err.message);
     });
  }

  onConfirmPwd(form: NgForm)
  {
    //console.log("Sumer");

   
          //  console.log(data);
        if(form.value.password != form.value.cpassword){
            this.validateEqual = false;
            $('#pcp_error').show();      

         }else
         {
           $('#pcp_error').hide();
         }
      

  }

  onFormSubmit(form: NgForm) {
  	this.isValidFormSubmitted = false;
     if (form.invalid) {

        if(form.value.password != form.value.cpassword){
            this.validateEqual = false;
            $('#pcp_error').show();      

         }else
         {
           $('#pcp_error').hide();
         }
        return;
     }
     if(form.value.password != form.value.cpassword){
        this.validateEqual = false;
        $('#pcp_error').show();
        //alert('Password & Confirm password do not match.');
        return;

     }else
     {
       $('#pcp_error').hide();
     }

     
      if(this.user_data && this.user_data['email']){

          //this.register_alert.email = this.user_data['email'];
         // this.register_alert.name = this.user_data['name'];
          this.register_alert.user_id = this.user_data["id"];

        }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

            //this.converter_alert.email = this.cookieService.get('_mio_user_email');
            //this.converter_alert.name = this.cookieService.get('_mio_user_name');
            this.register_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
        }else{
            this.register_alert.user_id = parseInt(this.cookieService.get('_mio_user_id'));
        }

     this.validateEqual = true;
     this.isValidFormSubmitted = true;
     //form_value = form.value
     //form.value.remove('cpassword');
     this.register_alert.name = form.value.name;
     this.register_alert.email = form.value.email;
     this.register_alert.password = form.value.password;
     this.register_alert.is_updates = form.value.is_updates;
     //this.register_alert.is_terms = form.value.is_terms;
     this.register_alert.referrer_id =this.cookieService.get('_mio_user_referral_id');
     this.register_alert.status = 1;
     this.register_alert.id_cms_privileges = 4;    


     //console.log(this.register_alert);

     this.postRegister().subscribe(data => 
            {
            //console.log(data.data);
            if (data["api_status"]==1)
                {
                   toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;PuPow! You now have a free POW account! !", "", {
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

               //localStorage.setItem('userData',JSON.stringify(data["data"]));                   

               //localStorage.setItem('userData',JSON.stringify(data)); 
               this.globals.user_data = true;
               this.globals.user_name = data["data"]["name"];
               this.globals.user_email = data["data"]["email"];
               //this.getpricealertCount();
               localStorage.setItem('userData',JSON.stringify(data['data']));

               this.expiredDate = new Date();
               this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

              this.cookieService.set( '_mio_user_name', data["data"]["name"], this.expiredDate,"/" );
              this.cookieService.set( '_mio_user_email', data["data"]["email"], this.expiredDate ,"/");  
              this.cookieService.set( '_mio_user_id', data["data"]["id"], this.expiredDate,"/" );

               // window.location.href = '/user-profile';
                this.router.navigate(['/members/dashboard']);
               
                }
                else
                {
                  toastr.error("<i class='icon-ok-sign'></i>&nbsp;&nbsp;A user with the email address " + this.register_alert.email +" already has an account. <a href='/login'>Login here !</a>", "", {
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

     /*this.postRegister().subscribe(
      (data => {
        console.log(data);
       // console.log(data["api_status"]);
         if(data["api_status"] == 0){
           alert(data["api_status"]);
           return;
            
         }
         else {

             toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;User Registered Successfully !", "", {
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
          localStorage.setItem('userdata',form.value);
           this.router.navigate(['/user-profile'])
          form.resetForm(); 
         }
         
      }),
      (err: any) => console.log(err),
      () => {
        
      }
     );
    
  }*/

}
