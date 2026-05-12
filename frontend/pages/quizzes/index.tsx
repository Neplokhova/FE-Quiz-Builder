import Link from "next/link";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteQuiz, getQuizzes } from "@/services/api";
import type { QuizListItem } from "@/services/types";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<QuizListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadQuizzes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const items = await getQuizzes();
      setQuizzes(items);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Failed to load quizzes.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQuizzes();
  }, []);

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteQuiz(deleteTarget.id);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Failed to delete quiz.";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <Link href="/create" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
          New Quiz
        </Link>
      </div>

      {isLoading && <p className="text-sm text-slate-600">Loading quizzes...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!isLoading && !error && quizzes.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
          No quizzes yet. Create one to get started.
        </p>
      )}

      <ul className="space-y-3">
        {quizzes.map((quiz) => (
          <li
            key={quiz.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
          >
            <div>
              <h2 className="font-semibold">{quiz.title}</h2>
              <p className="text-sm text-slate-600">{quiz.questionsCount} questions</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/quizzes/${quiz.id}`}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
              >
                View
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(quiz)}
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete quiz?"
        message={`This action will remove "${deleteTarget?.title ?? ""}".`}
        confirmLabel="Delete"
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </section>
  );
}
