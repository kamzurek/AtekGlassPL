// gallery.jsx
import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import '/src/App.css';
import 'aos/dist/aos.css';

export default function Gallery() {
    const [selectedIndex, setSelectedIndex] = useState(null);

    // Wszystkie obrazy
    const allImages = [
        { src: '/aneks.jpg',       alt: 'Szkło 1' },
        { src: '/galeria1.jpg',    alt: 'Szkło 2' },
        { src: '/balustrada.jpg',  alt: 'Szkło 3' },
        { src: '/lustro.jpg',      alt: 'Szkło 4' },
        { src: '/grafika2.jpg',    alt: 'Szkło 5' },
        { src: '/kabina1.jpg',     alt: 'Szkło 6' },
        { src: '/wizytowka.jpg',   alt: 'Szkło 7' },
        { src: '/hartowane.jpg',   alt: 'Szkło 8' },
        // nowa paczka: galery (1) .. galery (27)
        ...Array.from({ length: 27 }, (_, i) => ({
            src: `/galery (${i + 1}).JPG`,
            alt: `Szkło ${i + 9}`,
        })),
    ];

    const previewCount = 7;
    const total = allImages.length;
    const remainingCount = Math.max(total - previewCount, 0);
    const previewImages = allImages.slice(0, previewCount);

    const displayItems =
        remainingCount > 0
            ? [...previewImages, { isMore: true, count: remainingCount }]
            : [...previewImages];

    const moreThumbSrc =
        total > previewCount
            ? allImages[previewCount].src
            : previewImages[previewCount - 1]?.src;

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // Nawigacja klawiaturą w lightboxie
    useEffect(() => {
        if (selectedIndex === null) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setSelectedIndex(null);
            if (e.key === 'ArrowLeft') setSelectedIndex((i) => (i - 1 + total) % total);
            if (e.key === 'ArrowRight') setSelectedIndex((i) => (i + 1) % total);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedIndex, total]);

    const openFrom = (idx) => setSelectedIndex(idx);
    const handleItemClick = (item, idx) => (item.isMore ? openFrom(previewCount) : openFrom(idx));

    // Zmiana slajdów
    const goPrev = () => setSelectedIndex((i) => (i - 1 + total) % total);
    const goNext = () => setSelectedIndex((i) => (i + 1) % total);
    const prevImage = (e) => { e.stopPropagation(); goPrev(); };
    const nextImage = (e) => { e.stopPropagation(); goNext(); };

    // --- SWIPE BEZ ANIMACJI: jeden gest = jeden slajd ---
    const pointerIdRef = useRef(null);      // aktywny pointer
    const startXRef = useRef(0);
    const startTRef = useRef(0);
    const handledRef = useRef(false);       // czy już obsłużono ten gest
    const lastNavAtRef = useRef(0);         // krótki debounce po nawigacji

    const distanceThreshold = 40;           // px
    const velocityThreshold = 0.45;         // ~450 px/s
    const debounceMs = 220;                 // minimalny odstęp między slajdami

    const onPointerDown = (e) => {
        // nie reaguj, jeśli lightbox zamknięty
        if (selectedIndex === null) return;

        e.stopPropagation();
        // Blokuj natywny drag obrazka i gesty przeglądarki
        if (e.cancelable) e.preventDefault();

        const tgt = e.currentTarget;
        if (tgt && typeof tgt.setPointerCapture === 'function') {
            tgt.setPointerCapture(e.pointerId);
        }

        pointerIdRef.current = e.pointerId;
        startXRef.current = e.clientX;
        startTRef.current = performance.now();
        handledRef.current = false;
    };

    const onPointerUp = (e) => {
        if (selectedIndex === null) return;
        e.stopPropagation();

        // tylko ten sam pointer
        if (pointerIdRef.current !== e.pointerId) return;

        const now = performance.now();
        if (now - lastNavAtRef.current < debounceMs) {
            // jeszcze „cooldown” po poprzednim slajdzie
            cleanupCapture(e);
            return;
        }

        // oblicz parametry gestu
        const dx = e.clientX - startXRef.current;
        const dt = Math.max(1, now - startTRef.current);
        const velocity = Math.abs(dx / dt); // px/ms

        // zwolnij capture
        cleanupCapture(e);

        if (handledRef.current) return; // ten gest już obsłużony (na wszelki wypadek)

        const accept = Math.abs(dx) >= distanceThreshold || velocity >= velocityThreshold;
        if (!accept) return; // zbyt mały/ wolny ruch — brak nawigacji

        handledRef.current = true;
        lastNavAtRef.current = now;

        if (dx < 0) goNext(); else goPrev();
    };

    const onPointerCancel = (e) => {
        // tylko sprzątamy; bez nawigacji
        cleanupCapture(e);
    };

    const cleanupCapture = (e) => {
        const tgt = e.currentTarget;
        if (
            tgt &&
            typeof tgt.releasePointerCapture === 'function' &&
            typeof tgt.hasPointerCapture === 'function' &&
            tgt.hasPointerCapture(e.pointerId)
        ) {
            tgt.releasePointerCapture(e.pointerId);
        }
        pointerIdRef.current = null;
    };

    return (
        <section id="gallery">
            <h2>Galeria</h2>

            <div className="gallery">
                {displayItems.map((item, idx) => {
                    const isMore = item.isMore === true;
                    const src = isMore ? moreThumbSrc : item.src;
                    const countText = isMore ? `+${remainingCount}` : '';

                    return (
                        <div
                            key={idx}
                            className="gallery-item"
                            onClick={() => handleItemClick(item, idx)}
                            data-aos="zoom-in"
                            data-aos-delay={idx * 50}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleItemClick(item, idx); }}
                            aria-label={isMore ? `Zobacz pozostałe ${remainingCount} zdjęcia` : item.alt}
                        >
                            <img
                                src={src}
                                alt={isMore ? `Pozostałe zdjęcia (${countText})` : item.alt}
                                className={isMore ? 'blurred' : ''}
                                draggable={false}
                            />
                            <div className={`overlay ${isMore ? 'overlay--visible' : ''}`}>
                                {countText}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedIndex !== null && (
                <div className="lightbox" onClick={() => setSelectedIndex(null)}>
                    <button className="nav left" onClick={prevImage} aria-label="Poprzednie zdjęcie">‹</button>

                    {/* Bez animacji – tylko gest i licznik */}
                    <div
                        className="lightbox-image-wrap"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={onPointerDown}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerCancel}
                        // Uwaga: NIE podpinać onPointerLeave pod onPointerUp — to wywoływało fałszywe „swipe”
                    >
                        <img
                            src={allImages[selectedIndex].src}
                            alt={allImages[selectedIndex].alt}
                            draggable={false}
                        />
                        <div className="lightbox-counter" aria-live="polite">
                            {selectedIndex + 1}/{total}
                        </div>
                    </div>

                    <button className="nav right" onClick={nextImage} aria-label="Następne zdjęcie">›</button>
                    <button className="close-btn" onClick={() => setSelectedIndex(null)} aria-label="Zamknij">×</button>
                </div>
            )}
        </section>
    );
}
