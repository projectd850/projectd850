import React, { useState } from "react";
import "./Contact.css";
import contactImg from "../assets/contact.jpg";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);

  // (opciono) stub handler; možeš kasnije zameniti fetch-om ka backendu
  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: pozovi /api/contact ili email service
    setTimeout(() => setSubmitting(false), 1200);
  };

  return (
    <main className="contact" aria-label="Contact section">
      {/* Slika (dekorativna) */}
      <section className="contact__media" aria-hidden="true">
        <div className="contact__imageWrap">
          <img
            src={contactImg}
            alt=""
            loading="lazy"
            decoding="async"
            sizes="(max-width: 880px) 100vw, 50vw"
            width="1200"
            height="1600"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://via.placeholder.com/1200x1600?text=Image+Unavailable";
            }}
          />
        </div>
      </section>

      {/* Forma */}
      <section className="contact__formWrap" aria-label="Contact form">
        <h1 className="contact__title">Get in Touch</h1>
        <p className="contact__desc">
          Interested in working together or purchasing prints? Send a message.
        </p>

        <form className="contact__form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="name" className="vh">Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              autoComplete="name"
              required
              minLength={2}
            />
          </div>

          <div className="field">
            <label htmlFor="email" className="vh">Your Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              autoComplete="email"
              inputMode="email"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="message" className="vh">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              rows={6}
              required
              minLength={10}
            />
            <small className="help">Tell me a bit about the project, date, and location.</small>
          </div>

          <button type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Contact;
