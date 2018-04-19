import { Injectable } from '@angular/core';

declare global { // declare global interface, set custom fn groupBy with type any
    interface Array<T> {
      groupBy(elem: T): Array<T>;
    }
}

@Injectable()
export class MainTableSharedService {

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
                    filter: 'agNumberColumnFilter',
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    lockPosition: true,
                    unSortIcon: true,
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
            }
        );

        for ( let i = 0; i < carrierGroupHeadersArr.length; i++ ) { // pushing ea carrier as a col
            const sellrateFieldString = 'sellrate_' + filteredData[i].ratecard_id;

            let ratingTemplate = ``;
            if ( carrierGroupHeadersArr[i].rating >= 1 ) {
                ratingTemplate = `<i class="fas fa-star"></i>`;
            }
            if ( carrierGroupHeadersArr[i].rating >= 2 ) {
                ratingTemplate = `<i class="fas fa-star"></i><i class="fas fa-star"></i>`;
            }
            if ( carrierGroupHeadersArr[i].rating >= 3 ) {
                ratingTemplate = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`;
            }
            if ( carrierGroupHeadersArr[i].rating >= 4 ) {
                // tslint:disable-next-line:max-line-length
                ratingTemplate = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`;
            }
            if ( carrierGroupHeadersArr[i].rating >= 5 ) {
                // tslint:disable-next-line:max-line-length
                ratingTemplate = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`;
            } else {
            }

            const ratingAmount = (Math.floor(Math.random() * 999).toString());

            const prefixGroupHeaderTemplate =
                `
                <div class="top-buttons">
                        <div>
                        <input class="checkbox-addToCart" type="checkbox" id="checkbox_${i}"/>
                        <i class="fas fa-minus" id="hide_${i}"></i>
                        </div>
                </div>
                `
                +
                `<div class="rating-container" id="ratings_${i}">${ratingTemplate}(${ratingAmount})</div>`
                +
                `
                <div class="exceptions-container">
                        <span>- Expiration Date: ${carrierGroupHeadersArr[i].end_ts.slice(0, 10)}</span>
                        <span>- Quantity Offered: ${carrierGroupHeadersArr[i].quantity_available}</span>
                        <span>- Resellable: ${carrierGroupHeadersArr[i].resellable}</span>
                </div>
                `;
            carrierColumnDefs.push(
                {
                    headerName: prefixGroupHeaderTemplate,
                    children: [
                        {
                            headerName: `${carrierGroupHeadersArr[i].groupHeaderName}`, field: sellrateFieldString,
                            headerHeight: 500,
                            filter: 'agNumberColumnFilter',
                            colId: 'carrier',
                            cellStyle: function(params) {
                                return {'border-right': '1px solid #E0E0E0'};
                            },
                            unSortIcon: true,
                        }
                    ]
                }
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

        function combineObjsFn(groupedData) {
            const rowData = []; // loops through an array of objects and merges multiple objects into one
            for ( let i = 0; i < groupedData.length; i++) {
                rowData.push(
                    Object.assign.apply({}, groupedData[i])
                 );
            }
            return rowData;
        }

        return finalRowData;
    }
}
