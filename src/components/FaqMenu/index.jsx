import { Children, useState } from 'react';
import FaqCard from '../CardFaq';
import CardSimple from '../CardSimple';
import './index.css';
import Link from '../Link';

export default function FaqMenu({ onClosed, classfaq, Children, emailLink }) {

    const [isActive, setIsActive] = useState(false);

    return (
        <div className='container-faq'>
            <span className={classfaq} onClick={onClosed}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z" />
                </svg>
            </span>
            <FaqCard title="duvidas">
                <div className='div-duvidas'>
                <CardSimple title="Tem o medicamento?" question="Observe na lista de medicamentos ativos que todos ali listados estão disponíveis atualmente." />
                <CardSimple title="Quanto tempo ele ficará no estoque?" question="Não temos como saber por quanto tempo o medicamento ficará disponível no estoque." />
                <CardSimple title="A lista está atualizada?" question="A data da última atualização sempre ficará no topo da lista de medicamentos." />
                <CardSimple title="Não estou vendo meu medicamento!" question="Existem duas listas no site, uma com medicamentos disponíveis e outra com todos os medicamentos oferecidos pelo CAPS II LESTE." />
                <CardSimple title="Não vejo meu medicamento em nenhuma das listas!" question="Nesse caso, o CAPS II LESTE não oferece o medicamento que você procura." />
                <CardSimple title="Como eu posso ver mais informações do medicamento?" question="Clique em cima do medicamento na lista." />
                </div>
            </FaqCard>
            <FaqCard title="como usar">
                <div className='div-tutorial'>
                    <button className={`${isActive ? 'active' : 'inactive'}-tutorial`} onClick={Children}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25s-.559 1.25-1.25 1.25zm1.961-5.928c-.904.975-.947 1.514-.935 2.178h-2.005c-.007-1.475.02-2.125 1.431-3.468.573-.544 1.025-.975.962-1.821-.058-.805-.73-1.226-1.365-1.226-.709 0-1.538.527-1.538 2.013h-2.01c0-2.4 1.409-3.95 3.59-3.95 1.036 0 1.942.339 2.55.955.57.578.865 1.372.854 2.298-.016 1.383-.857 2.291-1.534 3.021z" />
                        </svg>
                    </button>
                </div>
            </FaqCard>
            <FaqCard title="autor">
                <div className='div-autor'>
                    <p>Desenvolvido por SAME CAPS II LESTE TERESINA-PI</p>
                    <p>Suporte: <Link className='faq-email' href={emailLink}>Enviar E-mail</Link></p>
                </div>
            </FaqCard>
        </div>
    );
}
