import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import {md5} from './util/md5';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;
const API_KEY = environment.apiKey;

@Injectable()
export class MyInterceptor implements HttpInterceptor {

  user_token = null;
  deviceInfo = null;
  timestame = null;

  constructor(private deviceService: DeviceDetectorService) {
    this.timestame = Math.round((new Date()).getTime() / 1000);
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.user_token = md5(API_KEY + this.timestame + this.deviceInfo.userAgent);
  }
  // function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

     if(request.url == "blog_posts"){
       var updatedRequest = request.clone({
       url: "https://www.pow21.com/blog/wp-json/wp/v2/posts?per_page=3",
       headers: new HttpHeaders()
     });

     }else{
      var updatedRequest = request.clone({
      url: API_URL + request.url,
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        //'Content-Type':  'application/json',
        'X-Authorization-Time': this.timestame.toString(),
        'X-Authorization-Token': this.user_token
      })
    });
     }

    // console.log('Before making api call : ', request.url);

    // how to update the request Parameters
    

    // logging the updated Parameters to browser's console

     //console.log('Before making api call : ', updatedRequest);

    return next.handle(updatedRequest).pipe(
      tap(
        event => {
          // logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
            // console.log(HttpResponse);
            // console.log('api call success :', event);
          }
        },
        error => {
          // logging the http response to browser's console in case of a failuer
          if (event instanceof HttpResponse) {
            // console.log('api call error :', event);
          }
        }
      )
    );
  }
}
