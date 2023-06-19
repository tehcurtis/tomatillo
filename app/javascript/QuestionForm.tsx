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

const QuestionForm = ({ defaultQuestion }: FormProps) => {
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const askQuestionButtonRef = useRef<HTMLButtonElement>(null);

  const [showButtonsContainer, setShowButtonsContainer] = React.useState(true)
  const [answer, setAnswer] = React.useState(null)

  const handleLuckyButtonClick = () => {
    var options = [
      "What is a minimalist entrepreneur?",
      "What is your definition of community?",
      "How do I decide what kind of business I should start?"
    ],
      random = ~~(Math.random() * options.length);

    const questionElement = questionRef.current
    if (questionElement) {
      questionElement.value = options[random];
    };
  }

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

    const askQuestionButton = askQuestionButtonRef.current
    if (askQuestionButton) {
      askQuestionButton.textContent = "Asking...";
      askQuestionButton.disabled = true;
    }

    // TODO: do something if this isn't set
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
          <button type="submit" id="ask-button" ref={askQuestionButtonRef}>
            Ask question
          </button>
          <button id="lucky-button" style={{ background: "#eee", borderColor: "#eee", color: "#444" }} onClick={handleLuckyButtonClick}>
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

export default QuestionForm;