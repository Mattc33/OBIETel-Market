import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

    guardValue = false;

    constructor(private router: Router) { }

    isLoggedIn(username, password) {
        // return true;
        if ( username === 'obietel' && password === 'b1TpJ9' || username === 'obietel2' && password === '7hWDyI' ) {
            this.guardValue = true;
            this.router.navigateByUrl('/rates');
        } else {
            alert('wrong username or password');
            this.guardValue = false;
        }
    }

    guardCheck(): boolean {
        // return true;
        if (this.guardValue === true) {
            return true;
        } else {
            return false;
        }
    }

}
