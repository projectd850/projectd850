import React from "react";
import "./Marketplace.css";
import shop1 from "../assets/shop1.jpg";
import shop2 from "../assets/shop2.jpg";
import shop3 from "../assets/shop3.jpg";

const Marketplace = () => {
  const products = [
    { id: 1, title: "Golden Bridge", price: 29.99, image: shop1 },
    { id: 2, title: "Urban Blues", price: 24.99, image: shop2 },
    { id: 3, title: "Silent Morning", price: 34.99, image: shop3 },
  ];

  return (
    <main className="shop-section" aria-label="Shop section with photo prints for sale">
      <h1 className="shop-title">Prints for Sale</h1>
      <p className="shop-subtitle">Limited edition fine art prints, captured by Project Focus.</p>

      <div className="shop-grid">
        {products.map((item) => (
          <div key={item.id} className="shop-card">
            <div className="image-wrapper">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                width="300"
                height="250"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x250?text=Image+Unavailable";
                }}
              />
              <div className="overlay">
                <span>{item.title}</span>
              </div>
            </div>
            <p className="price">${item.price}</p>
            <button className="buy-btn">Buy Now</button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Marketplace;
