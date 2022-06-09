import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user.component';
import { EditComponent } from './profile/edit.component';
import { ShareearnComponent } from './profile/share-earn.component';
import {PricealertComponent } from './profile/pricealert.component';
import {PricealerttargetComponent } from './profile/pricealerttarget.component';
import {ForgotpasswordComponent} from './login/forgotpassword.component'
import { AppRoutingModule } from '../app-routing.module';
import { FavstrainComponent } from './profile/favstrain.component';
import { ProfileTopComponent } from './profile/profile-top-menu.component';
import { ProfileSubMenuComponent } from './profile/profile-sub-menu.component';
import { BusinessSubMenuComponent } from './profile/business-sub-menu.component';
import { ProfileAccountComponent } from './profile/profile-account.component';
import { LogoutComponent } from './logout.component';
import { ImageUploadModule } from "angular2-image-upload";
import {ShareLinkComponent} from "./profile/share-link.component"
import {ReviewsComponent} from "./profile/reviews.component";
import {ReadMoreComponent} from "./profile/ReadMore.component";
import { Ng2CompleterModule } from "ng2-completer";

import { FollowdispComponent } from './profile/followdisp.component';
import { BusinessComponent } from './profile/business.component';
import { BusinessEditComponent } from './profile/business-edit.component';
import { BusinessUserComponent } from './profile/business-users.component';
import { BusinessUserEditComponent } from './profile/business-user-edit.component';
import { BusinessFollowersComponent } from './profile/business-followers.component';
import { BusinessInsightsComponent } from './profile/business-insights.component';
import { BusinessContributersComponent } from './profile/business-contributers.component';
import { BusinessContributersEditComponent } from './profile/business-contributers-edit.component';

@NgModule({
  imports: [
    CommonModule,FormsModule,
    BrowserModule,
    AppRoutingModule,
    ImageUploadModule.forRoot(),
    Ng2CompleterModule,
  ],
  declarations: [LoginComponent,
    ReviewsComponent,
    RegisterComponent,
    ProfileComponent,
    BusinessComponent,
    BusinessEditComponent,
    BusinessUserComponent,
    BusinessUserEditComponent,
    BusinessFollowersComponent,
    BusinessInsightsComponent,
    UserComponent,
    EditComponent,
    ShareearnComponent,
    PricealertComponent,
    PricealerttargetComponent,
    ForgotpasswordComponent,
    FavstrainComponent,
    FollowdispComponent,
    ProfileTopComponent,
    ProfileSubMenuComponent,
    BusinessSubMenuComponent,
    ProfileAccountComponent,
    LogoutComponent,
    ShareLinkComponent,
    ReadMoreComponent,BusinessContributersComponent,BusinessContributersEditComponent],
  exports: [UserComponent]
})
export class UserModule { }
