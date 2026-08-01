import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../core/models/survey';

@Component({
  selector: 'app-survey-detail',
  imports: [Header],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  private route = inject(ActivatedRoute);
  private surveyService = inject(SurveyService);

  survey = signal<Survey | null>(null);

  constructor() {
    this.loadSurvey(this.route.snapshot.paramMap.get('id'));
  }

  private async loadSurvey(id: string | null): Promise<void> {
    if (id) {
      this.survey.set(await this.surveyService.getById(id));
    }
  }
}
