import { Component, OnInit, ElementRef, Inject, Renderer, ViewChild } from '@angular/core';
import { GridApi, ColumnApi, ColumnGroup } from 'ag-grid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RatesTableFilterComponent } from './rates-table-filter/rates-table-filter.component';

import { RatesService } from './../services/rates.api.service';
import { CodesSharedService } from './../services/codes.shared.service';
import { MainTableSharedService } from './../services/main-table.shared.service';
import { RatesSharedService } from './../services/rates.shared.service';
import { RatingsComponent } from './dialog/ratings/ratings.component';

@Component({
  selector: 'app-rates-table',
  templateUrl: './rates-table.component.html',
  styleUrls: ['./rates-table.component.scss']
})
export class RatesTableComponent implements OnInit {

    public elementRef: ElementRef;
    @ViewChild(RatesTableFilterComponent) _filterComponent: RatesTableFilterComponent;

    // row data and columnd defs
    rowData; columnDefs; rowDataCountry; columnDefsCountry; columnDefsCarrier; columnDefsDetails;
    rowDataCarrierDetails;

    // gridApi
    private gridApi: GridApi; private columnApi: ColumnApi; private gridApiCountry: GridApi; private gridApiCarrier: GridApi;
    private gridApiDetails: GridApi;

    // gridUi
    rowSelectionM = 'multiple';
    rowSelectionS = 'single';
    private howManyCarriers: number;
    private currentlyViewableCol; //  
    private currentlySelectedCarriers = [];
    private movableRowToCol;
    private enterIndex;

    // top grid toolbar
    selectedCountryName: string;

    // sidepanels
    booleanFilterSidebar = false;
    booleanCountryCarrierSidebar = true;
    booleanCarrierDetailsSidebar = false;
    countryCarrierPanelWidth;

    constructor(
        private codesSharedService: CodesSharedService, private ratesService: RatesService,
        private mainTableSharedService: MainTableSharedService,
        private ratesSharedService: RatesSharedService,
        @Inject(ElementRef) elementRef: ElementRef,
        private renderer: Renderer,
        public dialog: MatDialog
    ) {
        this.columnDefsCountry = this.createColumnDefsCountry();
        this.columnDefsCarrier = this.createColumnDefsCarrier();
        this.columnDefsDetails = this.createColumnDefsDetails();
        this.elementRef = elementRef;
    }

    ngOnInit() {
        this.rowDataCountry = this.codesSharedService.getCountryCodes();
    }

    /*
        ~~~~~~~~~~ Carrier-Selector API Serivices ~~~~~~~~~~
    */
    get_specificCarrierRatesByCountry(isoCode: string) {
        this.ratesService.get_ratesByCountry(isoCode)
            .subscribe(
                data => {
                    const carrierGroupHeadersArr = this.mainTableSharedService.createColumnGroupHeaders(data);
                    this.howManyCarriers = carrierGroupHeadersArr.length;

                    this.columnDefs = this.mainTableSharedService.createCarrierColumnDefs(carrierGroupHeadersArr, data);

                    const finalRowData = this.mainTableSharedService.createRowData(data);
                    this.gridApi.setRowData(finalRowData);

                    this.setCarrierRowData(carrierGroupHeadersArr);
                    this.setCarrierDetailsRowData(carrierGroupHeadersArr);
                }
            );
    }

    mockdata_get_specificCarrierRatesByCountry(isoCode: string) {
        if ( isoCode === 'cn' ) {
            this.ratesService.get_mockDataChina().subscribe( data => this.processMockData(data) );
        }
        if ( isoCode === 'in' ) {
            this.ratesService.get_mockDataIndia().subscribe( data => this.processMockData(data) );
        }
        if ( isoCode === 'mx' ) {
            this.ratesService.get_mockDataMexico().subscribe( data => this.processMockData(data));
        }
        if ( isoCode === 'ph' ) {
            this.ratesService.get_mockDataPhillipines().subscribe( data => this.processMockData(data));
        }
        if ( isoCode === 'pk' ) {
            this.ratesService.get_mockDataPakistan().subscribe( data => this.processMockData(data));
        }
        if ( isoCode === 'ru' ) {
            this.ratesService.get_mockDataRussia().subscribe( data => this.processMockData(data));
        }
        if ( isoCode === 'sa' ) {
            this.ratesService.get_mockDataSaudiArabia().subscribe( data => this.processMockData(data));
        }
        if ( isoCode === 'tj' ) {
            this.ratesService.get_mockDataTajikistan().subscribe( data => this.processMockData(data));
        }
        if ( isoCode === 'us' ) {
            this.ratesService.get_mockDataUnitedState().subscribe( data => this.processMockData(data));
        }
        if ( isoCode === 'ae' ) {
            this.ratesService.get_mockDataUnitedArabEmirates().subscribe( data => this.processMockData(data));
        }
        if ( isoCode === 'test' ) {
            this.ratesService.get_testCountry().subscribe( data => this.processMockData(data));
        }
    }

    processMockData(rowData) {
        const carrierGroupHeadersArr = this.mainTableSharedService.createColumnGroupHeaders(rowData);
        this.howManyCarriers = carrierGroupHeadersArr.length;

        this.columnDefs = this.mainTableSharedService.createCarrierColumnDefs(carrierGroupHeadersArr, rowData);

        const finalRowData = this.mainTableSharedService.createRowData(rowData);
        this.gridApi.setRowData(finalRowData);

        this.setCarrierRowData(carrierGroupHeadersArr);
        this.setCarrierDetailsRowData(carrierGroupHeadersArr);

        this._filterComponent.resetFilter();
    }

    // ================================================================================
    // AG Grid Init
    // ================================================================================
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.setGroupHeaderHeight(150);
    }

    on_GridReady_country(params): void {
        this.gridApiCountry = params.api;
        params.api.sizeColumnsToFit();
        this.gridApiCountry.selectIndex(0, true, null);
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
                unSortIcon: true,
            },
            {
                headerName: 'Code', field: 'code', hide: true, unSortIcon: true,
            }
        ];
    }

    private createColumnDefsCarrier() {
        return [
            {
                headerName: 'Carriers', field: 'groupHeaderName', colId: 'carrierToggle',
                checkboxSelection: true, headerCheckboxSelection: true, unSortIcon: true,
            }
        ];
    }

    private createColumnDefsDetails() {
        return [
            {
                headerName: 'Carrier', field: 'groupHeaderName', unSortIcon: true,
            },
            {
                headerName: 'Ratings', field: 'rating', unSortIcon: true,
            },
            {
                headerName: 'Carrier Tier', field: 'carrier_tier', unSortIcon: true,
            },
            {
                headerName: 'Carrier Coverage', field: 'carrier_coverage', unSortIcon: true,
            },
            {
                headerName: 'Quality Of Service', field: 'quality_of_service', unSortIcon: true,
            },
            {
                headerName: 'Popular Deals', field: 'popular_deals', unSortIcon: true,
            },
            {
                headerName: 'Resellable', field: 'resellable', unSortIcon: true,
            },
            {
                headerName: 'Quantity', field: 'quantity_available', unSortIcon: true,
            },
            {
                headerName: 'Expires', field: 'end_ts', unSortIcon: true,
            }
        ];
    }

    setCarrierRowData(rowData: Array<[{}]>) {
        this.gridApiCarrier.setRowData(rowData);
        this.gridApiCarrier.selectAll();
    }

    setCarrierDetailsRowData(rowData: Array<[{}]>) {
        this.gridApiDetails.setRowData(rowData);
        this.rowDataCarrierDetails = rowData;
    }

    // ================================================================================
    // Top toolbar
    // ================================================================================
    toggleFilterSidebar() {
        this.booleanFilterSidebar = !this.booleanFilterSidebar;
    }

    toggleCountryCarrierSidebar() {
        this.booleanCountryCarrierSidebar = !this.booleanCountryCarrierSidebar;
    }

    toggleCarrierDetailsSidebar() {
        this.booleanCarrierDetailsSidebar = !this.booleanCarrierDetailsSidebar;
    }

    closeAllSideBars() {
        this.booleanFilterSidebar = false;
        this.booleanCountryCarrierSidebar = false;
        this.booleanCarrierDetailsSidebar = false;
    }

    // ================================================================================
    // AG Grid shared Fn
    // ================================================================================
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    // ================================================================================
    // Events
    // ================================================================================
    receiveFilterSettings(params) {
        if  (params.event === 'price') {
            if ( params.status === 'lowest' ) {
                this.sortByLowestPrice();
            }
            if ( params.status === 'highest' ) {
                this.sortByHighestPrice();
            }
            if ( params.status === 'reset' ) {
                this.sortByResetPrice();
            }
        }
        if (params.event === 'rating') {
            this.sortByNumberOfStarOrHigher(params.status);
        }
        if (params.event === 'qos') {
            this.sortByNumberOfBarsOrHigher(params.status);
        }
    }

    // ================================================================================
    // AG Grid Main Table - Header - Assigning Events
    // ================================================================================
    onColumnVisible(params) { // On column reappears after hiding
        this.assignEventHandler();
        this.reassignRatingsEventHandler(params.column.colId);
        this.onCheckStatusAfterHideCol();
        this.assignSignalBarCss();
        // this.reassignSignalBarCss(params.column.colId);
    }

    onNewColumnsLoaded(params) {
        this.assignEventHandler();
        this.assignRatingsEventHandler();
        this.assignSignalBarCss();
    }

    assignEventHandler() {
        for ( let i = 0; i < this.howManyCarriers; i++ ) {
            const hideCol = this.elementRef.nativeElement.querySelector(`#hide_${i}`);
            const e_hideCol = this.renderer.listen(hideCol, 'click', (event) => {
                 this.deselectCarrierTableCheckbox(event, `${i}`);
            });

            const checkbox = this.elementRef.nativeElement.querySelector(`#checkbox_${i}`);
            const e_checkbox = this.renderer.listen(checkbox, 'change', (event) => {
                this.onCheckboxSelection(event, `${i}`);
            });
        }
    }

    assignRatingsEventHandler() {
        for ( let i = 0; i < this.howManyCarriers; i++ ) {
            const ratings = this.elementRef.nativeElement.querySelector(`#ratings_${i}`);
            const e_ratings = this.renderer.listen(ratings, 'click', (event) => {
                this.onRatingsClicked(event, `${i}`);
            });
        }
    }

    reassignRatingsEventHandler(colId) {
        const splitColId = parseInt(colId.split('_')[1], 0);
        const ratings = this.elementRef.nativeElement.querySelector(`#ratings_${splitColId}`);
        const e_ratings = this.renderer.listen(ratings, 'click', (event) => {
            this.onRatingsClicked(event, `${splitColId}`);
        });
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Header - Ratings
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    onRatingsClicked(event, id) {
        this.closeAllSideBars();
        const carrierObj = {
            carrier_name: this.getCarrierDatabaseName(id),
            ratings: this.getCarrierDatabaseRatings(id)
        };
        this.openDialogRatings(carrierObj);
    }

    openDialogRatings(carrierObj): void {
        const dialogRef = this.dialog.open(RatingsComponent, {
            width: '30vw',
            data: {
                    name: carrierObj.carrier_name,
                    rating: carrierObj.ratings
                  }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Header - Hide
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    deselectCarrierTableCheckbox(event, id) {
        const rowNode = this.gridApiCarrier.getRowNode(id);
        rowNode.setSelected(false);
    }

    detectColVisibility(condition: boolean, rowIndex: number) {
        const colId = `carrier_${rowIndex}`;
        if ( condition === true ) {
            this.showCol(colId);
        }
        if ( condition === false ) {
            this.hideCol(colId);
        }
    }

    hideCol(colId: string) {
        this.columnApi.setColumnVisible(colId, false, null);
    }

    showCol(colId: string) {
        this.columnApi.setColumnVisible(colId, true, null);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Header - Checkbox Event
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    onCheckboxSelection(event, id): void { // main event, since dynamic generated carrier col[0] has a different id conditional checks
        const checkedStatus: boolean = event.target.checked;
        if ( checkedStatus === true && id >= 0 ) { // if checkbox true and carrier col[>0] detected
            this.addColCssClass(`div[col-id="carrier_${id}"]`, `highlight-column`);
            this.addColCssClass(`div[col-id="${id}_0"]`, 'highlight-column');
            this.addSelectedCarrier(id, this.getCarrierDatabaseId(id), this.getCarrierDatabaseName(id));
        }
        if ( checkedStatus === false && id >= 0 ) { // if checkbox false and carrier col[>0] detected
            this.removeColCssClass(`div[col-id="carrier_${id}"]`, `highlight-column`);
            this.removeColCssClass(`div[col-id="${id}_0"]`, 'highlight-column');
            this.removeDeselectedCarrier(id);
        }
    }

    addColCssClass(element: string, cssClass: string) {
        this.elementRef.nativeElement.querySelector(`${element}`).classList.add(`${cssClass}`);
    }

    removeColCssClass(element: string, cssClass: string) {
        this.elementRef.nativeElement.querySelector(`${element}`).classList.remove(`${cssClass}`);
    }

    onCheckStatusAfterHideCol() { // extra fn to ensure visual aspect is maintained on col hide
        const currentlySelectedCarriers = this.currentlySelectedCarriers;
        for ( let i = 0; i < currentlySelectedCarriers.length; i++ ) {
            const colId = currentlySelectedCarriers[i].colId;
            this.addColCssClass(`div[col-id="carrier_${colId}"]`, `highlight-column`);
            this.addColCssClass(`div[col-id="${colId}_0"]`, 'highlight-column');
            this.elementRef.nativeElement.querySelector(`#checkbox_${colId}`).checked = true;
        }
    }

    addSelectedCarrier(colId: number, carrierId: number, carrierName: string) {
        this.currentlySelectedCarriers.push(
            {
                colId: colId,
                carrierId: carrierId,
                carrierName: carrierName
            }
        );
    }

    removeDeselectedCarrier(colId: number) {
        const filteredArr = this.currentlySelectedCarriers.filter( obj => obj.colId !== `${colId}` );
        this.currentlySelectedCarriers = filteredArr;
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Header - Quality of Service
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    assignSignalBarCss() {
        for ( let i = 0; i < this.rowDataCarrierDetails.length; i++) {
            const signalbarOne = this.elementRef.nativeElement.querySelector(`#signalbar_${i} .first-bar`);
            const signalbarTwo = this.elementRef.nativeElement.querySelector(`#signalbar_${i} .second-bar`);
            const signalbarThree = this.elementRef.nativeElement.querySelector(`#signalbar_${i} .third-bar`);
            const signalbarFour = this.elementRef.nativeElement.querySelector(`#signalbar_${i} .fourth-bar`);
            const signalbarFive = this.elementRef.nativeElement.querySelector(`#signalbar_${i} .fifth-bar`);
            const color = '#228B22';

            if ( this.rowDataCarrierDetails[i].quality_of_service === 5 ) {
                signalbarOne.style.setProperty('--bar-color', color);
                signalbarTwo.style.setProperty('--bar-color', color);
                signalbarThree.style.setProperty('--bar-color', color);
                signalbarFour.style.setProperty('--bar-color', color);
                signalbarFive.style.setProperty('--bar-color', color);
            }
            if ( this.rowDataCarrierDetails[i].quality_of_service === 4 ) {
                signalbarOne.style.setProperty('--bar-color', color);
                signalbarTwo.style.setProperty('--bar-color', color);
                signalbarThree.style.setProperty('--bar-color', color);
                signalbarFour.style.setProperty('--bar-color', color);
            }
            if ( this.rowDataCarrierDetails[i].quality_of_service === 3 ) {
                signalbarOne.style.setProperty('--bar-color', color);
                signalbarTwo.style.setProperty('--bar-color', color);
                signalbarThree.style.setProperty('--bar-color', color);
            }
            if ( this.rowDataCarrierDetails[i].quality_of_service === 2 ) {
                signalbarOne.style.setProperty('--bar-color', color);
                signalbarTwo.style.setProperty('--bar-color', color);
            }
            if ( this.rowDataCarrierDetails[i].quality_of_service === 1 ) {
                signalbarOne.style.setProperty('--bar-color', color);
            }
        }
    }

    reassignSignalBarCss(colId) {
        const splitColId = parseInt(colId.split('_')[1], 0);
        const signalbarOne = this.elementRef.nativeElement.querySelector(`#signalbar_${splitColId}} .first-bar`);
        const signalbarTwo = this.elementRef.nativeElement.querySelector(`#signalbar_${splitColId}} .second-bar`);
        const signalbarThree = this.elementRef.nativeElement.querySelector(`#signalbar_${splitColId}} .third-bar`);
        const signalbarFour = this.elementRef.nativeElement.querySelector(`#signalbar_${splitColId}} .fourth-bar`);
        const signalbarFive = this.elementRef.nativeElement.querySelector(`#signalbar_${splitColId}} .fifth-bar`);
        const color = '#228B22';

        if ( this.rowDataCarrierDetails[splitColId].quality_of_service === 5) {
            signalbarOne.style.setProperty('--bar-color', color);
            signalbarTwo.style.setProperty('--bar-color', color);
            signalbarThree.style.setProperty('--bar-color', color);
            signalbarFour.style.setProperty('--bar-color', color);
            signalbarFive.style.setProperty('--bar-color', color);
        }
        if ( this.rowDataCarrierDetails[splitColId].quality_of_service === 4) {
            signalbarOne.style.setProperty('--bar-color', color);
            signalbarTwo.style.setProperty('--bar-color', color);
            signalbarThree.style.setProperty('--bar-color', color);
            signalbarFour.style.setProperty('--bar-color', color);
        }
        if ( this.rowDataCarrierDetails[splitColId].quality_of_service === 3) {
            signalbarOne.style.setProperty('--bar-color', color);
            signalbarTwo.style.setProperty('--bar-color', color);
            signalbarThree.style.setProperty('--bar-color', color);
        }
        if ( this.rowDataCarrierDetails[splitColId].quality_of_service === 2) {
            signalbarOne.style.setProperty('--bar-color', color);
            signalbarTwo.style.setProperty('--bar-color', color);
        }
        if ( this.rowDataCarrierDetails[splitColId].quality_of_service === 1) {
            signalbarOne.style.setProperty('--bar-color', color);
        }
    }

    // ================================================================================
    // AG Grid Main Table - Sorts & Filters - Price
    // ================================================================================
    sortByLowestPrice() {
        const sort = [
            {
                colId: 'lowest_price',
                sort: 'asc'
            }
        ];
        this.gridApi.setSortModel(sort);
        this.showCol(sort[0].colId);
        this.hideCol('highest_price');
    }

    sortByHighestPrice() {
        const sort = [
            {
                colId: 'highest_price',
                sort: 'desc'
            }
        ];
        this.gridApi.setSortModel(sort);
        this.showCol(sort[0].colId);
        this.hideCol('lowest_price');
    }

    sortByResetPrice() {
        const sort = [
            {
                colId: 'lowest_price',
                sort: 'null'
            },
            {
                colId: 'highest_price',
                sort: 'null'
            }
        ];
        this.gridApi.setSortModel(sort);
        this.hideCol(sort[0].colId);
        this.hideCol(sort[1].colId);
    }

    // ================================================================================
    // AG Grid Main Table - Sorts & Filters - Rating
    // ================================================================================
    sortByNumberOfStarOrHigher(starNum: number) {
        this.loopThroughAndShowAll();
        const carrierRatingArr = this.getArrayOfCarrierDetail();
        const filteredForNumberStarOrHigher = carrierRatingArr.filter(data => data.rating >= starNum);
        const filteredForLowerThanNumberStar = carrierRatingArr.filter(data => data.rating < starNum);

        this.loopThroughAndHide(filteredForLowerThanNumberStar);
    }

    loopThroughAndShowAll() {
        for (let i = 0; i < this.howManyCarriers; i++) {
            const colId = `carrier_${[i]}`;
            this.showCol(colId);
        }
    }

    loopThroughAndHide(hideTheseCol) {
        for (let i = 0; i < hideTheseCol.length; i++) {
            const colId = `carrier_${hideTheseCol[i].colId}`;
            this.hideCol(colId);
        }
    }

    loopThroughAndSortHighToLow(sortTheseCol) {
        // for (let i = 0; i < sortTheseCol.length; i++) { this.hideCol(sortTheseCol.colId); }
    }

    // ================================================================================
    // AG Grid Main Table - Sorts & Filters - QoS
    // ================================================================================
    sortByNumberOfBarsOrHigher(barNum: number) {
        this.loopThroughAndShowAll();
        const carrierQoSArr = this.getArrayOfCarrierDetail();
        const filiteredForNumberBarOrHigher = carrierQoSArr.filter(data => data.quality_of_service >= barNum);
        const filiteredForLowerThanNumberBar = carrierQoSArr.filter(data => data.quality_of_service < barNum);

        this.loopThroughAndHide(filiteredForLowerThanNumberBar);
    }

    // ================================================================================
    // AG Grid Country Table
    // ================================================================================
    onSelectionChanged(params) {
        const selectedCode = this.gridApiCountry.getSelectedRows()[0].code;
        this.mockdata_get_specificCarrierRatesByCountry(selectedCode); // API Call
        this.selectedCountryName = this.gridApiCountry.getSelectedRows()[0].country; // Set country name to selected country
    }

    // ================================================================================
    // AG Grid Carrier Table
    // ================================================================================
    rowSelectedCarrier(params) {
        const mainGridColArr = this.columnApi.getColumnState();
        this.detectColVisibility(params.node.selected, params.rowIndex);
    }

    // ================================================================================
    // AG Grid Carrier Table - General purpose fn returning data
    // ================================================================================
    getCarrierDatabaseId(rowNodeId): number {
        return this.gridApiCarrier.getRowNode(rowNodeId).data.carrier_id;
    }

    getCarrierDatabaseName(rowNodeId): string {
        return this.gridApiCarrier.getRowNode(rowNodeId).data.carrier_name;
    }

    getCarrierDatabaseRatings(rowNodeId): number {
        return this.gridApiCarrier.getRowNode(rowNodeId).data.rating;
    }

    getArrayOfCarrierDetail() {
        const carrierRatingArr = [];
        for ( let i = 0; i < this.howManyCarriers; i++) {
            const gridDetailRowData = this.gridApiDetails.getDisplayedRowAtIndex(i);
            carrierRatingArr.push({
                colId: parseInt(gridDetailRowData.data.carrier_name.slice(7), 0) - 1,
                rating: gridDetailRowData.data.rating,
                quality_of_service: gridDetailRowData.data.quality_of_service
            });
        }
        return carrierRatingArr;
    }

}
