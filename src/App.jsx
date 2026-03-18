// import { useEffect, useState, useRef } from 'react'
// import './App.css'
// import axios from 'axios';
// import { gifs } from './assets';
// import FaqMenu from './components/FaqMenu';
// import Carousel from './components/Carousel';
// import MedicineCard from './components/MedicineCard';
// import { isElementScrollable } from './utils/domUtils';

// function App() {
//   const [medicines, setMedicines] = useState([]);
//   const [hour, setHour] = useState();
//   const [loading, setLoading] = useState(true);
//   const [erro, setErro] = useState(null);

//   const [showallMedicines, setShowAllMedicines] = useState(true);
//   const [search, setSearch] = useState('');

//   const [showOnlyActive, setShowOnlyActive] = useState(true);

//   const [toggle, setToggle] = useState(true);

//   const [isActive, setIsActive] = useState(false)
//   const onMenu = () => setIsActive(!isActive);
//   const listRef = useRef(null);
//   const [listScrollable, setListScrollable] = useState(false);

//   function handleToggle() {
//     setToggle(toggle => !toggle);
//     setShowOnlyActive(prev => !prev);
//     setShowAllMedicines(!showallMedicines)
//   }

//   const removeAccents = (str) => {
//     return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
//   }

//   const medicinesFiltered = medicines
//     .filter(med => showallMedicines ? (med.status) === 1 : true)
//     .filter(med => removeAccents(med.name.toLowerCase()).includes(removeAccents(search.toLowerCase())));

//   const API_URL = import.meta.env.VITE_API_URL

//   const fetchMedicamentos = async () => {
//     try {
//       setLoading(true);
//       const timer = new Promise((resolve) => setTimeout(resolve, 5000));
//       const apiCall = axios.get(API_URL);
//       const [response] = await Promise.all([apiCall, timer]);

//       setMedicines(response.data.medicamentos);
//       setHour(response.data.hora);
//     } catch (error) {
//       setErro('Erro ao buscar medicamentos');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMedicamentos();
//     const hideLoader = () => {
//       const loader = document.querySelector('.loader');
//       if (loader) {
//         setTimeout(() => {
//           loader.classList.add('loader-finish');
//         }, 4000);
//       }
//     };
//     if (document.readyState === 'complete') {
//       hideLoader();
//     } else {
//       window.addEventListener('load', hideLoader);
//       return () => window.removeEventListener('load', hideLoader);
//     }
//   }, []);

//   useEffect(() => {
//     const el = listRef.current;
//     if (!el) return;

//     const check = () => setListScrollable(isElementScrollable(el));

//     check();

//     let ro;
//     if (typeof ResizeObserver !== 'undefined') {
//       ro = new ResizeObserver(check);
//       ro.observe(el);
//     } else {
//       window.addEventListener('resize', check);
//     }

//     return () => {
//       if (ro) ro.disconnect();
//       else window.removeEventListener('resize', check);
//     };
//   }, [medicines]);

//   if (loading) {
//     return <div className="loader">
//       <div className='div-inf-gif'>
//         <img className='git-img' src={gifs.img03} alt="Gif" />
//         <div className="loader-text">
//           <span className="char">C</span>
//           <span className="char">A</span>
//           <span className="char">P</span>
//           <span className="char">S</span>
//           <span className='space-char'></span>
//           <span className="char">II</span>
//           <span className='space-char'></span>
//           <span className="char">L</span>
//           <span className="char">E</span>
//           <span className="char">S</span>
//           <span className="char">T</span>
//           <span className="char">E</span>
//         </div>
//       </div>
//     </div>;
//   }

//   return (
//     <div className='div-container'>
//       <div className='div-header'>
//         <div className='div-title'>
//           <h1>CAPS II LESTE</h1>
//         </div>
//         <div className='div-container-search'>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//             <path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 
//             1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 
//             3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 
//             3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z" />
//           </svg>
//           <input className='input-search' type='text' placeholder='buscar...' value={search} onChange={e => setSearch(e.target.value)} />
//         </div>
//         {erro && <p style={{ color: 'red' }}>{erro}</p>}
//       </div>
//       <div className='inf-text'>
//         <div className='text-h3'>
//           <h3>{showOnlyActive ? "Medicamentos ativos" : "Todos os medicamentos"}</h3>
//         </div>
//         <section>
//           <label className={`${toggle}`} onClick={handleToggle}>
//             <div className={`${toggle}-theme`}>
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`true-icon`}>
//                 <path d="m2.25 12.321 7.27 6.491c.143.127.321.19.499.19.206 0 .41-.084.559-.249l11.23-12.501c.129-.143.192-.321.192-.5 0-.419-.338-.75-.749-.75-.206 0-.411.084-.559.249l-10.731 11.945-6.711-5.994c-.144-.127-.322-.19-.5-.19-.417 0-.75.336-.75.749 0 .206.084.412.25.56" fillRule="nonzero" />
//               </svg>
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`false-icon`}>
//                 <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
//               </svg>
//             </div>
//           </label>
//         </section>
//       </div>
//       <div className='list-container'>
//         <div className='div-update'>
//           <h3>ultima atualização {hour}</h3>
//         </div>
//         <div className='div-list' ref={listRef}>
//           {medicinesFiltered.map((med, id) => (
//             <MedicineCard key={id} med={med} />
//           ))}
//         </div>
//         <div>
//         </div>
//       </div>
//       <span className={`${isActive}-span-info`} onClick={onMenu}>
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//           <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z" />
//         </svg>
//       </span>
//       <ul className={isActive ? "active" : ""}>
//         <div className='div-menu'>
//           <FaqMenu onClosed={onMenu} classfaq={`${true}-span-info-menu`} />
//         </div>
//       </ul>
//     </div>
//   )
// }

// export default App;

import { useEffect, useState, useRef } from 'react'
import './App.css'
import axios from 'axios';
import { gifs } from './assets';
import FaqMenu from './components/FaqMenu';
import Carousel from './components/Carousel';
import MedicineCard from './components/MedicineCard';
import { isElementScrollable } from './utils/domUtils';

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

  // Configuração do Gist privado
  const GIST_ID = import.meta.env.VITE_GITHUB_GIST_ID;
  const FILENAME = import.meta.env.VITE_GITHUB_FILENAME;
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  const fetchMedicamentos = async () => {
    try {
      setLoading(true);
      setErro(null);

      // Mantém o loader visível por pelo menos 5s (como antes)
      const timer = new Promise((resolve) => setTimeout(resolve, 5000));

      if (!GITHUB_TOKEN) {
        throw new Error('GitHub token não configurado. Defina VITE_GITHUB_TOKEN no .env');
      }

      const apiUrl = `https://api.github.com/gists/${GIST_ID}`;
      const headers = { Authorization: `token ${GITHUB_TOKEN}` };

      // busca metadados do gist (autenticado)
      const apiCall = axios.get(apiUrl, { headers, timeout: 10000 });
      const [apiResponse] = await Promise.all([apiCall, timer]);
      const gist = apiResponse.data;

      // localiza o arquivo pelo nome; se não existir, pega o primeiro arquivo
      const file = gist.files && (gist.files[FILENAME] || Object.values(gist.files)[0]);
      if (!file) throw new Error('Arquivo não encontrado no gist');

      let jsonText = null;

      // Se o arquivo estiver truncado na resposta da API, buscar raw_url com autenticação
      if (file.truncated) {
        if (!file.raw_url) throw new Error('Arquivo truncado e raw_url não disponível');
        const rawResp = await axios.get(file.raw_url, { headers, timeout: 10000 });
        jsonText = typeof rawResp.data === 'string' ? rawResp.data : JSON.stringify(rawResp.data);
      } else if (file.content && file.content.trim().length) {
        // content disponível diretamente na resposta da API
        jsonText = file.content;
      } else if (file.raw_url) {
        // fallback: buscar raw_url
        const rawResp = await axios.get(file.raw_url, { headers, timeout: 10000 });
        jsonText = typeof rawResp.data === 'string' ? rawResp.data : JSON.stringify(rawResp.data);
      } else {
        throw new Error('Conteúdo do arquivo não disponível');
      }

      const parsed = JSON.parse(jsonText);

      // atualiza estado conforme estrutura do JSON
      setMedicines(parsed.medicamentos || parsed);
      // tenta pegar hora do JSON; se não existir, usa updated_at do gist
      setHour(parsed.hora || gist.updated_at || null);
    } catch (error) {
      // mensagens amigáveis para o usuário e log para debug
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
    <div className='div-container'>
      <div className='div-header'>
        <div className='div-title'>
          <h1>CAPS II LESTE</h1>
        </div>
        <div className='div-container-search'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 
            1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 
            3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 
            3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z" />
          </svg>
          <input className='input-search' type='text' placeholder='buscar...' value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </div>
      <div className='inf-text'>
        <div className='text-h3'>
          <h3>{showOnlyActive ? "Medicamentos ativos" : "Todos os medicamentos"}</h3>
        </div>
        <section>
          <label className={`${toggle}`} onClick={handleToggle}>
            <div className={`${toggle}-theme`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`true-icon`}>
                <path d="m2.25 12.321 7.27 6.491c.143.127.321.19.499.19.206 0 .41-.084.559-.249l11.23-12.501c.129-.143.192-.321.192-.5 0-.419-.338-.75-.749-.75-.206 0-.411.084-.559.249l-10.731 11.945-6.711-5.994c-.144-.127-.322-.19-.5-.19-.417 0-.75.336-.75.749 0 .206.084.412.25.56" fillRule="nonzero" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`false-icon`}>
                <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
              </svg>
            </div>
          </label>
        </section>
      </div>
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
      <span className={`${isActive}-span-info`} onClick={onMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z" />
        </svg>
      </span>
      <ul className={isActive ? "active" : ""}>
        <div className='div-menu'>
          <FaqMenu onClosed={onMenu} classfaq={`${true}-span-info-menu`} />
        </div>
      </ul>
    </div>
  )
}

export default App;

