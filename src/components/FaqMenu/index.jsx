import FaqCard from '../CardFaq';
import CardSimple from '../CardSimple';
import './index.css';

export default function FaqMenu() {
    return (
        <div className='container-faq'>
            <FaqCard title="duvidas">
                <CardSimple title="Tem o medicamento?" question="Observe na lista de medicamentos ativos, todos os medicamentos listados la estão disponiveis atualmente" />
                <CardSimple title="Quando tempo ele ficara no estoque?" question="Não temos como saber por quanto tempo o medicamento ficará disponível no estoque." />
                <CardSimple title="A lista está atualizada?" question="A data da ultima atualização sempre ficara no topo da lista de medicamentos" />
                <CardSimple title="Não estou vendo meu medicamento!" question="Existe duas listas no site, uma com medicamentos disponiveis e outra com todos os medicamentos oferecidos pelo CAPS II LESTE" />
                <CardSimple title="Não vejo meu medicamento em nenhuma das listas!" question="Nesse caso o CAPS II LESTE não oferece o medicamento que você procura." />
                <CardSimple title="Como eu posso ver mais dados do medicamento?" question="Click em cima do medicamento na lista." />
            </FaqCard>
            <FaqCard title="como usar">
                <div className='btn-tutorial'>tutorial modal aqui</div>
            </FaqCard>
            <FaqCard title="autor">conteudo</FaqCard>
        </div>
    );
}
