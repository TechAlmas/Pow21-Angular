import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StrainComponent } from './strain/strain.component';
import { DispensaryComponent } from './dispensary/dispensary.component';
import { ReferralComponent } from './referral.component'; 
import { LayoutComponent } from './ui/layout/layout.component';
import { MainComponent } from './main.component';
import { PriceAlertPageComponent } from './price-alert/price-alert-page.component';
import { ComparePriceComponent } from './compare-price/compare-price.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ShareearnComponent } from './user/profile/share-earn.component';
import { EditComponent } from './user/profile/edit.component';
import { PricealertComponent } from './user/profile/pricealert.component';
import { PricealerttargetComponent } from './user/profile/pricealerttarget.component';
import { ForgotpasswordComponent } from './user/login/forgotpassword.component';
import { FavstrainComponent } from './user/profile/favstrain.component';
import { ReviewsComponent } from './user/profile/reviews.component';
import { FeelLikeComponent } from './feel-like/feel-like.component';
import { MedicalStainsComponent } from './medical-strains/medical-strains.component';
import { DeveloperComponent } from './developer/developer.component';
import { CannabisConverterComponent } from './cannabis-converter/cannabis-converter.component';
import { ProfileAccountComponent } from './user/profile/profile-account.component';
import { LogoutComponent } from './user/logout.component';
import { LocationResolver } from './location-resolver.services';

import { BusinessComponent } from './user/profile/business.component';
import { BusinessEditComponent } from './user/profile/business-edit.component';
import { BusinessUserComponent } from './user/profile/business-users.component';
import { BusinessUserEditComponent } from './user/profile/business-user-edit.component';
import { FollowdispComponent } from './user/profile/followdisp.component';
import { BusinessFollowersComponent } from './user/profile/business-followers.component';
import { BusinessInsightsComponent } from './user/profile/business-insights.component';
import { BusinessContributersComponent } from './user/profile/business-contributers.component';
import { BusinessContributersEditComponent } from './user/profile/business-contributers-edit.component';


const routes: Routes = [
  { path: '', component: HomeComponent,resolve: {locations: LocationResolver}},
  { path: 'share/:referralId', component: ReferralComponent,resolve: {locations: LocationResolver}},
  { path: 'price-alert', component: PriceAlertPageComponent,resolve: {locations: LocationResolver}},  
  { path: 'cannabis-converter', component: CannabisConverterComponent,resolve: {locations: LocationResolver}},
  { path: 'compare-price', component: ComparePriceComponent,resolve: {locations: LocationResolver}},
  { path: 'login', component: UserComponent,resolve: {locations: LocationResolver}},
  { path: 'register', component: RegisterComponent,resolve: {locations: LocationResolver}},
  { path: 'members/logout', component: LogoutComponent,resolve: {locations: LocationResolver}},
  { path: 'members/dashboard', component: ProfileComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business', component: BusinessComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/edit/:slug', component: BusinessEditComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/add', component: BusinessEditComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/users', component: BusinessUserComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/user/edit/:id', component: BusinessUserEditComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/user/add', component: BusinessUserEditComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/followers/:slug', component: BusinessFollowersComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/insights', component: BusinessInsightsComponent,resolve: {locations: LocationResolver}},
  { path: 'members/share-earn', component: ShareearnComponent,resolve: {locations: LocationResolver}},
  { path: 'members/account', component: ProfileAccountComponent,resolve: {locations: LocationResolver}},
  { path: 'compare-marijuana-moods', component: FeelLikeComponent,resolve: {locations: LocationResolver}},
  { path: 'developers', component: DeveloperComponent,resolve: {locations: LocationResolver}},
  { path: 'members/profile', component: EditComponent,resolve: {locations: LocationResolver}},
  { path: 'members/price-alert', component: PricealertComponent,resolve: {locations: LocationResolver}},
  { path: 'price-alerttargetprofile', component: PricealerttargetComponent,resolve: {locations: LocationResolver}},
  { path: 'forgotpassword', component: ForgotpasswordComponent,resolve: {locations: LocationResolver}},
  {path: 'members/strain-favorites',component:FavstrainComponent,resolve: {locations: LocationResolver}},
  {path: 'members/dispensary-followers',component:FollowdispComponent,resolve: {locations: LocationResolver}},
  {path: 'members/reviews',component:ReviewsComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/contributors', component: BusinessContributersComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/contributors/edit/:slug', component: BusinessContributersEditComponent,resolve: {locations: LocationResolver}},
  { path: 'members/business/contributors/add', component: BusinessContributersEditComponent,resolve: {locations: LocationResolver}},

  { path: ':country',
     // component: MainComponent,
      children: [
        { path: 'home', component: HomeComponent,resolve: {locations: LocationResolver}},  
        { path: 'strain/:strainName', component: StrainComponent,resolve: {locations: LocationResolver}},
        { path: 'dispensary/:dispName', component: DispensaryComponent,resolve: {locations: LocationResolver}},  
        { path: 'strain/:strainName/:id', component: StrainComponent,resolve: {locations: LocationResolver}},       
        { path: 'main', component: MainComponent,resolve: {locations: LocationResolver}},
        { path: 'price-alert', component: PriceAlertPageComponent,resolve: {locations: LocationResolver}},  
        { path: 'cannabis-converter', component: CannabisConverterComponent,resolve: {locations: LocationResolver}},
        { path: 'compare-price', component: ComparePriceComponent,resolve: {locations: LocationResolver}},
         { path: ':stateName/compare-price', component: ComparePriceComponent,resolve: {locations: LocationResolver}},
         { path: 'compare-price/:strainName', component: ComparePriceComponent,resolve: {locations: LocationResolver}},
         { path: ':stateName/compare-price/:strainName', component: ComparePriceComponent,resolve: {locations: LocationResolver}},
         { path: ':stateName/:cityName/compare-price/:strainName', component: ComparePriceComponent,resolve: {locations: LocationResolver}},
          { path: ':stateName/:cityName/compare-price', component: ComparePriceComponent,resolve: {locations: LocationResolver}},
        { path: 'user-login', component: UserComponent,resolve: {locations: LocationResolver}},
        { path: 'user-register', component: RegisterComponent,resolve: {locations: LocationResolver}},
        { path: 'developers', component: DeveloperComponent,resolve: {locations: LocationResolver}},
        { path: 'user-profile', component: ProfileComponent,resolve: {locations: LocationResolver}},
        { path: 'compare-marijuana-moods', component: FeelLikeComponent,resolve: {locations: LocationResolver}},
        { path: 'compare-marijuana-moods/:attr1', component: FeelLikeComponent, runGuardsAndResolvers: 'always',resolve: {locations: LocationResolver}},
        { path: 'compare-marijuana-moods/:attr1/:attr2', component: FeelLikeComponent, runGuardsAndResolvers: 'always'},
        { path: 'compare-marijuana-moods/:attr1/:attr2/:attr3', component: FeelLikeComponent, runGuardsAndResolvers: 'always',resolve: {locations: LocationResolver}},
        { path: 'compare-medical-marijuana', component: MedicalStainsComponent,resolve: {locations: LocationResolver}},
        { path: 'compare-medical-marijuana/:attr1', component: MedicalStainsComponent, runGuardsAndResolvers: 'always',resolve: {locations: LocationResolver}},
        { path: 'compare-medical-marijuana/:attr1/:attr2', component: MedicalStainsComponent, runGuardsAndResolvers: 'always',resolve: {locations: LocationResolver}},
      ]
  }  

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [LocationResolver]
})
export class AppRoutingModule { }
