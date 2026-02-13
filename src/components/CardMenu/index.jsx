import { useState } from "react";
import './index.css'

export default function CardMenu({ title, content }) {
    const [down, setDown] = useState(true);
    const downUp = () => setDown(!down);

    return (
        <div className={`card-${down}`}>
            <div className="text-container">
                <h3>{title}</h3>
                {!down && (
                    <div className="content-body">
                        <p>{content}</p>
                    </div>
                )}
            </div>

            <span onClick={downUp}>
                {down ? (
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
                    </svg>
                ) : (
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z" />
                    </svg>
                )}
            </span>
        </div>
    );
}