import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';

import { RatesTableComponent } from './../../rates-table.component';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {

    private rating;
    private ratingsCollection =
        [
            {
                ratings: '4',
                ratings_msg: 'Eam esse discere cu. Id eos invenire voluptatibus. Ei duo dicam mentitum imperdiet, scripta vivendo patrioque ut pri. Solet lobortis sententiae in quo, nam id civibus moderatius. Prompta postulant reprimique usu ea, ius et maiorum instructior consectetuer. Eam ex nostro honestatis temporibus.',
                ratings_date: 'October 11, 2017',
                user: 'Bob from Carrier 1'
            },
            {
                ratings: '3',
                ratings_msg: 'Eam esse discere cu. Id eos invenire voluptatibus. Ei duo dicam mentitum imperdiet, scripta vivendo patrioque ut pri. Solet lobortis sententiae in quo, nam id civibus moderatius. Prompta postulant reprimique usu ea, ius et maiorum instructior consectetuer. Eam ex nostro honestatis temporibus.',
                ratings_date: 'Januay 1, 2018',
                user: 'Susan from Carrier 2'
            },
            {
                ratings: '5',
                ratings_msg: 'Eam esse discere cu. Id eos invenire voluptatibus. Ei duo dicam mentitum imperdiet, scripta vivendo patrioque ut pri. Solet lobortis sententiae in quo, nam id civibus moderatius. Prompta postulant reprimique usu ea, ius et maiorum instructior consectetuer. Eam ex nostro honestatis temporibus.',
                ratings_date: 'April 5, 2018',
                user: 'Steve from Carrier 3'
            },
            {
                ratings: '3',
                ratings_msg: 'Eam esse discere cu. Id eos invenire voluptatibus. Ei duo dicam mentitum imperdiet, scripta vivendo patrioque ut pri. Solet lobortis sententiae in quo, nam id civibus moderatius. Prompta postulant reprimique usu ea, ius et maiorum instructior consectetuer. Eam ex nostro honestatis temporibus.',
                ratings_date: 'December 21, 2017',
                user: 'Tiffany from Carrier 4'
            },
            {
                ratings: '2',
                ratings_msg: 'Eam esse discere cu. Id eos invenire voluptatibus. Ei duo dicam mentitum imperdiet, scripta vivendo patrioque ut pri. Solet lobortis sententiae in quo, nam id civibus moderatius. Prompta postulant reprimique usu ea, ius et maiorum instructior consectetuer. Eam ex nostro honestatis temporibus.',
                ratings_date: 'March 8, 2018',
                user: 'Billy from Carrier 5'
            },
        ];

    constructor(
        public dialogRef: MatDialogRef<RatesTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.rating = this.data.rating;
    }

    ngOnInit() {
        // this.formatTitle();
    }

    /*
        ~~~~~~~~~~ API Service ~~~~~~~~~~
    */
    post_ratings() {
        // 2 values
        // ratings counter
        // ratings value
    }

    /*
    */
    formatTitle() {

    }

    eventReceive_postObj(params) {
        setTimeout(() => this.ratingsCollection.push(params) );
    }

    onStarMouseEnter(params) {
        alert('enter');
        console.log(params);
    }

    starMouseLeave(params) {
        console.log(params);
    }

}
