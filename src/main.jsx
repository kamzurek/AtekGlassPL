import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Inicjalizacja AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
    duration: 800,
    once: true,
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)