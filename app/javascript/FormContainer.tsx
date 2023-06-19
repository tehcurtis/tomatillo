import * as React from "react";
import { useState } from "react";
import QuestionForm from './QuestionForm';

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


export default FormContainer;