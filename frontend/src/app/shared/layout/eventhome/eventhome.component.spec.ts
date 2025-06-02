import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventhomeComponent } from './eventhome.component';

describe('EventhomeComponent', () => {
  let component: EventhomeComponent;
  let fixture: ComponentFixture<EventhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventhomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
