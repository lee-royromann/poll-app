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

  readonly categories = [
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation',
  ];

  selectedCategory = signal<string | null>(null);

  isDropdownOpen = signal(false);

  visibleSurveys = computed(() => {
    const byTab = this.activeTab() === 'active' ? this.activeSurveys() : this.pastSurveys();
    const category = this.selectedCategory();
    return category ? byTab.filter((survey) => survey.category === category) : byTab;
  });

  showTab(tab: 'active' | 'past'): void {
    this.activeTab.set(tab);
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update((open) => !open);
  }

  /** Picking the active category again clears the filter. */
  selectCategory(category: string): void {
    this.selectedCategory.update((current) => (current === category ? null : category));
    this.isDropdownOpen.set(false);
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
