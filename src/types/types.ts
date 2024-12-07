export interface formType {
  form_title: string;
  questions: questionType[];
}
// Types for formQuestion
export interface questionType {
  position: number;
  category:
    | "short_answer"
    | "long_answer"
    | "single_select"
    | "number"
    | "url"
    | "date";
  options?: (string | undefined)[];
  title: undefined | string;
  helpText: undefined | string;
  required: boolean;
}
