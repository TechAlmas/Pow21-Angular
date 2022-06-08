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
import { ContDetail } from '../../models/contributer-detail';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { $ } from 'protractor';





declare var toastr: any;
declare var jQuery: any;
declare var Swal: any;

@Component({
	selector: 'mio-business-contributers-edit',
	templateUrl: './business-contributers-edit.component.html',
	styleUrls: ['./business-contributers-edit.component.css']
})
export class BusinessContributersEditComponent implements OnInit {
	contDetails = new ContDetail();
	user_data: any;
	first_name : string;
    last_name : string;
    name : string;
	email: string;
	referral_url :string;
	referral_id :string;
	contData:any;
	userList: any;
    retail_store :any;
    cont_id :any;
    retail_store_dropdown : any;

	constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation, private _http: HttpClient,private router: Router, private globals: Globals,private cookieService: CookieService) {
        this.cont_id = this.router.url.split('/').pop();
		this.user_data = JSON.parse(localStorage.getItem('userData'));
		//console.log(this.router.url);
		if(this.user_data == null){
			this.router.navigate(['/']);
		}
		if(this.user_data['id_cms_privileges'] != 7 && this.user_data['id_cms_privileges'] != 6){
			this.router.navigate(['/members/profile']);
		}
		this.getuserdata();
		this.getContributersDetail();
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
	updateContDetails(postdata){
		//const headers = new Headers();
		//return this._http.get<Ret[]>('dispensary_update?slug='+slug);
		return this._http.post<any[]>('business_contributers_update',postdata);
	}
	getUser(){
		//console.log(this.user_data['remember_token']);
		return this._http.get<Ret[]>('users?id='+this.user_data['id']+'&remember_token='+this.user_data['remember_token']);
	}
	ngOnInit() {
		window.scrollTo(0, 0);
		jQuery(".js-select2").select2({
			closeOnSelect : false,
			placeholder : "Select Retail Store",
			allowHtml: true,
			allowClear: true,
			tags: true // создает новые опции на лету
		});

	
		
	}
	
	// removeStoreImage($name){

	// 		if(this.removedImages == undefined){
	// 			this.removedImages = [] ;
	// 		}
	// 		console.log(jQuery('.remove-image[name="'+$name+'"]'))
	// 		jQuery('.remove-image[name="'+$name+'"]').parents('.image-area').remove();
	// 		this.removedImages.push($name);


	// }
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
    getContList(){
		return this._http.get<Ret[]>('businesscontributerslist?id='+this.cont_id+'&user_id='+this.user_data['id']+'&type=add_edit');
	}
	getContributersDetail(){
		this.getContList().subscribe(

	      ((data:any) => {
	      	this.contDetails = data['data'];
              if(data['retail_store_dropdown']){
                const resultArray = Object.keys(data['retail_store_dropdown']).map(index => {
                    let newData = data['retail_store_dropdown'][index];
                    return newData;
                });
                this.retail_store_dropdown = resultArray;
              }
            
              if(data['data'].retail_store){
                const retailStoreArray = Object.keys(data['data'].retail_store).map(index => {
                    let newVal = data['data'].retail_store[index];
                    return newVal;
                });
                this.retail_store = retailStoreArray; 			
              }
			
	      }),
	      (err: any) => console.log(err),
	      () => {
			
		}

	)

	}
	// dispDetails(){
	// 	//console.log(this.router.url.split('/').pop());
	// 	var form = jQuery('#submitStore');
	// 	this.slug = this.router.url.split('/').pop();
	// 	if(this.slug != 'add'){
	// 		this.getStoreDetails(this.slug).subscribe(data => {
	// 			//console.log(data['data']);
	// 			//if(data['data'])
	// 			this.dispData = data['data'];
	// 		}, (err) => {
	// 			console.log(err.message);
	// 		});
	// 	}else{
	// 		jQuery('#add_edit_store').modal('show');	
	// 	}
	// }
	changeStatus(id,slug){
		var modal = jQuery('#store_status_change');
		if(slug){
			this.getStoreDetails(slug).subscribe(data => {
				if(data['data']){
					console.log(data['data']);
					//modal.find('#id').val(data['data']['disp_id']);
					modal.find('#status_'+data['data']['status']).attr('checked','checked');
					modal.modal('show');
				}
			}, (err) => {
				console.log(err.message);
			});
		}
	}



	
	
	checkRetailStoreSelectStatus(value){
		if(Array.isArray(this.retail_store) && this.retail_store !=undefined ){
     
			if(this.retail_store.includes(value)){
				return 'yes';
			}else{
				return 'no';
			}
		}else{

			return 'no';
		}
	}

	onSubmitCont(data){
	
		let error = 0;
		jQuery('.image-container').parent('.whitebgs').find('.customError').remove();
		jQuery('.honeyInput').each(function(){
			if(jQuery(this).val() != '' ){
				var element = '<p class="customError" style="color:red">Something Went Wrong.</p>';
				jQuery(element).insertAfter(jQuery('.image-container'));
				error++;
				return false;
			}
		});
        jQuery('.customInput').each(function(){
            jQuery(this).next('.customError').remove();
			if(jQuery(this).val() == '' ){
				var element = '<p class="customError" style="color:red">The '+jQuery(this).attr('name')+' field is required</p>';
				jQuery(element).insertAfter(jQuery(this));
				error++;
				
			}
		});

        
		const formData = new FormData();
		
		
		formData.append('first_name',jQuery('#first_name').val());
    	formData.append('last_name', jQuery('#last_name').val());
        formData.append('name',jQuery('#first_name').val()+" "+jQuery('#last_name').val())
		formData.append('email', jQuery('#email').val());
		formData.append('id', jQuery('#id').val());
        formData.append('id_cms_privileges','7');
        formData.append('parent_id',this.user_data['id']);

		let retailStoreValues = jQuery('select[name=retail_store]').val();
		if(retailStoreValues != undefined && retailStoreValues != null){
			jQuery.each(retailStoreValues, function(index,value){
				formData.append('retail_store[]', value);
			});
		}else{
			formData.append('retail_store[]', retailStoreValues);
		}


    	//console.log(formData);
		if(error == 0){
			
			this.updateContDetails(formData).subscribe(
				data =>{
					if(data["api_message"] == "success"){
                        let message = "";
                        if(this.cont_id == 'add'){
                            message = 'Business contributer added successfully';
                        }else{
                            message = 'Business contributer updated successfully';
                        }
						toastr.success("<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, "+message+"", "", {
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
						jQuery('#add_edit_store').modal('hide');
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
	}


	userlist(){
		this.getAllUsers().subscribe(data => {
			this.userList = data['data'];
		},(err) => {
			console.log(err.message);
		});
	}



}
