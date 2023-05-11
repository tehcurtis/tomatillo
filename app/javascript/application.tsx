import * as React from "react";
import { createRoot } from "react-dom/client";
import { useState, useEffect, useRef } from "react";

// interfaces

interface FormProps {
  defaultQuestion: string;
}

// fns
const randomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const showText = (selector: string, text: string, index: number) => {
  const element = document.querySelector(selector);
  if (element && index < text.length) {
    const interval = randomInteger(30, 70);
    element.innerHTML += text[index];
    setTimeout(() => showText(selector, text, index + 1), interval);
  }
};

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

  const [showButtonsContainer, setShowButtonsContainer] = React.useState(true)
  const [answer, setAnswer] = React.useState(null)

  useEffect(() => {
    if (answer !== null) {
      const answerElement = document.querySelector("#answer");
      if (answerElement) {
        answerElement.innerHTML = "";
        setTimeout(() => {
          showText("#answer", answer, 0);
        }, 1200);
      }
    }
  }, [answer]);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentQuestionText = questionRef.current?.value;
    if (currentQuestionText?.trim() === "") {
      alert("Please ask a question!");
      return false;
    }

    // todo: do something if this isn't set
    const csrf_token = document?.querySelector("meta[name='csrf-token']")?.getAttribute("content") || "no_csrf";
    const requestOptions: RequestInit = {
      method: "POST",
      cache: "no-cache",
      headers: {
        'X-CSRF-Token': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'question=' + currentQuestionText
    }

    fetch("/questions/", requestOptions).then(response => response.json()).then(json => {
      setShowButtonsContainer(false);
      setAnswer(json.question.answer);
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

      { showButtonsContainer ?
        <div className="buttons">
          <button type="submit" id="ask-button">
            Ask question
          </button>
          <button id="lucky-button" style={{ background: "#eee", borderColor: "#eee", color: "#444" }}>
            I'm feeling lucky
          </button>
        </div>
       : null
      }

      <p id="answer-container" className={`hidden${answer !== null ? ' showing' : ''}`}>
        <strong>Answer: </strong>
        <span id="answer">{ answer !== null ? answer : '\u00A0' }</span>
        <button id="ask-another-button" style={{ display: answer !== null ? 'block' : 'none' }}>
          Ask another question
        </button>
      </p>

    </form>
  );
};

const container = document.getElementById("FormContainer")!;
const root = createRoot(container);
root.render(<FormContainer />)