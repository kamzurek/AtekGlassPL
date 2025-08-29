import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import '/src/App.css';
import 'aos/dist/aos.css';

export default function Gallery() {
    const [selectedIndex, setSelectedIndex] = useState(null);

    // Wszystkie obrazy
    const allImages = [
        { src: '/aneks.jpg',      alt: 'Szkło hartowane nad blatem kuchennym – Rybnik' },
        { src: '/galeria1.jpg',   alt: 'Realizacje Atek Glass – szkło na wymiar Rybnik' },
        { src: '/balustrada.jpg', alt: 'Balustrada szklana na schodach – Rybnik' },
        { src: '/lustro.jpg',     alt: 'Lustro na wymiar z polerowaną krawędzią – Rybnik' },
        { src: '/grafika2.jpg',   alt: 'Grafika na szkle do kuchni – Rybnik' },
        { src: '/kabina1.jpg',    alt: 'Kabina prysznicowa ze szkła hartowanego – Rybnik' },
        { src: '/wizytowka.jpg',  alt: 'Wizytówka firmowa Atek Glass – kontakt Rybnik' },
        { src: '/hartowane.jpg',  alt: 'Szkło hartowane 8–10 mm – realizacja Rybnik' },
        // nowa paczka: galery (1) .. galery (27)
        ...Array.from({ length: 27 }, (_, i) => ({
            src: `/galery (${i + 1}).JPG`,
            alt: `Szkło hartowane, kabiny, aneksy, na wymiar ${i + 9}`,
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

    // Nawigacja klawiaturą (tylko gdy lightbox otwarty)
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

    // --- SWIPE bez animacji: jeden gest = jeden slajd, z progiem zależnym od typu pointera ---
    const pointerIdRef = useRef(null);
    const pointerTypeRef = useRef('mouse');
    const startXRef = useRef(0);
    const startTRef = useRef(0);
    const handledRef = useRef(false);
    const lastNavAtRef = useRef(0);

    const getThresholds = () => {
        const isTouch =
            pointerTypeRef.current === 'touch' ||
            (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
        // Wyższa czułość na dotyku:
        return {
            distance: isTouch ? 20 : 40,
            velocity: isTouch ? 0.25 : 0.45,
            debounce: isTouch ? 140 : 220,
        };
    };

    const onPointerDown = (e) => {
        if (selectedIndex === null) return;

        e.stopPropagation();
        if (e.cancelable) e.preventDefault();

        const tgt = e.currentTarget;
        if (tgt && typeof tgt.setPointerCapture === 'function') {
            tgt.setPointerCapture(e.pointerId);
        }

        pointerIdRef.current = e.pointerId;
        pointerTypeRef.current = e.pointerType || 'mouse';
        startXRef.current = e.clientX;
        startTRef.current = performance.now();
        handledRef.current = false;
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

    const onPointerUp = (e) => {
        if (selectedIndex === null) return;
        e.stopPropagation();
        if (pointerIdRef.current !== e.pointerId) return;

        const now = performance.now();
        const { distance, velocity, debounce } = getThresholds();

        if (now - lastNavAtRef.current < debounce) {
            cleanupCapture(e);
            return;
        }

        const dx = e.clientX - startXRef.current;
        const dt = Math.max(1, now - startTRef.current);
        const v = Math.abs(dx / dt); // px/ms

        cleanupCapture(e);
        if (handledRef.current) return;

        const accept = Math.abs(dx) >= distance || v >= velocity;
        if (!accept) return;

        handledRef.current = true;
        lastNavAtRef.current = now;

        if (dx < 0) goNext(); else goPrev();
    };

    const onPointerCancel = (e) => {
        cleanupCapture(e);
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

                    {/* Bez animacji – sam gest i licznik */}
                    <div
                        className="lightbox-image-wrap"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={onPointerDown}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerCancel}
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