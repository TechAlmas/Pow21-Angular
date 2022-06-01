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
import { DispDetail } from '../../models/disp-detail';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { $ } from 'protractor';





declare var toastr: any;
declare var jQuery: any;
declare var Swal: any;

@Component({
	selector: 'mio-business-edit',
	templateUrl: './business-edit.component.html',
	styleUrls: ['./business-edit.component.css']
})
export class BusinessEditComponent implements OnInit {
	dispDetails = new DispDetail();
	store_meta : any;
	assign_user : any;
	user_data: any;
	name : string;
	email: string;
	phone :string;
	referral_url :string;
	referral_id :string;
	dispData:any;
	file:any;
	userList: any;
	slug: any;
	storeImages: any;
	removedImages : any;
	store_images : any;


	constructor(private title: Title, private meta: Meta, private platformLocation: PlatformLocation, private _http: HttpClient,private router: Router, private globals: Globals,private cookieService: CookieService) {
		this.user_data = JSON.parse(localStorage.getItem('userData'));
		//console.log(this.router.url);
		if(this.user_data == null){
			this.router.navigate(['/']);
		}
		if(this.user_data['id_cms_privileges'] != 7 && this.user_data['id_cms_privileges'] != 6){
			this.router.navigate(['/members/profile']);
		}
		this.getuserdata();
		this.getDispensaryDetail();
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
		jQuery(".js-select2").select2({
			closeOnSelect : false,
			placeholder : "Placeholder",
			allowHtml: true,
			allowClear: true,
			tags: true // создает новые опции на лету
		});

		jQuery(document).on('change','.isThumbnail',function(){
			jQuery('.fileInput').parent().next('.customError').remove();
			if(jQuery('.isThumbnail:checked').length > 1){
				
				var element = '<p class="customError" style="color:red">Only one image can be selected as thumbnail image.</p>';
				jQuery(element).insertAfter(jQuery('.fileInput').parent());
				jQuery(this).prop('checked',false);
				return false;
			}
		});
		const component = this;
		jQuery(document).on('click','.remove-image',function(){
			
			jQuery(this).parents('.image-area').remove();
			component.addRemovedImagesToArray(jQuery(this).attr('name'));

		});
		

		
	}
	addRemovedImagesToArray($name){
		if(this.removedImages == undefined){
			this.removedImages = [] ;
		}
		this.removedImages.push($name);
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
	getDispensaryDetail(){
		this.slug = this.router.url.split('/').pop();
		this.getStoreDetails(this.slug).subscribe(

	      ((data:any) => {
	      	this.dispDetails = data['data'];
			this.store_meta = data['data'].store_meta; 			
			this.assign_user = data['data'].assign_user; 
			  this.dispDetails.schedule =  JSON.parse(this.dispDetails.schedule)
			  this.store_images  = Object.values(data['data'].store_images);
			console.log(this.store_images)
	        //this.dispens_id = this.dispDetails.disp_id;
	        //this.dispState = data['data'].state.replace(/\s/g, "-");
	        //this.dispCity = data['data'].city.replace(/\s/g, "-");
	        //this.image_disp = "https://www.pow21.com/admin/storage/app/"+this.dispDetails.logoUrl;
	        //this.schedule = JSON.parse(this.dispDetails.schedule);
	       //console.log(this.dispDetails.state.replace(/\s/g, "-"));

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
		this.file = event.target.files;
	}
	// onStoreMetaChange(event: any) {
	// 	this.storeMeta = event.target.value;
	// 	con
	// }
	onStoreImagesUpload(event:any){
		let dispId =  this.dispDetails.id;
		jQuery('.fileInput').parent().next('.customError').remove();
		var validations = ['image/jpeg', 'image/png', 'image/jpg'];

		for(let i=0;i<event.target.files.length;i++){
            var file = event.target.files[i];
            var fileType = file.type;
			const fsize = event.target.files[i].size;
			const fileSize = Math.round((fsize / 1024));
            if(!((fileType == validations[0]) || (fileType == validations[1]) || (fileType == validations[2]))){
				
				var element = '<p class="customError" style="color:red">only JPG, JPEG, & PNG files are allowed to upload.</p>';
				jQuery(element).insertAfter(jQuery('.fileInput').parent());
                jQuery(".fileInput").val('');
                return false;
            }
			if (fileSize >= 1024) {
				
				var element = '<p class="customError" style="color:red">The image size should not be greater than 1MB.</p>';
				jQuery(element).insertAfter(jQuery('.fileInput').parent());
                jQuery(".fileInput").val('');
                return false;
			}else{
				
				var reader:any,
				target:EventTarget;
				reader= new FileReader();

				reader.onload = function (imgsrc) {
					let url = imgsrc.target.result;
					
					let fileName =dispId+"-"+file.name;
					let html = 		'<div class="image-area mr-3" ><img src="'+url+'" width="100" height="100" alt="" ><a class="remove-image" href="javascript:void(0)" style="display: inline;" name="'+fileName+'"></a><label class="toggle"><div class="togglebox"><input type="radio" name="is_thumbnail" value="'+fileName+'" class="form-control isThumbnail" ><div class="slide-toggle"></div><div class="slide-toggle-content text-white">Thumbnail</div></div></label></div>';

					jQuery('.image-container').append(html); 
				}
				reader.readAsDataURL(file); 
				 
			}
        }
		this.storeImages = event.target.files;
		

	}
	
	
	checkStoreMetaSelectStatus(value){
		if(Array.isArray(this.store_meta) && this.store_meta !=undefined ){

			if(this.store_meta.includes(value.toString())){
				return 'yes';
			}else{
				return 'no';
			}
		}else{
			return 'no';
		}
	}
	checkAssignUserSelectStatus(value){
		if(Array.isArray(this.assign_user) && this.assign_user !=undefined ){

			if(this.assign_user.includes(value.toString())){
				return 'yes';
			}else{
				return 'no';
			}
		}else{
			return 'no';
		}
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
		// console.log(this.file);
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
		const formData = new FormData();
		jQuery.each(this.file, function(index,value){
			formData.append('file[]', value);
		});
		
		jQuery.each(this.storeImages, function(index,value){
			formData.append('store_images[]', value);
		});
	
		
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
		console.log(this.removedImages)
		if(this.removedImages != undefined){
			jQuery.each(this.removedImages, function(index,value){
				formData.append('removed_images[]', value);
			});
		}
		if(jQuery('.isThumbnail:checked').val() != undefined){

			formData.append('store_thumbnail_image', jQuery('.isThumbnail:checked').val());
		}else{
			formData.append('store_thumbnail_image', '');
		}

		let storeMetaValues = jQuery('select[name=store_meta]').val();
		if(storeMetaValues != undefined && storeMetaValues != null){
			jQuery.each(storeMetaValues, function(index,value){
				formData.append('store_meta[]', value);
			});
		}else{
			formData.append('store_meta[]', storeMetaValues);
		}
		let assignUserValues = jQuery('select[name=assign_user]').val();
		console.log(assignUserValues)
		if(assignUserValues != undefined && assignUserValues != null){
			jQuery.each(assignUserValues, function(index,value){
				formData.append('assign_user[]', value);
			});
		}else{
			formData.append('assign_user[]', assignUserValues);
		}
		

		//Schedule Timings Data 
		let scheduleObj = {
			monday : this.getTimeValue('monday'),
			tuesday : this.getTimeValue('tuesday'),
			wednesday : this.getTimeValue('wednesday'),
			thursday : this.getTimeValue('thursday'),
			friday : this.getTimeValue('friday'),
			saturday : this.getTimeValue('saturday'),
			sunday : this.getTimeValue('sunday'),
		} ;

		formData.append('schedule',JSON.stringify(scheduleObj));

    	//console.log(formData);
		if(error == 0){
			
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
	getTimeValue(day){
		if(jQuery('#'+day+"_start").val() != undefined && jQuery('#'+day+"_end").val() != undefined && jQuery('#'+day+"_start").val() && jQuery('#'+day+"_end").val() && jQuery('#'+day+"_close").prop('checked') == false){

			let datePipe = new DatePipe('en-US');
			let startTimeObj = datePipe.transform(new Date("2021-05-23"+" "+ jQuery('#'+day+"_start").val()), 'shortTime');
			let endTimeObj = datePipe.transform(new Date("2021-05-23"+" "+ jQuery('#'+day+"_end").val()), 'shortTime');
			
			let timeString = startTimeObj + " - " + endTimeObj;
			return timeString;
		}else if(jQuery('#'+day+"_close").prop('checked') == true){
			let timeString = "Closed";
			return timeString;
		}


	}

	userlist(){
		this.getAllUsers().subscribe(data => {
			this.userList = data['data'];
		},(err) => {
			console.log(err.message);
		});
	}

	getTimeStringValue(day,type,checkClosed = 0){
		let timeString = '';
	
		if(this.dispDetails.schedule){
	
			let scheduleData = this.dispDetails.schedule;
			if(typeof scheduleData[day] != undefined && scheduleData[day] ){
				if(checkClosed == 1){
					if(scheduleData[day] == 'Closed' || scheduleData[day] == 'closed' ){
						return 'yes';
					}else{
						return 'no';
					}
				}else{
					if(scheduleData[day] != 'Closed' && scheduleData[day] != 'closed' ){
						timeString = scheduleData[day].split(" - ");
						if(type == 'start'){
							if(Array.isArray(timeString)){
								let newTimeString = new Date("2021-05-23"+" "+timeString[0]);
								return newTimeString;
							}
						}else if(type == 'end'){
							if(Array.isArray(timeString)){
								let newTimeString = new Date("2021-05-23"+" "+timeString[1]);
								return newTimeString;
							}
						}
					}
					
				}
				
			}
		}
			
		
	
	}

	onClickClose(e,day){
		
		if(e.currentTarget.checked){    
			jQuery('#'+day+"_start").prop('disabled',true);
			jQuery('#'+day+"_end").prop('disabled',true);
			  
		}else{
			jQuery('#'+day+"_start").prop('disabled',false);
			jQuery('#'+day+"_end").prop('disabled',false);
		}
	}

	
}
