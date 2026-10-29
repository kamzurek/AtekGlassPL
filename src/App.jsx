import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Offer from './components/Offer';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const SECTION_IDS = ['about', 'offer', 'gallery', 'contact'];

function readThemePreference() {
    try {
        const value = localStorage.getItem('atekglass-theme');
        return value === 'dark' || value === 'light' ? value : null;
    } catch {
        return null;
    }
}

export default function App() {
    const [activeSection, setActiveSection] = useState('');
    const [themePreference, setThemePreference] = useState(readThemePreference);
    const [systemDark, setSystemDark] = useState(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    const darkMode = themePreference ? themePreference === 'dark' : systemDark;

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const update = () => setSystemDark(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
        document.querySelector('meta[name="theme-color"]')?.setAttribute(
            'content', darkMode ? '#121619' : '#004466'
        );
        if (themePreference) {
            try {
                localStorage.setItem('atekglass-theme', themePreference);
            } catch {
                // Motyw działa także bez możliwości zapisu ustawienia.
            }
        }
    }, [darkMode, themePreference]);

    useEffect(() => {
        let frame = null;
        const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
        const navbar = document.querySelector('.navbar');
        const main = document.getElementById('main-content');

        const updateSection = () => {
            frame = null;
            const marker = (navbar?.getBoundingClientRect().height ?? 82) + 16;
            let current = '';
            for (const section of sections) {
                if (section.getBoundingClientRect().top <= marker) current = `#${section.id}`;
            }
            // Krótka końcowa sekcja też zostaje zaznaczona przy końcu strony.
            if (window.scrollY > 0 && window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 2) current = '#contact';
            setActiveSection(current);
        };
        const scheduleUpdate = () => {
            if (frame === null) frame = requestAnimationFrame(updateSection);
        };
        const observer = new ResizeObserver(scheduleUpdate);
        if (main) observer.observe(main);
        if (navbar) observer.observe(navbar);
        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);
        scheduleUpdate();

        // Kotwica w adresie może zostać przetworzona przed montażem Reacta.
        const initialTarget = [...sections, main].find(
            (element) => element && `#${element.id}` === window.location.hash
        );
        const anchorFrame = initialTarget
            ? requestAnimationFrame(() => initialTarget.scrollIntoView({ behavior: 'instant' }))
            : null;

        return () => {
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);
            observer.disconnect();
            if (frame !== null) cancelAnimationFrame(frame);
            if (anchorFrame !== null) cancelAnimationFrame(anchorFrame);
        };
    }, []);

    useEffect(() => {
        const main = document.getElementById('main-content');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        // Domyślnie treść jest widoczna. Brak obsługi API nie ukryje strony.
        if (!main || reducedMotion.matches || !('IntersectionObserver' in window)) return;

        const selector = '.about-panel, .card, .gallery-item, .contact-item';
        const registered = new Set();
        const reveal = (element) => {
            element.classList.add('is-revealed');
            observer.unobserve(element);
        };
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) reveal(entry.target);
            }
        }, { threshold: 0.08 });

        const register = (element, index) => {
            if (registered.has(element)) return;
            registered.add(element);
            // Elementy już widoczne oraz znajdujące się nad ekranem pozostają widoczne.
            // Zapobiega to miganiu przy powrocie na stronę i linkach do sekcji.
            if (reducedMotion.matches || element.getBoundingClientRect().top < window.innerHeight) return;
            element.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
            element.classList.add('reveal-pending');
            observer.observe(element);
        };
        const registerTree = (node) => {
            if (!(node instanceof Element)) return;
            if (node.matches(selector)) register(node, 0);
            node.querySelectorAll(selector).forEach(register);
        };
        main.querySelectorAll(selector).forEach(register);

        // Obejmuje także cztery kafelki dodawane po rozwinięciu oferty.
        const mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) mutation.addedNodes.forEach(registerTree);
        });
        mutationObserver.observe(main, { childList: true, subtree: true });

        const onMotionChange = () => {
            if (reducedMotion.matches) registered.forEach(reveal);
        };
        reducedMotion.addEventListener('change', onMotionChange);
        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
            reducedMotion.removeEventListener('change', onMotionChange);
            for (const element of registered) {
                element.classList.remove('reveal-pending', 'is-revealed');
                element.style.removeProperty('--reveal-delay');
            }
        };
    }, []);

    return (
        <div className="App">
            <a className="skip-link" href="#main-content">Przejdź do treści</a>
            <Navbar
                activeSection={activeSection}
                darkMode={darkMode}
                toggleDarkMode={() => setThemePreference(darkMode ? 'light' : 'dark')}
            />
            <main id="main-content" tabIndex={-1}>
                <Hero />
                <About />
                <Offer />
                <Gallery />
                <Contact />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
}
