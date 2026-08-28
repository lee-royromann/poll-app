import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { SurveyService } from '../../core/services/survey.service';
import { VotesService } from '../../core/services/votes.service';
import { Question, Survey } from '../../core/models/survey';
import { formatDate, hasEnded } from '../../core/utils/deadline';
import { letter } from '../../core/utils/letter';

@Component({
  selector: 'app-survey-detail',
  imports: [Header, RouterLink],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private surveyService = inject(SurveyService);
  private votesService = inject(VotesService);

  survey = signal<Survey | null>(null);

  /** Mobile only: the results sit behind a "See results" / "Close results" accordion. */
  resultsOpen = signal(true);

  /** Guards against a double submit while votes are being saved. */
  private saving = false;

  private selected = signal<Record<string, Set<string>>>({});
  private storedResults = signal<Record<string, number>>({});

  endsOn = computed(() => formatDate(this.survey()?.end_date ?? null));

  /** Ended surveys are read-only: they can be viewed but no longer voted on. */
  isEnded = computed(() => hasEnded(this.survey()?.end_date ?? null));

  hasVotes = computed(() =>
    (this.survey()?.content.questions ?? []).some((q) => this.questionTotal(q) > 0),
  );

  /** Every question needs at least one answer before the survey can be completed. */
  canComplete = computed(() => {
    const questions = this.survey()?.content.questions ?? [];
    return questions.length > 0 && questions.every((q) => (this.selected()[q.id]?.size ?? 0) > 0);
  });

  /** Exposed for the template to label options A, B, C … */
  readonly letter = letter;

  toggleResults(): void {
    this.resultsOpen.update((open) => !open);
  }

  isSelected(questionId: string, optionId: string): boolean {
    return this.selected()[questionId]?.has(optionId) ?? false;
  }

  /** Toggling the active option clears it, so a single choice can be unset again. */
  toggleOption(question: Question, optionId: string): void {
    const map = { ...this.selected() };
    const current = map[question.id];
    const isOn = current?.has(optionId) ?? false;
    if (question.allowMultiple) {
      const next = new Set(current);
      isOn ? next.delete(optionId) : next.add(optionId);
      map[question.id] = next;
    } else {
      map[question.id] = isOn ? new Set() : new Set([optionId]);
    }
    this.selected.set(map);
  }

  /** Stored votes plus the live preview of the not-yet-saved selection. */
  optionCount(question: Question, optionId: string): number {
    const stored = this.storedResults()[optionId] ?? 0;
    const preview = this.isSelected(question.id, optionId) ? 1 : 0;
    return stored + preview;
  }

  questionTotal(question: Question): number {
    return question.options.reduce((sum, o) => sum + this.optionCount(question, o.id), 0);
  }

  percent(question: Question, optionId: string): number {
    const total = this.questionTotal(question);
    return total === 0 ? 0 : Math.round((this.optionCount(question, optionId) / total) * 100);
  }

  /** Persist the votes, then return to the home page like the Figma flow. */
  async complete(): Promise<void> {
    if (this.saving || !this.canComplete()) {
      return;
    }
    this.saving = true;
    await this.saveVotes();
    await this.router.navigate(['/']);
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
