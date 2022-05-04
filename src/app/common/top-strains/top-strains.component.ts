import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Ret } from '../../models/ret';

declare var $: any;
declare var jQuery: any;
declare var toastr: any;

@Component({
  selector: 'mio-top-strains',
  templateUrl: './top-strains.component.html',
  styles: [],
  providers: []
})

export class TopStrainsComponent implements OnInit {

  top_strains: any;
  selectedLocation: any;  

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    
    this.selectedLocation = JSON.parse(localStorage.getItem('locationData')); 
    
    this.loadTopStrains();
    
  }

 

  loadTopStrains(){

    
    this.getTopStrains().subscribe(

      (data => {
        this.top_strains = data['data'];
        //console.log(this.top_strains);
      }),
      (err: any) => console.log(err),
      () => {}
    );
  }

  getTopStrains (): Observable<any[]> {
    return this._http.get<any[]>('top_strains?city='+this.selectedLocation.id);
  }

}
