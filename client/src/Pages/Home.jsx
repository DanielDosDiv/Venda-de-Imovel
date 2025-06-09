import style from './Home.css'
import House from '../img/house.png'
import Btn from '../components/Button.jsx'
import { useState, useEffect, useRef } from 'react'
import { data, useNavigate } from 'react-router-dom'
import api from '../services/api.js'
function Home() {
    const navigate = useNavigate()


    function GoToCadastro() {

        navigate("/cadastro")
    }
    const precoRef = useRef(0)
    const preco = useRef()
    const [pais, setPais] = useState([])
    const [tipo, setTipo] = useState([])
    const [tipoVenda, setTipoVenda] = useState([])
    const [tipoVendaSelecionado, setTipoVendaSelecionado] = useState("")
    const [paisSelecionado, setPaisSelecionado] = useState("")
    const [tipoSelecionado, setTipoSelecionado] = useState("")
    const [valorNumerico, setValorNumerico] = useState(0)
    const [valorFormatado, setValorFormatado] = useState('');
// const [valorNumerico, setValorNumerico] = useState(0);


    const handleChangePreco = (e) => {
        const rawValue = e.target.value
        const numericValue = rawValue.replace(/\D/g, '')
        const valorEmCentavos = parseFloat(numericValue) / 100 || 0
      
        // Atualiza valor formatado para exibição
        const formatado = valorEmCentavos.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      
        setValorFormatado(formatado)
        setValorNumerico(valorEmCentavos) // valor limpo e pronto pra usar na URL
      }
      
    async function getPaises() {
        const allPaises = await api.get('/paises')
        setPais(allPaises.data.paises)
    }

    async function getTipos() {
        const allTipos = await api.get('/tipos')
        setTipo(allTipos.data.tipos)
    }

    async function getTiposVenda() {
        const tiposVenda = await api.get('/tiposVenda')
        setTipoVenda(tiposVenda.data.tiposVenda)
    }


    useEffect(() => {
        getPaises()
        getTipos()
        getTiposVenda()
    }, [])
    function Pesquisar() {
        console.log(paisSelecionado, tipoSelecionado, valorNumerico)
        navigate(`/filtroImovel/${paisSelecionado}/${tipoSelecionado}/${valorNumerico}`)
    }
    return (
        <div className="container">

            <div className="home">
                <div className="div-esquerdo">
                    <h1>A casa dos seus sonhos</h1>
                    <p>Explore nossa seleção criteriosa de propriedades requintadas meticulosamente adaptadas à sua visão única de casa dos sonhos</p>
                    <Btn text={"Sign up"} className={"btn"} onClick={GoToCadastro} />
                </div>
                <div className="container-direito">
                    <img src={House} alt="" />
                </div>
            </div>
            <div className="container-flutuante">
                <select className='preset-input' value={paisSelecionado} onChange={(e) => setPaisSelecionado(e.target.value)} ref={pais}>
                    <option value="">Selecione um país</option>
                    {pais.map((pais) => (
                        <option key={pais.id} value={pais.id}>
                            {pais.nome}
                        </option>
                    ))}
                </select>

                <select className='preset-input' value={tipoSelecionado} onChange={(e) => setTipoSelecionado(e.target.value)} ref={tipo}>
                    <option value="">Tipo Imóvel</option>
                    {tipo.map((tipos) => (
                        <option key={tipos.id} value={tipos.id}>
                            {tipos.nome}
                        </option>
                    ))}
                </select>
                <input
                    className='preset-input'
                    type="text"
                    placeholder="R$ 0,00"
                    ref={preco}
                    value={valorFormatado}
                    onChange={handleChangePreco}
                />
                <Btn text={"Pesquisar"} onClick={Pesquisar} className={"btn"} />
            </div>
        </div>

    )
}
export default Home