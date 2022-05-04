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
import { UserDetail } from '../../models/user-detail';

declare var toastr: any;
declare var jQuery: any;
declare var Swal: any;

@Component({
  selector: 'mio-business-user-edit',
  templateUrl: './business-user-edit.component.html',
  styleUrls: ['./business-user-edit.component.css']
})
export class BusinessUserEditComponent implements OnInit {

user_data: any;
name : string;
email: string;
phone :string;
referral_url :string;
referral_id :string;
listUserLists:any;
id: any;
UserDetail= new UserDetail();

  constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation, private _http: HttpClient,private router: Router, private globals: Globals,private cookieService: CookieService) { 
	
	
	this.user_data = JSON.parse(localStorage.getItem('userData'));
  //console.log(this.router.url);
	if(this.user_data == null)
  {
	 this.router.navigate(['/']);

  }
  if(this.user_data['id_cms_privileges'] != 6){
	 this.router.navigate(['/members/profile']);
  }
	this.getuserdata();
  this.editUser();
  }

  getUserList(){
	//return this._http.get<any[]>('get_user_dispensary_reviews?user_id='+this.user_data['id']);
	return this._http.get<Ret[]>('business_users?user_id='+this.user_data['id']);
  }
 getUser(){
	//console.log(this.user_data['remember_token']);
	return this._http.get<Ret[]>('users?id='+this.user_data['id']+'&remember_token='+this.user_data['remember_token']);
  }
  getUserDetails(id){
  	return this._http.get<Ret[]>('user_details?id='+id);
  }
  ngOnInit() {
window.scrollTo(0, 0);
  //this.loadMetaData();
  }
  loadMetaData(){
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
  	updateUserDetails(postdata){
		//const headers = new Headers();
		//return this._http.get<Ret[]>('dispensary_update?slug='+slug);
		return this._http.post<any[]>('user_update',postdata);
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
	listUserList(){
		this.getUserList().subscribe(data => 
		{
			this.listUserLists = data['data'];
			if(this.listUserLists.length == 0){

			}
		}, (err) => {
			console.log(err.message);
		});
  	}
  editUser(){
  	this.id = this.router.url.split('/').pop();
		if(this.id){
		  this.getUserDetails(this.id).subscribe(data => {
				this.UserDetail = data['data'];
		  }, (err) => {
			console.log(err.message);
		  });
		}
  }
  suspendStore(storeset){
	Swal({
	  title: 'Suspend your store profile?',
	  text: 'Suspending your store listing will make it inactive from the public. Thus visitors, customers and future customers will not find your store listing or profile anywhere on POW. You can undo this action anytime.',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonText: 'Yes, suspend!',
	  cancelButtonText: 'No, keep it'
	}).then((result) => {
	  if (result.value) {
		var postdata = storeset;
		postdata.status = 0;
		postdata.id = postdata.dispansary_id;
		
		delete postdata.user_id;
		delete postdata.dispansary_id;
		//console.log(postdata);
		// this.updateUserDetails(postdata).subscribe(
		//   data =>{
		// 	if(data["api_message"] == "success" && data["id"] > 0){
		// 	  toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, Your store '"+name+"' deleted successfully", "", {
		// 		"closeButton": true,
		// 		"timeOut": "7000",
		// 		"extendedTImeout": "0",
		// 		"showDuration": "300",
		// 		"hideDuration": "1000",
		// 		"extendedTimeOut": "0",
		// 		"showEasing": "swing",
		// 		"hideEasing": "linear",
		// 		"showMethod": "fadeIn",
		// 		"hideMethod": "fadeOut",
		// 		"positionClass": "toast-top-full-width",
		// 	  });
		// 	}
		//   },
		//   (err) => {console.log(err.message);}
		// );
	  }
	});
  }
 //  onFilechange(event: any) {
	// this.file = event.target.files[0]
 //  }
  onSubmitUser(data){
	// var postdata = {
	//  'name': jQuery('#name').val(),
	//  'address': jQuery('#address').val(),
	//  'address2': jQuery('#address2').val(),
	//  'city': jQuery('#city').val(),
	//  'state': jQuery('#state').val(),
	//  'zip_code': jQuery('#zip_code').val(),
	//  'country': jQuery('#country').val(),
	//  'website': jQuery('#website').val(),
	//  'email': jQuery('#email').val(),
	//  'email2': jQuery('#email2').val(),
	//  'phone': jQuery('#phone').val(),
	//  'license_type': jQuery('#license_type').val(),
	//  'id': jQuery('#id').val(),
	//  'file': this.file
	// }
	const formData = new FormData();
	//formData.append('file', this.file);
	formData.append('name',jQuery('#name').val());
	formData.append('email',jQuery('#email').val());
	formData.append('gender',jQuery('input[name="gender"]:checked').val());
	formData.append('country',jQuery('#country').val());
	formData.append('state',jQuery('#state').val());
	formData.append('id',jQuery('#id').val());
	console.log(formData);
	this.updateUserDetails(formData).subscribe(
	  data =>{
		if(data["api_message"] == "success"){
		  toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, Your store '"+name+"' updated successfully", "", {
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
		  jQuery('#add_edit_user').modal('hide');
		}else{
		  toastr.error(data["api_message"], "", {
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
		  jQuery('#add_edit_user').modal('hide');
		}
	  },
	  (err) => {
		toastr.danger(err.message, "", {
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
		console.log(err.message);
	  }
	);
  }
 

}
