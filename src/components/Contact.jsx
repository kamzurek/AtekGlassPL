export default function Contact() {
    return (
        <section id="contact">
            <h2>Kontakt</h2>
            <div className="contact-info">
                <div className="contact-item">
                    <div className="icon">📍</div>
                    <div>
                        <h3>Adres</h3>
                        <p>ul. Radoszowska 65a, 44-293 Szczerbice</p>
                    </div>
                </div>
                <div className="contact-item">
                    <div className="icon">📞</div>
                    <div>
                        <h3>Telefon</h3>
                        <p>+48 731 721 706</p>
                    </div>
                </div>
                <div className="contact-item">
                    <div className="icon">✉️</div>
                    <div>
                        <h3>Email</h3>
                        <p>atekglass1@gmail.com</p>
                    </div>
                </div>
                <div className="contact-item">
                    <div className="icon">⏰</div>
                    <div>
                        <h3>Godziny otwarcia</h3>
                        <p>Pon-Pt: 7:00-15:00</p>
                        <p>Sobota: 9:00-13:00</p>
                        <p>Niedziela: Zamknięte</p>
                    </div>
                </div>
            </div>
            <div className="map-container">
                <iframe
                    title="Lokalizacja"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5119.0565217461335!2d18.449077000000013!3d50.093305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47114595c5820a6d%3A0xdce5a189090c559a!2sATEK-GLASS%20Hurtownia%20Szk%C5%82a%20Karol%20Dubaj!5e0!3m2!1spl!2spl!4v1752320804897!5m2!1spl!2spl"
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </section>
    );
}