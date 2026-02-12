import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { gifs } from './assets';

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
  const onMenu = () => setIsActive(!isActive)

  const colorPalette = [
    // '#eb8325',
    // '#1c545c',
    // '#9c9d62',
    // '#a2aa79'
  ]

  function handleToggle() {
    setToggle(toggle => !toggle);
    setShowOnlyActive(prev => !prev);
    setShowAllMedicines(!showallMedicines)
  }

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const medicinesFiltered = medicines.filter(med => showallMedicines ? (med.status) === 1 : true).filter(med =>
    removeAccents(med.name.toLowerCase()).includes(removeAccents(search.toLowerCase()))
  );

  const fetchMedicamentos = async () => {
    try {
      setLoading(true);
      const timer = new Promise((resolve) => setTimeout(resolve, 1000));
      const apiCall = axios.get('https://api.npoint.io/33b08d2edd649671343a');
      const [response] = await Promise.all([apiCall, timer]);

      setMedicines(response.data.medicamentos);
      setHour(response.data.hora);
    } catch (error) {
      setErro('Erro ao buscar medicamentos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  if (loading) {
    return <div className="loader">
      <img src={gifs.img03} alt="Logo" />
      <h1>carregando.....</h1>
    </div>;
  }

  return (
    <div className='div-container'>
      <div className='div-header'>
        <div className='div-title'>
          <h1>CAPS II LESTE</h1>
        </div>
        <div className='div-container-search'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24">
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
        <div className='div-list'>
          {medicinesFiltered.map((med, id) => (
            <div key={id} className='card-medicines' style={{ backgroundColor: colorPalette[id % colorPalette.length] }}>
              <p className='name'>{med.name}</p>
              <div className='inf-medicines'>
                <div className='inf-names'>
                  <p>Depaken</p>
                  <p>valproato de sodio</p>
                </div>
                <div className='inf-all'>
                  <div className='inf-detal'>
                    <p><strong>status:</strong></p>
                    <p>{med.status}</p>
                  </div>
                  <div className='inf-detal'>
                    <p><strong>entrada:</strong></p>
                    <p>25/01/2026</p>
                  </div>
                  <div className='inf-detal'>
                    <p><strong>quantidade:</strong></p>
                    <p>5000</p>
                  </div>
                  <div className='inf-detal'>
                    <p><strong>dosagem:</strong></p>
                    <p>250mg</p>
                  </div>
                  <div className='inf-detal'>
                    <p><strong>tipo:</strong></p>
                    <p>comprimido</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className={`${isActive}-span-info`} onClick={onMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z" />
        </svg>
      </span>
      <ul className={`${isActive ? "active" : "inactive"}`}>
        menu
        <span className='span-info' onClick={onMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z" />
          </svg>
        </span>
      </ul>
    </div>
  )
}

export default App;