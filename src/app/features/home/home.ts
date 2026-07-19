import { Component, computed, inject, signal } from '@angular/core';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { SurveyListCard } from '../../shared/components/survey-list-card/survey-list-card';
import { SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../core/models/survey';

@Component({
  selector: 'app-home',
  imports: [SurveyCard, SurveyListCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private surveyService = inject(SurveyService);

  surveys = signal<Survey[]>([]);

  activeSurveys = computed(() => this.surveys().filter((survey) => !this.hasEnded(survey)));

  pastSurveys = computed(() => this.surveys().filter((survey) => this.hasEnded(survey)));

  /** The service already sorts by end date, so the first three are the most urgent. */
  endingSoon = computed(() => this.activeSurveys().slice(0, 3));

  activeTab = signal<'active' | 'past'>('active');

  visibleSurveys = computed(() =>
    this.activeTab() === 'active' ? this.activeSurveys() : this.pastSurveys(),
  );

  showTab(tab: 'active' | 'past'): void {
    this.activeTab.set(tab);
  }

  constructor() {
    this.loadSurveys();
  }

  private async loadSurveys(): Promise<void> {
    this.surveys.set(await this.surveyService.getAll());
  }

  private hasEnded(survey: Survey): boolean {
    return survey.end_date !== null && new Date(survey.end_date).getTime() < Date.now();
  }
}
