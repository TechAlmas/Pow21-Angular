import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConverterBoxComponent } from './converter-box/converter-box.component';
import { PriceAlertComponent } from './price-alert/price-alert.component';
import { PriceAlertDetailComponent } from './price-alert-detail/price-alert-detail.component';
import { TopStrainsComponent } from './top-strains/top-strains.component';

@NgModule({
  imports: [BrowserModule, AppRoutingModule,FormsModule, ReactiveFormsModule],
  declarations: [ConverterBoxComponent, PriceAlertComponent, PriceAlertDetailComponent,TopStrainsComponent],
  exports: [ConverterBoxComponent,PriceAlertComponent,PriceAlertDetailComponent,TopStrainsComponent]
})

export class CommonModule {}
