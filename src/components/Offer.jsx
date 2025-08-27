// offer.jsx
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '/src/App.css';

export default function Offer() {
    const offers = [
        { title: 'Szkło okienne', icon: '🔍', description: 'Podstawowe szkło stosowane w oknach, zapewniające doskonałą izolację termiczną i akustyczną.' },
        { title: 'Lustra (srebrne, brąz, grafit)', icon: '🔍', description: 'Wysokiej jakości lustra do łazienek, salonów i dekoracji wnętrz, dostępne w kilku wykończeniach kolorystycznych.' },
        { title: 'Szkło żaroodporne', icon: '🔍', description: 'Odporne na wysoką temperaturę, idealne do kominków, pieców i urządzeń grzewczych.' },
        { title: 'Szkło hartowane', icon: '🔍', description: 'Wzmocnione termicznie, poddane procesowi hartowania, co czyni je bezpiecznym i odpornym na uderzenia.' },
        { title: 'Szkła kolorowe (lacobel, lacomat, decormat)', icon: '🔍', description: 'Barwione szkła dekoracyjne do mebli, ścianek działowych i elementów architektonicznych.' },
        { title: 'Szkło bezpieczne (VSG laminowane)', icon: '🔍', description: 'Wielowarstwowe szkło laminowane z folią, chroniące przed rozbiciem i zwiększające bezpieczeństwo.' },
        { title: 'Szkło z grafiką 3D (panele szklane)', icon: '🔍', description: 'Nowoczesne panele z grafiką UV, idealne jako szkło kuchenne czy dekoracyjne.' },
        { title: 'Balustrady szklane', icon: '🔍', description: 'Eleganckie balustrady ze szkła ESG (hartowane/laminowane) do balkonów, tarasów i wnętrz.' },
        { title: 'Kabiny prysznicowe', icon: '🔍', description: 'Gotowe i na wymiar kabiny ze szkła hartowanego.' },
        { title: 'Ściany szklane / biura', icon: '🔍', description: 'Przeszklone ściany działowe do biur i przestrzeni komercyjnych, zapewniające elegancję i przepływ światła.' },
        { title: 'Drzwi szklane', icon: '🔍', description: 'Szkło hartowane do drzwi wewnętrznych i zewnętrznych, z możliwością piaskowania i kolorowania.' },
        { title: 'Daszki szklane', icon: '🔍', description: 'Szklane daszki przeciwwiatrowe i przeciwdeszczowe nad wejściami do budynków.' },
        { title: 'Ogrody zimowe', icon: '🔍', description: 'Całoroczne konstrukcje ze szkła, łączące wnętrze z ogrodem, zapewniające izolację termiczną.' },
    ];

    const INITIAL_VISIBLE = 9;
    const [showAll, setShowAll] = useState(false);
    const [selected, setSelected] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // po rozwinięciu odśwież animacje nowo dodanych kafelków
    useEffect(() => {
        // AOS v2:
        if (typeof AOS.refreshHard === 'function') AOS.refreshHard();
        else if (typeof AOS.refresh === 'function') AOS.refresh();
    }, [showAll]);

    const openModal = (offer) => {
        setSelected(offer);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelected(null);
    };

    const visibleOffers = showAll ? offers : offers.slice(0, INITIAL_VISIBLE);
    const remaining = Math.max(offers.length - INITIAL_VISIBLE, 0);

    return (
        <section id="offer">
            <h2>Oferta</h2>

            <div
                className={`card-list offer-grid ${showAll ? '' : 'offer-grid--collapsed'}`}
                aria-expanded={showAll}
            >
                {visibleOffers.map((offer, idx) => (
                    <div
                        key={`${offer.title}-${idx}`}
                        className="card"
                        data-aos="fade-up"
                        data-aos-delay={(idx % 9) * 80}
                        onClick={() => openModal(offer)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openModal(offer)}
                    >
                        <div className="card-icon">{offer.icon}</div>
                        <h3>{offer.title}</h3>
                    </div>
                ))}
            </div>

            {offers.length > INITIAL_VISIBLE && (
                <div className="offer-toggle-wrap">
                    <button
                        type="button"
                        className="button offer-toggle"
                        onClick={() => setShowAll((s) => !s)}
                        aria-expanded={showAll}
                        aria-controls="offer"
                    >
                        {showAll ? 'Zwiń' : `Rozwiń ${remaining ? `(+${remaining})` : ''}`}
                    </button>
                </div>
            )}

            {modalOpen && selected && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal} aria-label="Zamknij modal">×</button>
                        <h3>{selected.title}</h3>
                        <p>{selected.description}</p>
                    </div>
                </div>
            )}
        </section>
    );
}