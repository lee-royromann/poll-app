/** Editable shapes used while building a survey, before it is saved. */
export interface AnswerDraft {
  id: number;
  text: string;
}

export interface QuestionDraft {
  id: number;
  text: string;
  allowMultiple: boolean;
  answers: AnswerDraft[];
}

export function emptyQuestion(id: number): QuestionDraft {
  return { id, text: '', allowMultiple: false, answers: [{ id: 1, text: '' }, { id: 2, text: '' }] };
}
