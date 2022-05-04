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
  selector: 'mio-business-sub-menu',
  templateUrl: './business-sub-menu.component.html',
  styleUrls: []
})
export class BusinessSubMenuComponent implements OnInit {

user_data: any;
name : string;
email: string;
phone :string;
subPrivileges: string;
referral_url :string;

  constructor(private router: Router, private globals: Globals,private cookieService: CookieService) {}

  ngOnInit() {
    this.user_data = JSON.parse(localStorage.getItem('userData'));
  	if(this.user_data['id_cms_privileges'] == 6){
      this.subPrivileges = this.user_data['id_cms_privileges'];
    }
  }
 

}
