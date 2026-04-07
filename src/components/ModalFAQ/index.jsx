import { useState, useEffect } from 'react';
import './index.css';

export default function ModalFAQ() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animationDelay = 1000; 

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="modal-corner-container">
      <div className="modal-content">
        <h3>Dúvidas e suporte, aqui!</h3>
        <button className='btn-faq-span' onClick={() => setIsVisible(false)}>
          Entendi
        </button>
      </div>
    </div>
  );
};