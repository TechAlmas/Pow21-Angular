import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { empty, Observable } from 'rxjs';
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
	cont_email : string;

	constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation, private _http: HttpClient,private router: Router, private globals: Globals,private cookieService: CookieService) {
        this.cont_id = this.router.url.split('/').pop();
		this.user_data = JSON.parse(localStorage.getItem('userData'));
		// console.log(this.cont_id);
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

		

		//Get States by Selecting Country
		jQuery(document).on('change','#country',function(){
			let countryVal = jQuery(this).val();
			if( countryVal != ''){
				jQuery.getJSON( "assets/json/states.json", function( data ) {

					if(data && Array.isArray(data)){
						
						let html  = "<option value=''>Select State</option>";
						jQuery.each( data, function( key, val ) {
							if(data[key].country_name == countryVal){

								html+= '<option value="'+data[key].name+'">'+data[key].name+'</option>';
							}

						});
						jQuery('#state').html(html);
					}
				   
				  });

			}
			
		})

		//Get Cities by Selecting Country and State
		jQuery(document).on('change','#state',function(){
			let stateVal = jQuery(this).val(); 
			console.log(stateVal)
			if(stateVal != '' && jQuery('#country').val() !=''){
				jQuery.getJSON( "assets/json/cities.json", function( data ) {

					if(data && Array.isArray(data)){
						
						let html  = "<option value=''>Select City</option>";
						jQuery.each( data, function( key, val ) {
							if(data[key].country_name == jQuery('#country').val() && data[key].state_name == stateVal){

								html+= '<option value="'+data[key].name+'">'+data[key].name+'</option>';
							}

						});
						jQuery('#city').html(html);
					}
				   
				  });

			
			}
			
		})
		let component = this;
		//Check if email already exists or not
		if(this.cont_id != undefined && this.cont_id == 'add'){

			jQuery(document).on('blur','#email',function(){ 
				if(jQuery(this).val() != ''){
	
					let formData = new FormData();
					let elem   = jQuery(this);
					formData.append('email',jQuery(this).val());
					formData.append('type','check_email');
					component.updateContDetails(formData).subscribe(
						data =>{
							if(data["data"] == 1){
								var element = '<p class="customError" style="color:red">'+data['api_message']+'</p>';
								jQuery(element).insertAfter(elem);
								
							}else{
								elem.next('.customError').remove();
							}
						},
						(err) => {
						
						}
					);
				}
			});
		}


			
		   
		   
	
		
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
			  if(data['data'].email){
              	this.cont_email = data['data'].email;
              }
			  if(data['data'].country){
				jQuery('#country').val(data['data'].country);
				jQuery.getJSON( "assets/json/states.json", function( value ) {

					if(value && Array.isArray(value)){
						
						let html  = "<option value=''>Select State</option>";
						jQuery.each( value, function( key, val ) {
							if(value[key].country_name == data['data'].country){
								let selected = '';
								if(value[key].name == data['data'].state){
									selected= 'selected';
								}
								html+= '<option value="'+value[key].name+'" '+selected+'>'+value[key].name+'</option>';
							}

						});
						jQuery('#state').html(html);
					}
				   
				  });

				
			  }

			  

			  if(data['data'].state && data['data'].country){
				jQuery.getJSON( "assets/json/cities.json", function( value ) {

					if(value && Array.isArray(value)){
						
						let html  = "<option value=''>Select City</option>";
						jQuery.each( value, function( key, val ) {
							if(value[key].country_name == data['data'].country && value[key].state_name == data['data'].state){
								let selected = '';
								if(value[key].name == data['data'].city){
									selected= 'selected';
								}
								html+= '<option value="'+value[key].name+'" '+selected+'>'+value[key].name+'</option>';
							}

						});
						jQuery('#city').html(html);
					}
				   
				  });
				
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
        let component = this;
        jQuery('.customInput').each(function(){
            jQuery(this).next('.customError').remove();
            if(jQuery(this).attr('name') == 'cpassword' && jQuery(this).val() != ''){
                if(jQuery(this).val() != jQuery('#contributor_password').val()){
                    var element = '<p class="customError" style="color:red">Password & Confirm password do not match</p>';
                    jQuery(element).insertAfter(jQuery(this));
				    error++;
                }
            }
			else if(jQuery(this).val() == ''){
                if(jQuery(this).attr('name') == 'password' || jQuery(this).attr('name') == 'cpassword'){
                 
                    if(component.cont_id == 'add'){
                        var element = '<p class="customError" style="color:red">The '+jQuery(this).attr('name')+' field is required</p>';
                        jQuery(element).insertAfter(jQuery(this));
                        error++;
                    }
                }else{
                    var element = '<p class="customError" style="color:red">The '+jQuery(this).attr('name')+' field is required</p>';
                    jQuery(element).insertAfter(jQuery(this));
                    error++;
                }
				
				
			}
		});

        
		const formData = new FormData();
		
		
		formData.append('first_name',jQuery('#first_name').val());
    	formData.append('last_name', jQuery('#last_name').val());
        formData.append('name',jQuery('#first_name').val()+" "+jQuery('#last_name').val())
		if(this.cont_id != undefined && this.cont_id == 'add'){

			formData.append('email', jQuery('#email').val());
		}else{
			formData.append('email',this.cont_email);
		}
		formData.append('id', jQuery('#id').val());
        formData.append('id_cms_privileges','7');
        formData.append('parent_id',this.user_data['id']);
		formData.append('password', jQuery('#contributor_password').val());
		formData.append('phone', jQuery('#phone').val());
		formData.append('position', jQuery('#position').val());
		formData.append('country', jQuery('#country').val());
		formData.append('state', jQuery('#state').val());
		formData.append('city', jQuery('#city').val());

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
