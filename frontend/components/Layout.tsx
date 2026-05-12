import Head from "next/head";
import Link from "next/link";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Quiz Builder</title>
        <meta name="description" content="Frontend quiz builder" />
      </Head>
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl gap-4 px-6 py-4 text-sm font-medium">
          <Link href="/create" className="hover:text-blue-600">
            Create Quiz
          </Link>
          <Link href="/quizzes" className="hover:text-blue-600">
            Quizzes
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </>
  );
}
