import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomePartner } from './become-partner';

describe('BecomePartner', () => {
  let component: BecomePartner;
  let fixture: ComponentFixture<BecomePartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomePartner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomePartner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
