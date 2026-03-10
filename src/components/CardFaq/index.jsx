import { useEffect, useRef, useState } from 'react';
import './index.css';

export default function FaqCard({ title, children }) {

    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);
    const contentRef = useRef(null);

    // useEffect(() => {
    //     const el = contentRef.current;
    //     if (!el) return;
    //     if (isOpen) {
    //         el.style.maxHeight = el.scrollHeight + 'px';
    //         el.style.opacity = '1';
    //     } else {
    //         el.style.maxHeight = '0px';
    //         el.style.opacity = '0';
    //     }
    // }, [isOpen]);

useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const timeout = setTimeout(() => {
        if (isOpen) {
            el.style.maxHeight = `${el.scrollHeight}px`;
            el.style.opacity = '1';
        } else {
            el.style.maxHeight = '0px';
            el.style.opacity = '0';
        }
    }, 50);
    return () => clearTimeout(timeout);
}, [isOpen, children]);

    return (
        <div className='div-card'>
            <div className='card-title'>
                <p>{title}</p>
                <button
                    onClick={toggleOpen}
                    aria-expanded={isOpen}
                    aria-controls="faq-content"
                    className={isOpen ? 'btn open' : 'btn-content'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
                    </svg>
                </button>
            </div>
            <section id="faq-content" ref={contentRef} className="content-dynamic" aria-hidden={!isOpen}>{children}</section>
        </div>
    );
}
