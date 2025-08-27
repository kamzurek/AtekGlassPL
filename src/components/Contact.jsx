import React from 'react';
import '/src/App.css'
import { FaFacebook, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

export default function Contact() {
    return (
        <section id="contact" className="contact-section">
            <h2>Kontakt</h2>
            <div className="contact-info">
                <div className="contact-item">
                    <div className="icon-circle"><FaMapMarkerAlt /></div>
                    <div className="contact-text">
                        <h3>Adres</h3>
                        <p>ul. Radoszowska 65a, 44-293 Szczerbice</p>
                    </div>
                </div>
                <div className="contact-item">
                    <div className="icon-circle" aria-hidden="true"><FaPhoneAlt /></div>
                    <div className="contact-text">
                        <h3>Telefon</h3>
                        <a
                            href="tel:+48731721706"
                            className="phone-link"
                            aria-label="Zadzwoń pod numer +48 731 721 706"
                        >
                            +48 731 721 706
                        </a>
                    </div>
                </div>
                <div className="contact-item">
                    <div className="icon-circle"><FaEnvelope /></div>
                    <div className="contact-text">
                        <h3>Email</h3>
                        <p>
                            <a href="mailto:atekglass1@gmail.com">
                                atekglass1@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
                <div className="contact-item">
                    <div className="icon-circle"><FaClock /></div>
                    <div className="contact-text">
                        <h3>Godziny otwarcia</h3>
                        <p>Pon-Pt: 7:00-15:00<br />Sobota: 9:00-13:00<br />Niedziela: Zamknięte</p>
                    </div>
                </div>
                <div className="contact-item">
                    <a
                        className="icon-circle fb-circle"
                        href="https://www.facebook.com/atekglass"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Odwiedź nas na Facebooku"
                    >
                        <FaFacebook />
                    </a>
                    <div className="contact-text">
                        <h3>Znajdź nas na</h3>
                        <p>
                            <a
                                href="https://www.facebook.com/atekglass"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-link"
                            >
                                Facebooku
                            </a>
                        </p>
                    </div>
                </div>

            </div>
            <div className="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.6249568098037!2d18.44650177681262!3d50.09330831301413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47114595c5820a6d%3A0xdce5a189090c559a!2sATEK-GLASS%20Hurtownia%20Szk%C5%82a%20Karol%20Dubaj!5e0!3m2!1spl!2spl!4v1752399159306!5m2!1spl!2spl">
                </iframe>
            </div>
        </section>
    );
}