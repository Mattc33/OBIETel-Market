// Core Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, RouterLinkActive, CanActivate } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { AlwaysAuthGuard } from './shared/guard/always-auth-guard.guard';
import { OnlyLoggedInUsersGuard } from './shared/guard/only-logged-in-users.guard';
import { UserService } from './shared/services/user.service';

// Third Party Modules
import { AgGridModule } from 'ag-grid-angular';
import { SidebarModule } from 'ng-sidebar';

// Angular Material Modules
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

// Main Components
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { FooterComponent } from './footer/footer.component';

// Dashboard Components
import { DashboardComponent } from './dashboard/dashboard.component';

// Rates Table Components | Services
import { RatesComponent } from './rates/rates.component';
import { RatesTableComponent } from './rates/rates-table/rates-table.component';
import { CodesSharedService } from './rates/services/codes.shared.service';
import { RatesService } from './rates/services/rates.api.service';
import { MainTableSharedService } from './rates/services/main-table.shared.service';
import { RatesSharedService } from './rates/services/rates.shared.service';
import { RatingsComponent } from './rates/rates-table/dialog/ratings/ratings.component';

import { RegistrationComponent } from './registration/registration.component';

import { AccountComponent } from './account/account.component';

import { StatisticsComponent } from './statistics/statistics.component';

import { ContactusComponent } from './contactus/contactus.component';

import { MarketComponent } from './market/market.component';
import { AddRatingsComponent } from './rates/rates-table/dialog/ratings/add-ratings/add-ratings.component';
import { RatesTableFilterComponent } from './rates/rates-table/rates-table-filter/rates-table-filter.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [
            // Web portal main
            AppComponent, SideNavComponent, TopNavComponent, FooterComponent,
            DashboardComponent,
            RatesComponent,
            RatesTableComponent,
            RatingsComponent,
            RegistrationComponent,
            AccountComponent,
            StatisticsComponent,
            ContactusComponent,
            MarketComponent,
            AddRatingsComponent,
            RatesTableFilterComponent,
            LoginComponent,
    ],
    imports: [
            BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, HttpModule,
            AgGridModule.withComponents([]),
            SidebarModule.forRoot(),
            // Angular Materials
            MatExpansionModule, MatCardModule, MatRadioModule, MatCheckboxModule, MatInputModule, MatButtonModule,
            MatDialogModule, MatSidenavModule, MatFormFieldModule, MatIconModule,
            // Routing
            RouterModule.forRoot([
                {path: '', component: LoginComponent},
                {path: 'dashboard', component: DashboardComponent, canActivate: [AlwaysAuthGuard, OnlyLoggedInUsersGuard]},
                {path: 'rates', component: RatesComponent, canActivate: [AlwaysAuthGuard, OnlyLoggedInUsersGuard]},
                {path: 'market', component: MarketComponent, canActivate: [AlwaysAuthGuard, OnlyLoggedInUsersGuard]},
                {path: 'statistics', component: StatisticsComponent, canActivate: [AlwaysAuthGuard, OnlyLoggedInUsersGuard]},
                {path: 'account', component: AccountComponent, canActivate: [AlwaysAuthGuard, OnlyLoggedInUsersGuard]},
                {path: 'contact', component: ContactusComponent, canActivate: [AlwaysAuthGuard, OnlyLoggedInUsersGuard]},
                {path: 'login', component: LoginComponent, canActivate: []},
            ])
    ],
    providers: [CodesSharedService, RatesService,
        MainTableSharedService, RatesSharedService,
        // Auth
        UserService,
        // guards
        OnlyLoggedInUsersGuard, AlwaysAuthGuard,
    ],
  bootstrap: [AppComponent],
  entryComponents: [RatingsComponent],
})
export class AppModule { }
