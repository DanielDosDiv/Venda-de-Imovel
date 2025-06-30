import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import style from './Detalhe.module.css';
import NovoComentario from "../../components/Modal/NovoComentario/NovoComentario"
import ModalAcessoNegado from '../../components/Modal/AcessoNegado/ModalDeUserSemLgoin';
import Loading from '../../components/animation/Loading.jsx';

function DetalheImovel() {
  const { id } = useParams();
  const textComment = useRef();
  const [imovel, setImovel] = useState(null);
  const [comentario, setComentarios] = useState([]);
  const [mostrarModal, setModal] = useState(false);
  const [mostrarModalAcesso, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  async function getComentariosImovelId() {
    try {
      const response = await api.get(`/listAllComment/${id}`);
      const data = response.data?.data?.comments || response.data?.comments || response.data || [];
      setComentarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  }

  async function getImovel() {
    try {
      const response = await api.get(`/listImovel/${id}`);
      setImovel(response.data.imovelDb);
    } catch (error) {
      console.error("Erro ao buscar imóvel:", error);
    }
  }

  async function carregarTudo() {
    setLoading(true);
    await Promise.all([getImovel(), getComentariosImovelId()]);
    setLoading(false);
  }

  const getNomePais = (imovel) => {
    if (imovel?.Pais) return imovel.Pais.nome;
    return "País não especificado";
  };

  async function fecharModal(event) {
    event.preventDefault();
    try {
      await api.post("/novoComentario", {
        comment: textComment.current.value,
        imovelId: id,
        authorId: localStorage.getItem("id")
      });
      getComentariosImovelId();
    } catch (error) {
      console.log("Não foi possível criar o comentário", error);
    }
    setModal(false);
  }

  function NewComment() {
    if (!token) {
      setMostrarModal(true);
    } else {
      setModal(true);
    }
  }

  function fecharModalAcesso() {
    setMostrarModal(false);
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  if (loading || !imovel) {
    return (
     
        <Loading />
    
    );
  }

  return (
    <div className={style.container}>
      {mostrarModalAcesso && (
        <ModalAcessoNegado isOpen={mostrarModalAcesso} onClose={fecharModalAcesso} />
      )}
      {mostrarModal && (
        <NovoComentario isOpen={mostrarModal} onClose={fecharModal} inputRef={textComment} />
      )}

      <div className={style.img_casa}>
        <img src={imovel.FotoCasa} alt="Imagem do imóvel" />
      </div>

      <div className={style.imovel_info}>
        <h1>{imovel.Cidade}, {getNomePais(imovel)}</h1>

        <div className={style.detalhe_imovel}>
          <div className={style.info_colum_esquerdo}>
            <div>
              <h3>Endereço</h3>
              <p>{imovel.Rua || "não especificado"}, {imovel.NumCasa || "não especificado"} - {imovel.Bairro || "não especificado"}</p>
            </div>
            <div>
              <h3>Quartos:</h3>
              <p>{imovel.QtdQuartos}</p>
            </div>
            <div>
              <h3>Preço</h3>
              <p>R${imovel.Preco}</p>
            </div>
            <div>
              <h3>Corretor responsável:</h3>
              <p>{imovel.usuario?.name || "não especificado"}</p>
            </div>
          </div>

          <div className={style.info_colum_direito}>
            <div>
              <h3>Tipo do imóvel:</h3>
              <p>{imovel.TipoImovel?.nome || "não especificado"}</p>
            </div>
            <div>
              <h3>Tipo Venda:</h3>
              <p>{imovel.tipoVenda?.nome || "não especificado"}</p>
            </div>
            <div>
              <h3>Tamanho:</h3>
              <p>{imovel.Comprimento}x{imovel.Largura}</p>
            </div>
          </div>
        </div>

        <h1 className={style.center}>Comentários</h1>
        <button className={style.botao_comentario} onClick={NewComment}>Adicionar Comentário</button>
      </div>

      {comentario.map((comentarios) => (
        <div className={style.card_comentario} key={comentarios.id}>
          <div className={style.info_user}>
            <div className={style.fotoUser}>
              <img src="https://img.freepik.com/vetores-gratis/circulo-azul-com-usuario-branco_78370-4707.jpg?semt=ais_hybrid&w=740" alt="Foto do usuário" />
            </div>
            <h1>{comentarios.author?.name || "Usuário Anônimo"}</h1>
          </div>
          <p>{comentarios.comment || "Sem comentário"}</p>
        </div>
      ))}
    </div>
  );
}

export default DetalheImovel;
