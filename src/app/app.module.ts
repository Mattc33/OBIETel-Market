// Core Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

// Third Party Modules
import { AgGridModule } from 'ag-grid-angular';
import { SidebarModule } from 'ng-sidebar';

// Angular Material Modules
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

// Main Components
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { FooterComponent } from './footer/footer.component';

import { DashboardComponent } from './dashboard/dashboard.component';

import { RegistrationComponent } from './registration/registration.component';

import { AccountComponent } from './account/account.component';

import { StatisticsComponent } from './statistics/statistics.component';

import { ContactusComponent } from './contactus/contactus.component';

import { MarketComponent } from './market/market.component';

import { RatesComponent } from './rates/rates.component';
import { RatesTableComponent } from './rates/rates-table/rates-table.component';
import { CodesSharedService } from './rates/services/codes.shared.service';
import { RatesService } from './rates/services/rates.api.service';
import { CarrierTableSharedService } from './rates/services/carrier-table.shared.service';

@NgModule({
  declarations: [
        // Web portal main
        AppComponent,
        SideNavComponent,
        TopNavComponent,
        FooterComponent,

        DashboardComponent,

        RegistrationComponent,

        AccountComponent,

        StatisticsComponent,

        ContactusComponent,

        MarketComponent,

        RatesComponent,
        RatesTableComponent,
  ],
  imports: [
        BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, HttpModule,
        AgGridModule.withComponents([]), SidebarModule.forRoot(),
        // Angular Materials
        MatExpansionModule, MatCardModule, MatRadioModule, MatCheckboxModule, MatInputModule,
        RouterModule.forRoot([
            {path: '', component: DashboardComponent},
            {path: 'dashboard', component: DashboardComponent},
            {path: 'rates', component: RatesComponent},
            {path: 'market', component: MarketComponent},
            {path: 'statistics', component: StatisticsComponent},
            {path: 'account', component: AccountComponent},
            {path: 'contact', component: ContactusComponent},
          ])
  ],
  providers: [CodesSharedService, RatesService, CarrierTableSharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
