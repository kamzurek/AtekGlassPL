import { useEffect, useRef, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const LINKS = [
    { href: '#about', label: 'O nas' },
    { href: '#offer', label: 'Oferta' },
    { href: '#gallery', label: 'Galeria' },
    { href: '#contact', label: 'Kontakt' },
];

export default function Navbar({ activeSection, darkMode, toggleDarkMode }) {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef(null);
    const menuButtonRef = useRef(null);

    useEffect(() => {
        const navbar = navRef.current;
        const updateHeight = () => document.documentElement.style.setProperty(
            '--navbar-height', `${navbar.getBoundingClientRect().height}px`
        );
        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(navbar);
        const desktop = window.matchMedia('(min-width: 961px)');
        const closeOnDesktop = () => { if (desktop.matches) setIsOpen(false); };
        desktop.addEventListener('change', closeOnDesktop);
        return () => {
            observer.disconnect();
            desktop.removeEventListener('change', closeOnDesktop);
            document.documentElement.style.removeProperty('--navbar-height');
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                menuButtonRef.current?.focus();
            }
        };
        const onPointerDown = (event) => {
            if (!navRef.current?.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('pointerdown', onPointerDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointerdown', onPointerDown);
        };
    }, [isOpen]);

    const closeForNavigation = (event) => {
        // Przy zwykłej nawigacji przenieś fokus z zamykanego menu na cel linku.
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
            const target = document.getElementById(event.currentTarget.hash.slice(1));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
            setIsOpen(false);
        }
    };

    return (
        <nav ref={navRef} className="navbar" aria-label="Nawigacja główna"
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
            }}>
            <a href="#main-content" className="logo-link" onClick={closeForNavigation}
                aria-label="ATEK-GLASS — początek strony">
                <img src="/logopng.png" alt="ATEK-GLASS" className="logo-img" />
            </a>
            <button ref={menuButtonRef} type="button"
                className={`menu-toggle${isOpen ? ' open' : ''}`}
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
                aria-expanded={isOpen} aria-controls="main-navigation">
                <span /><span /><span />
            </button>
            <div id="main-navigation" className={`nav-links${isOpen ? ' open' : ''}`}>
                {LINKS.map(({ href, label }) => (
                    <a key={href} href={href} onClick={closeForNavigation}
                        className={activeSection === href ? 'active' : undefined}
                        aria-current={activeSection === href ? 'location' : undefined}>
                        {label}
                    </a>
                ))}
            </div>
            <div className="theme-toggle-wrapper">
                <button type="button" role="switch" aria-checked={darkMode}
                    aria-label="Tryb ciemny" onClick={toggleDarkMode}
                    className={`theme-toggle${darkMode ? ' is-dark' : ''}`}>
                    <span className="tt-track" aria-hidden="true">
                        <FaSun className="tt-icon sun" />
                        <FaMoon className="tt-icon moon" />
                        <span className="tt-thumb" />
                    </span>
                </button>
                <span className="theme-label" aria-hidden="true">
                    {darkMode ? 'Tryb ciemny' : 'Tryb jasny'}
                </span>
            </div>

        </nav>
    );
}
