import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Offer() {
    const offers = [
        { title: 'Szkło typu float', icon: '🔍' },
        { title: 'Szyby zespolone', icon: '🔍' },
        { title: 'Szkło hartowane', icon: '🔍' },
        { title: 'Lustra', icon: '🔍' },
        { title: 'Szkło ornamentowe', icon: '🔍' },
        { title: 'Szyby antywłamaniowe', icon: '🔍' }
    ];

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <section id="offer">
            <h2>Oferta</h2>
            <div className="card-list">
                {offers.map((offer, index) => (
                    <div
                        className="card"
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="card-icon">{offer.icon}</div>
                        <h3>{offer.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}