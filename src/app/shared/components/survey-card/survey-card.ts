import { Component, computed, input } from '@angular/core';
import { Survey } from '../../../core/models/survey';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-survey-card',
  imports: [],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCard {
  survey = input.required<Survey>();

  /** Rounded up so a survey running out later today still counts as one full day. */
  daysLeft = computed(() => {
    const endDate = this.survey().end_date;
    if (!endDate) {
      return null;
    }
    const remaining = new Date(endDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(remaining / MS_PER_DAY));
  });

  endsLabel = computed(() => {
    const days = this.daysLeft();
    if (days === null) {
      return null;
    }
    return days === 1 ? 'Ends in 1 Day' : `Ends in ${days} Days`;
  });
}
