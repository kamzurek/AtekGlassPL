import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import '/src/App.css';
import 'aos/dist/aos.css';

export default function Gallery() {
    const [selectedIndex, setSelectedIndex] = useState(null);

    // Wszystkie obrazy (dodawaj kolejne wpisy do tej tablicy)
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

    // kafelek „+N” dokładamy tylko, jeśli są jeszcze zdjęcia
    const displayItems = remainingCount > 0
        ? [...previewImages, { isMore: true, count: remainingCount }]
        : [...previewImages];

    // miniatura dla kafelka „+N” – pierwsze ukryte zdjęcie (fallback: ostatnie z podglądu)
    const moreThumbSrc =
        total > previewCount
            ? allImages[previewCount].src
            : previewImages[previewCount - 1]?.src;

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const openFrom = (idx) => setSelectedIndex(idx);

    const handleItemClick = (item, idx) => {
        if (item.isMore) openFrom(previewCount);  // otwórz od 1. ukrytego
        else openFrom(idx);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setSelectedIndex((i) => (i - 1 + total) % total);
    };
    const nextImage = (e) => {
        e.stopPropagation();
        setSelectedIndex((i) => (i + 1) % total);
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
                    <img
                        src={allImages[selectedIndex].src}
                        alt={allImages[selectedIndex].alt}
                    />
                    <button className="nav right" onClick={nextImage} aria-label="Następne zdjęcie">›</button>
                    <button className="close-btn" onClick={() => setSelectedIndex(null)} aria-label="Zamknij">×</button>
                </div>
            )}
        </section>
    );
}
