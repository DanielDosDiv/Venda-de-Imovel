import style from './Nav.css'
import logo from '../img/logo.png'
import Btn from './Button.jsx'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ModalDeSatus from './Modal/ModalDeSatus/ModalDeSatus.jsx'
import FeatherIcon from 'feather-icons-react'

function Nav() {
    const navigate = useNavigate()
    const [mostrarModal, setMostrarModal] = useState(false)
    const [mostrarModalSair, setMostrarModalSair] = useState(false)
    const [menuAberto, setMenuAberto] = useState(false)
    const [status, setStatus] = useState(null)
    const token = localStorage.getItem('token')
    const nomedoUser = localStorage.getItem('name')
    const id = localStorage.getItem('id') // Corrigido: "id" minúsculo

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMenuAberto(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    function goToNewImovel() {
        if (!token) {
            // setMostrarModal(true)
            navigate("/login")

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

    function LogoffUser() {
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        localStorage.removeItem('name')
        setMostrarModalSair(true)
        setStatus(true)
    }

    function toggleMenu() {
        setMenuAberto(!menuAberto)
    }

    return (
        <>
            {mostrarModal && (
                <ModalDeSatus
                    isOpen={mostrarModal}
                    onClose={fecharModal}
                    Titulo={"Acesso Negado"}
                    descricao={"Você precisa estar logado para acessar essa página!"}
                />
            )}
            {mostrarModalSair && (
                <ModalDeSatus
                    isOpen={mostrarModalSair}
                    onClose={fecharModalSair}
                    Titulo={"Logoff"}
                    status={status}
                    descricao={"Você foi desconectado com sucesso!"}
                />
            )}

            <div className="nav">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>

                {/* Menu Desktop */}
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
                        <Link to="/contadores" className="nav-link">Usuários</Link>
                    </li>
                </ul>

                {/* Área direita - Desktop */}
                <div className="div-direito">
                    {id && <p onClick={() => navigate(`/editUser/${id}`)}>{nomedoUser}</p>}
                    
                    {!id ? (
                        <FeatherIcon icon="user" className="user" onClick={() => navigate("/login")} />
                    ) : (
                        <div className="FeatherIcon" onClick={LogoffUser}>
                            <FeatherIcon icon="log-out" />
                        </div>
                    )}

                    <Btn text={"Novo Imóvel"} className={"btn"} onClick={goToNewImovel} />
                </div>

                {/* Ícone do menu hambúrguer para mobile */}
                <div className="menu-icon" onClick={toggleMenu}>
                    <FeatherIcon icon={menuAberto ? "x" : "menu"} />
                </div>

                {/* Menu Mobile */}
                <div className={`menu-mobile ${menuAberto ? 'active' : ''}`}>
                    <ul className="menu-mobile-list">
                        <li>
                            <Link to="/" className="menu-mobile-link" onClick={() => setMenuAberto(false)}>Home</Link>
                        </li>
                        <li>
                            <Link to="/imoveis" className="menu-mobile-link" onClick={() => setMenuAberto(false)}>Imóveis</Link>
                        </li>
                        <li>
                            <Link to="/comentarios" className="menu-mobile-link" onClick={() => setMenuAberto(false)}>Comentários</Link>
                        </li>
                        <li>
                            <Link to="/contadores" className="menu-mobile-link" onClick={() => setMenuAberto(false)}>Contadores</Link>
                        </li>
                    </ul>

                    {/* Área de usuário no menu mobile */}
                    <div className="menu-mobile-user">
                        {id ? (
                            <p onClick={() => {
                                navigate(`/editUser/${id}`)
                                setMenuAberto(false)
                            }}>{nomedoUser}</p>
                        ) : (
                            <p onClick={() => navigate("/login")}>Faça login</p>
                        )}

                        <div className="menu-mobile-user-actions">
                            {!id ? (
                                <div className='userLogin'>

                                <FeatherIcon
                                    icon='user'
                                    onClick={() => {
                                        navigate("/login")
                                        setMenuAberto(false)
                                    }}
                                    />
                                    </div>
                            ) : (
                                <div onClick={() => {
                                    LogoffUser()
                                    setMenuAberto(false)
                                }}>
                                    <FeatherIcon icon="log-out" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botão no menu mobile */}
                    <div className="menu-mobile-btn">
                        <Btn
                            text={"Novo Imóvel"}
                            className={"btn_grande"}
                            onClick={() => {
                                goToNewImovel()
                                setMenuAberto(false)
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Nav
