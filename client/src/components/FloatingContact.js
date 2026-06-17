import React from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import './FloatingContact.css';

const FloatingContact = () => {
  const phoneNumber = "9845122100"; 
  const email = "destinations@aarna.net.in";
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
        <MessageCircle size={20} strokeWidth={2.1} aria-hidden="true" />
        <span className="tooltip">WhatsApp</span>
      </a>
      
      <a 
        href={`mailto:${email}`} 
        className="floating-btn email"
        aria-label="Send Email"
      >
        <Mail size={20} strokeWidth={2.1} aria-hidden="true" />
        <span className="tooltip">Email</span>
      </a>

      <a 
        href={`tel:+91${phoneNumber}`} 
        className="floating-btn call"
        aria-label="Call Us"
      >
        <Phone size={20} strokeWidth={2.1} aria-hidden="true" />
        <span className="tooltip">Call Us</span>
      </a>
    </div>
  );
};

export default FloatingContact;
