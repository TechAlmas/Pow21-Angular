import { Component, OnInit,AfterViewInit } from '@angular/core';
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
import { CompleterService, CompleterData } from 'ng2-completer';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;
declare var Swal: any;

@Component({
  selector: 'mio-Edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./profile.component.css']
})
export class EditComponent implements OnInit {
	change_location = true;
  user_data: any;
  form: FormGroup;
  isValidFormSubmitted = false;
  referral_url: string;
  bMonth: any;
  bDay: any;
  bYear: any;
  state_data: any;
  city_data: any;
  birthday_valid = false;
  birthday_message:any; 
  currentYear:any;

  actorDS: any;

  genderOption = [{'label': 'Select Gender', 'value': null},{'label': 'Male', 'value': 'Male'}, {'label': 'Female', 'value': 'Female'}];

	edit_alert = new Edit();
	emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  protected searchStr: string;
  protected captain: string;
  protected dataService: CompleterData;
 
	constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation,private _http: HttpClient,private router: Router,private globals: Globals,private cookieService: CookieService,private completerService: CompleterService){

   

   //this.dataService = completerService.local(this.searchData, 'city_name', 'city_name');
   // this.dataService = completerService.remote("getgeoautocomplete?city_name=",null,null);



		this.user_data = JSON.parse(localStorage.getItem('userData'));
    if(this.user_data == null)
    {
      console.log("exit");
       this.router.navigate(['/']);

    }
      // console.log(this.user_data);
    this.edit_alert.name = this.user_data['name'];
    var uudata = this.edit_alert.name.split(" ");
		this.edit_alert.first_name = uudata[0];
    this.edit_alert.last_name = uudata[1];
		this.edit_alert.id = this.user_data['id'];
    this.edit_alert.city = this.user_data["city"];
    this.edit_alert.state = this.user_data["state"];
    this.edit_alert.country = this.user_data["country"];
    this.edit_alert.auto_state = this.user_data["city"]+','+this.user_data["state"];
    //console.log(this.edit_alert); 
		//this.edit_alert.email= this.user_data['email'];

    this.edit_alert.gender = this.user_data['gender'];
    if(this.user_data['birthday'] != null)
    {
      var birthdate_split = this.user_data['birthday'].split("-");
      //console.log(birthdate);
      this.bYear = birthdate_split[0];
      this.bMonth = birthdate_split[1];
      this.bDay = birthdate_split[2];
    }

     this.actorDS = completerService.remote(null, 'name', 'name');
    this.actorDS.urlFormater(term => {
            return 'getgeoautocomplete?country='+this.edit_alert.country+'&name='+term;
        });
    this.actorDS.dataField('data');
    
    //console.log(this.bMonth);
    
   //console.log(this.edit_alert.birthday);


   
    this.referral_url = (this.platformLocation as any).location.origin + "/share/" + this.user_data['referral_id'];



	}
  /*ngAfterViewInit(){

    $('#converter-state').on(
            'change',
            (e) => {       
               
              alert('hyy')
            }
        );
  }*/

	ngOnInit() {

    window.scrollTo(0, 0);
       this.loadestate();
        this.loadcity();
      //this.loadMetaData();
      $('input[type=text]').each(function(){
        $(this).attr("autocomplete","off");
      });
      
      $("#birthday").attr("autocomplete","off");
      $("#birthday").datepicker({
        format: "yyyy-mm-dd",
        forceParse: false
      });
      $("#bMonth").blur(function(){
            //alert(('0' + $("#bMonth").val()).slice(-2)) // '11');
            if($("#bMonth").val() > 0 && $("#bMonth").val() < 13){
                $("#bMonth").val(('0' + $("#bMonth").val()).slice(-2));
                $('#month_error').hide();
            }
            else{          
                 this.birthday_valid = true;      
                //this.birthday_message = "Month value must be 01 to 12";
               $('#month_error').show();
                //console.log(this.birthday_message);
                $("#bMonth").val("");
               // $("#bMonth").focus();
              // console.log(this.birthday_valid);
                return false;


            }

           if($("#bMonth").val() == null)
           {
             $('#month_error').show();
           }
            
        });
       $("#bDay").blur(function(){
            if($("#bDay").val() > 0 && $("#bDay").val() < 32){
                $("#bDay").val(('0' + $("#bDay").val()).slice(-2));
                $('#day_error').hide();                
            } 

            else{
                this.birthday_valid = true;
                //this.birthday_message = "Day value must be 01 to 31";
                $('#day_error').show();
                //console.log(this.birthday_message);
                $("#bDay").val("");
               // $("#bDay").focus();
                return false;
            }

            if($("#bMonth").val() == "02"){
              if($("#bDay").val() > 0 && $("#bDay").val() < 30){
                $("#bDay").val(('0' + $("#bDay").val()).slice(-2));
                $('#day_error1').hide();  
              }
              else{
                   this.birthday_valid = true;
                    $('#day_error1').show();
                    $("#bDay").val("");
                     return false;
              }
            }
            
        });
        $("#bYear").blur(function(){

          this.currentYear= (new Date()).getFullYear();
          
          //console.log($("#bYear").val())
            
            if($("#bYear").val().length < 4){
               this.birthday_valid = true;
                //this.birthday_message = "Year value must be 4 digits";
               $('#year_error').show();
                $("#bYear").val("");
                //$("#bYear").focus();
                return false;
            }
            if($("#bYear").val() <1850 || $("#bYear").val()>=this.currentYear)
            {
              //console.log();

              this.birthday_valid = true;
              $('#year_error1').show();
              $("#bYear").val("");
              return false;
            }
            else
            {
               $('#year_error1').hide();
            }

        });





        /* $('#converter-state').on(
            'change',
            (e) => {       
               
              alert('hyy')
            }
        );*/
       

     /* $("#birthday").change(function(){
           console.log("Test" + $(this).val());
      });*/

   }

   checkDayValue(event){
    
      var bday = $("#bDay").val();
      if(bday && bday.length == 2){
        if(bday[0] == 3 && bday[1] > 1){
          $("#bDay").val(bday.slice(0,-1));
        }
        else if(bday[0] > 3)
        {
          $("#bDay").val(bday.slice(0,-1));
        }
      }

  }

   checkMonthValue(event){
    
      var bday = $("#bMonth").val();
      console.log(bday);
      if(bday && bday.length == 2){
        if(bday[0] == 1 && bday[1] > 2){
          $("#bMonth").val(bday.slice(0,-1));
        }
      }

  }

  checkYearValue(event)
  {
     var byear = $("#bYear").val();
     if(byear)
     {
       if(byear[0] != 1 && byear[0] !=2)
       {
          $("#bYear").val(byear.slice(0,-1));
       }
       if(byear && byear.length == 2)
       {
         if(byear[0] == 1)
         {
           if(byear[1] != 9)
           {
             $("#bYear").val(byear.slice(0,-1));
           }
         }
         else if(byear[0] == 2)
         {
           if(byear[1] != 0)
           {
             $("#bYear").val(byear.slice(0,-1));
           }
         }
       }
       if(byear && byear.length == 3)
       {
         if(byear[0] == 2)
         {
           if(byear[2] != 0)
           {
              $("#bYear").val(byear.slice(0,-1));
           }
         }
       }
        if(byear && byear.length == 4)
       {
         if(byear[0] == 2)
         {
           if(byear[3] > 4)
           {
              $("#bYear").val(byear.slice(0,-1));
           }
         }
       }
     }
//console.log(byear);
   // alert(bYear)
    
   
  }

   showhide()
   {
     this.change_location = !this.change_location;
     if(this.change_location)
     {
       $("#converter-state").show('fast');
       $("#converter-city").show('fast');
      /* setTimeout(function() {
          $('#converter-state').select2();
        }, 100);

       var $eventSelect = $("#converter-state");

       $("#converter-state").on("select2:select", function (e) { alert("change"); });

               $('#converter-state').on(
            'change',
            (e) => {       
               
              alert('hyy')
            }
        );*/
       
     }

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
   
    return this._http.post<any[]>('users_edit',this.edit_alert);
  }
  onFileSelected(event){
  	//console.log(event);
  	//this.selectedFile = event.target.files[0];

  }


  onFormSubmit(form: NgForm){

  	  this.isValidFormSubmitted = false;
    	 if (form.invalid) {
          return;
       }

     this.isValidFormSubmitted = true;
     this.edit_alert.id = this.user_data['id'];


     this.edit_alert.name = form.value.first_name+" "+form.value.last_name;

     //this.edit_alert.email = form.value.email;
     /*if(this.change_location){*/
       //this.edit_alert.city = $("#converter-city").val();
       //this.edit_alert.city = form.value.city;
       //this.edit_alert.state = form.value.state;
       //this.edit_alert.country = form.value.country;
       //var city = form.value.city;
       //console.log(this.edit_alert.city)
       if(this.edit_alert.city == null)
       {
         $('#city_error').show();
         return false;
       }
      
      /* if(this.edit_alert.state == "")
       {
         $('#state_error').show();
         return false;
       }*/

      //console.log(this.edit_alert.city)
     /*}*/
     

     this.edit_alert.gender = form.value.gender;
     var bDay = $("#bDay").val();
     var bMonth = $("#bMonth").val();
     var bYear = $("#bYear").val();
     if(bMonth == "")
     {
         $('#month_error').show();
         return false;
     }
     else
      {
         $('#month_error').hide();
      }

     if(bDay == "")
     {
        $('#day_error').show();
        return false;
     }
     else
      {
        $('#day_error').hide();
      }

     if(bYear == "")
     {
         $('#year_error').show();
         return false;
     }
     else
     {
       $('#year_error').hide();
     }
     this.edit_alert.auto_state = form.value.auto_state;
     var autocom =form.value.auto_state.split(',');
     this.edit_alert.city = autocom[0];
     this.edit_alert.state = autocom[1];
     //console.log(autocom[0])
     this.edit_alert.birthday = bYear+"-"+bMonth+"-"+bDay;


     //console.log(this.edit_alert.birthday);


    this.postEdit().subscribe(data => 
            {
              this.change_location = true;
           //console.log(data['data']);
            if (data["api_status"]==1)
                {
                   toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Profile edited successfully !", "", {
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
               
               // console.log(err.message);
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
        //console.log(this.globals.price_alert_count);

       if(this.globals.price_alert_count == null){
         //console.log(this.user_data_email);

         this.globals.price_alert_count = 0;
      }           
      //this.mio_session_count = localStorage.getItem('_mio_count');
      }, (err) => {
          //console.log(err.message);
      });


  }

  getstate()
  {
     return this._http.get<Ret[]>('getgeostates?country_name='+this.edit_alert.country);
  }
  getcity()
  {
    return this._http.get<Ret[]>('getgeocities?country_name='+this.edit_alert.country+'&subdivision_1_name='+this.edit_alert.state);
  }

  loadestate()
  {
    this.getstate().subscribe(state_data =>
        {

            this.state_data = state_data['data'];
            
              setTimeout(function() {
          $('#converter-state').select2();
        }, 100);

             
       $('#converter-state').on(
            'change',
            (e) => {       
               
              this.edit_alert.state = jQuery(e.target).val();
              if(this.edit_alert.state == "")
              {
                  $('#state_error').show();
              }
              else
              {
                $('#state_error').hide();
              }
              this.loadcity();
            }
        );
           

         }),
      (err: any) => console.log(err),
      () => {
         this.loadcity();
      }
  }

  loadcity()
  {
    this.getcity().subscribe(city_data =>
        {

            this.city_data = city_data['data'];
            
             setTimeout(function() {
          $('#converter-city').select2();
        }, 100);

             $('#converter-city').on(
            'change',
            (e) => {       
               
              this.edit_alert.city = jQuery(e.target).val();
              if(this.edit_alert.city == "")
              {
                  $('#city_error').show();
              }
              else
              {
                $('#city_error').hide();
              }
              
            }
        );
           
         }),
      (err: any) => console.log(err),
      () => {
         
      }
  }
}