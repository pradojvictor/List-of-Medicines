import React, { useState, useRef, useEffect, Children, cloneElement } from 'react';
import './index.css';

export default function Carousel({
    children,
    autoplay = true,
    autoplayInterval = 4000,
    showArrows = true,
    showDots = true,
    pauseOnHover = true,
    loop = true
}) {
    const slides = Children.toArray(children);
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const containerRef = useRef(null);
    const touchStartX = useRef(null);
    const touchDeltaX = useRef(0);
    const autoplayRef = useRef();

    useEffect(() => {
        autoplayRef.current = () => {
            setIndex(prev => {
                const next = prev + 1;
                if (next >= slides.length) return loop ? 0 : prev;
                return next;
            });
        };
    }, [slides.length, loop]);

    useEffect(() => {
        if (!isPlaying) return;
        const id = setInterval(() => autoplayRef.current(), autoplayInterval);
        return () => clearInterval(id);
    }, [isPlaying, autoplayInterval]);

    const goTo = (i) => {
        if (i < 0) return setIndex(loop ? slides.length - 1 : 0);
        if (i >= slides.length) return setIndex(loop ? 0 : slides.length - 1);
        setIndex(i);
    };
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    const handleMouseEnter = () => { if (pauseOnHover) setIsPlaying(false); };
    const handleMouseLeave = () => { if (pauseOnHover && autoplay) setIsPlaying(true); };

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        const el = containerRef.current;
        el && el.addEventListener('keydown', onKey);
        return () => el && el.removeEventListener('keydown', onKey);
    }, [index]);

    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
    };
    const onTouchMove = (e) => {
        if (!touchStartX.current) return;
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };
    const onTouchEnd = () => {
        const threshold = 50;
        if (touchDeltaX.current > threshold) prev();
        else if (touchDeltaX.current < -threshold) next();
        touchStartX.current = null;
        touchDeltaX.current = 0;
    };

    return (
        <div
            className="carousel"
            ref={containerRef}
            tabIndex={0}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carousel"
            aria-label="Galeria de imagens"
        >
            <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
                {slides.map((child, i) => (
                    <div
                        className="carousel-slide"
                        key={i}
                        aria-hidden={i !== index}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Slide ${i + 1} de ${slides.length}`}
                    >
                        {cloneElement(child)}
                    </div>
                ))}
            </div>

            {showArrows && (
                <>
                    <button className="carousel-arrow prev" onClick={prev} aria-label="Anterior">
                        <svg clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="m22 12.002c0-5.517-4.48-9.997-9.998-9.997-5.517 0-9.997 4.48-9.997 9.997 0 5.518 4.48 9.998 9.997 9.998 5.518 0 9.998-4.48 9.998-9.998zm-8.211-4.843c.141-.108.3-.157.456-.157.389 0 .755.306.755.749v8.501c0 .445-.367.75-.755.75-.157 0-.316-.05-.457-.159-1.554-1.203-4.199-3.252-5.498-4.258-.184-.142-.29-.36-.29-.592 0-.23.107-.449.291-.591z" fillRule="nonzero" />
                        </svg>
                    </button>
                    <button className="carousel-arrow next" onClick={next} aria-label="Próximo">
                        <svg clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="m2.009 12.002c0-5.517 4.48-9.997 9.998-9.997s9.998 4.48 9.998 9.997c0 5.518-4.48 9.998-9.998 9.998s-9.998-4.48-9.998-9.998zm8.211-4.843c-.141-.108-.3-.157-.456-.157-.389 0-.755.306-.755.749v8.501c0 .445.367.75.755.75.157 0 .316-.05.457-.159 1.554-1.203 4.199-3.252 5.498-4.258.184-.142.29-.36.29-.592 0-.23-.107-.449-.291-.591z" fillRule="nonzero" />
                        </svg>
                    </button>
                </>
            )}

            {showDots && (
                <div className="carousel-dots" role="tablist" aria-label="Navegação por slides">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className={`dot ${i === index ? 'active' : ''}`}
                            onClick={() => goTo(i)}
                            aria-label={`Ir para slide ${i + 1}`}
                            aria-selected={i === index}
                            role="tab"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
