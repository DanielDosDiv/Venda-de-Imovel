import './App.css';
import Nav from './components/Nav.jsx';
import Home from './Pages/Home.jsx';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Imoveis from './Pages/Imóveis/Imoveis.jsx';
import Comentarios from './Pages/Comentarios/Comentarios.jsx';
import Contadores from './Pages/Contadores/Contadores.jsx';
import NovoImovel from './Pages/Novo_Imovel/NovoImovel.jsx';
import Cadastro from './Pages/Cadastro/Cadastro.jsx';
import Login from './Pages/Login/Login.jsx';
import DetalheImovel from './Pages/Detalhe_Imovel/Detalhe.jsx';
import FiltroImovel from './Pages/FiltroImovel/FiltroImovel.jsx';
import EditUserPage from './Pages/EditUserPage/EditUserPage.jsx';
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  // Lista de rotas onde o Navbar não deve aparecer
  const rotasSemNavbar = ['/login', '/cadastro'];

  const esconderNavbar = rotasSemNavbar.includes(location.pathname);

  return (
    <div className="App">
      {!esconderNavbar && <Nav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imoveis" element={<Imoveis />} />
        <Route path="/comentarios" element={<Comentarios />} />
        <Route path="/contadores" element={<Contadores />} />
        <Route path="/novo-imovel" element={<NovoImovel />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/imovel/:id" element={<DetalheImovel />} />
        <Route path="/filtroImovel/:paisId/:tipoImovelId/:preco" element={<FiltroImovel/>}/>
        <Route path="/editUser/:id" element={<EditUserPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
