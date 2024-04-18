import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGenComponent } from './image-gen.component';

describe('ImageGenComponent', () => {
  let component: ImageGenComponent;
  let fixture: ComponentFixture<ImageGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
