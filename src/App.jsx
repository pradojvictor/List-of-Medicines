import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { gifs } from './assets';
import ToggleBox from './components/Toggle';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [hour, setHour] = useState();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [showallMedicines, setShowAllMedicines] = useState(true);
  const [search, setSearch] = useState('');

  const [showOnlyActive, setShowOnlyActive] = useState(true);

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
        {/* <ToggleBox isChecked={showallMedicines} onToggle={() => setShowAllMedicines(!showallMedicines)} /> */}

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </div>
      <div className='inf-text'>
        <h3>{showOnlyActive ? "Medicamentos ativos" : "Todos os medicamentos"}</h3>
            <input
              type="checkbox"
              checked={showOnlyActive}
              onChange={() => setShowOnlyActive(prev => !prev)}
              onClick={() => setShowAllMedicines(!showallMedicines)}
            />
      </div>
      <div className='list-container'>
        <div className='div-update'>
          <h3>ultima atualização {hour}</h3>
        </div>
        <div className='div-list'>
          {medicinesFiltered.map((med, id) => (
            <div key={id}>
              <p >{med.name}</p>
              <p >{med.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App;



{/* <button onClick={() => setShowAllMedicines(!showallMedicines)}>
          {showallMedicines ? <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm4.998 13.245c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.248c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.252c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero" /></svg>
            : <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm4.998 11.745c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.248c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.252c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero" /></svg>}
        </button> */} 