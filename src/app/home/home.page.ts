import { Component } from '@angular/core';
import { ApiService } from '../api.service'
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public newStationSearch:any
  public cities:any = []
  public data:any = []

  constructor(private storage: Storage, private api: ApiService, public toastController: ToastController) {
  	this.initForecasts() 

  }

  initForecasts() {
  	this.storage.get('cities').then((cities) => {
  		if(cities.length > 0) {
  			console.log(cities)
  			this.cities = cities
  			for (var i = cities.length - 1; i >= 0; i--) {
  				this.readForecasts(cities[i])
  			}
  		}
  	}).catch(() => {
  		console.log('Engar borgir í Storage')
  	})
  }

  readForecasts(city) {
  	this.api.get('forecast?q=' + city).subscribe((forecast) => {
  		this.addToScreen(forecast)
  	}, err => { 
  		this.presentToast('Error fetching data') //network error
  	})
  }

  addToScreen(forecast) {
  	let days = []
  	let nextFiveDays = forecast.list.filter((curr) => {
  		let day:any = new Date(curr.dt * 1000).getDay()
  		switch (day) {
  			case 0:
  			day = 'Sun'
  			break;
  			case 1:
  			day = 'Mon'
  			break;
  			case 2:
  			day = 'Tue'
  			break;
  			case 3:
  			day = 'Wed'
  			break;
  			case 4:
  			day = 'Thu'
  			break;
  			case 5:
  			day = 'Fri'
  			break;
  			case 6:
  			day = 'Sat'
  			break;
  		}
  		if(days.indexOf(day) === -1) { // api gefur each 3 hour, þetta til að fá bara daily
  			days.push(day)
  			curr.day = day
  			return curr
  		} 
  	})
  	nextFiveDays = nextFiveDays.map((curr) => {
  		curr.main.temp = parseInt(curr.main.temp - 273.15)
  		switch (curr.weather[0].main) {
  			case 'Clear':
  			curr.weather[0].icon = 'cloud-outline'
  			break;
  			case 'Clouds':
  			curr.weather[0].icon = 'cloud-outline'
  			break;
  			case 'Rain':
  			curr.weather[0].icon = 'rainy-outline'
  			break;
  			case 'Sun':
  			curr.weather[0].icon = 'sunny-outline'
  			break;
  			case 'Snow':
  			curr.weather[0].icon = 'snow-outline'
  			break;
  			default:
  			curr.weather[0].icon = 'cloud-offline-outline'
  		}
  		return curr
  	})
  	//temp - 273.15 because the temperature is recorded in kelvin. X - 273.15 kelvin returns celcius

  	this.data.push({name: forecast.city.name, weather: nextFiveDays })
  }

  addStation() {
  	let city = this.newStationSearch
  	this.api.get('weather?q=' + city).subscribe((weather) => {
  		this.cities.push(city)
  		this.storage.set('cities', this.cities).then(() => {})
  		this.readForecasts(city)
  	}, err => {
  		if(err.error.cod === '404' || !city) {
  			this.presentToast('City not found')
  		} else {
  			this.presentToast('Error fetching data') //network error
  		}
  	})
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
