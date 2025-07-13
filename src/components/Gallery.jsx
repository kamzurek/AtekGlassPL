import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Gallery() {
    const [selectedIndex, setSelectedIndex] = useState(null);

    // wszystkie obrazy
    const allImages = [
        { src: 'src/assets/aneks.jpg', alt: 'Szkło 1' },
        { src: 'src/assets/galeria1.jpg', alt: 'Szkło 2' },
        { src: 'src/assets/balustrada.jpg', alt: 'Szkło 3' },
        { src: 'src/assets/lustro.jpg', alt: 'Szkło 4' },
        { src: 'src/assets/grafika2.jpg', alt: 'Szkło 5' },
        { src: 'src/assets/kabina1.jpg', alt: 'Szkło 6' },
        { src: 'src/assets/wizytowka.jpg', alt: 'Szkło 7' },
        { src: 'src/assets/hartowane.jpg', alt: 'Szkło 8' },
        // kolejne obrazy... np. '/assets/inne.jpg'
    ];

    const previewCount = 7;
    const previewImages = allImages.slice(0, previewCount);
    const remainingCount = allImages.length - previewCount;

    const displayItems = [
        ...previewImages,
        { isMore: true, count: remainingCount }
    ];

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const prevImage = (e) => {
        e.stopPropagation();
        setSelectedIndex((i) => (i - 1 + allImages.length) % allImages.length);
    };
    const nextImage = (e) => {
        e.stopPropagation();
        setSelectedIndex((i) => (i + 1) % allImages.length);
    };

    return (
        <section id="gallery">
            <h2>Galeria</h2>
            <div className="gallery">
                {displayItems.map((item, idx) => (
                    <div
                        key={idx}
                        className="gallery-item"
                        onClick={() => {
                            if (item.isMore) setSelectedIndex(previewCount);
                            else setSelectedIndex(idx);
                        }}
                        data-aos="zoom-in"
                        data-aos-delay={idx * 50}
                    >
                        <img
                            src={
                                item.isMore
                                    ? previewImages[previewCount - 1].src
                                    : item.src
                            }
                            alt={item.isMore ? `+${item.count}` : item.alt}
                            className={item.isMore ? 'blurred' : ''}
                        />
                        <div className="overlay">
                            {item.isMore ? `+${item.count}` : ''}
                        </div>
                    </div>
                ))}
            </div>

            {selectedIndex !== null && (
                <div className="lightbox" onClick={() => setSelectedIndex(null)}>
                    <button className="nav left" onClick={prevImage}>&lsaquo;</button>
                    <img
                        src={allImages[selectedIndex].src}
                        alt={allImages[selectedIndex].alt}
                    />
                    <button className="nav right" onClick={nextImage}>&rsaquo;</button>
                    <button className="close-btn" onClick={() => setSelectedIndex(null)}>&times;</button>
                </div>
            )}
        </section>
    );
}