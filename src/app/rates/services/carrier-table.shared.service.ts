import { Injectable } from '@angular/core';

declare global { // declare global interface, set custom fn groupBy with type any
    interface Array<T> {
      groupBy(elem: T): Array<T>;
    }
}

@Injectable()
export class CarrierTableSharedService {

    filterForPrivateRateCardsOnly(input) {
        return input.filter(data => data.ratecard_name.includes('private'));
    }

    createColumnGroupHeaders(input) { // groupHeader: `Carrier ${privateData.carrier_id}`,
        const colGroupArr = [];
        for ( let i = 0; i < input.length; i++ ) {
            colGroupArr.push(
                {
                    groupHeaderName: `Carrier ${input[i].carrier_id}`,
                    carrier_coverage: input[i].carrier_coverage,
                    carrier_id: input[i].carrier_id,
                    carrier_name: input[i].carrier_name,
                    carrier_tier: input[i].carrier_tier,
                    end_ts: input[i].end_ts,
                    popular_deals: input[i].popular_deals,
                    quality_of_service: input[i].quality_of_service,
                    quantity_available: input[i].quantity_available,
                    ratecard_id: input[i].ratecard_id,
                    ratecard_name: input[i].ratecard_name,
                    rating: input[i].rating,
                    resellable: input[i].resellable
                }
            );
        }
        return colGroupArr;
    }

    createCarrierColumnDefs(carrierGroupHeadersArr, filteredData) {
        const carrierColumnDefs = [];
        carrierColumnDefs.push(
            {
                headerName: 'Prefix', field: 'prefix',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Minimum Price', field: 'minimum_price',
                valueGetter(params) {
                    const arr = Object.values(params.data);
                    arr.shift();
                    const min = Math.min(...arr);
                    return min;
                },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                hide: true,
            },
            {
                headerName: 'Maximum Price', field: 'maximum_price',
                valueGetter(params) {
                    const arr = Object.values(params.data);
                    arr.shift();
                    const min = Math.max(...arr);
                    return min;
                },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                hide: true,
            },
        );
        for ( let i = 0; i < carrierGroupHeadersArr.length; i++ ) {
            const sellrateFieldString = 'sellrate_' + filteredData[i].ratecard_id;
            carrierColumnDefs.push(
                {
                    headerName: carrierGroupHeadersArr[i].groupHeaderName,
                    children: [
                        {
                            headerName: 'Sell Rate', field: sellrateFieldString,
                            colId: 'carrier',
                            cellStyle: { 'border-right': '1px solid #E0E0E0' }
                        },
                    ]
                },
            );
        }
        return carrierColumnDefs;
    }

    createRowData(inputFilteredData) {
        const carrierRowData = carrierRowDataFn(inputFilteredData);
        const groupDataByPrefix = groupDataByPrefixFn(carrierRowData);
        const finalRowData = combineObjsFn(groupDataByPrefix);

        // Set row data
        function carrierRowDataFn(filteredData) {
            const carrierRowDataArr = [];

            for ( let i = 0; i < filteredData.length; i++ ) {
                const prefixFieldKey = 'prefix';
                const sellrateField = 'sellrate_' + filteredData[i].ratecard_id;

                for ( let x = 0; x < filteredData[i].rates.length; x++ ) {
                    carrierRowDataArr.push(
                            {
                                [prefixFieldKey]: filteredData[i].rates[x].prefix,
                                [sellrateField]: filteredData[i].rates[x].sell_rate,
                            }
                    );
                }

            }

            return carrierRowDataArr;
        }

        console.log(carrierRowData);

        function groupDataByPrefixFn(json) {
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    groups[item[prop]] = groups[item[prop]] || [];
                    groups[item[prop]].push(item);
                    return groups;
                }, {});
            };

            const data = json.groupBy('prefix');
            const dataArr = [];
            for (const item in data) {
                if ( item ) {
                    dataArr.push(data[item]);
                } else {
                }
            }
            return dataArr;
        }
        console.log(groupDataByPrefix);

        function combineObjsFn(groupedData) {
            const rowData = []; // loops through an array of objects and merges multiple objects into one
            for ( let i = 0; i < groupedData.length; i++) {
                rowData.push(
                    Object.assign.apply({}, groupedData[i])
                 );
            }
            return rowData;
        }
        console.log(finalRowData);

        return finalRowData;
    }


}
