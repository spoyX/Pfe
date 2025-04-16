import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMembershipComponent } from './my-membership.component';

describe('MyMembershipComponent', () => {
  let component: MyMembershipComponent;
  let fixture: ComponentFixture<MyMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyMembershipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
