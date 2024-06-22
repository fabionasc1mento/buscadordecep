import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import "./style.css";
import api from './services/api';

function App() {

  const [input, setInput] = useState('');
  const [cep, setCep] = useState({});

  async function handleSearch(){
    if(input === ''){
      alert('Preencha o campo vazio!');
      return;
    }

    try{
      const response = await api.get(`${input}/json`);
      setCep(response.data)
      setInput('')
    }catch{
      alert('Ops! Erro ao buscar.');
      setInput('');
    }
  }

  return (
    <body>
      <div className="container">
        <h1 className="title">Buscador CEP</h1>

        <div className="container-input">
          <input type="text" 
          placeholder="digite o CEP..."
          value={input}
          onChange={(event)=>setInput(event.target.value)}
          />

          <button className="btn" onClick={handleSearch}>
            <FiSearch size={25} color='#fff'/>
          </button> 

        </div>

        {Object.keys(cep).length > 0 && (
          <main className='main'>
            <h2>CEP: {cep.cep}</h2>
            <span>Rua: {cep.logradouro}</span>
            <span>Num: {cep.complemento}</span>
            <span>Bairro: {cep.bairro}</span>
            <span>Cidade: {cep.localidade} - {cep.uf}</span>
            <span>DDD: {cep.ddd}</span>
          </main >
        )}

      </div>
    </body>
  );
}

export default App;
