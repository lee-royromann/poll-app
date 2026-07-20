import { Component, computed, input } from '@angular/core';
import { Survey } from '../../../core/models/survey';
import { endsLabel, hasEnded } from '../../../core/utils/deadline';

@Component({
  selector: 'app-survey-list-card',
  imports: [],
  templateUrl: './survey-list-card.html',
  styleUrl: './survey-list-card.scss',
})
export class SurveyListCard {
  survey = input.required<Survey>();

  endsLabel = computed(() => endsLabel(this.survey().end_date));

  isEnded = computed(() => hasEnded(this.survey().end_date));
}
