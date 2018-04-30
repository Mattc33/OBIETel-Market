import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-rates-table-filter',
  templateUrl: './rates-table-filter.component.html',
  styleUrls: ['./rates-table-filter.component.scss']
})
export class RatesTableFilterComponent implements OnInit {

    @Output() emitFilterSettings = new EventEmitter();

    private filterFormGroup: FormGroup;

    constructor(
        private _fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.filterFormGroup = this._fb.group({
            lowestPriceCtrl: [false, Validators.required],
            highestPriceCtrl: [false, Validators.required]
        });
    }

    emitFilterEventBuilder(_event: string, _status: string) {
        this.emitFilterSettings.emit(
            {
                event: _event,
                status: _status
            }
        );
    }

    onPriceChange(params) {
        const lowestPriceVal = this.filterFormGroup.get('lowestPriceCtrl').value;
        const highestPriceVal = this.filterFormGroup.get('highestPriceCtrl').value;
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

    onLowestPriceClick(params) {
        this.filterFormGroup.get('highestPriceCtrl').setValue(false);
    }

    onHighestPriceClick(params) {
        this.filterFormGroup.get('lowestPriceCtrl').setValue(false);
    }

}
