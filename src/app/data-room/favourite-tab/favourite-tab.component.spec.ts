import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteTabComponent } from './favourite-tab.component';

describe('FavouriteTabComponent', () => {
  let component: FavouriteTabComponent;
  let fixture: ComponentFixture<FavouriteTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavouriteTabComponent]
    });
    fixture = TestBed.createComponent(FavouriteTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
