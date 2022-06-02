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


declare var toastr: any;
declare var jQuery: any;
declare var Swal: any;

@Component({
	selector: 'mio-business',
	templateUrl: './business.component.html',
	styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
	user_data: any;
	name : string;
	email: string;
	phone :string;
	referral_url :string;
	referral_id :string;
	listdispLists:any;
	file:any;
	userList: any;
	

	constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation, private _http: HttpClient,private router: Router, private globals: Globals,private cookieService: CookieService) {
		this.user_data = JSON.parse(localStorage.getItem('userData'));
		console.log(this.user_data);
		//console.log(this.router.url);
		if(this.user_data == null){
			this.router.navigate(['/']);
		}
		if(this.user_data['id_cms_privileges'] != 7 && this.user_data['id_cms_privileges'] != 6){
			this.router.navigate(['/members/profile']);
		}
		this.getuserdata();
		this.listdispList();
		this.userlist();
	}

	getdispList(){
		return this._http.get<Ret[]>('businesslist?user_id='+this.user_data['id']);
	}
	getStoreDetails(slug){
		return this._http.get<Ret[]>('dispensary_detail?slug='+slug);
	}
	getAllUsers(){
		return this._http.get<Ret[]>('list_users');
	}
	updateStoreDetails(postdata){
		//const headers = new Headers();
		//return this._http.get<Ret[]>('dispensary_update?slug='+slug);
		return this._http.post<any[]>('dispensary_update',postdata);
	}
	getUser(){
		//console.log(this.user_data['remember_token']);
		return this._http.get<Ret[]>('users?id='+this.user_data['id']+'&remember_token='+this.user_data['remember_token']);
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
		//console.log(replaceString); console.log(replaceWord);console.log(currentUrl);
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
			"positionClass": "toast-top-full-width",
		});
		localStorage.removeItem('userData');
		this.globals.user_data = false;
		this.globals.user_name = this.cookieService.get('_mio_user_name');
		this.globals.user_email = this.cookieService.get('_mio_user_email');
		this.getpricealertCount();
		//window.location.href = '/';
		//this.router.navigate(['/user-login']);
	}
	getuserdata(){
		this.getUser().subscribe(data => {
			// console.log(data);
			this.name = data['name'];
			this.email = data['email'];
			this.phone = data['phone'];
			this.referral_id = data['referral_id'];
			this.referral_url = (this.platformLocation as any).location.origin + "/referral/" + data['referral_id'];
		},
		(err) => {
			console.log(err.message);
		});
	}
	getcount(){
		return this._http.get<Ret[]>('pricealertcount?email='+this.globals.user_email);
	}
	getpricealertCount(){
		this.getcount().subscribe(count_data => {
			this.globals.price_alert_count = count_data['price_alert_count'];
			//console.log(this.globals.price_alert_count);
			if(this.globals.price_alert_count == null){
				//console.log(this.user_data_email);
				this.globals.price_alert_count = 0;
			}
			//this.mio_session_count = localStorage.getItem('_mio_count');
		}, (err) => {
			console.log(err.message);
		});
	}
	listdispList(){
		this.getdispList().subscribe(data => {
			this.listdispLists = data['data'];
			//console.log(this.listdispLists);
			if(this.listdispLists.length == 0){
				//this.isValid = true;
			}
		}, (err) => {
			console.log(err.message);
		});
	}
	// editStore(id,slug){
	// 	var modal = jQuery('#add_edit_store');
	// 	if(slug){
	// 		this.getStoreDetails(slug).subscribe(data => {
	// 			//console.log(data['data']);
	// 			modal.find('#name').val(data['data']['name']);
	// 			modal.find('#address').val(data['data']['address']);
	// 			modal.find('#address2').val(data['data']['address2']);
	// 			modal.find('#city').val(data['data']['city']);
	// 			modal.find('#state').val(data['data']['state']);
	// 			modal.find('#zip_code').val(data['data']['zip_code']);
	// 			modal.find('#country').val(data['data']['country']);
	// 			modal.find('#website').val(data['data']['website']);
	// 			modal.find('#email').val(data['data']['email']);
	// 			modal.find('#email2').val(data['data']['email2']);
	// 			modal.find('#phone').val(data['data']['phone']);
	// 			modal.find('#license_type').val(data['data']['license_type']);
	// 			modal.find('#id').val(data['data']['disp_id']);
	// 			//modal.find('#name').val(data['data']['name']);
	// 			modal.find('.modal-title').text('Edit your store "'+data['data']['name']+'"');
	// 			jQuery('#add_edit_store').modal('show');
	// 		}, (err) => {
	// 			console.log(err.message);
	// 		});
	// 	}else{
	// 		modal.find('.modal-title').text('Add new store');
	// 		jQuery('#add_edit_store').modal('show');	
	// 	}
	// }
	// changeStatus(id,slug){
	// 	var modal = jQuery('#store_status_change');
	// 	if(slug){
	// 		this.getStoreDetails(slug).subscribe(data => {
	// 			modal.find('#id').val(data['data']['disp_id']);
	// 			modal.find('#status_'+data['data']['status']).attr('checked','checked');
	// 			modal.modal('show');
	// 		}, (err) => {
	// 			console.log(err.message);
	// 		});
	// 	}
	// }
	suspendStore(storeset,status){
		Swal({
			title: 'Suspend your store profile?',
			html: 'Please confirm you wish to suspend your retail store profile. The store profile will become inactive and not be accessible to any customers searching for your store, or allow to follow, browse products, leave a review and more. Please confirm below. Should you wish to delete the store listing altogether, please <a href="https://www.pow21.com/blog/contact-us">send us an email.</a>',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, suspend!',
			cancelButtonText: 'No, keep it'
		}).then((result) => {
			if (result.value) {
				var postdata = storeset;
				postdata.status = status;
				delete postdata["contributors"];
				delete postdata["follow_count"];
				postdata.id = postdata.dispansary_id;
				
				delete postdata.user_id;
				delete postdata.dispansary_id;
				//console.log(postdata);
				this.updateStoreDetails(postdata).subscribe(
					data =>{
						if(data["api_message"] == "success" && data["id"] > 0){
							toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, Your store '"+name+"' deleted successfully", "", {
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
					},
					(err) => {console.log(err.message);}
				);
			}
		});
	}
	onFilechange(event: any) {
		this.file = event.target.files[0]
	}
	onSubmitStore(data){
		// var postdata = {
		// 	'name': jQuery('#name').val(),
		// 	'address': jQuery('#address').val(),
		// 	'address2': jQuery('#address2').val(),
		// 	'city': jQuery('#city').val(),
		// 	'state': jQuery('#state').val(),
		// 	'zip_code': jQuery('#zip_code').val(),
		// 	'country': jQuery('#country').val(),
		// 	'website': jQuery('#website').val(),
		// 	'email': jQuery('#email').val(),
		// 	'email2': jQuery('#email2').val(),
		// 	'phone': jQuery('#phone').val(),
		// 	'license_type': jQuery('#license_type').val(),
		// 	'id': jQuery('#id').val(),
		// 	'file': this.file
		// }
		const formData = new FormData();
		formData.append('file', this.file);
		formData.append('name',jQuery('#name').val());
    	formData.append('address', jQuery('#address').val());
		formData.append('address2', jQuery('#address2').val());
		formData.append('city', jQuery('#city').val());
		formData.append('state', jQuery('#state').val());
		formData.append('zip_code', jQuery('#zip_code').val());
		formData.append('country', jQuery('#country').val());
		formData.append('website', jQuery('#website').val());
		formData.append('email', jQuery('#email').val());
		formData.append('email2', jQuery('#email2').val());
		formData.append('phone', jQuery('#phone').val());
		formData.append('license_type', jQuery('#license_type').val());
		formData.append('id', jQuery('#id').val());
    	//console.log(formData);
		this.updateStoreDetails(formData).subscribe(
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
					//jQuery('#add_edit_store').modal('hide');
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
					//jQuery('#add_edit_store').modal('hide');
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
	userlist(){
		this.getAllUsers().subscribe(data => {
			this.userList = data['data'];
		},(err) => {
			console.log(err.message);
		});
	}
}
