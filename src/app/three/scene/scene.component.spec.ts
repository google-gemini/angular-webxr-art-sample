import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneComponent } from './scene.component';

describe('SceneComponent', () => {
  let component: SceneComponent;
  let fixture: ComponentFixture<SceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SceneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
