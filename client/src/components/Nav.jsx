import style from './Nav.css'
import logo from '../img/logo.png'
import userLogo from '../img/user.svg'
import Btn from './Button.jsx'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ModalAcessoNegado from './Modal/AcessoNegado/ModalDeUserSemLgoin.jsx'
import ModalLogoff from './Modal/Logoff/Logoff.jsx'
import FeatherIcon from 'feather-icons-react'
import api from '../services/api'

function Nav() {
    const navigate = useNavigate()
    const [mostrarModal, setMostrarModal] = useState(false)
    const [mostrarModalSair, setMostrarModalSair] = useState(false)

    const token = localStorage.getItem('token')
    const nomedoUser = localStorage.getItem('name')

    function goToNewImovel() {
        if (!token) {
            setMostrarModal(true) // mostra o modal
        } else {
            navigate("/novo-imovel")
        }
    }
    

    function fecharModal() {
        setMostrarModal(false)
    }
    function fecharModalSair() {
        setMostrarModalSair(false)
    }

    function LogoffUser(){
        localStorage.clear('token')
        localStorage.clear('name')
        setMostrarModalSair(true)
    }
    return (
        <>
            {mostrarModal && (
                <ModalAcessoNegado
                    isOpen={mostrarModal}
                    onClose={fecharModal}
                />
            )}
            {mostrarModalSair &&(
                <ModalLogoff 
                isOpen={mostrarModalSair}
                onClose={fecharModalSair}
                />
            )
                
            }

            <div className="nav">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <ul className="nav-list">
                    <li>
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li>
                        <Link to="/imoveis" className="nav-link">Imóveis</Link>
                    </li>
                    <li>
                        <Link to="/comentarios" className="nav-link">Comentários</Link>
                    </li>
                    <li>
                        <Link to="/contadores" className="nav-link">Contadores</Link>
                    </li>
                </ul>
                <div className="div-direito">
                    <p>{nomedoUser || <FeatherIcon icon='user' className="user" onClick={() => navigate("/login")}/>}</p>
                    <div className="FeatherIcon" onClick={LogoffUser}>
                        <FeatherIcon icon="log-out" />
                    </div>
                    <Btn text={"Novo Imóvel"} className={"btn"} onClick={goToNewImovel} />
                </div>
            </div>
        </>
    )
}
export default Nav
