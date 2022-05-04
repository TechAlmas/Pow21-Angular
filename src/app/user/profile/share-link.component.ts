import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ret} from '../../models/ret';
import {Router} from "@angular/router";
import {PlatformLocation } from '@angular/common';
import {Globals} from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'mio-share-link',
  templateUrl: './share-link.component.html',
  styleUrls: []
})
export class ShareLinkComponent implements OnInit {

user_data: any;
name : string;
email: string;
phone :string;
referral_url :string;
referral_id :string;

  constructor(private router: Router, private globals: Globals,private cookieService: CookieService, private platformLocation: PlatformLocation) {

  }

  ngOnInit() {
  	this.user_data = JSON.parse(localStorage.getItem('userData'));
  	//console.log((this.platformLocation as any).location);
  	this.referral_url = (this.platformLocation as any).location.origin + "/share/" + this.user_data['referral_id'];
  	//console.log(this.referral_url);
  }
 

}
