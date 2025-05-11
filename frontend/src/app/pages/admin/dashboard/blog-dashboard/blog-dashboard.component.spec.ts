import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDashboardComponent } from './blog-dashboard.component';

describe('BlogDashboardComponent', () => {
  let component: BlogDashboardComponent;
  let fixture: ComponentFixture<BlogDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
