import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class VotesService {
  private supabase = inject(SupabaseService);

  /** One row per option instead of a counter column, so parallel votes cannot overwrite each other. */
  async castVotes(surveyId: string, questionId: string, optionIds: string[]): Promise<void> {
    const rows = optionIds.map((optionId) => ({
      survey_id: surveyId,
      question_id: questionId,
      option_id: optionId,
    }));

    const { error } = await this.supabase.client.from('votes').insert(rows);

    if (error) {
      throw error;
    }
  }

  /** Counted in code rather than SQL, since a GROUP BY would require a database function. */
  async getResults(surveyId: string): Promise<Record<string, number>> {
    const { data, error } = await this.supabase.client
      .from('votes')
      .select('option_id')
      .eq('survey_id', surveyId);

    if (error) {
      throw error;
    }
    return this.countByOption(data);
  }

  private countByOption(rows: { option_id: string }[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.option_id] = (counts[row.option_id] ?? 0) + 1;
    }
    return counts;
  }
}
