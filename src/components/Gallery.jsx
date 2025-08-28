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

    const handleItemClick = (item, idx) => {
        if (item.isMore) openFrom(previewCount);
        else openFrom(idx);
    };

    // Proste funkcje zmiany slajdu (bez eventów), używane też przez „swipe”
    const goPrev = () => setSelectedIndex((i) => (i - 1 + total) % total);
    const goNext = () => setSelectedIndex((i) => (i + 1) % total);

    // Klik na strzałkach (zatrzymujemy propagację, by nie zamykać lightboxa)
    const prevImage = (e) => { e.stopPropagation(); goPrev(); };
    const nextImage = (e) => { e.stopPropagation(); goNext(); };

    // --- SWIPE: logika przeciągania palcem/myszą (Pointer Events) ---
    const startXRef = useRef(0);
    const [dragX, setDragX] = useState(0);         // aktualne przesunięcie (px)
    const [dragging, setDragging] = useState(false);
    const [animating, setAnimating] = useState(false);

    const thresholdPx = Math.min(Math.floor(window.innerWidth * 0.18), 120); // próg akceptacji gestu

    const onPointerDown = (e) => {
        e.stopPropagation();
        // blokujemy domyślne „przeciąganie obrazka”
        e.preventDefault();
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
        startXRef.current = e.clientX;
        setDragging(true);
        setAnimating(false);
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
        const delta = e.clientX - startXRef.current;
        setDragX(delta);
    };

    const animateTo = (x, cb, duration = 240) => {
        setAnimating(true);
        setDragX(x);
        window.setTimeout(() => {
            if (cb) cb();
        }, duration);
    };

    const onPointerUp = (e) => {
        if (!dragging) return;
        e.stopPropagation();
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
        const dx = dragX;
        setDragging(false);

        // próg akceptacji gestu
        if (Math.abs(dx) < thresholdPx) {
            setAnimating(true);
            setDragX(0);
            return window.setTimeout(() => setAnimating(false), 240);
        }

        // kierunek gestu: lewo = next, prawo = prev
        const dir = dx < 0 ? 'left' : 'right';
        const outX = dir === 'left' ? -window.innerWidth : window.innerWidth;

        // 1) Wyjedź obecnym slajdem w stronę gestu
        setAnimating(true);
        setDragX(outX);

        window.setTimeout(() => {
            // 2) Zmień slajd
            if (dir === 'left') goNext(); else goPrev();

            // 3) TELEPORT nowego slajdu poza ekran po PRZECIWNEJ stronie BEZ animacji
            // (dla swipe w LEWO wjeżdżamy z PRAWEJ -> +window.innerWidth)
            setAnimating(false);
            setDragX(dir === 'left' ? window.innerWidth : -window.innerWidth);

            // 4) W następnym frame włącz animację i jedź do środka
            requestAnimationFrame(() => {
                setAnimating(true);
                setDragX(0);
                // po dojechaniu wyłącz czysto pomocniczo "is-animating"
                window.setTimeout(() => setAnimating(false), 240);
            });
        }, 180); // czas wyjazdu starego slajdu (dopasuj do CSS)
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

                    {/* wrap: trzyma obraz i licznik; przesuwamy cały wrap */}
                    <div
                        className={`lightbox-image-wrap ${animating ? 'is-animating' : ''} ${dragging ? 'is-dragging' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
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