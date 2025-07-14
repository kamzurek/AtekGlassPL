import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Offer from './components/Offer';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
    const [activeSection, setActiveSection] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Dodaj klasę dark-mode do body zamiast do .App
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        const handleScroll = () => {
            const sections = ['#about', '#offer', '#gallery', '#contact'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.querySelector(section);
                if (
                    element &&
                    scrollPosition >= element.offsetTop - 100 &&
                    scrollPosition < element.offsetTop + element.offsetHeight - 100
                ) {
                    setActiveSection(section);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            // Usuń klasę przy czyszczeniu
            document.body.classList.remove('dark-mode');
        };
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <div className="App">
            <Navbar activeSection={activeSection} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Hero />
            <About />
            <Offer />
            <Gallery />
            <Contact />
            <Footer />
            <ScrollToTop />
        </div>
    );
}

export default App;