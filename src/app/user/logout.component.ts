import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {Globals} from '../models/globals';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;

@Component({
  selector: 'mio-members-logout',
  templateUrl: './user.component.html',
  styleUrls: [],
  providers: []
})

export class LogoutComponent implements OnInit {

  locations = [];
  geoLocations = "";
  expiredDate: any;

  constructor(private globals: Globals, private cookieService: CookieService, private route: ActivatedRoute, private routes: Router) {}

  ngOnInit() {

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
   //window.location.href = '/';

   this.routes.navigate(['']);
     
     
  }

  
  
  


}
