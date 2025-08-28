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

    // Reset po zamknięciu
    useEffect(() => {
        if (selectedIndex === null) {
            setDragX(0);
            setAnimating(false);
            setDragging(false);
            slideDirRef.current = null;
            phaseRef.current = 'idle';
        }
    }, [selectedIndex]);

    const openFrom = (idx) => setSelectedIndex(idx);
    const handleItemClick = (item, idx) => (item.isMore ? openFrom(previewCount) : openFrom(idx));

    // Zmiana slajdów
    const goPrev = () => setSelectedIndex((i) => (i - 1 + total) % total);
    const goNext = () => setSelectedIndex((i) => (i + 1) % total);
    const prevImage = (e) => { e.stopPropagation(); goPrev(); };
    const nextImage = (e) => { e.stopPropagation(); goNext(); };

    // --- SWIPE (Pointer Events) ---
    const startXRef = useRef(0);
    const startTRef = useRef(0);          // czas startu (ms)
    const slideDirRef = useRef(null);     // 'left' | 'right' | null
    const phaseRef = useRef('idle');      // 'idle' | 'out' | 'in'

    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [animating, setAnimating] = useState(false);

    const onPointerDown = (e) => {
        e.stopPropagation();
        e.preventDefault(); // blokuje natywne drag img

        const tgt = e.currentTarget;
        if (tgt && typeof tgt.setPointerCapture === 'function') {
            tgt.setPointerCapture(e.pointerId);
        }

        startXRef.current = e.clientX;
        startTRef.current = performance.now();
        setDragging(true);
        setAnimating(false);
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
        const delta = e.clientX - startXRef.current;
        setDragX(delta);
    };

    const onPointerUp = (e) => {
        if (!dragging) return;
        e.stopPropagation();

        const tgt = e.currentTarget;
        if (
            tgt &&
            typeof tgt.releasePointerCapture === 'function' &&
            typeof tgt.hasPointerCapture === 'function' &&
            tgt.hasPointerCapture(e.pointerId)
        ) {
            tgt.releasePointerCapture(e.pointerId);
        }

        const dx = dragX;
        const dt = Math.max(1, performance.now() - startTRef.current); // ms
        const velocity = dx / dt; // px/ms

        setDragging(false);

        // Próg i flick velocity (bardziej wyrozumiałe na telefonach)
        const distanceThreshold = 40;
        const velocityThreshold = 0.45; // ~450 px/s

        const accept =
            Math.abs(dx) >= distanceThreshold || Math.abs(velocity) >= velocityThreshold;

        if (!accept) {
            // powrót do środka
            setAnimating(true);
            // rAF: upewnia, że transition się zastosuje
            requestAnimationFrame(() => setDragX(0));
            return;
        }

        // kierunek gestu (lewo = następne)
        const dir = dx < 0 ? 'left' : 'right';
        slideDirRef.current = dir;
        phaseRef.current = 'out';

        // WYJAZD obecnego slajdu w stronę gestu
        setAnimating(true);
        const outX = dir === 'left' ? -window.innerWidth : window.innerWidth;
        // rAF: wymuś start animacji (często kluczowe na mobile)
        requestAnimationFrame(() => setDragX(outX));
    };

    const onTransitionEnd = (e) => {
        // tylko transform na wrapperze
        if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;

        if (phaseRef.current === 'out' && slideDirRef.current) {
            // Zmień slajd
            const dir = slideDirRef.current;
            if (dir === 'left') goNext(); else goPrev();

            // TELEPORT nowego poza ekran PO PRZECIWNEJ stronie (bez animacji)
            setAnimating(false);
            setDragX(dir === 'left' ? window.innerWidth : -window.innerWidth);

            // Następny frame: włącz animację i wjedź do środka
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { // podwójny rAF — stabilniej na iOS
                    phaseRef.current = 'in';
                    setAnimating(true);
                    setDragX(0);
                });
            });
            return;
        }

        if (phaseRef.current === 'in' || animating) {
            // Zakończ wjazd / powrót
            phaseRef.current = 'idle';
            setAnimating(false);
            slideDirRef.current = null;
        }
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

                    {/* wrap: przesuwamy cały kontener (obraz + licznik) */}
                    <div
                        className={`lightbox-image-wrap ${animating ? 'is-animating' : ''} ${dragging ? 'is-dragging' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                        onPointerLeave={dragging ? onPointerUp : undefined}
                        onTransitionEnd={onTransitionEnd}
                        style={{
                            transform: `translateX(${dragX}px)`,
                            opacity: dragging ? Math.max(0.75, 1 - Math.min(Math.abs(dragX) / 900, 0.25)) : 1,
                        }}
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