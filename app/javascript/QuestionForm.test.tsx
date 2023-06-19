import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import QuestionForm from "./QuestionForm";

const server = setupServer(
  rest.post("/questions/", (req, res, ctx) => {
    return res(ctx.json({ question: { answer: "Mocked answer" } }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders with default question", () => {
  const defaultQuestion = "What is The Minimalist Entrepreneur about?";
  render(<QuestionForm defaultQuestion={defaultQuestion} />);
  expect(screen.getByDisplayValue(defaultQuestion)).toBeInTheDocument();
});