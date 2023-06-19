import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormContainer from "./FormContainer";

test("renders with default question", () => {
  const defaultQuestion = "What is The Minimalist Entrepreneur about?";
  render(<FormContainer />);
  expect(screen.getByDisplayValue(defaultQuestion)).toBeInTheDocument();
});