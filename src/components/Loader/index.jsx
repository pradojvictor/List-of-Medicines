import { useEffect, useRef, useState } from 'react';
import { gifs } from '../../assets';
import './index.css';

// Tempo mínimo em tela para a animação das letras completar
// (12 letras x 60ms de stagger + 600ms da animação ~= 1.3s).
const MIN_VISIBLE_MS = 1400;

// Precisa casar com a duração da transição de .loader-finish no CSS.
const EXIT_MS = 700;

const CHARS = ['C', 'A', 'P', 'S', ' ', 'II', ' ', 'L', 'E', 'S', 'T', 'E'];

export default function Loader({ loading }) {
    const [mounted, setMounted] = useState(true);
    const [exiting, setExiting] = useState(false);
    const startedAt = useRef(null);

    useEffect(() => {
        if (loading) {
            startedAt.current = Date.now();
            return;
        }

        // Os dados já chegaram: só seguramos o loader pelo tempo que falta
        // da animação, nunca por um tempo fixo.
        const elapsed = startedAt.current ? Date.now() - startedAt.current : MIN_VISIBLE_MS;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

        const toExit = setTimeout(() => setExiting(true), remaining);
        const toUnmount = setTimeout(() => setMounted(false), remaining + EXIT_MS);

        return () => {
            clearTimeout(toExit);
            clearTimeout(toUnmount);
        };
    }, [loading]);

    if (!mounted) return null;

    return (
        <div
            className={`loader ${exiting ? 'loader-finish' : ''}`}
            role="status"
            aria-live="polite"
            aria-label="Carregando a lista de medicamentos"
        >
            <div className='div-inf-gif'>
                <img
                    className='git-img'
                    src={gifs.giftLoadPrincipal}
                    alt=""
                    aria-hidden="true"
                    fetchPriority="high"
                />
                <div className="loader-text" aria-hidden="true">
                    {CHARS.map((char, index) => (
                        char === ' '
                            ? <span key={index} className='space-char' />
                            : <span key={index} className="char" style={{ '--i': index }}>{char}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
