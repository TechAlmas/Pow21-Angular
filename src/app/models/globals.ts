// globals.ts
import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  price_alert_count: number = 0;
  user_data: boolean;
  location_global_url: string;
  user_name: string;
  user_email: string;
  redirect_url: string;
  locations:any = [];
}