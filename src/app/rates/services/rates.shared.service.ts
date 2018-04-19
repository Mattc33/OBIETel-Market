import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RatesSharedService {

    source_carrierDetailsObj = new BehaviorSubject<Array<[{}]>>([]);
    current_carrierDetailsObj = this.source_carrierDetailsObj.asObservable();

    source_checkedStatus = new BehaviorSubject<boolean>(false);
    current_checkedStatus = this.source_checkedStatus.asObservable();

    change_carrierDetailsObj(obj: Array<[{}]>) {
        this.source_carrierDetailsObj.next(obj);
        console.table(obj);
    }

    change_checkedStatus(status: boolean) {
        this.source_checkedStatus.next(status);
        console.log(status);
    }

}
