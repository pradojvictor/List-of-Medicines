import './index.css';

export function Detail({ label, value, isStatus }) {
    return (
        <div className='inf-detal'>
            <p><strong>{label}:</strong></p>
            <p className={isStatus ? (value === 'Disponível' ? 'ativo' : 'inativo') : ''}>
                {value}
            </p>
        </div>
    );
}