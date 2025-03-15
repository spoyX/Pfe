import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestamonialComponent } from './testamonial.component';

describe('TestamonialComponent', () => {
  let component: TestamonialComponent;
  let fixture: ComponentFixture<TestamonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestamonialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestamonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
