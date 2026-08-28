import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryDropdown } from '../../shared/components/category-dropdown/category-dropdown';
import { Header } from '../../shared/components/header/header';
import { CATEGORIES } from '../../core/constants/categories';
import { SurveyService } from '../../core/services/survey.service';
import { NewSurvey, Question } from '../../core/models/survey';
import { AnswerDraft, emptyQuestion, QuestionDraft } from './survey-draft';
import { letter } from '../../core/utils/letter';

const MAX_ANSWERS = 6;
const MIN_ANSWERS = 2;

@Component({
  selector: 'app-survey-create',
  imports: [FormsModule, RouterLink, CategoryDropdown, Header],
  templateUrl: './survey-create.html',
  styleUrl: './survey-create.scss',
})
export class SurveyCreate {
  private surveyService = inject(SurveyService);
  private router = inject(Router);

  readonly categories = CATEGORIES;
  readonly maxAnswers = MAX_ANSWERS;

  title = signal('');
  endDate = signal('');
  category = signal<string | null>(null);
  description = signal('');

  questions = signal<QuestionDraft[]>([emptyQuestion(1)]);

  /** Set once the user tries to publish, so errors only appear after that attempt. */
  submitted = signal(false);
  published = signal(false);

  private createdId: string | null = null;
  private saving = false;

  /** Today in local YYYY-MM-DD; the earliest end date the survey may carry. */
  get today(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  /** Optional, but if set it must not lie in the past. */
  isEndDateValid(): boolean {
    return this.endDate() === '' || this.endDate() >= this.today;
  }

  /** Exposed for the template to label answers A, B, C … */
  readonly letter = letter;

  /** Guarded so a second click cannot save the same survey twice. */
  async publish(): Promise<void> {
    this.submitted.set(true);
    if (this.saving || this.published() || !this.isValid()) {
      return;
    }
    this.saving = true;
    const survey = await this.surveyService.create(this.toNewSurvey());
    this.createdId = survey.id;
    this.published.set(true);
  }

  /** Closing the confirmation takes the user to the new survey, as required. */
  closeOverlay(): void {
    this.published.set(false);
    this.router.navigate(['/survey', this.createdId]);
  }

  /** Required: title, every question text and every answer option (see requirements.md). */
  isValid(): boolean {
    return (
      this.title().trim() !== '' &&
      this.isEndDateValid() &&
      this.questions().every((q) => this.isQuestionValid(q))
    );
  }

  addQuestion(): void {
    this.questions.update((qs) => [...qs, emptyQuestion(this.nextId(qs))]);
  }

  /** The first question can never be removed, only emptied (see CLAUDE.md). */
  removeQuestion(question: QuestionDraft, index: number): void {
    if (index === 0) {
      this.clearQuestion(question);
      return;
    }
    this.questions.set(this.questions().filter((q) => q.id !== question.id));
  }

  addAnswer(question: QuestionDraft): void {
    if (question.answers.length >= MAX_ANSWERS) {
      return;
    }
    question.answers.push({ id: this.nextId(question.answers), text: '' });
    this.questions.set([...this.questions()]);
  }

  removeAnswer(question: QuestionDraft, answer: AnswerDraft): void {
    if (question.answers.length <= MIN_ANSWERS) {
      return;
    }
    question.answers = question.answers.filter((a) => a.id !== answer.id);
    this.questions.set([...this.questions()]);
  }

  private isQuestionValid(question: QuestionDraft): boolean {
    return question.text.trim() !== '' && question.answers.every((a) => a.text.trim() !== '');
  }

  private clearQuestion(question: QuestionDraft): void {
    question.text = '';
    question.answers.forEach((a) => (a.text = ''));
    this.questions.set([...this.questions()]);
  }

  private nextId(items: { id: number }[]): number {
    return Math.max(0, ...items.map((i) => i.id)) + 1;
  }

  private toNewSurvey(): NewSurvey {
    return {
      title: this.title().trim(),
      description: this.description().trim() || null,
      category: this.category(),
      end_date: this.endDate() || null,
      content: { questions: this.questions().map((q, i) => this.toQuestion(q, i)) },
    };
  }

  private toQuestion(question: QuestionDraft, index: number): Question {
    const id = `q${index + 1}`;
    const options = question.answers.map((a, j) => ({ id: `${id}o${j + 1}`, label: a.text.trim() }));
    return { id, text: question.text.trim(), allowMultiple: question.allowMultiple, options };
  }
}
