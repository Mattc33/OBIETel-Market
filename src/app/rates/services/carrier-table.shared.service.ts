import { Injectable } from '@angular/core';

@Injectable()
export class CarrierTableSharedService {

    filterForPrivateRateCardsOnly(input) {
        return input.filter(data => data.ratecard_name.includes('private'));
    }

    createColumnGroupHeaders(input) {
        return input.map(privateData => `Carrier ${privateData.carrier_id}`);
    }

    createCarrierColumnDefs(carrierGroupHeadersArr, filteredData) {
        const carrierColumnDefs = [];
        carrierColumnDefs.push(
            {
                headerName: 'Prefix', field: 'prefix',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            }
        );
        for ( let i = 0; i < carrierGroupHeadersArr.length; i++ ) {
            const sellrateFieldString = 'sellrate_' + filteredData[i].ratecard_id;
            carrierColumnDefs.push(
                {
                    headerName: carrierGroupHeadersArr[i],
                    children: [
                        {
                            headerName: 'Sell Rate', field: sellrateFieldString,
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
        const numOfUniquePrefix = numOfUniquePrefixFn(carrierRowData);

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

        // process rowData for AG Grid
        function numOfUniquePrefixFn(input_carrierRowData) { // Detect how many unique prefixes
            const prefixArr = [];

            for ( let i = 0; i < input_carrierRowData.length; i++) {
                prefixArr.push(input_carrierRowData[i].prefix);
            }

            const uniquePrefixArr = prefixArr.filter(function(item, position) {
                return prefixArr.indexOf(item) === position;
            });

            return uniquePrefixArr;
        }

        console.log(numOfUniquePrefix);


    }


}
