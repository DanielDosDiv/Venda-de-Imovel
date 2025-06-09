import css from './NovoImovel.module.css';
import AnimationHouse from '../../components/animation/AnimationHouse.jsx';
// import MsgSuccess from '../../components/animation/.jsx';
import ModalDeSatus from '../../components/Modal/ModalDeSatus/ModalDeSatus.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CepApi from '../../services/api.js';
import api from '../../services/api.js';
import axios from 'axios';

function NovoImovel() {
    const navigate = useNavigate();

    const [etapa, setEtapa] = useState(1);
    const [pais, setPais] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [tipoVenda, setTipoVenda] = useState([]);
    const [imgCasa, setImgCasa] = useState(null);
    const [valorFormatado, setValorFormatado] = useState('');
    const [status, setStatus] = useState(false);
    const [msgSuccessOpen, setMsgSuccessOpen] = useState(null); // ✅ nome claro

    const [formData, setFormData] = useState({
        cidade: "",
        bairro: "",
        rua: "",
        cep: "",
        numCasa: "",
        paisId: "",
        tipoImovelId: "",
        tipoVendaId: "",
        preco: 0,
        comprimento: "",
        largura: "",
        fotoCasa: "",
        qtdQuartos: ""
    });

    const UserID = localStorage.getItem('id');

    const handleChangePreco = (e) => {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/\D/g, '');
        const valorEmReais = parseFloat(numericValue) / 100 || 0;

        setFormData(prev => ({
            ...prev,
            preco: valorEmReais
        }));

        setValorFormatado(valorEmReais.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === "fotoCasa") {
            setImgCasa(value || null);
        }
    };

    const getCEP = async (cep) => {
        if (!cep || cep.length < 8) return;

        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;

            if (data) {
                const numeros = cep.replace(/\D/g, '').slice(0, 8);
                const cepFormatado = numeros.replace(/^(\d{5})(\d{0,3})$/, "$1-$2");

                setFormData(prev => ({
                    ...prev,
                    cep: cepFormatado,
                    rua: data.logradouro || "",
                    bairro: data.bairro || "",
                    cidade: data.localidade || "",
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };

    const FecharModal = () => {
        setMsgSuccessOpen(false);
    };
    const GoToImoveis = () =>{
        setMsgSuccessOpen(false)
        navigate('/imoveis');
    }

    useEffect(() => {
        async function loadData() {
            try {
                const [paisesRes, tiposRes, tiposVendaRes] = await Promise.all([
                    api.get('/paises'),
                    api.get('/tipos'),
                    api.get('/tiposVenda')
                ]);

                setPais(paisesRes.data.paises);
                setTipo(tiposRes.data.tipos);
                setTipoVenda(tiposVendaRes.data.tiposVenda);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                alert("Erro ao carregar opções. Recarregue a página.");
            }
        }
        loadData();
    }, []);

    async function CadastrarImovel(event) {
        event.preventDefault();

        if (
            !formData.cidade ||
            !formData.paisId ||
            !formData.tipoImovelId ||
            !formData.tipoVendaId ||
            formData.preco <= 0 ||
            !formData.comprimento ||
            !formData.largura ||
            !formData.fotoCasa ||
            !formData.qtdQuartos ||
            !formData.rua ||
            !formData.numCasa ||
            !formData.bairro
        ) {
            setStatus(false)
            setMsgSuccessOpen(true);
            return;
        }

        const data = {
            cidade: formData.cidade,
            paisId: formData.paisId,
            tipoImovelId: formData.tipoImovelId,
            tipoVendaId: formData.tipoVendaId,
            preco: formData.preco,
            largura: parseFloat(formData.largura),
            comprimento: parseFloat(formData.comprimento),
            fotoCasa: formData.fotoCasa,
            qtdQuartos: parseInt(formData.qtdQuartos),
            rua: formData.rua,
            numCasa: parseInt(formData.numCasa),
            bairro: formData.bairro,
            usuarioId: UserID,
            cep: formData.cep
        };

        try {
            await api.post('/novoImovel', data);
            console.log("Imóvel cadastrado com sucesso!");
            setMsgSuccessOpen(true); // ✅ abrir modal
            setStatus(true)
        } catch (error) {
            console.error("Erro ao cadastrar:", error.response?.data || error);
            setStatus(false)
            setMsgSuccessOpen(true); // ✅ abrir modal
            // alert(`Erro ao cadastrar: ${error.response?.data?.message || "Verifique o console"}`);
        }
    }

    return (
        <div className={css.container}>
            {msgSuccessOpen && (
                <ModalDeSatus
                isOpen={msgSuccessOpen}
                onClose={status === false ? FecharModal : GoToImoveis}
                Titulo={status === true ? "Sucesso" : "Erro"}
                descricao={status === true ? "Imóvel criado com sucesso" : "Erro ao criar imóvel, preencha todas as informações"}
                status={status}
                />
            )}

            <div className={css.container_esquerdo}>
                {imgCasa === null ? <AnimationHouse /> :
                    <div className={css.img_casa}>
                        <img src={imgCasa} alt="Casa" />
                    </div>
                }
            </div>

            <div className={css.container_direito}>
                <h1>Novo Imóvel</h1>
                <form className={css.preset_input} onSubmit={CadastrarImovel}>

                    {etapa === 1 && (
                        <>
                            <input
                                type="text"
                                placeholder='CEP'
                                name="cep"
                                value={formData.cep}
                                onChange={handleChange}
                                onBlur={() => getCEP(formData.cep)}
                                required
                            />
                            <input
                                type="text"
                                placeholder='Cidade'
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder='Bairro'
                                name="bairro"
                                value={formData.bairro}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder='Rua'
                                name="rua"
                                value={formData.rua}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                min={0}
                                placeholder='N° da Casa'
                                name="numCasa"
                                value={formData.numCasa}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    {etapa === 2 && (
                        <>
                            <input
                                type="text"
                                placeholder="R$ 0,00"
                                value={valorFormatado}
                                onChange={handleChangePreco}
                                required
                            />
                            <input
                                type="number"
                                placeholder='Comprimento'
                                name="comprimento"
                                value={formData.comprimento}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                            />
                            <input
                                type="number"
                                placeholder='Largura'
                                name="largura"
                                value={formData.largura}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                            />
                            <input
                                type="number"
                                placeholder="Quantidade de quartos"
                                min="1"
                                name="qtdQuartos"
                                value={formData.qtdQuartos}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    {etapa === 3 && (
                        <>
                            <select name="tipoVendaId" value={formData.tipoVendaId} onChange={handleChange} required>
                                <option value="">Tipo da Venda</option>
                                {tipoVenda.map((tipos) => (
                                    <option key={tipos.id} value={tipos.id}>{tipos.nome}</option>
                                ))}
                            </select>
                            <select name="paisId" value={formData.paisId} onChange={handleChange} required>
                                <option value="">Selecione um país</option>
                                {pais.map((pais) => (
                                    <option key={pais.id} value={pais.id}>{pais.nome}</option>
                                ))}
                            </select>
                            <select name="tipoImovelId" value={formData.tipoImovelId} onChange={handleChange} required>
                                <option value="">Tipo Imóvel</option>
                                {tipo.map((tipos) => (
                                    <option key={tipos.id} value={tipos.id}>{tipos.nome}</option>
                                ))}
                            </select>
                            <input
                                type="url"
                                placeholder='URL da foto da casa'
                                name="fotoCasa"
                                value={formData.fotoCasa}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    <div className={css.botoes_carrossel}>
                        {etapa > 1 && (
                            <button type="button" onClick={() => setEtapa(etapa - 1)}>
                                Voltar
                            </button>
                        )}
                        {etapa < 3 ? (
                            <button type="button" onClick={() => setEtapa(etapa + 1)}>
                                Próximo
                            </button>
                        ) : (
                            <button type="submit">Adicionar Imóvel</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NovoImovel;
