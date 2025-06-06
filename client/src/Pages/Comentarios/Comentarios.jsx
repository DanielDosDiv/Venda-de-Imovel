import api from "../../services/api";
import style from "./Comentarios.module.css";
import { useEffect, useState } from 'react';
import Loading from "../../components/animation/Loading";
import Notfound from "../../components/animation/Notfound";

function Comentarios() {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getAllComments() {
        try {
            setLoading(true);
            const response = await api.get("/listAllComment");

            // Verifica se a resposta contém um array
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.comments || response.data.listAllComment || [];

            setComentarios(data);
            console.log(data)
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar comentários:", err);
            setError("Erro ao carregar comentários");
            setComentarios([]); // Garante que seja um array vazio em caso de erro
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllComments();
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
            detalheErro={"Nenhum comentário encontrado no momento"}
            />
        );
    }


    return (
        <div>
            <h1 className={style.center}>Comentários</h1>
            <div className={style.container_comentarios}>
                {comentarios.length > 0 ? (
                    comentarios.map((comentario) => (
                        <div className={style.card_comentario} key={comentario.id}>
                            <div className={style.fotoDaCasa}>
                                {comentario.imovel?.FotoCasa && (
                                    <img src={comentario.imovel.FotoCasa} alt="Imóvel" />
                                )}
                            </div>
                            <div className={style.info_comentario}>
                                <div className={style.dadosUser}>
                                    <div className={style.fotoUser}>
                                        <img
                                            src="https://img.freepik.com/vetores-gratis/circulo-azul-com-usuario-branco_78370-4707.jpg?semt=ais_hybrid&w=740"
                                            alt="Usuário"
                                        />
                                    </div>
                                    <div className={style.nameUser}>
                                        <h1>{comentario.author?.name || "Anônimo"}</h1>
                                        <p>{comentario.author?.email || "Email não especificado"}</p>
                                    </div>
                                </div>
                                <p className={style.comentario}>{comentario.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum comentário encontrado</p>
                )}
            </div>
        </div>
    );
}

export default Comentarios;