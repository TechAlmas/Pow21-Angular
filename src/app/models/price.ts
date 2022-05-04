export class Price {
  api_status: string;
  api_message: string;
  data: {
    avg_price: number
    high_price: number
    low_price: number
    differ_price: number
    differ_percent: number
    strain_name: string
    mass_name: string
    city_name: string
  };
  api_http: number;
}
