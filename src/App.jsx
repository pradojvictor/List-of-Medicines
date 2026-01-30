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

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const medicinesFiltered = medicines.filter(med => showallMedicines ? (med.status) === 1 : true).filter(med =>
    removeAccents(med.name.toLowerCase()).includes(removeAccents(search.toLowerCase()))
  );

  const fetchMedicamentos = async () => {
    try {
      setLoading(true);
      const timer = new Promise((resolve) => setTimeout(resolve, 6000));
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
    <div>
      
      <h1>CAPS II LESTE</h1>
      <input type='text' placeholder='buscar...' value={search} onChange={e => setSearch(e.target.value)}/>
      <ToggleBox isChecked={showallMedicines} onToggle={() => setShowAllMedicines(!showallMedicines)}/>
      <h3>ultima atualização {hour}</h3>
      {erro && <p style={{color: 'red'}}>{erro}</p>}
      <ul>
        <h1>Medicamentos disponiveis</h1>
        {medicinesFiltered.map((med, id) => (
          <div key={id}>
            <p >{med.name}</p>
            <p >{med.status}</p>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default App;