import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordConfirmation } from './forgot-password-confirmation';

describe('ForgotPasswordConfirmation', () => {
  let component: ForgotPasswordConfirmation;
  let fixture: ComponentFixture<ForgotPasswordConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
