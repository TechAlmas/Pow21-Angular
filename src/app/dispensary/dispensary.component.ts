import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PriceAlert } from '../models/price-alert';
import { Favdispensary } from '../models/fav-dispensary';
import { City } from '../models/city';
import { ReviewDisp } from '../models/review _disp';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../models/globals';
import { CookieService } from 'ngx-cookie-service';
import { PlatformLocation } from '@angular/common';
import { DispDetail } from '../models/disp-detail';
import { ViewEncapsulation } from '@angular/core';
import {Login} from '../models/login';




declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;
declare var SEMICOLON: any;
declare var Lightbox: any;

@Component({
  selector: 'dispensary-details',
  templateUrl: './dispensary.component.html',
  styleUrls: ['./dispensary.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: []
})

export class DispensaryComponent implements OnInit {

	dispDetails = new DispDetail();
  review = new ReviewDisp();
  schedule:any;
  image_disp : any;
  mapUrl : any;
  write_review = false;
  checkUser = false;
  user_data : any;
  rating_req = false;
  isValidFormSubmitted = false;
  dispens_id:any;
  dispState= false;
  dispCity= false;
  review_id: any;
  expiredDate: any;
  file: any;
  fav_disp= new Favdispensary();
  followed: string;
  isUserReviewed: any;
  isUserLoggedIn= false;
  validateEqual = false;
  claimListingWithSignup = false;
  login_alert = new Login();

   constructor(private cookieService: CookieService,public globals: Globals,private route: ActivatedRoute,private routes: Router,private _http: HttpClient,private platformLocation: PlatformLocation, private title: Title, private meta: Meta) {window.scrollTo(0, 0);}

  ngOnInit() {

  this.route.params.subscribe(params => {

        this.user_data = JSON.parse(localStorage.getItem('userData'));
         if(this.user_data && this.user_data['email']){
           this.checkUser = true;
           this.isUserLoggedIn = true;
          }
          else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){
            this.checkUser = true;
          }
  			if(typeof params['dispName'] === "undefined")
          	{ 
          		//console.log(params['strainName']);
          		this.routes.navigate(['/']);
          	}else
          	{
              if(typeof params['dispName'] !== "undefined")
              { 
                this.getDispensaryDetail(params['dispName']);
              }
          	}

  		});

      jQuery(document).on('click','.claimModelLink',function(e){
        e.stopPropagation();
        e.preventDefault();
        let url = jQuery(this).attr('href');
        window.open(url,'_blank');
        jQuery('#myModal_paid').modal('hide');
      })

        //Phone number masking code

        // $('#telnum').on('blur',function(){
        //   const x = $(this).val().replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
        //   if(x != null){
            
        //     $(this).val( '(' + x[1] + ') ' + x[2] + '-' + x[3]);
        //   }
          
          
        // });

      //Validations on KeyUp

      $('.customValidate').on('keyup',function(){
        $(this).next('.customError').remove();
      
        if($(this).attr('name') == 'reemail' && $(this).val() != ''){
          let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if(!regex.test($(this).val())){
            var element = '<p class="customError" style="color:red">'+"The email should be a valid email address"+'</p>';
            
          }
          else if($('input[name=email]').val() != $(this).val()){
            var element = '<p class="customError" style="color:red">'+"Email address does not match"+'</p>';
            
          }
        }
        if($(this).attr('name') == 'email' && $(this).val() != ''){
          let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if(!regex.test($(this).val())){
            var element = '<p class="customError" style="color:red">'+"The email should be a valid email address"+'</p>';
           
          }
        }
        // if($(this).attr('name') == 'telnum' && $(this).val() != ''){

        //   let newVal =  $(this).val().replace(/[^\d]/g, '');
        //   $(this).val(newVal)
        // } 
        if($(this).val() == ''){

          var element = '<p class="customError" style="color:red">'+"The "+$(this).prev().text()+" field is required"+'</p>';
          
        }
        $(element).insertAfter($(this));
      })


  }
getDispensaryDetail(disp_slug)
{
	this.getDispensaryDetailData(disp_slug).subscribe(

      ((data:any) => {
        //console.log(data['data']);
        // if(!data['data'].status){
        //   this.routes.navigate(['/']);
        // }
        //console.log(this.cookieService.get('fav_disp'));
        //console.log(this.user_data);
        if(this.user_data){

        }else{
          console.log(this.cookieService.get('fav_disp'));
        }
      	this.dispDetails = data['data'];
        this.dispens_id = this.dispDetails.disp_id;
        this.dispState = data['data'].state.replace(/\s/g, "-");
        this.dispCity = data['data'].city.replace(/\s/g, "-");
        this.image_disp = "https://www.pow21.com/admin/storage/app/"+this.dispDetails.logoUrl;
        this.mapUrl = "https://www.google.com/maps/place/"+this.dispDetails.address+','+this.dispCity+','+this.dispState+' '+data['data'].zip_code+','+data['data'].country;
        //1353 E 41st Ave, Vancouver, BC V5W 3R8, Canada
        this.schedule = JSON.parse(this.dispDetails.schedule); 
        //console.log(this.dispDetails.state.replace(/\s/g, "-"));
        this.isUserReviewed = data['is_user_reviewed'];

      }),
      (err: any) => console.log(err),
      () => {
		 
	}

)

}

linkClicked(id){
    
    var trgt = $("#"+id);
     $('html, body').animate({
          scrollTop: $("#"+id).offset().top - 150
      }, 500, 'linear');

     if(id == "reviews"){
       this.enableReviewForm();
     }
  }		
onFilechange(event: any) {
  jQuery('.fileInput').parent().find('.customError').remove();
  let error = 0;
		for(let i=0;i<event.target.files.length;i++){
      var file = event.target.files[i];
      var fileType = file.type;
      const fileName = event.target.files[i].name;
			const fsize = event.target.files[i].size;
			const fileSize = Math.round((fsize / 1024));
      
			if (fileSize >= 5120) {
				
				var element = '<p class="customError mb-0" style="color:red">'+fileName+'  size is more than 5MB please reduce size.</p>';
				jQuery(element).insertAfter(jQuery('.fileInput').next().next());
        error++;
       
			}
    }
    if(error > 0){
      jQuery(".fileInput").val('');
      return false;
    }else{

      this.file = event.target.files;
    }
}
enableReviewForm(){
    this.write_review = true;
    setTimeout(function(){ $("#starrating").rating(); }, 1);
 }
 customValidateFields(data,isSignUpfields = false):any{
  let error = 0;
  $('.customValidate').each(function(key,val){
    $(this).next('.customError').remove();
    
      if($(this).attr('name') == 'reemail' && $(this).val() != ''){
        let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(!regex.test($(this).val())){
          var element = '<p class="customError" style="color:red">'+"The email should be a valid email address"+'</p>';
          $(element).insertAfter($(this));
          error++;
        }
        else if(data.email != data.reemail){
          var element = '<p class="customError" style="color:red">'+"Email address does not match"+'</p>';
          $(element).insertAfter($(this));
          error++;
        }
      }
      if($(this).attr('name') == 'email' && $(this).val() != ''){
        let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(!regex.test($(this).val())){
          var element = '<p class="customError" style="color:red">'+"The email should be a valid email address"+'</p>';
          $(element).insertAfter($(this));
          error++;
        }
      }
     
      if($(this).val() == '' || $(this).val() == '(___)___-____'){

        var element = '<p class="customError" style="color:red">'+"The "+$(this).prev().text()+" field is required"+'</p>';
        $(element).insertAfter($(this));
        error ++;
      }
     
  });
  if(isSignUpfields){
    $('.customValidateSignUp').each(function(key,val){
      $(this).next('.customError').remove();
      if($(this).attr('name') == 'password' && $(this).val() != ''){
        if($(this).val().length < 6){
          var element = '<p class="customError" style="color:red">'+" Password must be at least 6 characters long."+'</p>';
          $(element).insertAfter($(this));
          error++;
        }
      }
      if($(this).attr('name') == 'cpassword' && $(this).val() != ''){
        if($(this).val() != $('input[name=password]').val()){
          var element = '<p class="customError" style="color:red">'+"Password & Confirm password do not match."+'</p>';
          $(element).insertAfter($(this));
          error++;
        }
      }
      if($(this).val() == '' ){
      
          var element = '<p class="customError" style="color:red">'+"The "+$(this).prev().text()+" field is required"+'</p>';
          $(element).insertAfter($(this));
          error ++;
        
      }
      if($(this).attr('name') == 'is_terms' && $(this).prop('checked') == false){
        var element = '<p class="customError" style="color:red">'+"Please accept the Term & Condition."+'</p>';
        $(element).insertAfter($(this));
        error ++;
      }
  
    });
  }
 
  return error;
 }

onClickSubmit(data) {
  
    // var postdata = {
    //   "listing_id" : this.dispDetails.id,
    //   "first_name" : data.fname,
    //   "last_name":data.lname,
    //   "telephone":data.telnum,
    //   "e_mail":data.email,
    //   'verification_details':data.notes,
    // };
    
    let honeyError = 0;
    let error = this.customValidateFields(data);

    if(error == 0){

      // Honeypot Implementation
      $('.honeyInput').each(function(key,val){
        if($(this).val() != ''){
          $('.fileInput').next('.customError').remove();
            var element = '<p class="customError" style="color:red">Something Went Wrong</p>';
            $(element).insertAfter($('.fileInput'));
            honeyError++;
        }
      });
    }

    // if(data.email != data.reemail){
    //   toastr.error("&nbsp;&nbsp;Both emails are not matching!", "", {
    //      "closeButton": true,
    //       "timeOut": "8000",
    //       "extendedTImeout": "0",
    //       "showDuration": "300",
    //       "hideDuration": "1000",
    //       "extendedTimeOut": "0",
    //       "showEasing": "swing",
    //       "hideEasing": "linear",
    //       "showMethod": "fadeIn",
    //       "hideMethod": "fadeOut",
    //       "positionClass": "toast-top-full-width",
    //     });
    // }
    const formData = new FormData();
    $.each(this.file, function(index, value){
      formData.append('file[]', value);
    });
 
    formData.append("listing_id",this.dispDetails.id);
    formData.append("first_name",data.fname);
    formData.append("last_name",data.lname);
    formData.append("telephone",$('input[name=telnum]').val());
    formData.append("e_mail",data.email);
    formData.append("verification_details",$('textarea[name=notes]').val());

    if(error == 0 && honeyError == 0){

      if(!this.claimListingWithSignup){
        this.review_check_email().subscribe(
          (data => {    
            if(data['data'] > 0)
            {
              this.postPaidFor(formData).subscribe(
                (data => {
                    if(data["api_message"] == "success" && data["id"] > 0){
                        toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Congrats, you'r provided information received successfully...Thanks", "", {
                       "closeButton": true,
                        "timeOut": "8000",
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
          
                    this.expiredDate = new Date();
                    this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );
                    this.cookieService.set( '_mio_user_id', data["user_id"], this.expiredDate,"/" );
          
                    $('#myModal_paid').modal('hide');
          
                }),
                (err: any) => {console.log(err)
                  toastr.error(err.message, "", {
                   "closeButton": true,
                    "timeOut": "8000",
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
                () => {
                  console.log("err.message");
                  
                }
               );
             
            }
            else
            {
              jQuery('.signupFields').show();
              this.claimListingWithSignup = true;
            }
          }),
          (err: any) => console.log(err),
          () => {  
              
         });
      }else{
        let errorCheck = this.customValidateFields(data,true);

        if(errorCheck == 0){
          this.isValidFormSubmitted = true;
          formData.append("password",data.password);        
          formData.append("is_updates",data.is_updates);   
          formData.append("status",'1');
          formData.append("id_cms_privileges",'4');
          formData.append("referrer_id",this.cookieService.get('_mio_user_referral_id'));
          formData.append("claim_listing_with_signup","1");

          this.postPaidFor(formData).subscribe(
            (data => {
                if(data["api_message"] == "success" && data["id"] > 0){
                    toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Congrats, you'r provided information received successfully...Thanks", "", {
                   "closeButton": true,
                    "timeOut": "8000",
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
      
                this.expiredDate = new Date();
                this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );
                this.cookieService.set( '_mio_user_id', data["user_id"], this.expiredDate,"/" );
      
                $('#myModal_paid').modal('hide');
      
            }),
            (err: any) => {console.log(err)
              toastr.error(err.message, "", {
               "closeButton": true,
                "timeOut": "8000",
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
            () => {
              console.log("err.message");
              
            }
           );
        }
      }
      
     
    }
 }

 onCheckEmail(form: NgForm)
 {

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
 postCheckEmail(){
  var postData = {"email":jQuery('input[name=email]').val()};
 
  return this._http.post<any[]>('checkemailexit',postData);
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
 
 postPaidFor(postdata){
    return this._http.post<any[]>('claim_lingings',postdata);
  }
onSubmitReviewForm(form: NgForm) {


  if($("#starrating").val() == "" || $("#starrating").val() == null){
       //console.log("Not set");
       this.rating_req = true;
       return;
     }else{
       this.rating_req = false;
     }

     this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }


     this.isValidFormSubmitted = true;
     this.review = form.value;
     this.login_alert.email = form.value.email
     this.review.status = 0;

     if(this.user_data && this.user_data['email']){

      this.review.email = this.user_data['email'];
      this.review.name = this.user_data['name'];
      this.review.user_id = this.user_data["id"];

    }else if(this.cookieService.get('_mio_user_email') && this.cookieService.get('_mio_user_email') != ""){

        this.review.email = this.cookieService.get('_mio_user_email');
        this.review.name = this.cookieService.get('_mio_user_name');
        this.review.user_id = parseInt(this.cookieService.get('_mio_user_id'));

    }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id') != ""){

      this.review.user_id = parseInt(this.cookieService.get('_mio_user_id'));
      
    }

    $("#rating").val();

   // console.log($("#rating").val());
    this.review.rating = $("#starrating").val();
     this.review.disp_id = this.dispens_id;
      this.expiredDate = new Date();
      this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );
  

      if(this.isUserLoggedIn)
    {
     // this.cookieService.set( '_mio_user_name', this.review.name, this.expiredDate,"/" );
     // this.cookieService.set( '_mio_user_email', this.review.email, this.expiredDate ,"/");
      this.postReview().subscribe(
      (data => {    
       
        this.review_id = data["id"];        
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
        this.checkUser = true;
      }),
      (err: any) => console.log(err),
      () => {              
          if(this.review_id > 0){
            this.review_id  = 0;
            toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp; Awesome! The POW Team has received your review. If it meets the community guidelines, it will be published momentarily.  ', "", {
             "closeButton": true,
              "timeOut": "8000",
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

            this.write_review =  false;

            this.review = new ReviewDisp();   
            form.resetForm();
          }
          
     });
    }
    else
    {
      
      this.review_check_email().subscribe(
      (data => {    
           if(data['data'] > 0)
           {
             console.log(data['data'])
             setTimeout(function(){ 
                $('#login_modal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: false
              });
        }, 1);
           }
           else
           {
             this.postReview().subscribe(
      (data => {    
        console.log(data)
        this.review_id = data["id"];        
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
        this.checkUser = true;
      }),
      (err: any) => console.log(err),
      () => {              
          if(this.review_id > 0){
            this.cookieService.set( '_mio_user_name', this.review.name, this.expiredDate,"/" );
     this.cookieService.set( '_mio_user_email', this.review.email, this.expiredDate ,"/");
            this.review_id  = 0;
            toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome! The POW Team has received your review. If it meets the community guidelines, it will be published momentarily. ', "", {
             "closeButton": true,
              "timeOut": "8000",
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

            this.write_review =  false;

            this.review = new ReviewDisp();   
            form.resetForm();
          }
          
     });
           }
      }),
      (err: any) => console.log(err),
      () => {              
          
          
     });
    }

    // this.postReview().subscribe(
    //   (data => {
    //     this.review_id = data["id"];        
    //     this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
    //     this.checkUser = true;
        
    //   }),
    //   (err: any) => console.log(err),
    //   () => {
    //       if(this.review_id > 0){
    //         this.cookieService.set( '_mio_user_name', this.review.name, this.expiredDate,"/" );
    //         this.cookieService.set( '_mio_user_email', this.review.email, this.expiredDate ,"/");
    //         this.review_id  = 0;
    //         //console.log(this.review_id)
    //         this.review_id  = 0;

    //         toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome! The POW Team has received your review. If it meets the community guidelines, it will be published momentarily. ', "", {
    //          "closeButton": true,
    //           "timeOut": "8000",
    //           "extendedTImeout": "0",
    //           "showDuration": "300",
    //           "hideDuration": "1000",
    //           "extendedTimeOut": "0",
    //           "showEasing": "swing",
    //           "hideEasing": "linear",
    //           "showMethod": "fadeIn",
    //           "hideMethod": "fadeOut",
    //           "positionClass": "toast-top-full-width",
    //         }); 

    //         this.write_review =  false;

    //         this.review = new ReviewDisp();   
    //         form.resetForm();
    //       }
          
    //  });
    
    
} 
  
review_check_email(){
  return this._http.get<any[]>('review_check_email?email='+this.review.email);
}
getDispensaryDetailData(disp_slug): Observable<any> {
   // var postData = {"url":currentUrl};
    if(this.user_data){
      return this._http.get<any>('dispensary_detail?slug='+disp_slug+'&user_id='+this.user_data["id"]);
    }else{
      return this._http.get<any>('dispensary_detail?slug='+disp_slug);
    }
  }

  postReview(){
    return this._http.post<any[]>('setdispreview',this.review);
  }
  disp_follow(fav_disp){
    return this._http.get<any>('dispensary_follow?user_id='+fav_disp.user_id+'&dispansary_id='+fav_disp.id);
  }
  followStore(id){
    if(this.user_data){
      this.fav_disp.user_id = this.user_data["id"];
      this.fav_disp.id = id;
      console.log(this.fav_disp);
      this.disp_follow(this.fav_disp).subscribe(
      (data => {
        if(data['data'] == 'follow'){
          toastr.success('<i class="icon-ok-sign"></i>&nbsp;&nbsp;PuPow! You are now following&nbsp;'+this.dispDetails.name, "", {
           "closeButton": true,
            "timeOut": "8000",
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
          $('.tooltip-contentfollow span.count').html(parseInt($('.tooltip-contentfollow span').text())+1);
          $('.tooltip-contentfollow').addClass('user_follow');
          $('.tooltip-contentfollow span.nocount').remove();
        }else{
          toastr.warning('<i class="icon-warning-sign"></i>&nbsp;&nbsp;You are no longer following&nbsp;'+this.dispDetails.name, "", {
           "closeButton": true,
            "timeOut": "8000",
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
          $('.tooltip-contentfollow').removeClass('user_follow');
          $('.tooltip-contentfollow span.count').html(parseInt($('.tooltip-contentfollow span').text())-1);
          $('.tooltip-contentfollow span.count').after('<span class="nocount" style="color: #ffff;font-size: 14px;vertical-align: middle;font-weight: 700;margin-left: 5px;">Follow</span>');
        }
      }),
      (err: any) => console.log(err),
      () => {
        //console.log(err);
     });
    }else{
      //this.fav_disp = this.cookieService.get('fav_disp');
      //this.fav_disp.append({'user_id': 0,'id': id});
      //this.fav_disp.id = id;
      this.expiredDate = new Date();
      this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );
      console.log(this.fav_disp);
      this.cookieService.set('fav_disp', JSON.stringify(this.fav_disp), this.expiredDate,"/");
      toastr.success('<i class="icon-ok-sign"></i>&nbsp;&nbsp;Awesome, you have followed the store', "", {
       "closeButton": true,
        "timeOut": "8000",
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
      $('.tooltip-contentfollow span').html(parseInt($('.tooltip-contentfollow span').text())+1);
      //this.cookieService.set('_mio_user_email', this.favstrain['email'], this.expiredDate,"/");
    }
  }

  
addUserLog (): Observable<any[]> {
    
  var postdata: any;
  var userId: any;

  userId = 0;

  if(this.user_data && this.user_data['id']!= '')
  {
      userId = this.user_data['id'];
  }else if(this.cookieService.get('_mio_user_id') && this.cookieService.get('_mio_user_id')!="")
  {
      userId = this.cookieService.get('_mio_user_id');
  }

  //var url = (this.platformLocation as any).location.origin ;
  var url = (this.platformLocation as any).location.href;

  //var detailstmp = {'location' : this.selectedLocation,'strain' : this.selectedStrain, 'mass' : this.selectedMass };
  
  //console.log((this.platformLocation as any).location);
  var details = "NA";
  
  

  var description = "I Feel Like-"+this.dispDetails['name'];


  postdata = {'url' : url , 'description' : description, 'user_id' :userId , 'details': details};
 
  return this._http.post<any[]>('set_user_log',postdata);
}


  onLogin(form: NgForm)
  {
    this.isValidFormSubmitted = false;
     if (form.invalid) {
        return;
     }
     this.isValidFormSubmitted = true;
     this.login_alert.email = form.value.email;
     this.login_alert.password = form.value.password;

     this.postLogin().subscribe(data => 
            {
            //console.log(data);
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
                   $('#login_modal').modal('hide');

                   this.expiredDate = new Date();
    this.expiredDate.setDate( this.expiredDate.getDate() + 1000 );

    //this.cookieService.set( '_mio_user_name', this.converter_alert.name, this.expiredDate,"/" );
    this.cookieService.set( '_mio_user_email', this.login_alert.email, this.expiredDate,"/" );
     this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );      
                   
                   localStorage.setItem('userData',JSON.stringify(data));   
                   this.checkUser = true;
                   this.isUserLoggedIn = true;
                   this.user_data = data;                
                   this.globals.user_data = true;
                   this.globals.user_name = data["name"];
                   this.globals.user_email = data["email"];
                   //this.getpricealertCount();

                   this.addUserLog().subscribe(
                      (data => {}),
                      (err: any) => console.log(err),
                      () => {}
                    ); 
                   form.resetForm();
                  // this.router.navigate(['/members/dashboard']);

                   //localStorage.setItem('remember_token',data["remember_token"]);
                //form.resetForm();

                  

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

   postLogin(){
    return this._http.post<any[]>('userlogin',this.login_alert);
  }




}
