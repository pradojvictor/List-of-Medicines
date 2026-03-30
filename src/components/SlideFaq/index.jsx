import { useRef, useState, useEffect } from "react";
import './index.css';


export default function SlideFaq({ children }) {
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Converte children para array para mapear os dots corretamente
    const childrenArray = Array.isArray(children) ? children : [children];

    const handleScrollUpdate = () => {
        if (sliderRef.current) {
            const { scrollLeft, offsetWidth } = sliderRef.current;
            // Arredonda a posição para o índice mais próximo
            const index = Math.round(scrollLeft / offsetWidth);
            setActiveIndex(index);
        }
    };

    const scrollToIndex = (index) => {
        if (sliderRef.current) {
            sliderRef.current.scrollTo({
                left: index * sliderRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }
    };

    const handleLeft = (e) => {
        if (e) e.preventDefault();
        scrollToIndex(activeIndex - 1);
    };

    const handleRight = (e) => {
        if (e) e.preventDefault();
        scrollToIndex(activeIndex + 1);
    };

    return (
      <div className="container-master-relative">
        
        {/* 1. Botões Laterais (Agora flutuando) */}
        <div className="controls">
            <button onClick={handleLeft}>&#10094;</button> {/* Ícone < */}
            <button onClick={handleRight}>&#10095;</button> {/* Ícone > */}
        </div>

        {/* 2. O Carrossel */}
        <div className="div-slide" ref={sliderRef} onScroll={handleScrollUpdate}>
            {children}
        </div>

        {/* 3. Os Dots (Já estão absolutos no código anterior) */}
        <div className="dots-container-absolute">
            {childrenArray.map((_, i) => (
                <div 
                    key={i} 
                    className={`dot ${i === activeIndex ? 'active' : ''}`}
                    onClick={() => scrollToIndex(i)}
                />
            ))}
        </div>
    </div>
    );
}