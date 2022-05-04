export class City {
  api_status: string;
  api_message: string;
  data: {
    user_location: any [],
    near_cities: any [],
    near_other_cities: any [],
    user_city_id: number,
    rest_cities: any [],
    user_city: string,
    user_state: string,
    user_country: string
  };
  api_http: number;
}
