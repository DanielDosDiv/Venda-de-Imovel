import css from './Contadores.module.css';
import FeatherIcon from 'feather-icons-react';
import iconUser from '../../img/iconUser.png';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import Loading from '../../components/animation/Loading';
import Notfound from '../../components/animation/Notfound';
function Contadores() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  async function getUsers() {
    try {
      setLoading(true);
      const response = await api.get('/listUser', {
        params: { // Envie os includes como parâmetros
          includeComments: true,
          includeImoveis: true
        }
      });
      setUsers(response.data.UserDb);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setError(true)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    )


  }
  if (error) {
    return (
      <Notfound
        detalheErro={"Nenhum contador encontrado no momento"}
      />
    );
  }

  return (
    <div className={css.container}>
      {users.map((user) => (
        <div className={css.card_user} key={user.id}>
          <div className={css.user_img}>
            <img src={iconUser} alt={`Usuário ${user.name}`} />
          </div>
          <div className={css.user_info}>
            <h1>{user.name}</h1>
            <div className={css.display_flexs}>
              <FeatherIcon icon="inbox" />
              <p>{user.email}</p>
            </div>
            <div className={css.display_flexs}>
              <FeatherIcon icon="message-circle" />
              <p>
                {/* Verifica se comments existe antes de acessar length */}
                {user.comments.length || 0} comentários
              </p>
            </div>
            <div className={css.display_flexs}>
              <FeatherIcon icon="home" />
              <p>
                {/* Verifica se imoveis existe antes de acessar length */}
                {user.imoveis.length || 0} imóveis
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Contadores;