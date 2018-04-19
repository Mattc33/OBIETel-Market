import { Component, OnInit, ElementRef, Inject, Renderer } from '@angular/core';
import { GridApi, ColumnApi, ColumnGroup } from 'ag-grid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

    // row data and columnd defs
    private rowData; private columnDefs; private rowDataCountry; private columnDefsCountry; private columnDefsCarrier;
    private columnDefsDetails;

    // gridApi
    private gridApi: GridApi; private columnApi: ColumnApi; private gridApiCountry: GridApi; private gridApiCarrier: GridApi;
    private gridApiDetails: GridApi;

    // gridUi
    private rowSelectionM = 'multiple';
    private howManyCarriers: number;
    private currentlySelectedCarriers = [];
    private movableRowToCol;
    private enterIndex;

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
        private codesSharedService: CodesSharedService, private ratesService: RatesService,
        private mainTableSharedService: MainTableSharedService, private ratesSharedService: RatesSharedService,
        @Inject(ElementRef) elementRef: ElementRef, private renderer: Renderer, public dialog: MatDialog
    ) {
        this.columnDefsCountry = this.createColumnDefsCountry();
        this.columnDefsCarrier = this.createColumnDefsCarrier();
        this.columnDefsDetails = this.createColumnDefsDetails();
        this.elementRef = elementRef;
    }

    ngOnInit() {
        this.rowDataCountry = this.codesSharedService.getCountryCodes().slice(1);
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

                    this.gridApiCarrier.setRowData(carrierGroupHeadersArr);
                    this.gridApiCarrier.selectAll();

                    this.gridApiDetails.setRowData(carrierGroupHeadersArr);
                }
            );
    }

    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.setGroupHeaderHeight(150);
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
                checkboxSelection: true,
                headerCheckboxSelection: true,
                unSortIcon: true,
                // editable: true,
                // rowDrag: true
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

    /*
        ~~~~~~~~~~ Top Toolbar UI Interactions ~~~~~~~~~~
    */
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

    /*
        ~~~~~~~~~~ AG Grid UI Interactions ~~~~~~~~~~
    */
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    rowSelectedCountry(params) {
        this.gridApi.setRowData([]);
        this.gridApiCarrier.setRowData([]);
        this.columnDefs = [];

        const countryCode = this.gridApiCountry.getSelectedRows();
        if ( countryCode.length > 0 ) {
            const selectedCode = this.gridApiCountry.getSelectedRows()[0].code;
            this.get_specificCarrierRatesByCountry(selectedCode); // API Call
            this.selectedCountryName = this.gridApiCountry.getSelectedRows()[0].country;
        } else {
        }
    }

    rowSelectedCarrier(params) {
        const mainGridColArr = this.columnApi.getColumnState();
        this.detectColVisibility(params.node.selected, params.rowIndex);
    }

    detectColVisibility(condition: boolean, rowIndex: number) {
        if ( condition === true ) {
            let colId = 'carrier';
            if ( rowIndex > 0 ) {
                colId = `carrier_${rowIndex}`;
            }
            this.showCol(colId);
        } else {
            let colId = 'carrier';
            if ( rowIndex > 0) {
                colId = `carrier_${rowIndex}`;
            }
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

    /*
        ~~~~~~~~~~~~ AG Grid | For Col UI ~~~~~~~~~~
    */
    onNewColumnsLoaded(params) {
        this.assignEventHandler();
        this.assignRatingsEventHandler();
    }

    onColumnVisible(params) {
        this.assignEventHandler();
        this.reassignRatingsEventHandler(params.column.colId);
        this.onCheckStatusAfterHideCol();
    }
    // What if instead of binding event reassignment to column visible I do it to the click of the other grid instead?

    assignEventHandler() {
        for ( let i = 0; i < this.howManyCarriers; i++ ) {
            const hideCol = this.elementRef.nativeElement.querySelector(`#hide_${i}`); // hide column btn
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
        let splitColId = parseInt(colId.split('_')[1], 0);
        if ( splitColId > 0 ) {
            splitColId = splitColId;
        } else {
            splitColId = 0;
        }

        const ratings = this.elementRef.nativeElement.querySelector(`#ratings_${splitColId}`);
        const e_ratings = this.renderer.listen(ratings, 'click', (event) => {
            this.onRatingsClicked(event, `${splitColId}`);
        });
    }

    /*
        ~~~~~~~~~~ General Purpose Fn's Returning Data ~~~~~~~~~~
    */
    getCarrierDatabaseId(rowNodeId): number {
        return this.gridApiCarrier.getRowNode(rowNodeId).data.carrier_id;
    }

    getCarrierDatabaseName(rowNodeId): string {
        return this.gridApiCarrier.getRowNode(rowNodeId).data.carrier_name;
    }

    getCarrierDatabaseRatings(rowNodeId): number {
        return this.gridApiCarrier.getRowNode(rowNodeId).data.rating;
    }

    /*
        ~~~~~~~~~~~~ AG Grid | For Col UI |  Hide Columns ~~~~~~~~~~
    */
    deselectCarrierTableCheckbox(event, id) {
        const rowNode = this.gridApiCarrier.getRowNode(id);
        rowNode.setSelected(false);
    }

    /*
        ~~~~~~~~~~~~ AG Grid | For Col UI | Add to Selected ~~~~~~~~~~
    */
    onCheckboxSelection(event, id): void { // main event, since dynamic generated carrier col[0] has a different id conditional checks
        const checkedStatus: boolean = event.target.checked;

        if ( checkedStatus === true && id < 1 ) { // if checkbox true and carrier col[0] detected
            this.addColCssClass(`div[col-id="carrier"]`, `highlight-column`);
            this.addColCssClass(`div[col-id="0_0"]`, 'highlight-column');
            this.addSelectedCarrier(id, this.getCarrierDatabaseId(id), this.getCarrierDatabaseName(id));
        }
        if ( checkedStatus === true && id > 0 ) { // if checkbox true and carrier col[>0] detected
            this.addColCssClass(`div[col-id="carrier_${id}"]`, `highlight-column`);
            this.addColCssClass(`div[col-id="${id}_0"]`, 'highlight-column');
            this.addSelectedCarrier(id, this.getCarrierDatabaseId(id), this.getCarrierDatabaseName(id));
        }
        if ( checkedStatus === false && id < 1 ) { // if checkbox false and carrier col[0] detected
            this.removeColCssClass(`div[col-id="carrier"]`, `highlight-column`);
            this.removeColCssClass(`div[col-id="0_0"]`, 'highlight-column');
            this.removeDeselectedCarrier(id);
        }
        if ( checkedStatus === false && id > 0 ) { // if checkbox false and carrier col[>0] detected
            this.removeColCssClass(`div[col-id="carrier_${id}"]`, `highlight-column`);
            this.removeColCssClass(`div[col-id="${id}_0"]`, 'highlight-column');
            this.removeDeselectedCarrier(id);
        }

        this.onCheckStatusForCarrierTable();
    }

    addColCssClass(element: string, cssClass: string) {
        this.elementRef.nativeElement.querySelector(`${element}`).classList.add(`${cssClass}`);
    }

    removeColCssClass(element: string, cssClass: string) {
        this.elementRef.nativeElement.querySelector(`${element}`).classList.remove(`${cssClass}`);
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

    onCheckStatusAfterHideCol() { // extra fn to ensure visual aspect is maintained on col hide
        for ( let i = 0; i < this.currentlySelectedCarriers.length; i++) {
            const id = this.currentlySelectedCarriers[i].colId;
            if ( id < 1 ) {
                this.addColCssClass(`div[col-id="carrier"]`, `highlight-column`);
                this.addColCssClass(`div[col-id="0_0"]`, 'highlight-column');
                this.elementRef.nativeElement.querySelector(`#checkbox_${id}`).checked = true;
            }
            if ( id > 0 ) {
                this.addColCssClass(`div[col-id="carrier_${id}"]`, `highlight-column`);
                this.addColCssClass(`div[col-id="${id}_0"]`, 'highlight-column');
                this.elementRef.nativeElement.querySelector(`#checkbox_${id}`).checked = true;
            }
        }
    }

    onCheckStatusForCarrierTable() {
        for ( let i = 0; i < this.currentlySelectedCarriers.length; i++) {
            const colId = this.currentlySelectedCarriers[i].colId;
            const node = this.gridApiCarrier.getRowNode(colId);
        }
    }

    // onEditingCell(key, input, status) { // On checkbox selection edit cell of carrier table
    //     if ( status === true ) {
    //         const formattedInput = `${input} - [Selected]`;
    //         this.gridApiCarrier.setFocusedCell(key, 'carrierToggle');
    //         this.gridApiCarrier.startEditingCell(
    //             {
    //                 rowIndex: key,
    //                 colKey: 'carrierToggle',
    //                 keyPress: key,
    //                 charPress: formattedInput
    //             }
    //         );
    //     }
    //     if ( status === false) {
    //         const formattedInput = `${input}`;
    //         this.gridApiCarrier.setFocusedCell(key, 'carrierToggle');
    //         this.gridApiCarrier.startEditingCell(
    //             {
    //                 rowIndex: key,
    //                 colKey: 'carrierToggle',
    //                 keyPress: key,
    //                 charPress: formattedInput
    //             }
    //         );
    //     }
    //     this.gridApiCarrier.stopEditing();
    // }

    // onRowDragEnter(params) {
    //     console.log('enter -->');
    //     console.log(params);

    //     this.enterIndex = params.overIndex;
    // }

    // onRowDragEnd(params) {
    //     console.log('end -->');
    //     console.log(params);

    //     const endIndex = params.overIndex;
    //     this.columnApi.moveColumnByIndex(this.enterIndex + 3, endIndex + 3, null);
    // }

    // onColDragStarted(params) {
    //     console.log(params);
    // }

    // onColDragStopped(params) {
    //     console.log(params);
    // }

    // onColumnMoved(params) {
    //     console.log(params.column.colId);
    //     console.log(params.toIndex);

    //     // this.gridApiCarrier.
    // }

    /*
        ~~~~~~~~~~ AG Grid | For Column UI | Ratings ~~~~~~~~~~
    */
    onRatingsClicked(event, id) {
        this.closeAllSideBars();

        const carrierObj = {
            carrier_name: this.getCarrierDatabaseName(id),
            ratings: this.getCarrierDatabaseRatings(id)
        };
        this.openDialogRatings(carrierObj);
    }

    /*
        ~~~~~~~~~~~~  Dialog ~~~~~~~~~~
    */
    openDialogRatings(carrierObj): void {
        console.log('test');
        const dialogRef = this.dialog.open(RatingsComponent, {
            width: '30vw',
            data:
            {
                name: carrierObj.carrier_name,
                rating: carrierObj.ratings
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

}
