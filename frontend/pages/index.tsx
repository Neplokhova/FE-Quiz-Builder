import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/quizzes",
      permanent: false
    }
  };
};

export default function Home() {
  return null;
}
