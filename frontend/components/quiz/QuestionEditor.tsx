import { useFieldArray, type Control, type FieldErrors, type UseFormRegister, type UseFormWatch } from "react-hook-form";

export type QuizFormValues = {
  title: string;
  questions: Array<{
    type: "boolean" | "input" | "checkbox";
    prompt: string;
    answerBoolean: boolean;
    answerInput: string;
    options: Array<{ text: string; isCorrect: boolean }>;
  }>;
};

type QuestionEditorProps = {
  index: number;
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  watch: UseFormWatch<QuizFormValues>;
  errors: FieldErrors<QuizFormValues>;
  onRemove: () => void;
};

export function QuestionEditor({
  index,
  control,
  register,
  watch,
  errors,
  onRemove
}: QuestionEditorProps) {
  const optionsPath = `questions.${index}.options` as const;
  const questionType = watch(`questions.${index}.type`);
  const currentOptions = watch(optionsPath) ?? [];

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption
  } = useFieldArray({
    control,
    name: optionsPath
  });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Question {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
        >
          Remove
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        <label className="grid gap-1 text-sm">
          Prompt
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            {...register(`questions.${index}.prompt`, { required: "Prompt is required." })}
          />
          <span className="text-xs text-red-600">{errors.questions?.[index]?.prompt?.message}</span>
        </label>

        <label className="grid gap-1 text-sm">
          Type
          <select
            className="rounded-md border border-slate-300 px-3 py-2"
            {...register(`questions.${index}.type`)}
          >
            <option value="boolean">Boolean</option>
            <option value="input">Input</option>
            <option value="checkbox">Checkbox</option>
          </select>
        </label>
      </div>

      {questionType === "boolean" && (
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" {...register(`questions.${index}.answerBoolean`)} />
          Correct answer is true
        </label>
      )}

      {questionType === "input" && (
        <label className="mt-3 grid gap-1 text-sm">
          Correct text answer
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            {...register(`questions.${index}.answerInput`, {
              validate: (value) => {
                if (questionType !== "input") return true;
                return value.trim().length > 0 || "Text answer is required.";
              }
            })}
          />
          <span className="text-xs text-red-600">
            {errors.questions?.[index]?.answerInput?.message}
          </span>
        </label>
      )}

      {questionType === "checkbox" && (
        <div className="mt-3 rounded-md border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Options</h4>
            <button
              type="button"
              onClick={() => appendOption({ text: "", isCorrect: false })}
              className="rounded-md bg-slate-900 px-3 py-1 text-xs text-white hover:bg-slate-700"
            >
              Add option
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {optionFields.map((option, optionIndex) => (
              <div key={option.id} className="grid gap-2 rounded border border-slate-200 p-2">
                <label className="grid gap-1 text-sm">
                  Option text
                  <input
                    className="rounded-md border border-slate-300 px-3 py-2"
                    {...register(`questions.${index}.options.${optionIndex}.text`, {
                      validate: (value) => {
                        if (questionType !== "checkbox") return true;
                        return value.trim().length > 0 || "Option text is required.";
                      }
                    })}
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...register(`questions.${index}.options.${optionIndex}.isCorrect`)}
                  />
                  Mark as correct
                </label>
                <button
                  type="button"
                  onClick={() => removeOption(optionIndex)}
                  className="justify-self-start rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                >
                  Remove option
                </button>
              </div>
            ))}
          </div>

          <p className="mt-2 text-xs text-red-600">
            {questionType === "checkbox" && currentOptions.length < 2
              ? "Checkbox questions need at least 2 options."
              : ""}
          </p>
        </div>
      )}
    </section>
  );
}
