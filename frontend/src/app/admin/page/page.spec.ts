import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingApps } from './page';

describe('PendingApps', () => {
  let component: PendingApps;
  let fixture: ComponentFixture<PendingApps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingApps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
