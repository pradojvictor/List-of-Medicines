import { useState, useRef, useLayoutEffect } from 'react';
import './index.css';

export default function MedicineCard({ med }) {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);

    const toggleCard = () => setIsOpen(!isOpen);

    useLayoutEffect(() => {
        const content = contentRef.current;
        if (!content) return;

        if (isOpen) {
            content.style.maxHeight = `${content.scrollHeight}px`;
            content.style.opacity = '1';
        } else {
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
        }
    }, [isOpen]);

    return (
        <div
            className={`card-medicines ${isOpen ? 'active-card' : ''}`}
            onClick={toggleCard}
            translate='no'
        >
            <p className='name'>{med.name}</p>
            <div ref={contentRef} className="inf-medicines-container">
                <div className='inf-medicines'>
                    <div className='inf-names'>
                        <p>{med.namefantasiaone}</p>
                        <p>{med.namefantasiatwo}</p>
                    </div>
                    <div className='inf-all'>
                        <Detail label="status" value={med.status} />
                        <Detail label="entrada" value={med.entrada} />
                        <Detail label="quantidade" value={med.quantidade} />
                        <Detail label="dosagem" value={med.dosagem} />
                        <Detail label="tipo" value={med.tipo} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-componente interno para organizar as linhas de detalhe
function Detail({ label, value }) {
    return (
        <div className='inf-detal'>
            <p><strong>{label}:</strong></p>
            <p>{value}</p>
        </div>
    );
}