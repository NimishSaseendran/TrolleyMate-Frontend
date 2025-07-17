import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleProductComponent } from './handle-product.component';

describe('HandleProductComponent', () => {
  let component: HandleProductComponent;
  let fixture: ComponentFixture<HandleProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
