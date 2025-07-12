import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Gallery() {
    const [selectedImg, setSelectedImg] = useState(null);
    const images = [
        { src: "/assets/hero.jpg", alt: "Szkło 1" },
        { src: "/assets/hero.jpg", alt: "Szkło 2" },
        { src: "/assets/hero.jpg", alt: "Szkło 3" },
        { src: "/assets/hero.jpg", alt: "Szkło 4" },
        { src: "/assets/hero.jpg", alt: "Szkło 5" },
        { src: "/assets/hero.jpg", alt: "Szkło 6" }
    ];

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <section id="gallery">
            <h2>Galeria</h2>
            <div className="gallery">
                {images.map((img, index) => (
                    <div
                        className="gallery-item"
                        key={index}
                        onClick={() => setSelectedImg(img)}
                        data-aos="zoom-in"
                        data-aos-delay={index * 50}
                    >
                        <img src={img.src} alt={img.alt} />
                        <div className="overlay">+</div>
                    </div>
                ))}
            </div>

            {selectedImg && (
                <div className="lightbox" onClick={() => setSelectedImg(null)}>
                    <img src={selectedImg.src} alt={selectedImg.alt} />
                    <button className="close-btn">&times;</button>
                </div>
            )}
        </section>
    );
}