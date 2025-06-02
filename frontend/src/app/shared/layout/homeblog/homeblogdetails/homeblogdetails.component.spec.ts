import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeblogdetailsComponent } from './homeblogdetails.component';

describe('HomeblogdetailsComponent', () => {
  let component: HomeblogdetailsComponent;
  let fixture: ComponentFixture<HomeblogdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeblogdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeblogdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
