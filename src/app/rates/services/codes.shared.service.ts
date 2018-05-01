import { Injectable } from '@angular/core';

@Injectable()
export class CodesSharedService {
    getCountryCodes() {
        return [
            {
                'country': 'China',
                'code': 'cn'
            },
            {
                'country': 'India',
                'code': 'in'
            },
            {
                'country': 'Mexico',
                'code': 'mx'
            },
            {
                'country': 'Philippines',
                'code': 'ph'
            },
            {
                'country': 'Pakistan',
                'code': 'pk'
            },
            {
                'country': 'Russia',
                'code': 'ru'
            },
            {
                'country': 'Saudi Arabia',
                'code': 'sa'
            },
            {
                'country': 'Tajikistan',
                'code': 'tj'
            },
            {
                'country': 'United States',
                'code': 'us'
            },
            {
                'country': 'United Arab Emirates',
                'code': 'ae'
            }
        ];
    }
}
