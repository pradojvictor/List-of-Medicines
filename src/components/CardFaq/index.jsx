import { useLayoutEffect, useRef, useState } from 'react';
import './index.css';

export default function FaqCard({ title, children }) {

    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);
    const contentRef = useRef(null);

useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
        if (isOpen) {
            el.style.maxHeight = `${el.scrollHeight}px`;
            el.style.opacity = '1';
        } else {
            el.style.maxHeight = '0px';
            el.style.opacity = '0';
        }
    };
    const frameId = requestAnimationFrame(measure);
    
    return () => cancelAnimationFrame(frameId);
}, [isOpen, children]);

    return (
        <div className='div-card' translate='no' onClick={toggleOpen}>
            <div className='card-title'>
                <p>{title}</p>
            </div>
            <section id="faq-content" ref={contentRef} className="content-dynamic" aria-hidden={!isOpen}>{children}</section>
        </div>
    );
}
