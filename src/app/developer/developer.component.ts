import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PlatformLocation } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import {Globals} from '../models/globals';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;

@Component({
  selector: 'mio-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.css'],
  providers: []
})

export class DeveloperComponent implements OnInit { 

  constructor(private platformLocation: PlatformLocation, private globals: Globals,private title: Title, private meta: Meta, private _http: HttpClient) {}

  ngOnInit() {window.scrollTo(0, 0); 

  	 //this.loadMetaData();
  }

  loadMetaData(){
   //console.log((this.platformLocation as any).location.pathname);
   //console.log(this.globals.location_global_url);
   //this.finalUrl.replace("/", "&"); 
   var replaceString = (this.platformLocation as any).location.pathname;
   var replaceWord = "/" + this.globals.location_global_url + "/";
   var currentUrl =replaceString.replace(replaceWord, "/");

   //console.log(replaceString);   console.log(replaceWord);      console.log(currentUrl);

   
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
}
