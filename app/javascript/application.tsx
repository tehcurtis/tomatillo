import * as React from 'react';
import { createRoot } from 'react-dom/client';
import FormContainer from './FormContainer';

const container = document.getElementById("FormContainer")!;
const root = createRoot(container);
root.render(<FormContainer />);