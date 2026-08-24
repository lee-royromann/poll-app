import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { SurveyService } from '../../core/services/survey.service';
import { VotesService } from '../../core/services/votes.service';
import { Question, Survey } from '../../core/models/survey';
import { formatDate } from '../../core/utils/deadline';

@Component({
  selector: 'app-survey-detail',
  imports: [Header, RouterLink],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  private route = inject(ActivatedRoute);
  private surveyService = inject(SurveyService);
  private votesService = inject(VotesService);

  survey = signal<Survey | null>(null);
  completed = signal(false);

  private selected = signal<Record<string, Set<string>>>({});
  private storedResults = signal<Record<string, number>>({});

  endsOn = computed(() => formatDate(this.survey()?.end_date ?? null));

  hasVotes = computed(() =>
    (this.survey()?.content.questions ?? []).some((q) => this.questionTotal(q) > 0),
  );

  letter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  isSelected(questionId: string, optionId: string): boolean {
    return this.selected()[questionId]?.has(optionId) ?? false;
  }

  /** Single choice questions keep one option, multiple choice ones toggle each. */
  toggleOption(question: Question, optionId: string): void {
    if (this.completed()) {
      return;
    }
    const map = { ...this.selected() };
    const set = new Set(question.allowMultiple ? (map[question.id] ?? []) : []);
    set.has(optionId) ? set.delete(optionId) : set.add(optionId);
    map[question.id] = set;
    this.selected.set(map);
  }

  /** Stored votes plus the live preview of the not-yet-saved selection. */
  optionCount(question: Question, optionId: string): number {
    const stored = this.storedResults()[optionId] ?? 0;
    const preview = !this.completed() && this.isSelected(question.id, optionId) ? 1 : 0;
    return stored + preview;
  }

  questionTotal(question: Question): number {
    return question.options.reduce((sum, o) => sum + this.optionCount(question, o.id), 0);
  }

  percent(question: Question, optionId: string): number {
    const total = this.questionTotal(question);
    return total === 0 ? 0 : Math.round((this.optionCount(question, optionId) / total) * 100);
  }

  async complete(): Promise<void> {
    if (this.completed()) {
      return;
    }
    this.completed.set(true);
    await this.saveVotes();
    this.storedResults.set(await this.votesService.getResults(this.survey()!.id));
  }

  constructor() {
    this.loadSurvey(this.route.snapshot.paramMap.get('id'));
  }

  private async saveVotes(): Promise<void> {
    const survey = this.survey()!;
    for (const question of survey.content.questions) {
      const optionIds = [...(this.selected()[question.id] ?? [])];
      if (optionIds.length) {
        await this.votesService.castVotes(survey.id, question.id, optionIds);
      }
    }
  }

  private async loadSurvey(id: string | null): Promise<void> {
    if (!id) {
      return;
    }
    this.survey.set(await this.surveyService.getById(id));
    this.storedResults.set(await this.votesService.getResults(id));
  }
}
