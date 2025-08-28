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
            src: `/galery (${i + 1}).JPG`, // zwróć uwagę na wielkość liter na serwerze
            alt: `Szkło ${i + 9}`,
        })),
    ];

    const previewCount = 7; // ile pokazać „na liście”
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

    // Nawigacja klawiaturą (w lightboxie)
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

    // --- SWIPE bez animacji: traktujemy gest jak kliknięcie strzałki ---
    const startXRef = useRef(0);
    const startTRef = useRef(0);
    const hasCapturedRef = useRef(false);

    const onPointerDown = (e) => {
        e.stopPropagation();
        e.preventDefault(); // blokuje natywne przeciąganie obrazka

        const tgt = e.currentTarget;
        if (tgt && typeof tgt.setPointerCapture === 'function') {
            tgt.setPointerCapture(e.pointerId);
            hasCapturedRef.current = true;
        } else {
            hasCapturedRef.current = false;
        }

        startXRef.current = e.clientX;
        startTRef.current = performance.now();
    };

    const onPointerUp = (e) => {
        e.stopPropagation();

        const tgt = e.currentTarget;
        if (
            hasCapturedRef.current &&
            tgt &&
            typeof tgt.releasePointerCapture === 'function' &&
            typeof tgt.hasPointerCapture === 'function' &&
            tgt.hasPointerCapture(e.pointerId)
        ) {
            tgt.releasePointerCapture(e.pointerId);
        }

        const dx = e.clientX - startXRef.current;
        const dt = Math.max(1, performance.now() - startTRef.current);
        const velocity = Math.abs(dx / dt); // px/ms

        // progi: dystans albo szybki „flick”
        const distanceThreshold = 40;   // ~40 px
        const velocityThreshold = 0.45; // ~450 px/s

        if (Math.abs(dx) >= distanceThreshold || velocity >= velocityThreshold) {
            if (dx < 0) goNext(); else goPrev();
        }
        // jeśli ruch mały/powolny — nic nie rób (zostaje bieżące zdjęcie)
    };

    const onPointerCancel = onPointerUp;
    const onPointerLeave = onPointerUp;

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

                    {/* bez animacji: tylko nasłuch gestów i licznik */}
                    <div
                        className="lightbox-image-wrap"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={onPointerDown}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerCancel}
                        onPointerLeave={onPointerLeave}
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
