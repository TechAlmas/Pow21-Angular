import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ret } from "../../models/ret";
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { Globals } from "../../models/globals";
import { CookieService } from "ngx-cookie-service";
import { Meta, Title } from "@angular/platform-browser";
import { DispDetail } from "../../models/disp-detail";
import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";


declare var $: any;
declare var toastr: any;
declare var jQuery: any;
declare var Swal: any;

@Component({
  selector: "mio-business-edit",
  templateUrl: "./business-edit.component.html",
  styleUrls: ["./business-edit.component.css"],
})
export class BusinessEditComponent implements OnInit {

  dispDetails = new DispDetail();
  store_meta: any;
  assign_user: any;
  user_data: any;
  name: string;
  email: string;
  phone: string;
  referral_url: string;
  referral_id: string;
  dispData: any;
  file: any;
  userList: any;
  slug: any;
  storeImages: any;
  removedImages: any;
  store_images: any;
  isValidFormSubmitted = false;
  claimListingWithSignup = false;
  expiredDate: any;
  claim_file: any;

  constructor(
    private title: Title,
    private meta: Meta,
    private platformLocation: PlatformLocation,
    private _http: HttpClient,
    private router: Router,
    private globals: Globals,
    private cookieService: CookieService
  ) {
    this.user_data = JSON.parse(localStorage.getItem("userData"));
    //console.log(this.router.url);
    if (this.user_data == null) {
      this.router.navigate(["/"]);
    }
    if (
      this.user_data["id_cms_privileges"] != 7 &&
      this.user_data["id_cms_privileges"] != 6
    ) {
      this.router.navigate(["/members/profile"]);
    }
    this.getuserdata();
    this.getDispensaryDetail();
    this.userlist();
  }

  getdispList() {
    return this._http.get<Ret[]>(
      "businesslist?user_id=" + this.user_data["id"]
    );
  }
  getStoreDetails(slug) {
    return this._http.get<Ret[]>("dispensary_detail?slug=" + slug+"&user_id="+this.user_data['id']);
  }
  getAllUsers() {
    return this._http.get<Ret[]>("list_users");
  }
  updateStoreDetails(postdata) {
    //const headers = new Headers();
    //return this._http.get<Ret[]>('dispensary_update?slug='+slug);
    return this._http.post<any[]>("dispensary_update", postdata);
  }
  getUser() {
    //console.log(this.user_data['remember_token']);
    return this._http.get<Ret[]>(
      "users?id=" +
        this.user_data["id"] +
        "&remember_token=" +
        this.user_data["remember_token"]
    );
  }
  ngOnInit() {
    window.scrollTo(0, 0);
    jQuery(".js-select2").select2({
      closeOnSelect: false,
      placeholder: "Placeholder",
      allowHtml: true,
      allowClear: true,
      tags: true, // создает новые опции на лету
    });

    //Show First checkbox always checked
    setTimeout(function () {
      if (jQuery(".isThumbnail:checked").length == 0) {
        jQuery(".isThumbnail").first().prop("checked", true);
      }
    }, 4000);

    //Functionality on thumbnail radio change
    jQuery(document).on("change", ".isThumbnail", function () {
      jQuery(".fileInput").parent().next(".customError").remove();
      if (jQuery(".isThumbnail:checked").length > 1) {
        var element =
          '<p class="customError" style="color:red">Only one image can be selected as thumbnail image.</p>';
        jQuery(element).insertAfter(jQuery(".fileInput").parent());
        jQuery(this).prop("checked", false);
        return false;
      }
    });
    const component = this;
    jQuery(document).on("click", ".remove-image", function () {
      if (jQuery(this).parents(".image-container").length > 0) {
        console.log("store image remove");
        component.addRemovedImagesToArray(jQuery(this).attr("name"));
      }
      if (jQuery(this).parents(".logo-container").length > 0) {
        component.file = "";
        console.log("logo image remove");
        jQuery("#file-upload").val("");
      }
      jQuery(this).parents(".image-area").remove();
    });


    	

		//Get States by Selecting Country
		jQuery(document).on('change','#country',function(){
			let countryVal = jQuery(this).val();
			if( countryVal != ''){
        let fieldText = 'State';
        let ZipCodeText = 'Zip Code';
        if(countryVal == 'Canada'){
          fieldText = 'Province';
          ZipCodeText = 'Postal Code';
        }
        jQuery('#state').parent().prev('.col-md-2').find('label').text(fieldText);
        jQuery('#zip_code').parent().prev('.col-md-2').find('label').text(ZipCodeText);
				jQuery.getJSON( "assets/json/states.json", function( data ) {

					if(data && Array.isArray(data)){
						
						let html  = "<option value=''>Select "+fieldText+"</option>";
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
            let cityDataCount = 0;
						jQuery.each( data, function( key, val ) {
							if(data[key].country_name == jQuery('#country').val() && data[key].state_name == stateVal){

								html+= '<option value="'+data[key].name+'">'+data[key].name+'</option>';
                cityDataCount++;
							}

						});
            if(cityDataCount == 0){
              let element = '<input type="text" id="city" name="city" class="sm-form-control inputCity required" value="" placeholder="" ngModel />';
              $(element).insertAfter($('.selectCity'));
              $('.selectCity').prop('disabled',true);
              $('.selectCity').hide();
            }else{
              $('.selectCity').prop('disabled',false);
              $('.selectCity').show();
              $('.inputCity').remove();
              jQuery('#city').html(html);
            }
					}
				   
				  });

			
			}
			
		})

    $(".customValidate").on("keyup", function () {
      component.customValidateFields($(this));
    });
  }
  addRemovedImagesToArray($name) {
    if (this.removedImages == undefined) {
      this.removedImages = [];
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
  loadMetaData() {
    //console.log((this.platformLocation as any).location.pathname);
    //console.log(this.globals.location_global_url);
    //this.finalUrl.replace("/", "&");
    var replaceString = (this.platformLocation as any).location.pathname;
    var replaceWord = "/" + this.globals.location_global_url + "/";
    var currentUrl = replaceString.replace(replaceWord, "/");
    //console.log(replaceString); console.log(replaceWord);console.log(currentUrl);
    this.getMetaData(currentUrl).subscribe(
      (data) => {
        this.title.setTitle(data["title"]);
        this.meta.updateTag({ name: "keywords", content: data["keywords"] });
        this.meta.updateTag({
          name: "description",
          content: data["description"],
        });
      },
      (err: any) => console.log(err),
      () => {}
    );
  }
  getMetaData(currentUrl): Observable<any[]> {
    var postData = { url: currentUrl };
    return this._http.post<any[]>("getmetadata", postData);
  }
  Logout() {
    // alert('hello');
    toastr.success(
      "<i class='icon-ok-sign'></i>&nbsp;&nbsp;Logout sucess fully !",
      "",
      {
        closeButton: true,
        timeOut: "1000",
        extendedTImeout: "0",
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "0",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        positionClass: "toast-top-full-width",
      }
    );
    localStorage.removeItem("userData");
    this.globals.user_data = false;
    this.globals.user_name = this.cookieService.get("_mio_user_name");
    this.globals.user_email = this.cookieService.get("_mio_user_email");
    this.getpricealertCount();
    //window.location.href = '/';
    //this.router.navigate(['/user-login']);
  }
  getuserdata() {
    this.getUser().subscribe(
      (data) => {
        // console.log(data);
        this.name = data["name"];
        this.email = data["email"];
        this.phone = data["phone"];
        this.referral_id = data["referral_id"];
        this.referral_url =
          (this.platformLocation as any).location.origin +
          "/referral/" +
          data["referral_id"];
      },
      (err) => {
        console.log(err.message);
      }
    );
  }
  onManageContributers(){
    toastr.error('error', "Sorry, only Business Owner accounts are authorized to access this content. If you need access, please contact your Business account owner/admin or POW Team directly.", {
      closeButton: true,
      timeOut: "7000",
      extendedTImeout: "0",
      showDuration: "300",
      hideDuration: "1000",
      extendedTimeOut: "0",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      positionClass: "toast-top-full-width",
    });
  }
  getcount() {
    return this._http.get<Ret[]>(
      "pricealertcount?email=" + this.globals.user_email
    );
  }
  getpricealertCount() {
    this.getcount().subscribe(
      (count_data) => {
        this.globals.price_alert_count = count_data["price_alert_count"];
        //console.log(this.globals.price_alert_count);
        if (this.globals.price_alert_count == null) {
          //console.log(this.user_data_email);
          this.globals.price_alert_count = 0;
        }
        //this.mio_session_count = localStorage.getItem('_mio_count');
      },
      (err) => {
        console.log(err.message);
      }
    );
  }
  getDispensaryDetail() {
    this.slug = this.router.url.split("/").pop();
    this.getStoreDetails(this.slug).subscribe(
      (data: any) => {
        this.dispDetails = data["data"];
        this.store_meta = data["data"].store_meta;
        this.assign_user = data["data"].assign_user;
        this.dispDetails.schedule = JSON.parse(this.dispDetails.schedule);
        this.store_images = Object.values(data["data"].store_images);
      
          if(data['data'].country){
            jQuery('#country').val(data['data'].country);
            let fieldText = 'State';
            let ZipCodeText = 'Zip Code';
            if(data['data'].country == 'Canada'){
              fieldText = 'Province';
              ZipCodeText = 'Postal Code';
            }
            jQuery('#state').parent().prev('.col-md-2').find('label').text(fieldText);
            jQuery('#zip_code').parent().prev('.col-md-2').find('label').text(ZipCodeText);
            jQuery.getJSON( "assets/json/states.json", function( value ) {
    
              if(value && Array.isArray(value)){
                
                let html  = "<option value=''>Select "+fieldText+"</option>";
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
              let cityDataCount = 0;
              jQuery.each( value, function( key, val ) {
                if(value[key].country_name == data['data'].country && value[key].state_name == data['data'].state){
                  let selected = '';
                  if(value[key].name == data['data'].city){
                    selected= 'selected';
                  }
                  html+= '<option value="'+value[key].name+'" '+selected+'>'+value[key].name+'</option>';
                  cityDataCount++;
                }
  
              });
              if(cityDataCount == 0 && data['data'].city != null){
                let element = '<input type="text" id="city" name="city" class="sm-form-control inputCity required" value="'+data['data'].city+'" placeholder="" ngModel />';
                $(element).insertAfter($('.selectCity'));
                $('.selectCity').prop('disabled',true);
                $('.selectCity').hide();
              }else{
                $('.selectCity').prop('disabled',false);
                $('.selectCity').show();
                $('.inputCity').remove();
                jQuery('#city').html(html);
              }
             
            }
             
            });
          
          }
        //this.dispens_id = this.dispDetails.disp_id;
        //this.dispState = data['data'].state.replace(/\s/g, "-");
        //this.dispCity = data['data'].city.replace(/\s/g, "-");
        //this.image_disp = "https://www.pow21.com/admin/storage/app/"+this.dispDetails.logoUrl;
        //this.schedule = JSON.parse(this.dispDetails.schedule);
        //console.log(this.dispDetails.state.replace(/\s/g, "-"));
      },
      (err: any) => console.log(err),
      () => {}
    );
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
  changeStatus(id, slug) {
    var modal = jQuery("#store_status_change");
    if (slug) {
      this.getStoreDetails(slug).subscribe(
        (data) => {
          if (data["data"]) {
            console.log(data["data"]);
            //modal.find('#id').val(data['data']['disp_id']);
            modal
              .find("#status_" + data["data"]["status"])
              .attr("checked", "checked");
            modal.modal("show");
          }
        },
        (err) => {
          console.log(err.message);
        }
      );
    }
  }
  suspendStore(storeset) {
    Swal({
      title: "Suspend your store profile?",
      text: "Suspending your store listing will make it inactive from the public. Thus visitors, customers and future customers will not find your store listing or profile anywhere on POW. You can undo this action anytime.",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, suspend!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        var postdata = storeset;
        postdata.status = 0;
        postdata.id = postdata.dispansary_id;

        delete postdata.user_id;
        delete postdata.dispansary_id;
        //console.log(postdata);
        this.updateStoreDetails(postdata).subscribe(
          (data) => {
            if (data["api_message"] == "success" && data["id"] > 0) {
              toastr.success(
                "<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, Your store '" +
                  name +
                  "' deleted successfully",
                "",
                {
                  closeButton: true,
                  timeOut: "7000",
                  extendedTImeout: "0",
                  showDuration: "300",
                  hideDuration: "1000",
                  extendedTimeOut: "0",
                  showEasing: "swing",
                  hideEasing: "linear",
                  showMethod: "fadeIn",
                  hideMethod: "fadeOut",
                  positionClass: "toast-top-full-width",
                }
              );

            }
          },
          (err) => {
            console.log(err.message);
          }
        );
      }
    });
  }
  onFilechange(event: any) {
    let dispId = this.dispDetails.id;
    jQuery("#file-upload").parent().next(".customError").remove();
    var validations = ["image/jpeg", "image/png", "image/jpg"];
    var file = event.target.files[0];
    var fileType = file.type;
    const fsize = event.target.files[0].size;
    const fileSize = Math.round(fsize / 1024);
    if (
      !(
        fileType == validations[0] ||
        fileType == validations[1] ||
        fileType == validations[2]
      )
    ) {
      var element =
        '<p class="customError" style="color:red">only JPG, JPEG, & PNG files are allowed to upload.</p>';
      jQuery(element).insertAfter(jQuery("#file-upload").parent());
      jQuery("#file-upload").val("");
      return false;
    } else {
      var reader: any, target: EventTarget;
      reader = new FileReader();

      reader.onload = function (imgsrc) {
        let url = imgsrc.target.result;

        let fileName = dispId + "-" + file.name;
        let html =
          '<div class="" style=""> <div class="image-area mr-3" ><img src="' +
          url +
          '" width="100" height="100" alt="" ><a class="remove-image" href="javascript:void(0)" style="display: inline;" >x</a></div> </div>';

        jQuery(".logo-container").html(html);
      };
      reader.readAsDataURL(file);
    }
    this.file = event.target.files[0];
  }

  onStoreImagesUpload(event: any) {
    let dispId = this.dispDetails.id;
    jQuery(".fileInput").parent().next(".customError").remove();
    var validations = ["image/jpeg", "image/png", "image/jpg"];

    for (let i = 0; i < event.target.files.length; i++) {
      var file = event.target.files[i];
      var fileType = file.type;
      const fsize = event.target.files[i].size;
      const fileSize = Math.round(fsize / 1024);
      if (
        !(
          fileType == validations[0] ||
          fileType == validations[1] ||
          fileType == validations[2]
        )
      ) {
        var element =
          '<p class="customError" style="color:red">only JPG, JPEG, & PNG files are allowed to upload.</p>';
        jQuery(element).insertAfter(jQuery(".fileInput").parent());
        jQuery(".fileInput").val("");
        return false;
      }
      if (fileSize >= 1024) {
        var element =
          '<p class="customError" style="color:red">The image size should not be greater than 1MB.</p>';
        jQuery(element).insertAfter(jQuery(".fileInput").parent());
        jQuery(".fileInput").val("");
        return false;
      } else {
        var reader: any, target: EventTarget;
        reader = new FileReader();

        reader.onload = function (imgsrc) {
          let url = imgsrc.target.result;

          let fileName = dispId + "-" + file.name;
          let html =
            '<div class="image-area mr-3" ><img src="' +
            url +
            '" width="100" height="100" alt="" ><a class="remove-image" href="javascript:void(0)" style="display: inline;" name="' +
            fileName +
            '">x</a><label class="toggle"><div class="togglebox"><input type="radio" name="is_thumbnail" value="' +
            fileName +
            '" class="form-control isThumbnail" ><div class="slide-toggle"></div><div class="slide-toggle-content">Thumbnail</div></div></label></div>';

          jQuery(".image-container").append(html);
        };
        reader.readAsDataURL(file);
      }
    }
    this.storeImages = event.target.files;
  }

  checkStoreMetaSelectStatus(value) {
    if (Array.isArray(this.store_meta) && this.store_meta != undefined) {
      if (this.store_meta.includes(value.toString())) {
        return "yes";
      } else {
        return "no";
      }
    } else {
      return "no";
    }
  }
  checkAssignUserSelectStatus(value) {
    if (Array.isArray(this.assign_user) && this.assign_user != undefined) {
      if (this.assign_user.includes(value.toString())) {
        return "yes";
      } else {
        return "no";
      }
    } else {
      return "no";
    }
  }
  onSubmitStore(data) {
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
    jQuery(".image-container")
      .parent(".whitebgs")
      .find(".customError")
      .remove();
    jQuery(".honeyInputStore").each(function () {
      if (jQuery(this).val() != "") {
        var element =
          '<p class="customError" style="color:red">Something Went Wrong.</p>';
        jQuery(element).insertAfter(jQuery(".image-container"));
        error++;
        return false;
      }
    });
    const formData = new FormData();
    if (this.file && this.file != undefined) {
      formData.append("file[]", this.file);
    }

    jQuery.each(this.storeImages, function (index, value) {
      formData.append("store_images[]", value);
    });

    formData.append("name", jQuery("#name").val());
    formData.append("address", jQuery("#address").val());
    formData.append("address2", jQuery("#address2").val());
    let cityVal = ';'
    if(jQuery("#city").prop('disabled') == true){
      cityVal = jQuery('.inputCity').val();
    }else{
      cityVal = jQuery('.selectCity').val();
    }
    formData.append("city", cityVal);
    formData.append("state", jQuery("#state").val());
    formData.append("zip_code", jQuery("#zip_code").val());
    formData.append("country", jQuery("#country").val());
    formData.append("website", jQuery("#website").val());
    formData.append("email", jQuery("#email").val());
    formData.append("email2", jQuery("#email2").val());
    formData.append("phone", jQuery("#phone").val());
    formData.append("license_type", jQuery("#license_type").val());
    formData.append("id", jQuery("#id").val());

    if(jQuery('#description').val() != ''){
      formData.append('description', jQuery("<div/>").html(jQuery('#description').val()).text() )
    }

    if (this.removedImages != undefined) {
      jQuery.each(this.removedImages, function (index, value) {
        formData.append("removed_images[]", value);
      });
    }
    if (jQuery(".isThumbnail:checked").val() != undefined) {
      formData.append(
        "store_thumbnail_image",
        jQuery(".isThumbnail:checked").val()
      );
    } else {
      formData.append("store_thumbnail_image", "");
    }

    let storeMetaValues = jQuery("select[name=store_meta]").val();
    if (storeMetaValues != undefined && storeMetaValues != null) {
      jQuery.each(storeMetaValues, function (index, value) {
        formData.append("store_meta[]", value);
      });
    } else {
      formData.append("store_meta[]", storeMetaValues);
    }
    let assignUserValues = jQuery("select[name=assign_user]").val();
    if(this.user_data['id']){
      formData.append("assign_user[]", this.user_data['id']);
    }
    if (assignUserValues != undefined && assignUserValues != null) {
      jQuery.each(assignUserValues, function (index, value) {
        formData.append("assign_user[]", value);
      });
    } else {
      formData.append("assign_user[]", assignUserValues);
    }

    //Schedule Timings Data
    let scheduleObj = {
      monday: this.getTimeValue("monday"),
      tuesday: this.getTimeValue("tuesday"),
      wednesday: this.getTimeValue("wednesday"),
      thursday: this.getTimeValue("thursday"),
      friday: this.getTimeValue("friday"),
      saturday: this.getTimeValue("saturday"),
      sunday: this.getTimeValue("sunday"),
    };

    formData.append("schedule", JSON.stringify(scheduleObj));

    //console.log(formData);
    if (error == 0) {
      this.updateStoreDetails(formData).subscribe(
        (data) => {
          if (data["api_message"] == "success") {
            toastr.success(
              "<i class='icon-ok-sign'></i>&nbsp;&nbsp;Confirm, Your store '" +
                data['data'].name +
                "' updated successfully",
              "",
              {
                closeButton: true,
                timeOut: "7000",
                extendedTImeout: "0",
                showDuration: "300",
                hideDuration: "1000",
                extendedTimeOut: "0",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
                positionClass: "toast-top-full-width",
              }
            );
            jQuery("#add_edit_store").modal("hide");
          } else {
            toastr.error(data["api_message"], "", {
              closeButton: true,
              timeOut: "7000",
              extendedTImeout: "0",
              showDuration: "300",
              hideDuration: "1000",
              extendedTimeOut: "0",
              showEasing: "swing",
              hideEasing: "linear",
              showMethod: "fadeIn",
              hideMethod: "fadeOut",
              positionClass: "toast-top-full-width",
            });
            //jQuery('#add_edit_store').modal('hide');
          }
        },
        (err) => {
          toastr.danger(err.message, "", {
            closeButton: true,
            timeOut: "7000",
            extendedTImeout: "0",
            showDuration: "300",
            hideDuration: "1000",
            extendedTimeOut: "0",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
            positionClass: "toast-top-full-width",
          });
          console.log(err.message);
        }

      );
    }
  }
  getTimeValue(day) {
    if (
      jQuery("#" + day + "_start").val() != undefined &&
      jQuery("#" + day + "_end").val() != undefined &&
      jQuery("#" + day + "_start").val() &&
      jQuery("#" + day + "_end").val() &&
      jQuery("#" + day + "_close").prop("checked") == false
    ) {
      let datePipe = new DatePipe("en-US");
      let startTimeObj = datePipe.transform(
        new Date("2021-05-23" + " " + jQuery("#" + day + "_start").val()),
        "shortTime"
      );
      let endTimeObj = datePipe.transform(
        new Date("2021-05-23" + " " + jQuery("#" + day + "_end").val()),
        "shortTime"
      );

      let timeString = startTimeObj + " - " + endTimeObj;
      return timeString;
    } else if (jQuery("#" + day + "_close").prop("checked") == true) {
      let timeString = "Closed";
      return timeString;
    }
  }

  userlist() {
    this.getAllUsers().subscribe(
      (data) => {
        this.userList = data["data"];
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  getTimeStringValue(day, type, checkClosed = 0) {
    let timeString = "";

    if (this.dispDetails.schedule) {
      let scheduleData = this.dispDetails.schedule;
      if (typeof scheduleData[day] != undefined && scheduleData[day]) {
        if (checkClosed == 1) {
          if (scheduleData[day] == "Closed" || scheduleData[day] == "closed") {
            return "yes";
          } else {
            return "no";
          }
        } else {
          if (scheduleData[day] != "Closed" && scheduleData[day] != "closed") {
            timeString = scheduleData[day].split(" - ");
            if (type == "start") {
              if (Array.isArray(timeString)) {
                let newTimeString = new Date(
                  "2021-05-23" + " " + timeString[0]
                );
                return newTimeString;
              }
            } else if (type == "end") {
              if (Array.isArray(timeString)) {
                let newTimeString = new Date(
                  "2021-05-23" + " " + timeString[1]
                );
                return newTimeString;
              }
            }
          }
        }
      }
    }
  }

  onClickClose(e, day) {
    if (e.currentTarget.checked) {
      jQuery("#" + day + "_start").prop("disabled", true);
      jQuery("#" + day + "_end").prop("disabled", true);
    } else {
      jQuery("#" + day + "_start").prop("disabled", false);
      jQuery("#" + day + "_end").prop("disabled", false);
    }
  }

  review_check_email_claim_listing() {
    return this._http.get<any[]>(
      "review_check_email?email=" + $(document).find(".claimListingEmail").val()
    );
  }

  customValidateFields($elem): any {
    let error = 0;

    $elem.next(".customError").remove();

    if ($elem.attr("name") == "reemail" && $elem.val() != "") {
      let regex =
        /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!regex.test($elem.val())) {
        var element =
          '<p class="customError" style="color:red">' +
          "The email should be a valid email address" +
          "</p>";
        $(element).insertAfter($elem);
        error++;
      } else if ($elem.val() != $(".claimListingEmail").val()) {
        var element =
          '<p class="customError" style="color:red">' +
          "Email address does not match" +
          "</p>";
        $(element).insertAfter($elem);
        error++;
      } else {
        $(".claimListingEmail").next(".customError").remove();
        this.review_check_email_claim_listing().subscribe(
          (data) => {
            if (data["data"] > 0) {
              jQuery(".signupFields").hide();
              this.claimListingWithSignup = false;
            } else {
              jQuery(".signupFields").show();
              this.claimListingWithSignup = true;
            }
          },
          (err: any) => console.log(err),
          () => {}
        );
      }
    }
    if ($elem.attr("name") == "email" && $elem.val() != "") {
      let regex =
        /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!regex.test($elem.val())) {
        var element =
          '<p class="customError" style="color:red">' +
          "The email should be a valid email address" +
          "</p>";
        $(element).insertAfter($elem);
        error++;
      } else if ($elem.val() != $(".claimListingReEmail").val()) {
        if ($(".claimListingReEmail").val() != "") {
          var element =
            '<p class="customError" style="color:red">' +
            "Email address does not match" +
            "</p>";
          $(element).insertAfter($elem);
          error++;
        }
      } else {
        $(".claimListingReEmail").next(".customError").remove();
        this.review_check_email_claim_listing().subscribe(
          (data) => {
            if (data["data"] > 0) {
              jQuery(".signupFields").hide();
              this.claimListingWithSignup = false;
            } else {
              jQuery(".signupFields").show();
              this.claimListingWithSignup = true;
            }
          },
          (err: any) => console.log(err),
          () => {}
        );
      }
    }

    if ($elem.val() == "" || $elem.val() == "(___)___-____") {
      var element =
        '<p class="customError" style="color:red">' +
        "The " +
        $elem.prev().text() +
        " field is required" +
        "</p>";
      $(element).insertAfter($elem);
      error++;
    }

    if (this.claimListingWithSignup) {
      $elem.next(".customError").remove();
      if ($elem.attr("name") == "password" && $elem.val() != "") {
        if ($elem.val().length < 6) {
          var element =
            '<p class="customError" style="color:red">' +
            " Password must be at least 6 characters long." +
            "</p>";
          $(element).insertAfter($elem);
          error++;
        } else if ($elem.val() != $(".claimListingCPassword").val()) {
          if ($(".claimListingCPassword").val() != "") {
            var element =
              '<p class="customError" style="color:red">' +
              "Password & Confirm password do not match." +
              "</p>";
            $(element).insertAfter($elem);
            error++;
          }
        } else {
          $(".claimListingCPassword").next(".customError").remove();
        }
      }
      if ($elem.attr("name") == "cpassword" && $elem.val() != "") {
        if ($elem.val() != $(".claimListingPassword").val()) {
          var element =
            '<p class="customError" style="color:red">' +
            "Password & Confirm password do not match." +
            "</p>";
          $(element).insertAfter($elem);
          error++;
        } else {
          $(".claimListingPassword").next(".customError").remove();
        }
      }
      if ($elem.val() == "") {
        var element =
          '<p class="customError" style="color:red">' +
          "The " +
          $elem.prev().text() +
          " field is required" +
          "</p>";
        $(element).insertAfter($elem);
        error++;
      }
      if ($elem.attr("name") == "is_terms" && $elem.prop("checked") == false) {
        var element =
          '<p class="customError" style="color:red">' +
          "Please accept the Term & Condition." +
          "</p>";
        $(element).insertAfter($elem);
        error++;
      }
    }

    return error;
  }
  postPaidFor(postdata) {
    return this._http.post<any[]>("claim_lingings", postdata);
  }

  onClickSubmit(data) {
    let error = 0;
    let honeyError = 0;

    $(".customValidate").each(function (key, val) {
      $(this).next(".customError").remove();

      if ($(this).val() == "" || $(this).val() == "(___)___-____") {
        var element =
          '<p class="customError" style="color:red">' +
          "The " +
          $(this).prev().text() +
          " field is required" +
          "</p>";
        $(element).insertAfter($(this));
        error++;
      }
      if (
        $(this).attr("name") == "is_terms" &&
        $(this).prop("checked") == false
      ) {
        var element =
          '<p class="customError" style="color:red">' +
          "Please accept the Term & Condition." +
          "</p>";
        $(element).insertAfter($(this));
        error++;
      }
    });

    // Honeypot Implementation
    $(".honeyInput").each(function (key, val) {
      if ($(this).val() != "") {
        $(".fileInput").next(".customError").remove();
        var element =
          '<p class="customError" style="color:red">Something Went Wrong</p>';
        $(element).insertAfter($(".fileInput"));
        honeyError++;
      }
    });

    const formData = new FormData();
    $.each(this.claim_file, function (index, value) {
      formData.append("file[]", value);
    });

    formData.append("listing_id", this.dispDetails.id);
    formData.append("first_name", data.fname);
    formData.append("last_name", data.lname);
    formData.append("telephone", $("input[name=telnum]").val());
    formData.append("e_mail", data.email);
    formData.append("verification_details", $("textarea[name=notes]").val());

    if (error == 0 && honeyError == 0) {
      this.isValidFormSubmitted = true;
      formData.append("password", data.password);
      formData.append("is_updates", data.is_updates);
      formData.append("status", "1");
      formData.append("id_cms_privileges", "4");
      formData.append(
        "referrer_id",
        this.cookieService.get("_mio_user_referral_id")
      );
      formData.append("claim_listing_with_signup", "1");

      this.postPaidFor(formData).subscribe(
        (data) => {
          if (data["api_message"] == "success" && data["id"] > 0) {
            toastr.success(
              "<i class='icon-ok-sign'></i>&nbsp;&nbsp;Congrats, you'r provided information received successfully...Thanks",
              "",
              {
                closeButton: true,
                timeOut: "8000",
                extendedTImeout: "0",
                showDuration: "300",
                hideDuration: "1000",
                extendedTimeOut: "0",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
                positionClass: "toast-top-full-width",
              }
            );
          }

          this.expiredDate = new Date();
          this.expiredDate.setDate(this.expiredDate.getDate() + 1000);
          this.cookieService.set(
            "_mio_user_id",
            data["user_id"],
            this.expiredDate,
            "/"
          );

          $("#myModal_paid").modal("hide");
        },
        (err: any) => {
          console.log(err);
          toastr.error(err.message, "", {
            closeButton: true,
            timeOut: "8000",
            extendedTImeout: "0",
            showDuration: "300",
            hideDuration: "1000",
            extendedTimeOut: "0",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
            positionClass: "toast-top-full-width",
          });
        },
        () => {
          console.log("err.message");
        }
      );
    }
  }

  onClaimFilechange(event: any) {
    jQuery(".fileInput").parent().find(".customError").remove();
    let error = 0;
    for (let i = 0; i < event.target.files.length; i++) {
      var file = event.target.files[i];
      var fileType = file.type;
      const fileName = event.target.files[i].name;
      const fsize = event.target.files[i].size;
      const fileSize = Math.round(fsize / 1024);

      if (fileSize >= 5120) {
        var element =
          '<p class="customError mb-0" style="color:red">' +
          fileName +
          "  size is more than 5MB please reduce size.</p>";
        jQuery(element).insertAfter(jQuery(".fileInput").next().next());
        error++;
      }
    }
    if (error > 0) {
      jQuery(".fileInput").val("");
      return false;
    } else {
      this.claim_file = event.target.files;
    }
  }

}