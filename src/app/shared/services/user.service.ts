import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

    guardValue = false;

    constructor(private router: Router) { }

    isLoggedIn(username, password) {
        if ( username === 'obietel' && password === 'b1TpJ9' ) {
            this.guardValue = true;
            this.router.navigateByUrl('/rates');
        } else {
            alert('wrong username or password');
            this.guardValue = false;
        }
    }

    guardCheck(): boolean {
        if (this.guardValue === true) {
            return true;
        } else {
            return false;
        }
    }

}
