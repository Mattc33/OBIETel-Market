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

    // active class flagging
    isRatingActiveFour = false; isRatingActiveThree = false; isRatingActiveTwo = false; isRatingActiveOne = false;
    isQoSActiveFour = false; isQoSActiveThree = false; isQoSActiveTwo = false; isQoSActiveOne = false;

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
    // Sorts & Filters - Reset
    // ================================================================================
    resetFilter() {
        this.priceFilterFormGroup.reset();
        this.emitFilterEventBuilder('price', 'reset');

        this.setRatingToNonActive();
        this.emitFilterEventBuilder('rating', '0');

        this.setQoSToNonActive();
    }

    // ================================================================================
    // Sorts & Filters - Price
    // ================================================================================
    onPriceChange() {
        const lowestPriceVal = this.priceFilterFormGroup.get('lowestPriceCtrl').value;
        const highestPriceVal = this.priceFilterFormGroup.get('highestPriceCtrl').value;
        const _event = 'price';
        if (lowestPriceVal === true && highestPriceVal === false) {
            this.emitFilterEventBuilder(_event, 'lowest');
        }
        if (lowestPriceVal === false && highestPriceVal === true) {
            this.emitFilterEventBuilder(_event, 'highest');
        }
        if (lowestPriceVal === false && highestPriceVal === false) {
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
    // Sorts & Filters - Rating
    // ================================================================================
    onClickRating(ratingNumber: number) {
        this.emitFilterEventBuilder('rating', ratingNumber.toString());
        this.setRatingToNonActive();
        if (ratingNumber === 4) {
            this.isRatingActiveFour = !this.isRatingActiveFour;
        }
        if (ratingNumber === 3) {
            this.isRatingActiveThree = !this.isRatingActiveThree;
        }
        if (ratingNumber === 2) {
            this.isRatingActiveTwo = !this.isRatingActiveTwo;
        }
        if (ratingNumber === 1) {
            this.isRatingActiveOne = !this.isRatingActiveOne;
        }
    }

    setRatingToNonActive() {
        this.isRatingActiveFour = false;
        this.isRatingActiveThree = false;
        this.isRatingActiveTwo = false;
        this.isRatingActiveOne = false;
    }

    // ================================================================================
    // Sorts & Filters - Rating
    // ================================================================================
    onClickQoS(qosNumber: number) {
        this.emitFilterEventBuilder('qos', qosNumber.toString());
        this.setQoSToNonActive();
        if (qosNumber === 4) {
            this.isQoSActiveFour = !this.isQoSActiveFour;
        }
        if (qosNumber === 3) {
            this.isQoSActiveThree = !this.isQoSActiveThree;
        }
        if (qosNumber === 2) {
            this.isQoSActiveTwo = !this.isQoSActiveTwo;
        }
        if (qosNumber === 1) {
            this.isQoSActiveOne = !this.isQoSActiveOne;
        }
    }

    setQoSToNonActive() {
        this.isQoSActiveFour = false;
        this.isQoSActiveThree = false;
        this.isQoSActiveTwo = false;
        this.isQoSActiveOne = false;
    }

}
