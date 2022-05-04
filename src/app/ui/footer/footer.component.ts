import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Globals} from '../../models/globals';
import { CookieService } from 'ngx-cookie-service';

declare var toastr: any;

@Component({
  selector: 'mio-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {


	st_count = 0;
	disp_count = 0;
  posts: any;

  	constructor(private _http: HttpClient, private globals: Globals,private cookieService: CookieService) { }

  	ngOnInit() {

  	this.getStrainsCount().subscribe(

      (data => {

      	 this.st_count = data.strains_count;
      	 //console.log(this.st_count);
       }),
      (err: any) => console.log(err),
      () => {
         
      }
    );

    this.getDispensariesCount().subscribe(

      (data => {

      	 this.disp_count = data.dispensaries_count;
      	 //console.log(this.st_count);
      } ),
      (err: any) => console.log(err),
      () => {
         
      }
    );

    this.getBLogPosts().subscribe(

      (data => {
        //console.log("Test");
        
         this.posts = data;
        // console.log(this.posts);
      } ),
      (err: any) => console.log(err),
      () => {
         
      }
    );

  }

  getBLogPosts(): Observable<any> {
    return this._http.get<any>('blog_posts');
  }

  getStrainsCount(): Observable<any> {
    return this._http.get<any>('strains_count');
  }

  getDispensariesCount(): Observable<any> {
    return this._http.get<any>('dispensaries_count');
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
                  "positionClass": "toast-top-full-width",});
   localStorage.removeItem('userData');
   this.globals.user_data = false;
   this.globals.user_name = this.cookieService.get('_mio_user_name');
   this.globals.user_email = this.cookieService.get('_mio_user_email');
   //window.location.href = '/';

   //this.router.navigate(['/user-login']);
  }

}
