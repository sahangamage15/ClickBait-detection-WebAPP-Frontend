import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsUploadComponent } from './topics-upload.component';

describe('TopicsUploadComponent', () => {
  let component: TopicsUploadComponent;
  let fixture: ComponentFixture<TopicsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicsUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
