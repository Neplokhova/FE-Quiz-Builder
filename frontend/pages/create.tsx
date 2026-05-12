import { QuizForm } from "@/components/quiz/QuizForm";

export default function CreateQuizPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Create Quiz</h1>
      <p className="text-sm text-slate-600">
        Build a quiz with boolean, input, and checkbox questions.
      </p>
      <QuizForm />
    </section>
  );
}
