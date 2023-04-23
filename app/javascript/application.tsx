import * as React from "react";
import { createRoot } from "react-dom/client";

// interfaces

interface FormProps {
  defaultQuestion: string;
}

// components

const FormContainer = () => {
  return (
    <>
      <p className="credits">
        This is an experiment in using AI to make my book's content more accessible. Ask a question and AI'll answer it in real-time:
      </p>
      <QuestionForm defaultQuestion="What is The Minimalist Entrepreneur about?" />
    </>)
  ;
};

const QuestionForm = ({ defaultQuestion }: FormProps) => {
  return (
    <form>
      <textarea name="question" id="question" defaultValue={defaultQuestion} />

      <div className="buttons">
        <button type="submit" id="ask-button">
          Ask question
        </button>
        <button id="lucky-button" style={{background: "#eee", borderColor: "#eee", color: "#444"}}>
          I'm feeling lucky
        </button>
      </div>

      <p id="answer-container" className="hidden">
        <strong>Answer:</strong>
        <span id="answer"></span>
        <button id="ask-another-button" style={{display: "none"}}>
          Ask another question
        </button>
      </p>

    </form>
  )
}

const container = document.getElementById("FormContainer")!;
const root = createRoot(container);
root.render(<FormContainer />)