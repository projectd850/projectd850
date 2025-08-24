import React from "react";
import "./Contact.css";
import contactImg from "../assets/contact.jpg";

const Contact = () => {
  return (
    <main className="contact-section" aria-label="Contact section with image and form">
      <div className="contact-left">
        <div className="image-container">
          <img
            src={contactImg}
            alt="Contact visual"
            loading="lazy"
            decoding="async"
            width="600"
            height="800"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/600x800?text=Image+Unavailable";
            }}
          />
        </div>
      </div>

      <div className="contact-right">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-description">
          Interested in working together or purchasing prints? Send a message.
        </p>

        <form className="contact-form" aria-label="Contact form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            autoComplete="name"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            autoComplete="email"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
