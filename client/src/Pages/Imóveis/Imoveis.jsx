import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import css from './Imoveis.module.css';
import img_casa from '../../img/img_casa.png';
import icon_Rooms from '../../img/rooms.svg';
import size from '../../img/size.svg';
import Btn from '../../components/Button.jsx';
import Loading from '../../components/animation/Loading.jsx';
import Notfound from "../../components/animation/Notfound.jsx";

function Imoveis() {
    const [allImoveis, setAllImoveis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // const { id } = useParams();
    const token = localStorage.getItem('token');

    const getNomePais = (imovel) => {
        if (imovel.Pais) {
            return imovel.Pais.nome;
        }
        
        if (imovel.nomePais) {
            return imovel.nomePais;
        }
        
        return "País não especificado";
    };
    
    async function getImoveis() {
        try {
            setLoading(true);
            // await new Promise(resolve => setTimeout(resolve, 1500));
            const response = await api.get('/listImovel', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data?.imovelDb) {
                setAllImoveis(response.data.imovelDb);
            } else {
                throw new Error("Estrutura de dados inesperada");
            }
        } catch (err) {
            console.error("Erro ao buscar imóveis:", err);
            setError("Erro ao carregar imóveis. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getImoveis();
    }, []);

    if (loading) {
        return (
            <div >
                <Loading/> 
            </div>
        );
    }

    if (error) {
        return (
            <Notfound
            detalheErro={"Nenhum imóvel encontrado no momento"}
            />
        );
    }

    if (allImoveis.length === 0) {
        return (
            <div className={css.emptyContainer}>
                <p>Nenhum imóvel disponível no momento</p>
                <Btn 
                    text={"Adicionar Imóvel"} 
                    onClick={() => navigate('/novo-imovel')} 
                />
            </div>
        );
    }

    return (
        <div className={css.container}>
            {allImoveis.map((imovel) => (
                <div className={css.card_imovel} key={imovel.id}>
                    <div className={css.imovel_img}>
                        <img 
                            src={imovel.FotoCasa || img_casa} 
                            alt={`Imóvel em ${imovel.Cidade || 'local desconhecido'}`} 
                            onError={(e) => {
                                e.target.src = img_casa;
                            }}
                        />
                    </div>
                    <div className={css.imovel_info}>
                        <div className={css.localizacao}>
                            <h1>
                                <i className="fa-solid fa-location-dot"></i>
                                {imovel.Cidade || "Cidade não especificada"},
                            </h1>
                            <h1>{getNomePais(imovel) || " País não especificado"}</h1>
                        </div>
                        
                        <div className={css.display_flax}>
                            <p>
                                <img src={icon_Rooms} alt="Ícone de quartos" />
                                {imovel.QtdQuartos || 0} Quartos
                            </p>
                            <p>
                                <img src={size} alt="Ícone de tamanho" />
                                {imovel.Largura || "?"}x{imovel.Comprimento || "?"}
                            </p>
                        </div>
                        
                        <div className={css.display_flax}>
                            <Btn 
                                className={"btn-pequeno"} 
                                text={"Mais detalhes"} 
                                onClick={() => navigate(`/imovel/${imovel.id}`)}
                            />
                            <h1>
                                R${imovel.Preco?.toLocaleString('pt-BR') || "Preço não disponível"}
                            </h1>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Imoveis;