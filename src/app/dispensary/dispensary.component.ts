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

   constructor(private cookieService: CookieService,public globals: Globals,private route: ActivatedRoute,private routes: Router,private _http: HttpClient,private platformLocation: PlatformLocation, private title: Title, private meta: Meta) {window.scrollTo(0, 0);}

  ngOnInit() {

  this.route.params.subscribe(params => {

        this.user_data = JSON.parse(localStorage.getItem('userData'));
         if(this.user_data && this.user_data['email']){
           this.checkUser = true;
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
        //this.schedule = JSON.parse(this.dispDetails.schedule);
        //console.log(this.dispDetails.state.replace(/\s/g, "-"));

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
  this.file = event.target.files;
}
enableReviewForm(){
    this.write_review = true;
    setTimeout(function(){ $("#starrating").rating(); }, 1);
 }
onClickSubmit(data) {
  console.log(data);
    // var postdata = {
    //   "listing_id" : this.dispDetails.id,
    //   "first_name" : data.fname,
    //   "last_name":data.lname,
    //   "telephone":data.telnum,
    //   "e_mail":data.email,
    //   'verification_details':data.notes,
    // };
    if(data.email != data.reemail){
      toastr.error("&nbsp;&nbsp;Both emails are not matching!", "", {
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
    const formData = new FormData();
    $.each(this.file, function(index, value){
      formData.append('file[]', value);
    });
    formData.append("listing_id",this.dispDetails.id);
    formData.append("first_name",data.fname);
    formData.append("last_name",data.lname);
    formData.append("telephone",data.telnum);
    formData.append("e_mail",data.email);
    formData.append("verification_details",data.notes);
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
        console.log(err.message);
        
      }
     );
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

          this.postReview().subscribe(
      (data => {
        this.review_id = data["id"];        
        this.cookieService.set( '_mio_user_id', data['user_id'], this.expiredDate,"/" );
        this.checkUser = true;
        
      }),
      (err: any) => console.log(err),
      () => {
          if(this.review_id > 0){
            //console.log(this.review_id)
            this.review_id  = 0;

            toastr.success('<i class="icon-warning-sign"></i>&nbsp;&nbsp;Awesome, the POW team has received ', "", {
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
          $('.tooltip-contentfollow span.count').after('<span class="nocount" style="color: #ffff;font-size: 14px;vertical-align: middle;font-weight: 700;margin-left: 5px;">&nbsp;&nbsp;|&nbsp;&nbsp;Follow</span>');
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
}
