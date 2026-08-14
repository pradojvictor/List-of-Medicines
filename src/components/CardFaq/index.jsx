import { useEffect, useLayoutEffect, useRef } from 'react';
import './index.css';

// Precisa ser maior que a transição de max-height no CSS (400ms).
const SCROLL_DELAY_MS = 420;

export default function FaqCard({ id, title, isOpen, onToggle, children }) {
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const contentId = `faq-content-${id}`;

    // Síncrono de propósito: useLayoutEffect já roda depois do DOM atualizado e
    // antes da pintura, então scrollHeight aqui já é o valor final. O
    // requestAnimationFrame que havia antes adiava para depois da pintura — e,
    // se o frame atrasasse, o card ficava marcado como aberto com altura zero.
    useLayoutEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        el.style.maxHeight = isOpen ? `${el.scrollHeight}px` : '0px';
        el.style.opacity = isOpen ? '1' : '0';
    }, [isOpen, children]);

    // Ao abrir, traz o card para a área visível. Sem isso, abrir uma aba mais
    // abaixo empurra o conteúdo para fora da tela e o usuário precisa
    // descobrir sozinho que dá para rolar. 'nearest' só rola se necessário.
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            cardRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }, SCROLL_DELAY_MS);

        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <div ref={cardRef} className={`div-card ${isOpen ? 'is-open' : ''}`} translate='no'>
            {/* O clique fica só no cabeçalho: antes ele envolvia o card inteiro,
                então clicar numa resposta fechava a aba. */}
            <button
                type="button"
                className='card-title'
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => onToggle(isOpen ? null : id)}
            >
                <span>{title}</span>
                <svg className='card-chevron' xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M12 15.5 4.44 7.94 5.5 6.88 12 13.38l6.5-6.5 1.06 1.06z" />
                </svg>
            </button>

            {/* inert impede que o conteúdo fechado receba foco ou seja lido
                por leitor de tela — antes ele seguia acessível via Tab. */}
            <section id={contentId} ref={contentRef} className="content-dynamic" inert={!isOpen}>
                {children}
            </section>
        </div>
    );
}
