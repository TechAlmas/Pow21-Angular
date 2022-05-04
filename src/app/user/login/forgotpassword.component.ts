import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ret} from '../../models/ret';
import {Router} from "@angular/router";
import {Forgotpassword} from '../../models/forgotpassword';

declare var toastr: any;


@Component({
  selector: 'mio-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./login.component.css']
})
export class ForgotpasswordComponent implements OnInit {
	isValidFormSubmitted = false;

	forgot_alert = new Forgotpassword();
	constructor(private _http: HttpClient,private router: Router) { 
   
 }
  ngOnInit() {
   

  }
  postforgotpassword(){
    return this._http.post<Ret[]>('forgotpassword',this.forgot_alert);
  }
  onFormSubmit(form: NgForm){

  	this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }

     this.isValidFormSubmitted = true;
      this.forgot_alert.email = form.value.email;
      this.postforgotpassword().subscribe(data => 
      			{
      			//console.log(data);
      			if (data["api_status"]==1)
                {
                   toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;New Password send to your register email !", "", {
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
                else
                {
                    toastr.error("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Enter correct email address !", "", {
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


  

}