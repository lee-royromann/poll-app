import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { SurveyListCard } from '../../shared/components/survey-list-card/survey-list-card';
import { CategoryDropdown } from '../../shared/components/category-dropdown/category-dropdown';
import { SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../core/models/survey';
import { CATEGORIES } from '../../core/constants/categories';
import { hasEnded } from '../../core/utils/deadline';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, SurveyCard, SurveyListCard, CategoryDropdown],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private surveyService = inject(SurveyService);

  surveys = signal<Survey[]>([]);

  activeSurveys = computed(() => this.surveys().filter((survey) => !hasEnded(survey.end_date)));

  pastSurveys = computed(() => this.surveys().filter((survey) => hasEnded(survey.end_date)));

  /** The service already sorts by end date, so the first three are the most urgent. */
  endingSoon = computed(() => this.activeSurveys().slice(0, 3));

  activeTab = signal<'active' | 'past'>('active');

  readonly categories = CATEGORIES;

  selectedCategory = signal<string | null>(null);

  visibleSurveys = computed(() => {
    const byTab = this.activeTab() === 'active' ? this.activeSurveys() : this.pastSurveys();
    const category = this.selectedCategory();
    return category ? byTab.filter((survey) => survey.category === category) : byTab;
  });

  showTab(tab: 'active' | 'past'): void {
    this.activeTab.set(tab);
  }

  selectCategory(category: string | null): void {
    this.selectedCategory.set(category);
  }

  constructor() {
    this.loadSurveys();
  }

  private async loadSurveys(): Promise<void> {
    this.surveys.set(await this.surveyService.getAll());
  }
}
