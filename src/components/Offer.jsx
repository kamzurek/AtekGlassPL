import { useRef, useState } from 'react';

const OFFERS = [
        { title: 'Szkło okienne', description: 'Szkło do przeszkleń okiennych, dobierane do wymiarów i wymagań konkretnego zastosowania.' },
        { title: 'Lustra (srebrne, brąz, grafit)', description: 'Wysokiej jakości lustra do łazienek, salonów i dekoracji wnętrz, dostępne w kilku wykończeniach kolorystycznych.' },
        { title: 'Szkło żaroodporne', description: 'Odporne na wysoką temperaturę, idealne do kominków, pieców i urządzeń grzewczych.' },
        { title: 'Szkło hartowane', description: 'Szkło poddane hartowaniu, o zwiększonej wytrzymałości mechanicznej i odporności na różnice temperatur.' },
        { title: 'Szkła kolorowe (lacobel, lacomat, decormat)', description: 'Barwione szkła dekoracyjne do mebli, ścianek działowych i elementów architektonicznych.' },
        { title: 'Szkło bezpieczne (VSG laminowane)', description: 'Szkło laminowane z warstwą folii, która po pęknięciu pomaga utrzymać odłamki razem.' },
        { title: 'Szkło z grafiką 3D (panele szklane)', description: 'Nowoczesne panele z grafiką UV, idealne jako szkło kuchenne czy dekoracyjne.' },
        { title: 'Balustrady szklane', description: 'Balustrady szklane do balkonów, tarasów i wnętrz. Rodzaj szkła dobierany do konstrukcji i wymagań projektu.' },
        { title: 'Kabiny prysznicowe', description: 'Gotowe i na wymiar kabiny ze szkła hartowanego.' },
        { title: 'Ściany szklane / biura', description: 'Przeszklone ściany działowe do biur i przestrzeni komercyjnych, zapewniające elegancję i przepływ światła.' },
        { title: 'Drzwi szklane', description: 'Szkło hartowane do drzwi wewnętrznych i zewnętrznych, z możliwością piaskowania i kolorowania.' },
        { title: 'Daszki szklane', description: 'Szklane daszki przeciwwiatrowe i przeciwdeszczowe nad wejściami do budynków.' },
        { title: 'Ogrody zimowe', description: 'Całoroczne konstrukcje ze szkła, łączące wnętrze z ogrodem, zapewniające izolację termiczną.' },
    ];

const INITIAL_VISIBLE = 9;

export default function Offer() {
    const [showAll, setShowAll] = useState(false);
    const toggleRef = useRef(null);
    const visibleOffers = showAll ? OFFERS : OFFERS.slice(0, INITIAL_VISIBLE);
    const remaining = OFFERS.length - INITIAL_VISIBLE;

    const toggleOffers = () => {
        // Po zwinięciu przycisk przesuwa się w górę; pozostaje w widoku.
        if (showAll) {
            setShowAll(false);
            requestAnimationFrame(() => {
                toggleRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
            });
        } else {
            setShowAll(true);
        }
    };

    return (
        <section id="offer" aria-labelledby="offer-heading">
            <h2 id="offer-heading">Oferta</h2>
            <div id="offer-grid" className="card-list">
                {visibleOffers.map((offer) => (
                    <article key={offer.title} className="card">
                        <h3>{offer.title}</h3>
                        <p>{offer.description}</p>
                    </article>
                ))}
            </div>
            {remaining > 0 && (
                <div className="offer-toggle-wrap">
                    <button
                        ref={toggleRef}
                        type="button"
                        className="button offer-toggle"
                        onClick={toggleOffers}
                        aria-expanded={showAll}
                        aria-controls="offer-grid"
                    >
                        {showAll ? 'Pokaż mniej usług' : `Pokaż wszystkie usługi (+${remaining})`}
                    </button>
                </div>
            )}
        </section>
    );
}
