import * as React from "react";
import { createRoot } from "react-dom/client";
import { useState, useEffect, useRef } from "react";

// interfaces

interface FormProps {
  defaultQuestion: string;
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

// components

const FormContainer = () => {
  const [defaultQuestion, setDefaultQuestion] = useState<string>();

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const csrf_token = document?.querySelector("meta[name='csrf-token']")?.getAttribute("content") || "no_csrf";
    fetch("/questions/", {
      method: "POST",
      cache: "no-cache",
      headers: {
        'X-CSRF-Token': csrf_token,
    }, })
      .then((response) => {
        // process response
      });

  };

  return (
    <>
      <p className="credits">
        This is an experiment in using AI to make my book's content more accessible. Ask a question and AI'll answer it in real-time:
      </p>
      <QuestionForm
        defaultQuestion="What is The Minimalist Entrepreneur about?"
        onFormSubmit={onFormSubmit}
      />
    </>
  );
};

const QuestionForm = ({ defaultQuestion, onFormSubmit }: FormProps) => {
  return (
    <form onSubmit={( event ) => onFormSubmit(event)}>
      <textarea
        id="question"
        name="question"
        defaultValue={ defaultQuestion }
      />

      <div className="buttons">
        <button type="submit" id="ask-button">
          Ask question
        </button>
        <button id="lucky-button" style={{ background: "#eee", borderColor: "#eee", color: "#444" }}>
          I'm feeling lucky
        </button>
      </div>

      <p id="answer-container" className="hidden">
        <strong>Answer:</strong>
        <span id="answer">&nbsp;</span>
        <button id="ask-another-button" style={{ display: "none" }}>
          Ask another question
        </button>
      </p>
    </form>
  );
};

const container = document.getElementById("FormContainer")!;
const root = createRoot(container);
root.render(<FormContainer />)