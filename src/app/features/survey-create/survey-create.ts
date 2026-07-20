import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryDropdown } from '../../shared/components/category-dropdown/category-dropdown';
import { CATEGORIES } from '../../core/constants/categories';

@Component({
  selector: 'app-survey-create',
  imports: [FormsModule, RouterLink, CategoryDropdown],
  templateUrl: './survey-create.html',
  styleUrl: './survey-create.scss',
})
export class SurveyCreate {
  readonly categories = CATEGORIES;

  title = signal('');
  endDate = signal('');
  category = signal<string | null>(null);
  description = signal('');

}
