import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { QuestionReadonly } from "@/components/quiz/QuestionReadonly";
import { getQuizById } from "@/services/api";
import type { QuizDetails } from "@/services/types";

type PageProps = {
  quiz: QuizDetails | null;
  error: string | null;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const id = context.params?.id;
  if (typeof id !== "string") {
    return { props: { quiz: null, error: "Invalid quiz id." } };
  }
  try {
    const quiz = await getQuizById(id);
    return { props: { quiz, error: null } };
  } catch {
    return {
      props: {
        quiz: null,
        error: "Could not load this quiz right now."
      }
    };
  }
};

export default function QuizDetailsPage({
  quiz,
  error
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (error || !quiz) {
    return (
      <section className="space-y-3">
        <Link href="/quizzes" className="text-sm text-blue-600 hover:underline">
          Back to quizzes
        </Link>
        <p className="text-sm text-red-600">{error ?? "Quiz not found."}</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Link href="/quizzes" className="text-sm text-blue-600 hover:underline">
        Back to quizzes
      </Link>
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      <p className="text-sm text-slate-600">{quiz.questions.length} questions</p>

      <div className="space-y-3">
        {quiz.questions.map((question, index) => (
          <QuestionReadonly key={`${question.prompt}-${index}`} question={question} index={index} />
        ))}
      </div>
    </section>
  );
}
