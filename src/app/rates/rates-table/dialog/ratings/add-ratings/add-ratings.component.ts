import { Component, ElementRef, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
    selector: 'app-add-ratings',
    templateUrl: './add-ratings.component.html',
    styleUrls: ['./add-ratings.component.scss']
  })
export class AddRatingsComponent implements OnInit {
  @ViewChild('star_1') star_1: ElementRef; @ViewChild('star_2') star_2: ElementRef; @ViewChild('star_3') star_3: ElementRef;
  @ViewChild('star_4') star_4: ElementRef; @ViewChild('star_5') star_5: ElementRef; @ViewChild('star_6') star_6: ElementRef;
  @ViewChild('star_7') star_7: ElementRef; @ViewChild('star_8') star_8: ElementRef; @ViewChild('star_9') star_9: ElementRef;
  @ViewChild('star_10') star_10: ElementRef;

  @Output() event_postObj = new EventEmitter<Object>();

  ratingsFormGroup: FormGroup;

  ratingsMsg: string;
  ratingsValue: number;
  starHover = true;
  starClicked = false;
  postObj;

  constructor(
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.ratingsFormGroup = this._fb.group({
      messageCtrl: ['', Validators.required]
    });
  }

  // ================================================================================
  // Events
  // ================================================================================
  onMouseOver(params) {
    this.onStarHover(params.target.id);
  }

  onMouseLeave(params) {
    this.onStarUnHover();
  }

  onMouseClickHover(params) {
    this.starHover = !this.starHover;
    this.starClicked = !this.starClicked;

    this.postObj = {};
    this.ratingsFormGroup.reset();

    // since the 2nd set of stars just came into view angular has not run change detection yet and has no knowledge of the new dom elements.
    // with a setTimeout of 0 angular is now notified of the dom el existence
    setTimeout(() => this.onStarClicked() );
  }

  onSubmit() {
    this.starHover = !this.starHover;
    this.starClicked = !this.starClicked;
    this.ratingsMsg = '';
    this.postRatings();

  }

  onClear() {
    this.starHover = !this.starHover;
    this.starClicked = !this.starClicked;
    this.ratingsMsg = '';
  }

  // ================================================================================
  // Actions
  // ================================================================================
  onStarHover(id: string) {
    const className = 'star-hover';
    if ( id === 'star_1' ) {
      this.star_1.nativeElement.classList.add(className);
      this.ratingsMsg = 'I hate it',
      this.ratingsValue = 1;
    }
    if ( id === 'star_2' ) {
      this.star_1.nativeElement.classList.add(className);
      this.star_2.nativeElement.classList.add(className);
      this.ratingsMsg = 'I don\'t like it',
      this.ratingsValue = 2;
    }
    if ( id === 'star_3' ) {
      this.star_1.nativeElement.classList.add(className);
      this.star_2.nativeElement.classList.add(className);
      this.star_3.nativeElement.classList.add(className);
      this.ratingsMsg = 'It\'s okay',
      this.ratingsValue = 3;
    }
    if ( id === 'star_4' ) {
      this.star_1.nativeElement.classList.add(className);
      this.star_2.nativeElement.classList.add(className);
      this.star_3.nativeElement.classList.add(className);
      this.star_4.nativeElement.classList.add(className);
      this.ratingsMsg = 'I like it',
      this.ratingsValue = 4;
    }
    if ( id === 'star_5' ) {
      this.star_1.nativeElement.classList.add(className);
      this.star_2.nativeElement.classList.add(className);
      this.star_3.nativeElement.classList.add(className);
      this.star_4.nativeElement.classList.add(className);
      this.star_5.nativeElement.classList.add(className);
      this.ratingsMsg = 'I love it',
      this.ratingsValue = 5;
    }
  }

  onStarUnHover() {
    const className = 'star-hover';
    this.star_1.nativeElement.classList.remove(className);
    this.star_2.nativeElement.classList.remove(className);
    this.star_3.nativeElement.classList.remove(className);
    this.star_4.nativeElement.classList.remove(className);
    this.star_5.nativeElement.classList.remove(className);
    this.ratingsMsg = '';
  }

  onStarClicked() {
    const className = 'star-clicked';
    if ( this.ratingsValue === 1 ) {
      this.star_6.nativeElement.classList.add(className);
    }
    if ( this.ratingsValue === 2 ) {
      this.star_6.nativeElement.classList.add(className);
      this.star_7.nativeElement.classList.add(className);
    }
    if ( this.ratingsValue === 3) {
      this.star_6.nativeElement.classList.add(className);
      this.star_7.nativeElement.classList.add(className);
      this.star_8.nativeElement.classList.add(className);
    }
    if ( this.ratingsValue === 4 ) {
      this.star_6.nativeElement.classList.add(className);
      this.star_7.nativeElement.classList.add(className);
      this.star_8.nativeElement.classList.add(className);
      this.star_9.nativeElement.classList.add(className);
    }
    if ( this.ratingsValue === 5 ) {
      this.star_6.nativeElement.classList.add(className);
      this.star_7.nativeElement.classList.add(className);
      this.star_8.nativeElement.classList.add(className);
      this.star_9.nativeElement.classList.add(className);
      this.star_10.nativeElement.classList.add(className);
    }
  }

  postRatings() {
    this.postObj = {
        ratings: this.ratingsValue,
        ratings_msg: this.ratingsFormGroup.get('messageCtrl').value,
        user: 'TEST from Carrier Test'
    };
    this.event_postObj.emit(this.postObj);
  }
}
