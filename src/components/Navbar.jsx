import React, { useState } from 'react';
import '/src/App.css';
import logo from '/public/logopng.png';
import { FaSun, FaMoon } from "react-icons/fa";
// Zaimportuj logo

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

    // Funkcja do przewijania na górę strony
    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <nav className="navbar">
            {/* Zastąpienie tekstu logo obrazkiem */}
            <a
                href="#"
                onClick={scrollToTop}
                className="logo-link"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none'
                }}
            >
                <img
                    src={logo}
                    alt="ATEK-GLASS Logo"
                    className="logo-img"
                    style={{
                        height: '50px', // Dostosuj wysokość według potrzeb
                        width: 'auto',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
            </a>

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

            <div className="theme-toggle-wrapper">
                <button
                    id="theme-toggle-btn"
                    type="button"
                    role="switch"
                    aria-checked={darkMode}
                    aria-label="Przełącz tryb jasny/ciemny"
                    onClick={toggleDarkMode}
                    className={`theme-toggle ${darkMode ? "is-dark" : "light"}`}
                >
                    <span className="tt-track">
                      <FaSun className="tt-icon sun" aria-hidden />
                      <FaMoon className="tt-icon moon" aria-hidden />
                      <span className="tt-thumb" />
                    </span>
                </button>
                <span className="theme-label">
                    Tryb: {darkMode ? "Ciemny" : "Jasny"}
                  </span>
            </div>

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