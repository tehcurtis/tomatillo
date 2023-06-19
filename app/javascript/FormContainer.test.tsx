import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import FormContainer from "./FormContainer";

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
  render(<FormContainer />);
  expect(screen.getByDisplayValue(defaultQuestion)).toBeInTheDocument();
});

// test("lucky button populates a question", () => {
//   const { getByText } = render(<QuestionForm defaultQuestion="" />);
//   fireEvent.click(getByText(/I'm feeling lucky/i));
//   expect(screen.getByRole("textbox")).toHaveValue(expect.stringMatching(/What is a minimalist entrepreneur\?|What is your definition of community\?|How do I decide what kind of business I should start\?/));
// });

// test("form submission calls fetch and handles response properly", async () => {
//   const { getByText, getByRole } = render(<QuestionForm defaultQuestion="" />);
//   fireEvent.change(getByRole("textbox"), { target: { value: 'Test question' } });
//   fireEvent.click(getByText(/Ask question/i))
// });
