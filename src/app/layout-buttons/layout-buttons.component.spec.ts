import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutButtonsComponent } from './layout-buttons.component';

describe('LayoutButtonsComponent', () => {
  let component: LayoutButtonsComponent;
  let fixture: ComponentFixture<LayoutButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
