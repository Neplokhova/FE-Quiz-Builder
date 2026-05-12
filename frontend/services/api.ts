import { API_BASE_URL } from "@/services/constants";
import type { CreateQuizPayload, QuizDetails, QuizListItem } from "@/services/types";

type ApiErrorBody = {
  message?: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {})
    }
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as ApiErrorBody;
      if (data.message) {
        message = data.message;
      }
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getQuizzes(): Promise<QuizListItem[]> {
  return request<QuizListItem[]>("/quizzes");
}

export function getQuizById(id: string): Promise<QuizDetails> {
  return request<QuizDetails>(`/quizzes/${id}`);
}

export function createQuiz(payload: CreateQuizPayload): Promise<QuizDetails> {
  return request<QuizDetails>("/quizzes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteQuiz(id: string): Promise<void> {
  return request<void>(`/quizzes/${id}`, { method: "DELETE" });
}
