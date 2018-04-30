import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {


    constructor(private userService: UserService, private router: Router) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            console.log(OnlyLoggedInUsersGuard);
            if (this.userService.guardCheck()) {
                return true;
            } else {
                window.alert('You don\'t have permission to view this page please login');
                // this.router.navigateByUrl('/login');
                return false;
            }
        }
}
