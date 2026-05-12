import { useRouter } from "next/router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { createQuiz } from "@/services/api";
import type { CreateQuizPayload, QuizQuestion } from "@/services/types";
import { QuestionEditor, type QuizFormValues } from "@/components/quiz/QuestionEditor";

const DEFAULT_QUESTION: QuizFormValues["questions"][number] = {
  type: "boolean",
  prompt: "",
  answerBoolean: false,
  answerInput: "",
  options: [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]
};

function mapFormToPayload(values: QuizFormValues): CreateQuizPayload {
  const questions: QuizQuestion[] = values.questions.map((question) => {
    if (question.type === "boolean") {
      return {
        type: "boolean",
        prompt: question.prompt.trim(),
        answer: question.answerBoolean
      };
    }

    if (question.type === "input") {
      return {
        type: "input",
        prompt: question.prompt.trim(),
        answer: question.answerInput.trim()
      };
    }

    return {
      type: "checkbox",
      prompt: question.prompt.trim(),
      options: question.options.map((option) => ({
        text: option.text.trim(),
        isCorrect: option.isCorrect
      }))
    };
  });

  return {
    title: values.title.trim(),
    questions
  };
}

function validateQuestions(values: QuizFormValues): string | null {
  for (const question of values.questions) {
    if (question.type === "checkbox") {
      if (question.options.length < 2) {
        return "Checkbox questions must have at least 2 options.";
      }
      if (!question.options.some((option) => option.isCorrect)) {
        return "Checkbox questions must have at least 1 correct option.";
      }
      if (question.options.some((option) => option.text.trim().length === 0)) {
        return "All checkbox options must have text.";
      }
    }
  }
  return null;
}

export function QuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>("");
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<QuizFormValues>({
    defaultValues: {
      title: "",
      questions: [DEFAULT_QUESTION]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const onSubmit = async (values: QuizFormValues) => {
    setSubmitError("");
    const questionError = validateQuestions(values);
    if (questionError) {
      setSubmitError(questionError);
      return;
    }

    try {
      const payload = mapFormToPayload(values);
      await createQuiz(payload);
      await router.push("/quizzes");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create quiz right now.";
      setSubmitError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <label className="grid gap-1 text-sm">
          Quiz title
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            {...register("title", { required: "Quiz title is required." })}
          />
          <span className="text-xs text-red-600">{errors.title?.message}</span>
        </label>
      </div>

      {fields.map((field, index) => (
        <QuestionEditor
          key={field.id}
          index={index}
          control={control}
          register={register}
          watch={watch}
          errors={errors}
          onRemove={() => remove(index)}
        />
      ))}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => append(structuredClone(DEFAULT_QUESTION))}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
        >
          Add question
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Create quiz"}
        </button>
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
    </form>
  );
}
