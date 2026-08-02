import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey } from '../../../core/models/survey';
import { endsLabel } from '../../../core/utils/deadline';

@Component({
  selector: 'app-survey-card',
  imports: [RouterLink],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCard {
  survey = input.required<Survey>();

  endsLabel = computed(() => endsLabel(this.survey().end_date));
}
