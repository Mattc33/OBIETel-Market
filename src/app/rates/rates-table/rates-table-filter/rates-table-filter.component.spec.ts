import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesTableFilterComponent } from './rates-table-filter.component';

describe('RatesTableFilterComponent', () => {
  let component: RatesTableFilterComponent;
  let fixture: ComponentFixture<RatesTableFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatesTableFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
