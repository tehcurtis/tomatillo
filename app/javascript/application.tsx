import { createRoot } from 'react-dom/client';
import FormContainer from './FormContainer';

const container = document.getElementById("CompContainer")!;
const root = createRoot(container);
root.render(<FormContainer />);