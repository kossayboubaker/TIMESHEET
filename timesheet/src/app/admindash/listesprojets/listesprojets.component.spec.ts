import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListesprojetsComponent } from './listesprojets.component';

describe('ListesprojetsComponent', () => {
  let component: ListesprojetsComponent;
  let fixture: ComponentFixture<ListesprojetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListesprojetsComponent]
    });
    fixture = TestBed.createComponent(ListesprojetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
