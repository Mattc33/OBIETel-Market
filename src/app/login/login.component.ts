import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';

import { UserService } from './../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    btnToggle = true;
    hide = true;

    // Form Group
    userLoginFormGroup: FormGroup;

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
    //   console.log(this.userService.isLoggedIn());
        this.userLoginFormGroup = this.formBuilder.group({
            usernameCtrl: ['', Validators.required],
            passwordCtrl: ['', Validators.required]
        });
    }

    userAuth() {
        const username = this.userLoginFormGroup.get('usernameCtrl').value;
        const password = this.userLoginFormGroup.get('passwordCtrl').value;

        this.userService.isLoggedIn(username, password);
    }

}
