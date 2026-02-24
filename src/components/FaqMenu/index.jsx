import FaqCard from '../CardFaq';
import './index.css';

export default function FaqMenu() {
    return (
        <div className='container-faq'>
            <FaqCard title="duvidas">conteudo</FaqCard>
            <FaqCard title="como usar">conteudo</FaqCard>
            <FaqCard title="autor">conteudo</FaqCard>
        </div>
    );
}
