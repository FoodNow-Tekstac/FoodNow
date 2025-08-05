import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemModal } from './menu-item-modal';

describe('MenuItemModal', () => {
  let component: MenuItemModal;
  let fixture: ComponentFixture<MenuItemModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
