import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { applyTheme, getPhoneBridgeMeta } from './lib/phoneBridge';
import './styles.css';

const meta = getPhoneBridgeMeta();
applyTheme(meta.theme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
