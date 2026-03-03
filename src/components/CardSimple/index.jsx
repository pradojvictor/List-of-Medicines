import './index.css';

export default function CardSimple({ title, question }) {
    return (
        <div className="div-simple">
            <div>
                <h4>{title}</h4>
                <p>{question}</p>
            </div>
        </div>
    )
}