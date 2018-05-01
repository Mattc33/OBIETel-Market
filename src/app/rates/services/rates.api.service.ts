import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class RatesService {
    url = 'http://172.20.13.129:8943/';
    rowData: any[];
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    get_ratesByCountry(isoCode: string) {
        return this.http.get(this.url + 'carriers/ratecards/rates/' + isoCode)
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockData() {
        return this.http.get('')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    // Get mock data
    get_mockDataChina() {
        return this.http.get('https://raw.githubusercontent.com/Mattc33/MattsCDN/master/json/mockup-obietel/china.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockDataIndia() {
        return this.http.get('https://rawgit.com/Mattc33/MattsCDN/master/json/mockup-obietel/india.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockDataMexico() {
        return this.http.get('https://rawgit.com/Mattc33/MattsCDN/master/json/mockup-obietel/mexico.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockDataPhillipines() {
        return this.http.get('https://rawgit.com/Mattc33/MattsCDN/master/json/mockup-obietel/phillipines.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockDataPakistan() {
        return this.http.get('https://rawgit.com/Mattc33/MattsCDN/master/json/mockup-obietel/pakistan.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockDataRussia() {
        return this.http.get('https://rawgit.com/Mattc33/MattsCDN/master/json/mockup-obietel/russia.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockDataSaudiArabia() {
        return this.http.get('https://rawgit.com/Mattc33/MattsCDN/master/json/mockup-obietel/saudiarabia.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockDataTajikistan() {
        return this.http.get('https://rawgit.com/Mattc33/MattsCDN/master/json/mockup-obietel/tajikistan.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockDataUnitedState() {
        return this.http.get('https://rawgit.com/Mattc33/MattsCDN/master/json/mockup-obietel/unitedstates.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_mockDataUnitedArabEmirates() {
        return this.http.get('https://rawgit.com/Mattc33/MattsCDN/master/json/mockup-obietel/unitedarabemirates.json')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    handleError(error: any): any {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
