
import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi, ColumnGroup } from 'ag-grid';

import { RatesService } from './../services/rates.api.service';
import { CodesSharedService } from './../services/codes.shared.service';
import { CarrierTableSharedService } from './../services/carrier-table.shared.service';

@Component({
  selector: 'app-rates-table',
  templateUrl: './rates-table.component.html',
  styleUrls: ['./rates-table.component.scss']
})
export class RatesTableComponent implements OnInit {

    // row data and columnd defs
    private rowDataCountry;
    private columnDefsCountry;
    private columnDefsCarrier;
    private rowDataToolpanel;
    private columnDefsToolpanel;

    // gridApi
    private gridApiCountry: GridApi;
    private gridApiCarrier: GridApi;
    private columnApiCarrier: ColumnApi;
    private gridApiToolpanel: GridApi;

    // gridUi
    private rowSelectionM = 'multiple';

    // raw json data
    private rawJSON;

    // top grid toolbar
    private selectedCountryName: string;

    // sidepanels
    private booleanFilterSidebar: boolean = false;
    private booleanCountryCarrierSidebar: boolean = true;

    // filter
    private currentPriceToggle: string;
    private priceSortGroup = ['Minimum Price', 'Maximum Price'];

    private currentQosToggle: string;
    private qosFilterGroup = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Tier 5'];
    private qosSortGroup = ['Minimum Quality', 'Maximum Quality'];

    private currentCarrierTierToggle: string;
    private carrierTierFilterGroup = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'];
    private carrierTierSortGroup = ['Minimum Tier', 'Maximum Tier'];

    private currentRatingsToggle: any;
    private ratingsFilterGroup = [5, 4, 3, 2, 1];
    private ratingsSortGroup = ['Minimum Rating', 'Maximum Rating'];

    private currentCoverageToggle;
    private coverageFilterGroup = ['Whole Country', 'Partial Country'];

    private currentResellableToggle;
    private resellableFilterGroup = ['Resellable', 'Not sellable'];

    private currentQuantityToggle;
    private quantitySortGroup = ['Minimum Quantity', 'Maximum Quantity'];

    private currentPopularDealToggle;

    //
    private test;

    constructor(
        private codesSharedService: CodesSharedService,
        private ratesService: RatesService,
        private carrierTableSharedService: CarrierTableSharedService
    ) {
        this.columnDefsCountry = this.createColumnDefsCountry();
        this.columnDefsToolpanel = this.createColumnDefsToolbar();
    }

    ngOnInit() {
        this.rowDataCountry = this.codesSharedService.getCountryCodes().slice(1);
    }

    private toggleFilterSidebar() {
        this.booleanFilterSidebar = !this.booleanFilterSidebar;
    }

    private toggleCountryCarrierSidebar() {
        this.booleanCountryCarrierSidebar = !this.booleanCountryCarrierSidebar;
    }

    /*
        ~~~~~~~~~~ Carrier-Selector API Serivices ~~~~~~~~~~
    */
    get_specificCarrierRatesByCountry(countryCode: number) {
        this.ratesService.get_ratesByCountry(countryCode)
            .subscribe(
                data => {
                    // prune data to keep only private rates
                    const filteredData = this.carrierTableSharedService.filterForPrivateRateCardsOnly(data);
                    console.log(filteredData);

                    const carrierGroupHeadersArr = this.carrierTableSharedService.createColumnGroupHeaders(filteredData);
                    console.log(carrierGroupHeadersArr);

                    this.columnDefsCarrier = this.carrierTableSharedService.createCarrierColumnDefs(carrierGroupHeadersArr, filteredData);
                    console.log(this.columnDefsCarrier);

                    this.carrierTableSharedService.createRowData(filteredData);

                    // function groupAllRatesByPrefix() { // Group rates by every unique prefix
                    //     function groupBy(list, keyGetter) {
                    //         const map = new Map();
                    //         list.forEach((item) => {
                    //             const key = keyGetter(item);
                    //             if (!map.has(key)) {
                    //                 map.set(key, [item]);
                    //             } else {
                    //                 map.get(key).push(item);
                    //             }
                    //         });
                    //         return map;
                    //     }

                    //     let groupedByPrefixMapped;
                    //     for ( let i = 0; i < numOfUniquePrefix(); i++) {
                    //         groupedByPrefixMapped = groupBy(carrierRowData, rate => rate.prefix);
                    //     }

                    //     const groupByPrefixArr = Array.from(groupedByPrefixMapped);

                    //     const groupedByPrefixRemoveKeyArr = [];
                    //     for ( let i = 0; i < groupByPrefixArr.length; i++) {
                    //         groupedByPrefixRemoveKeyArr.push(
                    //             groupByPrefixArr[i][1]
                    //         );
                    //     }

                    //     return groupedByPrefixRemoveKeyArr;
                    // }
                    // console.log(groupAllRatesByPrefix());

                    // const finalRowData = []; // loops through an array of objects and merges multiple objects into one
                    // for ( let i = 0; i < groupAllRatesByPrefix().length; i++) {
                    //      finalRowData.push(
                    //         Object.assign.apply({}, groupAllRatesByPrefix()[i])
                    //      );
                    // }
                    // console.log(finalRowData);
                    // this.gridApiCarrier.setRowData(finalRowData);
                }
            );
    }

    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    on_GridReady_country(params): void {
        this.gridApiCountry = params.api;
    }

    on_GridReady_carrier(params) {
        this.gridApiCarrier = params.api;
        this.columnApiCarrier = params.columnApi;
        // params.api.sizeColumnToFit();
    }

    on_GridReady_toolpanel(params) {
        this.gridApiToolpanel = params.api;
        // params.api.sizeColumnsToFit();
    }

    private createColumnDefsCountry() {
        return [
            {
                headerName: 'Country', field: 'country', checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Code', field: 'code', hide: true,
            },
            {
                headerName: 'Carriers', field: 'carriers',
            },
        ];
    }

    private createColumnDefsToolbar() {
        return [
            {
                headerName: 'Carriers', field: 'carrier_name', checkboxSelection: true,
            }
        ];
    }

    private createMockRowDataToolpanel() {
        return [
            {

            }
        ];
    }

    /*
        ~~~~~~~~~~ AG Grid UI Interactions ~~~~~~~~~~
    */
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    rowSelected(params) {
        this.gridApiCarrier.setRowData([]);
        this.columnDefsCarrier = [];

        const countryCode = this.gridApiCountry.getSelectedRows();
        if ( countryCode.length > 0 ) {
            this.get_specificCarrierRatesByCountry(countryCode[0].code);
            this.selectedCountryName = this.gridApiCountry.getSelectedRows()[0].country;
        } else {
        }
    }

    /*
        ~~~~~~~~~~ parse Data ~~~~~~~~~~
    */

}
