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
  selector: 'mio-profile-sub-menu',
  templateUrl: './profile-sub-menu.component.html',
  styleUrls: []
})
export class ProfileSubMenuComponent implements OnInit {

user_data: any;
name : string;
email: string;
phone :string;
referral_url :string;

  constructor(private router: Router, private globals: Globals,private cookieService: CookieService) {}

  ngOnInit() {
  	
  }
 

}
