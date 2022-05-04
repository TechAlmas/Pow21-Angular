import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Edit} from '../../models/edit';
import {Ret} from '../../models/ret';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import {Globals} from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';
import {PlatformLocation } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'mio-profile-account',
  templateUrl: './profile-account.component.html',
  styleUrls: []
})
export class ProfileAccountComponent implements OnInit {

user_data: any;
name : string;
email: string;
phone :string;
referral_url :string;
form: FormGroup;
isValidFormSubmitted = false;
validateEqual = false;
isRequired = false;

//display_field = false;

edit_alert = new Edit();
emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation,private _http: HttpClient,private router: Router,private globals: Globals,private cookieService: CookieService){

  	this.user_data = JSON.parse(localStorage.getItem('userData'));
  	this.edit_alert.email= this.user_data['email'];
  	if(this.user_data['is_updates']=="1")
  	{
  		this.edit_alert.is_updates= true; 
  	}
  	else
  	{
  		this.edit_alert.is_updates= false;
  	}

    if(this.user_data['is_terms']=="1")
    {
      this.edit_alert.is_terms= true; 
    }
    else
    {
      this.edit_alert.is_terms= false;
    }


    if(this.user_data['is_age_validation']=="1")
    {
      this.edit_alert.is_age_validation= true; 
    }
    else
    {
      this.edit_alert.is_age_validation= false;
    }
  	 	
  	this.referral_url = (this.platformLocation as any).location.origin + "/share/" + this.user_data['referral_id'];
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

   postEdit(){
 
    return this._http.post<Ret[]>('users_account',this.edit_alert);
  }

  onPasswordRequired(form: NgForm)
  {

  	//console.log(form.value);
    
    if((form.value.password!="" && typeof form.value.password !=="undefined" ) || (form.value.cpassword!=""  && typeof form.value.cpassword !=="undefined" ))
    {
    	//console.log("if Sumer");
    	this.isRequired = true;
    	//this.validateEqual = false;
            $('#pcp_error').show();  
    }else
    {
    	//this.validateEqual = true;
    	this.isRequired = false;
    	$('#pcp_error').hide();
    }
  }

  onConfirmPwd(form: NgForm)
  {  


    if(form.value.password != form.value.cpassword)
    {
            this.validateEqual = true;
            $('#pcp_error').show();      

    }else
    {
    		this.validateEqual = false;
           $('#pcp_error').hide();
    }

  }

  checkEmail(){

    if($("#edit-form-email").val() != this.edit_alert.email){
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

    
  }

  postCheckEmail(){
    var postData = {"email":$("#edit-form-email").val()};
   
    return this._http.post<any[]>('checkemailexit',postData);
  }

  onFormSubmit(form: NgForm){
  	  this.isValidFormSubmitted = false;

  	  //console.log(form);

  	  if (form.invalid) {
        return;
     }
  
     this.isValidFormSubmitted = true;
     this.edit_alert.id = this.user_data['id'];
     this.edit_alert.email = form.value.email;
     this.edit_alert.is_updates = form.value.is_updates;

    

     if(form.value.password!="")
     {
     	this.edit_alert.password = form.value.password; 
     }
     //console.log(form.value.is_updates);
    
     /*if(form.value.is_updates)
     {
     	this.edit_alert.is_updates = '1';
     }else
     {
     	this.edit_alert.is_updates = '0';
     } */      
       
    
    this.postEdit().subscribe(data => 
            {
            //console.log(data);
            if (data["api_status"]==1)
                {
                   toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Account details updated successfully!", "", {
                 "closeButton": true,
                  "timeOut": "5000",
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
                  //this.router.navigate(['/user-edit']);
                  localStorage.setItem('userData',JSON.stringify(data['data']));

                  //form.resetForm();
                }
                
            }, (err) => {
               
                console.log(err.message);
            });

  }
 

}
