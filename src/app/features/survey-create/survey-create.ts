import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryDropdown } from '../../shared/components/category-dropdown/category-dropdown';
import { CATEGORIES } from '../../core/constants/categories';
import { AnswerDraft, emptyQuestion, QuestionDraft } from './survey-draft';

const MAX_ANSWERS = 6;
const MIN_ANSWERS = 2;

@Component({
  selector: 'app-survey-create',
  imports: [FormsModule, RouterLink, CategoryDropdown],
  templateUrl: './survey-create.html',
  styleUrl: './survey-create.scss',
})
export class SurveyCreate {
  readonly categories = CATEGORIES;
  readonly maxAnswers = MAX_ANSWERS;

  title = signal('');
  endDate = signal('');
  category = signal<string | null>(null);
  description = signal('');

  questions = signal<QuestionDraft[]>([emptyQuestion(1)]);

  /** Set once the user tries to publish, so errors only appear after that attempt. */
  submitted = signal(false);

  /** Turns a zero-based index into the answer letter A, B, C … */
  letter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  publish(): void {
    this.submitted.set(true);
    if (!this.isValid()) {
      return;
    }
    // Saving to Supabase and the confirmation overlay follow in the next step.
  }

  /** Required: title, every question text and every answer option (see requirements.md). */
  isValid(): boolean {
    return this.title().trim() !== '' && this.questions().every((q) => this.isQuestionValid(q));
  }

  private isQuestionValid(question: QuestionDraft): boolean {
    return question.text.trim() !== '' && question.answers.every((a) => a.text.trim() !== '');
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

  private clearQuestion(question: QuestionDraft): void {
    question.text = '';
    question.answers.forEach((a) => (a.text = ''));
    this.questions.set([...this.questions()]);
  }

  private nextId(items: { id: number }[]): number {
    return Math.max(0, ...items.map((i) => i.id)) + 1;
  }
}
