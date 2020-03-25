import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators'
import { Injectable } from '@angular/core';


@Injectable()

export class ApiService {
	private url : string = 'https://api.openweathermap.org/data/2.5';
	private api_key: string = '3e3b31ec129241e660cea27f6bc73bc3';

	constructor(public http: HttpClient) {

	}

	get(endpoint: string, params?: any, reqOpts?: any) {
		endpoint = endpoint.replace(/\/+$/g,"");
		return this.http.get(this.url + '/' + endpoint + '&appid=' + this.api_key).pipe(timeout(3000))
	}

	post(endpoint: string, body: any, reqOpts?: any) {
		endpoint = endpoint.replace(/\/+$/g,"");
		const options = {
			headers: { 
				'Content-Type': 'multipart/form-data',
			}
		}
		return this.http.post(this.url + '/' + endpoint + '/', body, options).pipe(timeout(3000))
	}

}
