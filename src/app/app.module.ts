import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { Globals } from './models/globals';
import { MyInterceptor} from './my-interceptor';
import { RouterModule, Routes } from '@angular/router';
import { UiModule } from './ui/ui.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { StrainComponent } from './strain/strain.component';
import { DispensaryComponent } from './dispensary/dispensary.component';
import { PriceAlertPageComponent } from './price-alert/price-alert-page.component';
import { ComparePriceComponent } from './compare-price/compare-price.component';
import { FeelLikeComponent } from './feel-like/feel-like.component';
import { DeveloperComponent } from './developer/developer.component';
import { CannabisConverterComponent } from './cannabis-converter/cannabis-converter.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CookieService } from 'ngx-cookie-service';
import { MedicalStainsComponent } from './medical-strains/medical-strains.component';
import { ReferralComponent } from './referral.component';
import { ImageUploadModule } from "angular2-image-upload";
import {MyCurrencyPipe} from './util/my-currency.pipe';
import {MyCurrencyFormatterDirective} from './util/my-currency-formatter.directive';
import {NumberMaskPipe} from './util/number-mask.pipe';
import { Ng2CompleterModule } from "ng2-completer";


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    StrainComponent,
    DispensaryComponent,
    ReferralComponent,
    PriceAlertPageComponent,
    ComparePriceComponent,
    FeelLikeComponent,
    MedicalStainsComponent,
    DeveloperComponent,
    CannabisConverterComponent,
    MyCurrencyPipe,
    MyCurrencyFormatterDirective,
    NumberMaskPipe
   // EqualValidator 
  ],
  imports: [
    Ng2CompleterModule,
    BrowserModule,
    AppRoutingModule,
    UiModule,
    UserModule,
    CommonModule,
    HttpClientModule,
    DeviceDetectorModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    ImageUploadModule.forRoot(),

    

  ],
  providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MyInterceptor,
        multi: true
      },
      Globals,
      CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
