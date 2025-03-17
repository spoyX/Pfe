import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerficationsendComponent } from './verficationsend.component';

describe('VerficationsendComponent', () => {
  let component: VerficationsendComponent;
  let fixture: ComponentFixture<VerficationsendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerficationsendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerficationsendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
