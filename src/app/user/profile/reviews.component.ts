import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ret} from '../../models/ret';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Globals } from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';
import { City } from '../../models/city';
import {Review} from '../../models/review';
import {ReviewDisp} from '../../models/review _disp';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;

@Component({
  selector: 'mio-member-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./profile.component.css']
})
export class ReviewsComponent implements OnInit {
  user_data: any;
  strain: any;
  isValid = false;
  user_data_email: any;
  user_email:any;
  change_display = false;

  locations = new City();
  geoLocations = "";
  no_data = false;
  reviews: any;
  dispreviews:any;
  //strainreviewMessage:any;
  //strainid:any;
  review_alert = new Review();
  dispreview_alert = new ReviewDisp();
  strain_name:any;
  strain_rating:any;

  //readmore = "Readmore";
  //strainreadmore = "Readmore";

  constructor(private cookieService: CookieService,private _http: HttpClient,private globals: Globals,private route: ActivatedRoute,private routes: Router) {
        //this.review_alert.rating = 5;
      this.route.params.subscribe(params => {


          if(typeof params['country'] === "undefined")
          {   
            let locationSes = [];

            if(localStorage.getItem('locationData')!= null)
              {
                 // console.log("main if");
                  locationSes = JSON.parse(localStorage.getItem('locationData'));
                 if(typeof locationSes['country'] === "undefined")
                 {
                       // console.log("If");
                       this.loadLocationsIp();  

                 }else{
                      //console.log("else");
                      this.geoLocations = locationSes['country'].toLowerCase();
                      this.globals.location_global_url = locationSes['country'].toLowerCase();
                      this.routes.navigate(['/members/reviews']);
                         
                 }  
              } 
              else{

                   //console.log("main else");
                       this.loadLocationsIp();  
              }   
          }else{
            let locationSes = [];
             locationSes = JSON.parse(localStorage.getItem('locationData'));
             this.geoLocations = locationSes['country'].toLowerCase();

          }  
        
        })

  		this.user_data = JSON.parse(localStorage.getItem('userData'));

      //this.user_data_email = this.cookieService.get('_mio_user_email');
     // console.log(this.cookieService.get('_mio_user_email'));

      if(this.user_data == null)
      {
        this.user_email = this.cookieService.get('_mio_user_email');


      }else{
        this.user_email = this.user_data.email;
      }

  		//this.getpricealertData();

      this.listreview();
      this.listdispreview();

   }

   getGeoLocation (): Observable<City[]> {
    return this._http.get<City[]>('getusergeolocation');
  }

  loadLocationsIp(){
    
    this.getGeoLocation().subscribe(

      (data => {
        this.locations = data['data'];
        this.geoLocations = this.locations['country'].toLowerCase();;
        data['data']['country'] = data['data']['country'].toLowerCase();
        localStorage.setItem('locationData',JSON.stringify(data['data']));

        this.globals.location_global_url = data['data']['country'].toLowerCase();
        this.routes.navigate(['/'+ this.geoLocations +'/feel-like']);
               
      }),
      (err: any) => console.log(err),
      () => {}

    );
  }

  
  ngOnInit(){window.scrollTo(0, 0);
    
  }

  getReview(){
   
    return this._http.get<any[]>('get_user_strain_reviews?user_id='+this.user_data.id);
  }
  getdispReview(){
   
    return this._http.get<any[]>('get_user_dispensary_reviews?user_id='+this.user_data.id);
  }
  DeleteReview(id)
  {
    return this._http.get<any[]>('delete_user_strain_review?id='+id);
  }
  DeletedispReview(id)
  {
    return this._http.get<any[]>('delete_user_disp_review?id='+id);
  }

  

  listreview()
  {
    this.getReview().subscribe(data => 
            {

            
           this.reviews = data['data'];
           //console.log(this.reviews);

           if(this.reviews.length == 0){

             this.isValid = true;
           }
                

            }, (err) => {
               
                console.log(err.message);
            });
  }
  listdispreview()
  {
    this.getdispReview().subscribe(data => 
            {

            
           this.dispreviews = data['data'];
           //console.log(this.reviews);

           if(this.dispreviews.length == 0){

             this.isValid = true;
           }
                

            }, (err) => {
               
                console.log(err.message);
            });
  }

  removeReview(id,strain)
  {
    Swal({
      title: 'Are you sure?',
      text: 'You want to delete review for'+strain,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        this.DeleteReview(id).subscribe(
          data =>{
            this.listreview();

              toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, review form"+strain+"removed successfully", "", {
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

        
      }
    });

  }

  removedispReview(id,disp)
  {
     Swal({
      title: 'Are you sure?',
      text: 'You want to delete review for'+disp,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        this.DeletedispReview(id).subscribe(
          data =>{
            this.listdispreview();

              toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, review form"+disp+"removed successfully", "", {
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

        
      }
    });
  }

  readmoredisp(id)
  {
    

 if ($("#dots_"+id).css('display') == 'none') {
   
   $('#dots_'+id).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'inline');​​​​​​
     $('#more_'+id).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'none');​​​​​​
     document.getElementById("myBtn_"+id).innerHTML = "...Read more";
    // this.readmore = "Readmore"
    //btnText.innerHTML = "Read more"; 
    
  } else {
    //$().css('display') = "none";
    ​$('#dots_'+id).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'none');​​​​​​
    $('#more_'+id).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'inline');​​​​​​
    document.getElementById("myBtn_"+id).innerHTML = "...Read less";
   // this.readmore = "Readless"
    //$('#myBtn').css('innerHtml'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'Read less');​​​​​​

  //btnText.nativeElement.innerHTML = "Read less";
   
  }

  }

  readmorestrain(id)
  {
  //alert(rvid)

 if ($("#dots1_"+id).css('display') == 'none') {
   
   $('#dots1_'+id).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'inline');​​​​​​
     $('#more1_'+id).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'none');​​​​​​
     //this.strainreadmore = "Readmore"
      document.getElementById("myBtn1_"+id).innerHTML = "...Read more";
    //btnText.innerHTML = "Read more"; 
    
  } else {
    //$().css('display') = "none";
    ​$('#dots1_'+id).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'none');​​​​​​
    $('#more1_'+id).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'inline');​​​​​​
    //this.strainreadmore = "Readless"
    document.getElementById("myBtn1_"+id).innerHTML = "...Read less";
    //$('#myBtn').css('innerHtml'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'Read less');​​​​​​

  //btnText.nativeElement.innerHTML = "Read less";
   
  }

}

onSreviewsubmit(form: NgForm)
{
   if (form.invalid) {
          return;
       }
  this.review_alert.message = form.value.review;
  this.review_alert.id = form.value.id;

  this.strainreviewupdate().subscribe(data => 
            {

        
              if(data['api_status'] == 1)
              {
                $("#myModal_fav").modal('hide');

                toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Review edited successfully !", "", {
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

              

               this.listreview()
              }
                

            }, (err) => {
               
                console.log(err.message);
            });


}

getReviewdetail(id)
{
  this.getReviewMessage(id).subscribe(data => 
            {

           //console.log()
            this.strain_name = data['data']['strain_name'];
           // console.log(this.strain_name)
           this.review_alert.message = data['message'];
           this.review_alert.id = data['id'];
           //this.strain_rating = data['rating'];
           this.review_alert.rating = data['rating'];
           console.log(this.review_alert.rating);

         
                

            }, (err) => {
               
                console.log(err.message);
            });
}

getdispReviewdetail(id)
{
  this.getdispReviewMessage(id).subscribe(data => 
            {

            
           this.dispreview_alert.message = data['message'];
           this.dispreview_alert.id = data['id'];
          // console.log(this.strainreviewMessage);

         
                

            }, (err) => {
               
                console.log(err.message);
            });
}

onDispreviewupdate(form: NgForm)
{
  if (form.invalid) {
          return;
       }
  this.dispreview_alert.message = form.value.disp_review;
  this.dispreview_alert.id = form.value.id;

  this.dispreviewupdate().subscribe(data => 
            {

        
              if(data['api_status'] == 1)
              {
                $("#myModal_fav1").modal('hide');

                toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Review edited successfully !", "", {
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

              this.listdispreview()

                }
                

            }, (err) => {
               
                console.log(err.message);
            });

}

unpublishreview(id,name)
{
  Swal({
      title: 'Are you sure?',
      text: 'You want to unpublish review for'+name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unpublish it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        this.unpublishReview(id).subscribe(
          data =>{
            this.listreview();

              toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, review form"+name+"unpublish successfully", "", {
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

        
      }
    });
}
unpublishdispreview(id,name)
{
   Swal({
      title: 'Are you sure?',
      text: 'You want to unpublish review for'+name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unpublish it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {  

        this.unpublishdispReview(id).subscribe(
          data =>{
            this.listdispreview();

              toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, review form"+name+"unpublish successfully", "", {
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

        
      }
    });
}

getReviewMessage(id){
   
    return this._http.get<any[]>('getstrainreview?id='+id);
  }
  getdispReviewMessage(id){
   
    return this._http.get<any[]>('getdispreview?id='+id);
  }

  strainreviewupdate()
  {
    return this._http.post<any[]>('updatestrainreview',this.review_alert);
    
  }

  dispreviewupdate()
  {
     return this._http.post<any[]>('updatedispreview',this.dispreview_alert);
  }

  unpublishReview(id)
  {
    return this._http.get<any[]>('unpublishreview?id='+id);
  }
  unpublishdispReview(id)
  {
     return this._http.get<any[]>('unpublishdispreview?id='+id);
  }


  

}
