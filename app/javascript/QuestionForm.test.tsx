import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import QuestionForm from "./QuestionForm";

test("renders with default question", () => {
  const defaultQuestionStr = "What is The Minimalist Entrepreneur about?";
  render(<QuestionForm defaultQuestionStr={defaultQuestionStr} />);
  expect(screen.getByDisplayValue(defaultQuestionStr)).toBeInTheDocument();
});
