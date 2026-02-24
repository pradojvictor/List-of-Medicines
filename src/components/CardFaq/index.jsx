import { Children, useState } from 'react';
import './index.css';

export default function FaqCard({ title, children }) {

    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);
    return (
        <div className='div-card'>
            <div className='card-title'>
                <p>{title}</p>
                <button onClick={toggleOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
                    </svg>
                </button>
            </div>
            <section className={`${isOpen}-content`}>{children}</section>
        </div>
    );
}