import { useEffect, useRef, useState } from 'react';

const IMAGES = [
        { src: '/aneks.jpg',      alt: 'Szkło hartowane nad blatem kuchennym – Rybnik' },
        { src: '/galeria1.jpg',   alt: 'Realizacje Atek Glass – szkło na wymiar Rybnik' },
        { src: '/balustrada.jpg', alt: 'Balustrada szklana na schodach – Rybnik' },
        { src: '/lustro.jpg',     alt: 'Lustro na wymiar z polerowaną krawędzią – Rybnik' },
        { src: '/grafika2.jpg',   alt: 'Grafika na szkle do kuchni – Rybnik' },
        { src: '/kabina1.jpg',    alt: 'Kabina prysznicowa ze szkła hartowanego – Rybnik' },
        { src: '/wizytowka.jpg',  alt: 'Wizytówka firmowa Atek Glass – kontakt Rybnik' },
        { src: '/hartowane.jpg',  alt: 'Szkło hartowane 8–10 mm – realizacja Rybnik' },
        ...Array.from({ length: 27 }, (_, i) => ({
            src: `/galery (${i + 1}).JPG`,
            alt: `Szkło hartowane, kabiny, aneksy, na wymiar ${i + 9}`,
        })),
    ];

const PREVIEW_COUNT = 7;

export default function Gallery() {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [failedSrc, setFailedSrc] = useState(null);
    const dialogRef = useRef(null);
    const isOpen = selectedIndex !== null;
    const selectedImage = isOpen ? IMAGES[selectedIndex] : null;
    const remaining = IMAGES.length - PREVIEW_COUNT;
    const previewImages = IMAGES.slice(0, PREVIEW_COUNT);

    useEffect(() => {
        if (!isOpen) return;
        const dialog = dialogRef.current;
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
                previousFocus.focus({ preventScroll: true });
            }
        };
    }, [isOpen]);

    const close = () => setSelectedIndex(null);
    const move = (direction) => setSelectedIndex((index) =>
        index === null ? null : (index + direction + IMAGES.length) % IMAGES.length
    );
    const open = (index) => {
        setFailedSrc(null);
        setSelectedIndex(index);
    };

    return (
        <section id="gallery" aria-labelledby="gallery-heading">
            <h2 id="gallery-heading">Galeria realizacji</h2>
            <div className="gallery">
                {previewImages.map((image, index) => (
                    <button key={image.src} type="button" className="gallery-item"
                        onClick={() => open(index)} aria-haspopup="dialog"
                        aria-label={`Powiększ: ${image.alt}`}>
                        <img src={image.src} alt={image.alt} loading="lazy"
                            decoding="async" draggable={false} />
                    </button>
                ))}
                {remaining > 0 && (
                    <button type="button" className="gallery-item gallery-item--more"
                        onClick={() => open(PREVIEW_COUNT)} aria-haspopup="dialog"
                        aria-label={`Zobacz pozostałe zdjęcia: ${remaining}`}>
                        <img src={IMAGES[PREVIEW_COUNT].src} alt="" loading="lazy"
                            decoding="async" draggable={false} />
                        <span className="overlay" aria-hidden="true">+{remaining}</span>
                    </button>
                )}
            </div>
            <dialog ref={dialogRef} className="lightbox"
                aria-labelledby="gallery-dialog-heading"
                onCancel={(event) => { event.preventDefault(); close(); }}
                onClick={(event) => {
                    if (event.target !== event.currentTarget) return;
                    const rect = event.currentTarget.getBoundingClientRect();
                    if (event.clientX < rect.left || event.clientX > rect.right ||
                        event.clientY < rect.top || event.clientY > rect.bottom) close();
                }}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                        event.preventDefault();
                        move(event.key === 'ArrowLeft' ? -1 : 1);
                    }
                }}>
                <div className="lightbox-header">
                    <h2 id="gallery-dialog-heading">Galeria realizacji</h2>
                    <button type="button" className="lightbox-control close-btn"
                        onClick={close} autoFocus aria-label="Zamknij galerię">×</button>
                </div>
                <button type="button" className="lightbox-control nav left"
                    onClick={() => move(-1)} aria-label="Poprzednie zdjęcie">‹</button>
                <div className="lightbox-image-wrap">
                    {selectedImage && (failedSrc === selectedImage.src ? (
                        <div className="image-error" role="status">
                            <p>Nie udało się wczytać zdjęcia.</p>
                            <button type="button" className="button"
                                onClick={() => setFailedSrc(null)}>Spróbuj ponownie</button>
                        </div>
                    ) : (
                        <img key={selectedImage.src} src={selectedImage.src}
                            alt={selectedImage.alt} decoding="async"
                            onError={() => setFailedSrc(selectedImage.src)} />
                    ))}
                </div>
                <button type="button" className="lightbox-control nav right"
                    onClick={() => move(1)} aria-label="Następne zdjęcie">›</button>
                <p className="lightbox-counter" role="status" aria-atomic="true">
                    {selectedImage && `Zdjęcie ${selectedIndex + 1} z ${IMAGES.length}. ${selectedImage.alt}`}
                </p>
            </dialog>
        </section>
    );
}
