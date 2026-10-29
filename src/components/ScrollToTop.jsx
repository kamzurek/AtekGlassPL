import { useEffect, useRef, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
        let frame = null;
        const update = () => {
            frame = null;
            const visible = window.scrollY > 300;
            // Nie zostawiaj fokusu na kontrolce, która właśnie się ukrywa.
            if (!visible && document.activeElement === buttonRef.current) {
                document.getElementById('main-content')?.focus({ preventScroll: true });
            }
            setIsVisible(visible);
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

    return (
        <div className={`scroll-to-top${isVisible ? ' is-visible' : ''}`}
            aria-hidden={!isVisible}>
            <button ref={buttonRef} type="button" className="button" onClick={scrollToTop}
                disabled={!isVisible} tabIndex={isVisible ? 0 : -1}
                aria-label="Przejdź na początek strony">
                <FaArrowUp aria-hidden="true" />
            </button>
        </div>
    );
}
