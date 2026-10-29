import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let frame = null;
        const update = () => {
            frame = null;
            setIsVisible(window.scrollY > 300);
        };
        const schedule = () => {
            if (frame === null) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', schedule, { passive: true });
        return () => {
            window.removeEventListener('scroll', schedule);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    const scrollToTop = () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById('main-content')?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
    };

    return isVisible ? (
        <div className="scroll-to-top">
            <button type="button" className="button" onClick={scrollToTop}
                aria-label="Przejdź na początek strony">
                <FaArrowUp aria-hidden="true" />
            </button>
        </div>
    ) : null;
}
