import React from 'react';
import './FloatingContact.css';

const FloatingContact = () => {
  const phoneNumber = "9845122100"; 
  const email = "aarnadestinations@gmail.com";
  const whatsappNumber = "9845122100";

  return (
    <div className="floating-contact">
      <a 
        href={`https://wa.me/${whatsappNumber}`} 
        className="floating-btn whatsapp" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
        <span className="tooltip">WhatsApp</span>
      </a>
      
      <a 
        href={`mailto:${email}`} 
        className="floating-btn email"
        aria-label="Send Email"
      >
        <i className="fa-solid fa-envelope"></i>
        <span className="tooltip">Email</span>
      </a>

      <a 
        href={`tel:+91${phoneNumber}`} 
        className="floating-btn call"
        aria-label="Call Us"
      >
        <i className="fa-solid fa-phone"></i>
        <span className="tooltip">Call Us</span>
      </a>
    </div>
  );
};

export default FloatingContact;
