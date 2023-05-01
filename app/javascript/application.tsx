import * as React from "react";
import { createRoot } from "react-dom/client";
import { useState, useEffect, useRef } from "react";

// interfaces

interface FormProps {
  defaultQuestion: string;
}

// components

const FormContainer = () => {
  const [defaultQuestion, setDefaultQuestion] = useState<string>();

  return (
    <>
      <p className="credits">
        This is an experiment in using AI to make my book's content more accessible. Ask a question and AI'll answer it in real-time:
      </p>
      <QuestionForm
        defaultQuestion="What is The Minimalist Entrepreneur about?"
      />
    </>
  );
};

const QuestionForm = ({ defaultQuestion }: FormProps) => {
  const questionRef = useRef<HTMLTextAreaElement>(null);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // todo: do something if this isn't set
    const csrf_token = document?.querySelector("meta[name='csrf-token']")?.getAttribute("content") || "no_csrf";
    const requestOptions: RequestInit = {
      method: "POST",
      cache: "no-cache",
      headers: {
        'X-CSRF-Token': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'question=' + questionRef.current?.value
    }

    fetch("/questions/", requestOptions)
      .then((response) => {
        // process response
      });
  };

  return (
    <form onSubmit={( event ) => onFormSubmit(event)}>
      <textarea
        id="question"
        ref={questionRef}
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