
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
    private rowData;
    private columnDefs;
    private rowDataCountry;
    private columnDefsCountry;
    private columnDefsCarrier;
    private columnDefsDetails;

    // gridApi
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private gridApiCountry: GridApi;
    private gridApiCarrier: GridApi;
    private gridApiDetails: GridApi;

    // gridUi
    private rowSelectionM = 'multiple';

    // top grid toolbar
    private selectedCountryName: string;

    // sidepanels
    private booleanFilterSidebar = false;
    private booleanCountryCarrierSidebar = true;
    private booleanCarrierDetailsSidebar = false;
    private countryCarrierPanelWidth;

    // filter
    private priceSortGroup = ['Minimum Price', 'Maximum Price', 'Reset Price'];

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

    constructor(
        private codesSharedService: CodesSharedService,
        private ratesService: RatesService,
        private carrierTableSharedService: CarrierTableSharedService
    ) {
        this.columnDefsCountry = this.createColumnDefsCountry();
        this.columnDefsCarrier = this.createColumnDefsCarrier();
        this.columnDefsDetails = this.createColumnDefsDetails();
    }

    ngOnInit() {
        this.rowDataCountry = this.codesSharedService.getCountryCodes().slice(1);
    }

    /*
        ~~~~~~~~~~ Carrier-Selector API Serivices ~~~~~~~~~~
    */

    get_mockData() {
        this.ratesService.get_mockData()
            .subscribe(
                data => {

                    const carrierGroupHeadersArr = this.carrierTableSharedService.createColumnGroupHeaders(data);
                    console.log(carrierGroupHeadersArr);

                    this.columnDefs = this.carrierTableSharedService.createCarrierColumnDefs(carrierGroupHeadersArr, data);
                    console.log(this.columnDefsCarrier);

                    const finalRowData = this.carrierTableSharedService.createRowData(data);
                    this.gridApi.setRowData(finalRowData);

                    this.gridApiCarrier.setRowData(carrierGroupHeadersArr);
                    this.gridApiCarrier.selectAll();

                    this.gridApiDetails.setRowData(carrierGroupHeadersArr);
                }
            );
    }

    get_specificCarrierRatesByCountry(countryCode: number) {
        this.ratesService.get_ratesByCountry(countryCode)
            .subscribe(
                data => {
                }
            );
    }

    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
    }

    on_GridReady_country(params): void {
        this.gridApiCountry = params.api;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_carrier(params): void {
        this.gridApiCarrier = params.api;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_details(params): void {
        this.gridApiDetails = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefsCountry() {
        return [
            {
                headerName: 'Country', field: 'country', checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Code', field: 'code', hide: true,
            }
        ];
    }

    private createColumnDefsCarrier() {
        return [
            {
                headerName: 'Carriers', field: 'groupHeaderName', checkboxSelection: true,
                headerCheckboxSelection: true,
            }
        ];
    }

    private createColumnDefsDetails() {
        return [
            {
                headerName: 'Carrier', field: 'groupHeaderName',
            },
            {
                headerName: 'Ratings', field: 'rating',
            },
            {
                headerName: 'Carrier Tier', field: 'carrier_tier',
            },
            {
                headerName: 'Carrier Coverage', field: 'carrier_coverage',
            },
            {
                headerName: 'Quality Of Service', field: 'quality_of_service',
            },
            {
                headerName: 'Popular Deals', field: 'popular_deals',
            },
            {
                headerName: 'Resellable', field: 'resellable',
            },
            {
                headerName: 'Quantity', field: 'quantity_available',
            },
            {
                headerName: 'Expires', field: 'end_ts',
            }
        ];
    }

    /*
        ~~~~~~~~~~ Top Toolbar UI Interactions ~~~~~~~~~~
    */
    private toggleFilterSidebar() {
        this.booleanFilterSidebar = !this.booleanFilterSidebar;
    }

    private toggleCountryCarrierSidebar() {
        this.booleanCountryCarrierSidebar = !this.booleanCountryCarrierSidebar;
    }

    private toggleCarrierDetailsSidebar() {
        this.booleanCarrierDetailsSidebar = !this.booleanCarrierDetailsSidebar;
    }

    /*
        ~~~~~~~~~~ AG Grid UI Interactions ~~~~~~~~~~
    */
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    rowSelectedCountry(params) {
        this.gridApi.setRowData([]);
        // this.gridApiCarrier.setRowData([]);

        const countryCode = this.gridApiCountry.getSelectedRows();
        if ( countryCode.length > 0 ) {
            this.get_mockData();
            this.selectedCountryName = this.gridApiCountry.getSelectedRows()[0].country;
        } else {
        }
    }

    rowSelectedCarrier(params) {
        console.log('-->');

        const mainGridColArr = this.columnApi.getColumnState();

        if ( params.node.selected === true ) {
            console.log(params.rowIndex);
            console.log(mainGridColArr);

            let colId = 'carrier';
            if ( params.rowIndex > 0 ) {
                colId = `carrier_${params.rowIndex}`;
            }
            console.log(colId);
            this.showCol(colId);
        } else {
            let colId = 'carrier';
            if ( params.rowIndex > 0) {
                colId = `carrier_${params.rowIndex}`;
            }
            console.log(colId);
            this.hideCol(colId);
        }
    }

    /*
        ~~~~~~~~~~~~ AG Grid Sort | Filters ~~~~~~~~~~
    */
    sortByMinimumPrice() {
        const sort = [
            {
                colId: 'minimum_price',
                sort: 'asc'
            }
        ];
        this.gridApi.setSortModel(sort);
    }

    sortByMaximumPrice() {
        const sort = [
            {
                colId: 'maximum_price',
                sort: 'desc'
            }
        ];
        this.gridApi.setSortModel(sort);
    }

    sortByResetPrice() {
        const sort = [
            {
                colId: 'minimum_price',
                sort: 'null'
            },
            {
                colId: 'maximum_price',
                sort: 'null'
            }
        ];
        this.gridApi.setSortModel(sort);
    }

    sortByPrice(params) {
        if (params.value === 'Minimum Price') {
            this.sortByMinimumPrice();
        }
        if (params.value === 'Maximum Price') {
            this.sortByMaximumPrice();
        }
        if (params.value === 'Reset Price') {
            this.sortByResetPrice();
        }
    }

    hideCol(colId: string) {
        this.columnApi.setColumnVisible(colId, false, null);
    }

    showCol(colId: string) {
        this.columnApi.setColumnVisible(colId, true, null);
    }

    sortCol() {
        const colStateArr = this.columnApi.getColumnState();
        console.log(colStateArr);
    }

}
