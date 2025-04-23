import css from './NovoImovel.module.css'
import AnimationHouse from '../../components/animation/AnimationHouse.jsx'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

function NovoImovel() {
    // Mantenha apenas as refs para inputs simples
    const Cidade = useRef()
    const Comprimento = useRef()
    const Largura = useRef()
    const FotoCasa = useRef()
    const qtdQuartos = useRef()
    const navegate = useNavigate()

    // Estados para selects e valores complexos
    const [pais, setPais] = useState([])
    const [tipo, setTipo] = useState([])
    const [tipoVenda, setTipoVenda] = useState([])
    const [imgCasa, setImgCasa] = useState(null)
    
    // Estados para valores selecionados
    const [formData, setFormData] = useState({
        paisId: "",
        tipoImovelId: "",
        tipoVendaId: "",
        preco: 0
    })

    const UserID = localStorage.getItem('id')

    // Preço formatado
    const [valorFormatado, setValorFormatado] = useState('')

    const handleChangePreco = (e) => {
        const rawValue = e.target.value
        const numericValue = rawValue.replace(/\D/g, '')
        const valorEmReais = parseFloat(numericValue) / 100 || 0

        setFormData(prev => ({
            ...prev,
            preco: valorEmReais
        }))

        setValorFormatado(valorEmReais.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function GetFotoCasa() {
        const fotoDaCasa = FotoCasa.current.value
        setImgCasa(fotoDaCasa || null)
    }

    // Buscar dados
    useEffect(() => {
        async function loadData() {
            try {
                const [paisesRes, tiposRes, tiposVendaRes] = await Promise.all([
                    api.get('/paises'),
                    api.get('/tipos'),
                    api.get('/tiposVenda')
                ])
                
                setPais(paisesRes.data.paises)
                setTipo(tiposRes.data.tipos)
                setTipoVenda(tiposVendaRes.data.tiposVenda)
            } catch (error) {
                console.error("Erro ao carregar dados:", error)
                alert("Erro ao carregar opções. Recarregue a página.")
            }
        }
        loadData()
    }, [])

    async function CadastrarImovel(event) {
        event.preventDefault()

        // Validação completa
        if (
            !Cidade.current?.value ||
            !formData.paisId ||
            !formData.tipoImovelId ||
            !formData.tipoVendaId ||
            formData.preco <= 0 ||
            !Comprimento.current?.value ||
            !Largura.current?.value ||
            !FotoCasa.current?.value ||
            !qtdQuartos.current?.value
        ) {
            alert("Por favor, preencha todos os campos obrigatórios.")
            return
        }

        try {
            const response = await api.post('/novoImovel', {
                cidade: Cidade.current.value,
                paisId: formData.paisId,
                tipoImovelId: formData.tipoImovelId,
                tipoVendaId: formData.tipoVendaId,
                preco: formData.preco,
                largura: parseFloat(Largura.current.value),
                comprimento: parseFloat(Comprimento.current.value),
                fotoCasa: FotoCasa.current.value,
                qtdQuartos: parseInt(qtdQuartos.current.value),
                usuarioId: UserID,
            })

            alert("Imóvel cadastrado com sucesso!")
            // Limpar formulário após sucesso
            navegate("/imoveis")
            
        } catch (error) {
            console.error("Erro detalhado:", error.response?.data || error.message)
            alert(`Erro ao cadastrar: ${error.response?.data?.message || "Verifique o console"}`)
        }
    }

    return (
        <div className={css.container}>
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
                    <input type="text" placeholder='Cidade' ref={Cidade} required />

                    <select 
                        name="paisId"
                        value={formData.paisId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um país</option>
                        {pais.map((pais) => (
                            <option key={pais.id} value={pais.id}>
                                {pais.nome}
                            </option>
                        ))}
                    </select>

                    <select 
                        name="tipoImovelId"
                        value={formData.tipoImovelId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Tipo Imóvel</option>
                        {tipo.map((tipos) => (
                            <option key={tipos.id} value={tipos.id}>
                                {tipos.nome}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="R$ 0,00"
                        value={valorFormatado}
                        onChange={handleChangePreco}
                        required
                    />

                    <input type="number" placeholder='Comprimento' ref={Comprimento} required step="0.01" min="0" />
                    <input type="number" placeholder='Largura' ref={Largura} required step="0.01" min="0" />

                    <input
                        type="number"
                        placeholder="Quantidade de quartos"
                        min="1"
                        ref={qtdQuartos}
                        required
                    />

                    <select 
                        name="tipoVendaId"
                        value={formData.tipoVendaId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Tipo da Venda</option>
                        {tipoVenda.map((tipos) => (
                            <option key={tipos.id} value={tipos.id}>
                                {tipos.nome}
                            </option>
                        ))}
                    </select>

                    <input 
                        type="url" 
                        placeholder='URL da foto da casa' 
                        ref={FotoCasa} 
                        onChange={GetFotoCasa} 
                        required 
                    />
                    
                    <button type="submit">Adicionar Imóvel</button>
                </form>
            </div>
        </div>
    )

}

export default NovoImovel
