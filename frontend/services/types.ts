export type QuestionType = "boolean" | "input" | "checkbox";

export type QuizListItem = {
  id: string;
  title: string;
  questionsCount: number;
  createdAt?: string;
};

export type BooleanQuestion = {
  type: "boolean";
  prompt: string;
  answer: boolean;
};

export type InputQuestion = {
  type: "input";
  prompt: string;
  answer: string;
};

export type CheckboxOption = {
  text: string;
  isCorrect: boolean;
};

export type CheckboxQuestion = {
  type: "checkbox";
  prompt: string;
  options: CheckboxOption[];
};

export type QuizQuestion = BooleanQuestion | InputQuestion | CheckboxQuestion;

export type QuizDetails = {
  id: string;
  title: string;
  createdAt?: string;
  questions: QuizQuestion[];
};

export type CreateQuizPayload = {
  title: string;
  questions: QuizQuestion[];
};
