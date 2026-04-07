import { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { gifs } from './assets';
import FaqMenu from './components/FaqMenu';
import MedicineCard from './components/MedicineCard';
import { isElementScrollable } from './utils/domUtils';
import Link from './components/Link';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import './App.css'

function App() {
  const [medicines, setMedicines] = useState([]);
  const [hour, setHour] = useState();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [showallMedicines, setShowAllMedicines] = useState(true);
  const [search, setSearch] = useState('');

  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const [toggle, setToggle] = useState(true);

  const [isActive, setIsActive] = useState(false)
  const onMenu = () => setIsActive(!isActive);
  const listRef = useRef(null);
  const [listScrollable, setListScrollable] = useState(false);

  const numero = '5586994478042';
  const mensagem = encodeURIComponent('Olá, gostaria de obter informações sobre os medicamentos disponíveis no site do CAPS II Leste. Poderiam me ajudar?');
  const url = `https://wa.me/${numero}?text=${mensagem}`;

  const myEmail = "caps2leste@hotmail.com"
  const SameEmail = "caps2lestesame@gmail.com"

  const urlFormated = (email) => `mailto:${email}`;


  const validarLink = (url) => {
    const protocolosSeguros = ['http:', 'https:', 'mailto:', 'tel:'];
    try {
      const parsedUrl = new URL(url, window.location.origin);
      return protocolosSeguros.includes(parsedUrl.protocol) ? url : '#';
    } catch {
      return '#';
    }
  };

  const handleStartGuide = () => {
    onMenu(false);

    setTimeout(() => {
      introJs.tour().setOptions({
        steps: [
          {
            element: '.div-header',
            intro: 'aqui você faz a busca dos medicamentos por nome.',
            position: 'bottom',
            step: 1
          },
          {
            element: '.inf-text',
            intro: 'Aperte o botão para mostrar os medicamentos ativos ou todos os medicamentos disponíveis no CAPS II LESTE de Teresina, Piauí.',
            position: 'bottom',
            step: 2
          },
          {
            element: '.list-container',
            intro: 'Aqui mostra todas as informações disponíveis dos medicamentos.',
            position: 'floating',
            scrollTo: 'tooltip',
            step: 3
          },
          {
            element: '.div-update',
            intro: 'Aqui você acompanha a última data atualizada dos medicamentos disponíveis.',
            position: 'bottom',
            step: 4
          },
          {
            element: '.list-container',
            intro: 'Aqui você tem a lista de medicamentos; clique sobre o nome de algum e veja suas informações, como disponibilidade, tipo e dosagem.',
            position: 'top',
            scrollTo: 'tooltip',
            step: 5
          },
          {
            element: '#span-info',
            intro: 'Aperte o botão em caso de dúvidas e suporte.',
            position: 'top',
            scrollTo: 'tooltip',
            step: 6
          },
          {
            element: '.div-footer',
            intro: 'Informações gerais sobre o CAPS II LESTE TERESINA - PI.',
            position: 'floating',
            step: 7
          },
          {
            element: '.inf-footer',
            intro: 'Aqui você tem as informações sobre localização, número e e-mail do CAPS II Leste, Teresina, PI.',
            position: 'top',
            step: 8
          },
          {
            element: '#link-localization',
            intro: 'Localização do CAPS II LESTE, TERESINA, PI.',
            position: 'top',
            step: 9
          },
          {
            element: '#link-fone',
            intro: 'Clique sobre o ícone para ser redirecionado para o WhatsApp do CAPS II LESTE, TERESINA, PI.',
            position: 'top',
            step: 10
          },
          {
            element: '#link-email',
            intro: 'Clique sobre o ícone para ser redirecionado para o e-mail do CAPS II LESTE, TERESINA, PI.',
            position: 'top',
            step: 11
          },
          {
            element: '#link-maps',
            intro: 'Clique sobre o ícone para ser redirecionado para a localização no Google Maps do CAPS II LESTE, TERESINA, PI.',
            position: 'top',
            step: 12
          },
          {
            element: '.div-container',
            intro: 'Dúvidas, sugestões e elogios, aperte o botão com o ícone ⓘ.',
            position: 'floating',
            step: 13
          },
        ],
        showStepNumbers: true,
        showBullets: true,

        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        doneLabel: 'Entendi!'
      }).start();
    }, 300);

  };

  const infFAq = () => {
    introJs.tour().setOptions({
      steps: [
        {
          element: '#span-info',
          intro: 'Dúvidas e suporte, aqui!',
          position: 'top',
          scrollTo: 'tooltip',
          scrollToElement: false
        },
         {
          element: '.div-list-span',
          intro: 'Dúvidas e suporte, aqui!',
          position: 'floating',
          scrollTo: 'tooltip',
          scrollToElement: false
        },
      ],
      doneLabel: 'Entendi!',
    }).start();
  }

  function handleToggle() {
    setToggle(toggle => !toggle);
    setShowOnlyActive(prev => !prev);
    setShowAllMedicines(!showallMedicines)
  }

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const medicinesFiltered = medicines
    .filter(med => showallMedicines ? (med.status) === 1 : true)
    .filter(med => removeAccents(med.name.toLowerCase()).includes(removeAccents(search.toLowerCase())));

  const GIST_ID = import.meta.env.VITE_GITHUB_GIST_ID;
  const FILENAME = import.meta.env.VITE_GITHUB_FILENAME;
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  const fetchMedicamentos = async () => {
    try {
      setLoading(true);
      setErro(null);

      const timer = new Promise((resolve) => setTimeout(resolve, 5000));

      if (!GITHUB_TOKEN) {
        throw new Error('GitHub token error');
      }

      const apiUrl = `https://api.github.com/gists/${GIST_ID}`;
      const headers = { Authorization: `token ${GITHUB_TOKEN}` };

      const apiCall = axios.get(apiUrl, { headers, timeout: 10000 });
      const [apiResponse] = await Promise.all([apiCall, timer]);
      const gist = apiResponse.data;

      const file = gist.files && (gist.files[FILENAME] || Object.values(gist.files)[0]);
      if (!file) throw new Error('Arquivo não encontrado no gist');

      let jsonText = null;

      if (file.truncated) {
        if (!file.raw_url) throw new Error('Arquivo truncado e raw_url não disponível');
        const rawResp = await axios.get(file.raw_url, { headers, timeout: 10000 });
        jsonText = typeof rawResp.data === 'string' ? rawResp.data : JSON.stringify(rawResp.data);
      } else if (file.content && file.content.trim().length) {
        jsonText = file.content;
      } else if (file.raw_url) {
        const rawResp = await axios.get(file.raw_url, { headers, timeout: 10000 });
        jsonText = typeof rawResp.data === 'string' ? rawResp.data : JSON.stringify(rawResp.data);
      } else {
        throw new Error('Conteúdo do arquivo não disponível');
      }

      const parsed = JSON.parse(jsonText);

      setMedicines(parsed.medicamentos || parsed);
      setHour(parsed.hora || gist.updated_at || null);
    } catch (error) {
      setErro('Erro ao buscar medicamentos. Verifique token e permissões do Gist.');
      console.error('fetchMedicamentos error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicamentos();
    const hideLoader = () => {
      const loader = document.querySelector('.loader');
      if (loader) {
        setTimeout(() => {
          loader.classList.add('loader-finish');
        }, 4000);
      }
    };
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
      return () => window.removeEventListener('load', hideLoader);
    }
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const check = () => setListScrollable(isElementScrollable(el));

    check();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(check);
      ro.observe(el);
    } else {
      window.addEventListener('resize', check);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', check);
    };
  }, [medicines]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        infFAq();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return <div className="loader">
      <div className='div-inf-gif'>
        <img className='git-img' src={gifs.img03} alt="Gif" />
        <div className="loader-text">
          <span className="char">C</span>
          <span className="char">A</span>
          <span className="char">P</span>
          <span className="char">S</span>
          <span className='space-char'></span>
          <span className="char">II</span>
          <span className='space-char'></span>
          <span className="char">L</span>
          <span className="char">E</span>
          <span className="char">S</span>
          <span className="char">T</span>
          <span className="char">E</span>
        </div>
      </div>
    </div>;
  }

  return (
    <div>
      <div className='div-container'>
        <div className='div-header'>
          <div className='div-title'>
            <h1>CAPS II LESTE</h1>
            <h2>Centro de Atenção Psicossocial II Leste</h2>
            <h3>Teresina - PI</h3>
          </div>
          <div className='div-container-search'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 
            1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 
            3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 
            3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z" />
            </svg>
            <input name="search-medicine" className='input-search' type='text' placeholder='buscar...' value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {erro && <p style={{ color: 'red' }}>{erro}</p>}
        </div>
        <div className='inf-text'>
          <div className='text-h3'>
            <h3>{showOnlyActive ? "Medicamentos ativos" : "Todos os medicamentos"}</h3>
          </div>
          <section>
            <div role="button" tabIndex="0" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); } }} className={`${toggle}`} onClick={handleToggle}>
              <div className={`${toggle}-theme`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`true-icon`}>
                  <path d="m2.25 12.321 7.27 6.491c.143.127.321.19.499.19.206 0 .41-.084.559-.249l11.23-12.501c.129-.143.192-.321.192-.5 0-.419-.338-.75-.749-.75-.206 0-.411.084-.559.249l-10.731 11.945-6.711-5.994c-.144-.127-.322-.19-.5-.19-.417 0-.75.336-.75.749 0 .206.084.412.25.56" fillRule="nonzero" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`false-icon`}>
                  <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
                </svg>
              </div>
            </div>
          </section>
        </div>
        <div className='div-list-span'>

          <div className='list-container'>
            <div className='div-update'>
              <h3>ultima atualização {hour}</h3>
            </div>
            <div className='div-list' ref={listRef}>
              {medicinesFiltered.map((med, id) => (
                <MedicineCard key={id} med={med} />
              ))}
            </div>
            <div>
            </div>
          </div>

        <span className={`${isActive}-span-info`} id='span-info' onClick={onMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z" />
          </svg>
        </span>
        </div>


        <ul className={isActive ? "active" : ""}>
          <div className='div-menu'>
            <FaqMenu Children={handleStartGuide} onClosed={onMenu} classfaq={`${true}-span-info-menu`} emailLink={validarLink(urlFormated(SameEmail))} />
          </div>
        </ul>
      </div>
      <footer className='div-footer'>
        <div className='section-footer'>
          <h2>Centro de Atenção Psicossocial II Leste - Teresina - PI</h2>
          <p className='text-inf'>
            O CAPS II LESTE tem por objetivo facilitar e melhorar a vida dos usuarios por meio da implementação de sistemas e execução de políticas de saúde que facilitam
            o desenvolvendo de atividades integradas de prevenção, proteção, promoção e recuperação da saúde.
          </p>

          <div className='inf-footer'>

            <Link className="link-footer" id="link-localization" rel="noopener noreferrer">
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M21 22h2v2h-22v-2h2v-22h18v22zm-10-3h-2v4h2v-4zm4 0h-2v4h2v-4zm4-17h-14v20h2v-5h10v5h2v-20zm-12 11h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" /></svg>
              <span className='text-link'>Rua Visconde da Parnaíba, 2435 - Horto, Teresina - PI, 64052-825</span>
            </Link>

            <Link href={url} className="link-footer" id="link-fone" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
              <span className='text-link'>(+55) 86 99424-0220</span>
            </Link>

            <Link href={validarLink(urlFormated(myEmail))} className="link-footer" id="link-email" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" /></svg>
              <span className='text-link'>{myEmail}</span>
            </Link>

            <Link href='https://maps.app.goo.gl/cjafnH1e1vjeDspA9' className="link-footer" id="link-maps" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-3.148 0-6 2.553-6 5.702 0 4.682 4.783 5.177 6 12.298 1.217-7.121 6-7.616 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm12 16l-6.707-2.427-5.293 2.427-5.581-2.427-6.419 2.427 4-9 3.96-1.584c.38.516.741 1.08 1.061 1.729l-3.523 1.41-1.725 3.88 2.672-1.01 1.506-2.687-.635 3.044 4.189 1.789.495-2.021.465 2.024 4.15-1.89-.618-3.033 1.572 2.896 2.732.989-1.739-3.978-3.581-1.415c.319-.65.681-1.215 1.062-1.731l4.021 1.588 3.936 9z" /></svg>
              <span className='text-link'>Localização no Google Maps</span>
            </Link>
          </div>

          <p className='text-copyright'>
            © 2026 CAPS II LESTE. Todos os direitos reservados - Desenvolvido por EQUIPE-SAME
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App;
