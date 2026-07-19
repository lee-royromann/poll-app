import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyListCard } from './survey-list-card';

describe('SurveyListCard', () => {
  let component: SurveyListCard;
  let fixture: ComponentFixture<SurveyListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyListCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyListCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
