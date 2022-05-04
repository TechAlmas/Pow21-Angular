import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ret} from '../../models/ret';
import {Router} from "@angular/router";
import {PlatformLocation } from '@angular/common';
import {Globals} from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';
import { UploadMetadata } from 'angular2-image-upload';
import { DeviceDetectorService } from 'ngx-device-detector';
import {md5} from '../../util/md5';
import { environment } from 'src/environments/environment';

export class UserImage{
  photo: any;
  id: any;
}

declare var $: any;
declare var jQuery: any;
declare var style: any;

const API_URL = environment.apiUrl;
const API_KEY = environment.apiKey;

@Component({
  selector: 'mio-profile-top-menu',
  templateUrl: './profile-top-menu.component.html',
  styleUrls: []
})
export class ProfileTopComponent implements OnInit {

user_token = null;
deviceInfo = null;
timestame = null;

user_data: any;
uname: string;
privileges: string;
subPrivileges: string;
name : string;
email: string;
phone :string;
referral_url :string;
images = {};
private fileCounter = 0;
max_image = 1;
max = 0;
uploadApiUrl: any;
myHeaders: { [name: string]: any };

userImage = new UserImage();

  constructor(private router: Router, private globals: Globals,private cookieService: CookieService, private _http: HttpClient,private deviceService: DeviceDetectorService) {
    this.timestame = Math.round((new Date()).getTime() / 1000);
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.user_token = md5(API_KEY + this.timestame + this.deviceInfo.userAgent);
    this.uploadApiUrl = 'upload_profile_image';
    this.myHeaders = {'X-Authorization-Time': this.timestame, 'X-Authorization-Token': this.user_token};
  }

  ngOnInit() {

    this.user_data = JSON.parse(localStorage.getItem('userData'));
    this.uname = this.user_data['name'].split(" ");
    if(this.user_data['id_cms_privileges'] == 7 || this.user_data['id_cms_privileges'] == 6){
      this.privileges = this.user_data['id_cms_privileges'];
    }
    if(this.user_data['id_cms_privileges'] == 6){
      this.subPrivileges = this.user_data['id_cms_privileges'];
    }

    //console.log(this.user_data);    

    if(this.user_data['photo'] && this.user_data['photo'] != ""){
      this.images = [this.user_data["photo"]];
      this.max = 0;
      setTimeout(function(){ $("#profile_image label.img-ul-button").hide(); }, 1);      
    }else{
     this.max = 10;
    }


  }

  onRemoved(event){
    

  this.removeUserImage().subscribe(
    (data => {
      //console.log(data);
      localStorage.setItem('userData',JSON.stringify(data["data"]));
      $("#profile_image label.img-ul-button").show();        
    }),
    (err: any) => console.log(err),
    () => {}

  );
    //var list = document.getElementsByClassName("img-ul-button")["style"]["display"] = "";

   //jQuery("#profile_image label").css("display","");
    
    /*
    this.image_url = [];
    this.fileCounter = 0;
    return;*/
  }

onBeforeUpload = (metadata1: UploadMetadata) => {
  $("#profile_image label.img-ul-button").hide();
  return metadata1;
};

onUploadFinished(event){
  //console.log("Hello");

  this.userImage.photo = event.src;
  //console.log(this.userImage)
  this.userImage.id = this.user_data["id"];

  this.uplodUserImage().subscribe(
    (data => {
      var res = JSON.parse(event.serverResponse.response._body);  
      this.user_data['photo'] = res.path;
      console.log(this.user_data['photo']);
      localStorage.setItem('userData',JSON.stringify(this.user_data));
      $("#profile_image label.img-ul-button").hide();
    }),
    (err: any) => console.log(err),
    () => {}

  );

  /*var res = JSON.parse(event.serverResponse.response._body);  
  this.user_data['photo'] = res.image+"?time="+ new Date().getTime();
  localStorage.setItem('userData',JSON.stringify(this.user_data));
  $("#profile_image label.img-ul-button").hide(); */
}

 
 onUploadStateChanged(event){}

 removeUserImage (): Observable<any[]> {   
    return this._http.get<any[]>('remove_user_image?id='+ this.user_data["id"]);
  }

 getUserImage (): Observable<any[]> {   
    return this._http.get<any[]>('get_user_image?id='+ this.user_data["id"]);
  }

  uplodUserImage (): Observable<any[]> {  
    console.log(this.userImage);
    return this._http.post<any[]>('upload_profile_image',this.userImage);
  }

}
