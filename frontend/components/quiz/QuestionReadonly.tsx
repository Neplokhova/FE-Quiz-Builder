import type { QuizQuestion } from "@/services/types";

type QuestionReadonlyProps = {
  question: QuizQuestion;
  index: number;
};

export function QuestionReadonly({ question, index }: QuestionReadonlyProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold">
        Q{index + 1}. {question.prompt}
      </h3>
      <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Type: {question.type}</p>

      {question.type === "boolean" && (
        <p className="mt-3 text-sm">
          Correct answer:{" "}
          <span className="font-semibold">{question.answer ? "True" : "False"}</span>
        </p>
      )}

      {question.type === "input" && (
        <p className="mt-3 text-sm">
          Accepted answer: <span className="font-semibold">{question.answer}</span>
        </p>
      )}

      {question.type === "checkbox" && (
        <ul className="mt-3 space-y-1 text-sm">
          {question.options.map((option, optionIndex) => (
            <li
              key={`${option.text}-${optionIndex}`}
              className={`rounded px-2 py-1 ${
                option.isCorrect ? "bg-emerald-100 text-emerald-900" : "bg-slate-100"
              }`}
            >
              {option.text}
              {option.isCorrect ? " (correct)" : ""}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
