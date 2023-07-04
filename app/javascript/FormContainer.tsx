import * as React from "react";
import { useState } from "react";
import { Question } from "./types";
import QuestionForm from './QuestionForm';

type FormContainerProps = {
  viewingQuestion?: Question;
  defaultQuestionStr:  "What is The Minimalist Entrepreneur about?";
};

const FormContainer = ({ defaultQuestionStr, viewingQuestion }: FormContainerProps) => {

  return (
    <>
      <p className="credits">
        This is an experiment in using AI to make my book's content more accessible. Ask a question and AI'll answer it in real-time:
      </p>
      <QuestionForm
        defaultQuestionStr={defaultQuestionStr}
        viewingQuestion={viewingQuestion}
      />
    </>
  );
};


export default FormContainer;
