export default function Hero() {
    return (
        <section className="hero" aria-labelledby="hero-heading">
            <div className="hero-content">
                <h1 id="hero-heading">Hurtownia Szkła ATEK-GLASS</h1>
                <p>Szkło na wymiar, lustra i kabiny prysznicowe.<br />
                    Szczerbice, Rybnik i okolice.</p>
                <div className="hero-buttons">
                    <a href="#offer" className="button">Sprawdź ofertę</a>
                    <a href="tel:+48731721706" className="button button--secondary">
                        Zadzwoń: 731 721 706
                    </a>
                </div>
            </div>
        </section>
    );
}
