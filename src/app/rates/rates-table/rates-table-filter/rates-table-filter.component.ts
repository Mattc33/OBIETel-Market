import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-rates-table-filter',
  templateUrl: './rates-table-filter.component.html',
  styleUrls: ['./rates-table-filter.component.scss']
})
export class RatesTableFilterComponent implements OnInit {

    // events
    @Output() emitFilterSettings = new EventEmitter();

    // Form Groups
    priceFilterFormGroup: FormGroup;
    ratingFilterFormGroup: FormGroup;


    constructor(
        private _fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.priceFilterFormGroup = this.construct_priceFilterFormGroup();
        this.ratingFilterFormGroup = this.construct_ratingFilterFormGroup();
    }

    // ================================================================================
    // Global Event Handler
    // ================================================================================
    emitFilterEventBuilder(_event: string, _status: string) {
        this.emitFilterSettings.emit(
            {
                event: _event,
                status: _status
            }
        );
    }

    // ================================================================================
    // Form Group Construction
    // ================================================================================
    construct_priceFilterFormGroup() {
        return this._fb.group({
            lowestPriceCtrl: [false],
            highestPriceCtrl: [false]
        });
    }

    construct_ratingFilterFormGroup() {
        return this._fb.group({
            fourStarCtrl: [4],
            threeStarCtrl: [3],
            twoStarCtrl: [2],
            oneStarCtrl: [1]
        });
    }

    // ================================================================================
    // Sorts & Filters - Price
    // ================================================================================
    onPriceChange() {
        const lowestPriceVal = this.priceFilterFormGroup.get('lowestPriceCtrl').value;
        const highestPriceVal = this.priceFilterFormGroup.get('highestPriceCtrl').value;
        const _event = 'price';
        if ( lowestPriceVal === true && highestPriceVal === false ) {
            this.emitFilterEventBuilder(_event, 'lowest');
        }
        if ( lowestPriceVal === false && highestPriceVal === true ) {
            this.emitFilterEventBuilder(_event, 'highest');
        }
        if ( lowestPriceVal === false && highestPriceVal === false ) {
            this.emitFilterEventBuilder(_event, 'reset');
        }
    }

    onLowestPriceClick() {
        this.priceFilterFormGroup.get('highestPriceCtrl').setValue(false);
    }

    onHighestPriceClick() {
        this.priceFilterFormGroup.get('lowestPriceCtrl').setValue(false);
    }

    // ================================================================================
    // Sorts & Filters - Price
    // ================================================================================
    onClickRating(event) {
        const getTargetRatingValue = event.target.attributes.value.value;
        this.emitFilterEventBuilder('rating', getTargetRatingValue);
    }

}
