import React, { useState } from 'react';

export default function Navbar({ activeSection, darkMode, toggleDarkMode }) {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        setIsOpen(false);
        const section = document.querySelector(sectionId);
        if (section) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({
                top: section.offsetTop - navbarHeight,
                behavior: 'smooth',
            });
        }
    };

    return (
        <nav className="navbar">
            <h2 className="logo">ATEK-GLASS</h2>

            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                <a
                    href="#about"
                    onClick={(e) => scrollToSection(e, '#about')}
                    className={activeSection === '#about' ? 'active' : ''}
                >
                    O nas
                </a>
                <a
                    href="#offer"
                    onClick={(e) => scrollToSection(e, '#offer')}
                    className={activeSection === '#offer' ? 'active' : ''}
                >
                    Oferta
                </a>
                <a
                    href="#gallery"
                    onClick={(e) => scrollToSection(e, '#gallery')}
                    className={activeSection === '#gallery' ? 'active' : ''}
                >
                    Galeria
                </a>
                <a
                    href="#contact"
                    onClick={(e) => scrollToSection(e, '#contact')}
                    className={activeSection === '#contact' ? 'active' : ''}
                >
                    Kontakt
                </a>
            </div>

            <button
                id="theme-toggle-btn"
                aria-label="Przełącz tryb jasny/ciemny"
                onClick={toggleDarkMode}
                className="theme-toggle-btn"
                type="button"
            >
                {darkMode ? '🌞' : '🌙'}
            </button>

            <button
                className={`menu-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
                type="button"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    );
}
