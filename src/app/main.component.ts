import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { City } from './models/city';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'mio-main',
  templateUrl: './app.component.html',  
  styleUrls: [],
  providers: []
})

export class MainComponent implements OnInit {

  locations = [];
  geoLocations = "";
  display_title = "";
  display_messge = "";
  actionAgeValid: any;

  constructor(private route: ActivatedRoute,private routes: Router,private _http: HttpClient, private title: Title, private meta: Meta) {}

  ngOnInit() {    

     this.route.params.subscribe(params => {

       //console.log('inmain');

         //console.log(params);
         // localStorage.removeItem('locationData');

          if(typeof params['country'] !== "undefined")
          {    

            //console.log('inif');

            //console.log('Sumer Pal');
            let locationSes = [];
           // console.log(localStorage.getItem('locationData'));            
           // console.log(locationSes);


            if(localStorage.getItem('locationData')!= null)
              {
                 //console.log("main if");
                 locationSes = JSON.parse(localStorage.getItem('locationData'));
                 //console.log(locationSes);
                 //locationSes['country']
                 
              }

                   //console.log("main else");
                   locationSes['country'] = params['country'].toLowerCase();

                   if(params['country']=='us')
                   {

                      locationSes['id'] = '150';
                      locationSes['name'] = "Los Angeles, CA";
                      locationSes['state'] = "California";
                      locationSes['city'] = "Los Angeles";
                      locationSes['state_id'] = '13';
                      locationSes['latitude'] = '34.0522342';
                       locationSes['longitude'] = '-118.2436849';
                   }else
                   {
                      locationSes['id'] = '1065';
                      locationSes['name'] = "Vancouver, BC";
                      locationSes['state'] = "British Columbia";
                      locationSes['city'] = "Vancouver";
                       locationSes['state_id'] = '2';
                       locationSes['latitude'] = '49.2827291';
                       locationSes['longitude'] = '-123.1207375';
                   }
                  
                    
                   
                    // localStorage.setItem('locationData',JSON.stringify());
                

               localStorage.setItem('locationData',JSON.stringify(locationSes));
          }

          this.routes.navigate(['/']);
         // console.log("bypass");
        
        })
     
      
      this.title.setTitle('Home Page');
      this.meta.updateTag({ name: 'author',content: 'test.com'});
      this.meta.updateTag({name: 'keyword', content: 'angular overview, features'});
      this.meta.updateTag({name: 'description', content: 'It contains overview of angular application'});
  }

  getGeoLocation (): Observable<City[]> {
    return this._http.get<City[]>('getusergeolocation');
  }

  loadLocations(){
    
    this.getGeoLocation().subscribe(

      (data => {
        this.locations = data['data'];
        this.geoLocations = this.locations['country'];

        localStorage.setItem('locationData',JSON.stringify(data['data']));

        this.routes.navigate(['/'+ this.geoLocations +'/home']);
               
      }),
      (err: any) => console.log(err),
      () => {}

    );
  }
  
  


}
