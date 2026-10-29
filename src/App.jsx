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
