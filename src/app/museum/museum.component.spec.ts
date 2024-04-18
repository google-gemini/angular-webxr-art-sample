import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuseumComponent } from './museum.component';

describe('MuseumComponent', () => {
  let component: MuseumComponent;
  let fixture: ComponentFixture<MuseumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuseumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MuseumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
