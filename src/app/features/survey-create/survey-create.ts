import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../core/constants/categories';

@Component({
  selector: 'app-survey-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './survey-create.html',
  styleUrl: './survey-create.scss',
})
export class SurveyCreate {
  readonly categories = CATEGORIES;

  title = signal('');
  endDate = signal('');
  category = signal<string | null>(null);
  description = signal('');

  isCategoryOpen = signal(false);

  toggleCategory(): void {
    this.isCategoryOpen.update((open) => !open);
  }

  selectCategory(category: string): void {
    this.category.set(category);
    this.isCategoryOpen.set(false);
  }
}
