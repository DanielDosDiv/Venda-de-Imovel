import Btn from '../../components/Button.jsx'
import { useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api.js'
import InputPreset from '../../components/Input.jsx'
import css from './Login.module.css'
import { useState } from 'react'
import { Helmet } from 'react-helmet';
import ModalDeSatus from '../../components/Modal/ModalDeSatus/ModalDeSatus.jsx'

function Login() {
    const navigate = useNavigate()
    const EmailUser = useRef()
    const PasswordUser = useRef()
    const [mostrarModal, setMostrarModal] = useState(false)
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(null)


    async function Logar(event) {
        event.preventDefault()
        setIsLoading(true)
        if (!EmailUser.current.value || !PasswordUser.current.value) {
            return window.alert("Preencha todos os campos.");
        }

        try {
            const response = await api.post('/login', {
                email: EmailUser.current.value,
                password: PasswordUser.current.value
            })

            if (response.data && response.data.token && response.data.user) {
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('id', response.data.user.id)
                localStorage.setItem('name', response.data.user.name)
                setStatus(true)
                setMostrarModal(true)
                setIsLoading(false)
                navigate('/imoveis')
            } else {
                throw new Error('Estrutura de resposta inesperada')
            }
        } catch (error) {
            console.error('Erro no login:', error.response?.data?.message || error.message)
            setStatus(false)
            setMostrarModal(true)

        }
    }
    function fecharModal() {
        setMostrarModal(false)
        if (status) {
            navigate('/')
        }
        else{
            setIsLoading(false)
        }
    }
    return (
        <>
            {mostrarModal && (
                <ModalDeSatus
                    isOpen={mostrarModal}
                    onClose={fecharModal}
                    Titulo={status ? "Login bem-sucedido!" : "Erro ao fazer login"}
                    status={status}
                    descricao={status ? `Parabéns ${localStorage.getItem('name')}, você foi logado com sucesso!` : "Não foi possível logar, verifique seus dados e tente novamente."}
                />
            )}
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                />
            </Helmet>
            <div className={css.body}>
                <div className={css.container}>
                    <div className={css.container_esquerdo}>
                        <form onSubmit={Logar}>
                            <h1 className={css.titulo}>Login</h1>

                            <InputPreset type="email" id="email" placeholder="Exemple@email.com" label="Email" ref={EmailUser} />
                            <InputPreset type="password" id="password" placeholder="*******" label="Senha" ref={PasswordUser} />

                            <Link to="/cadastro">Não tem conta ainda?</Link>
                            <Btn text={!isLoading ? "Login" :
                                <div class="spinner-border spinner-border" role="status"
                                    style={{ width: '1.5rem', height: '1.5rem' }}>
                                    <span class="sr-only">Loading...</span>
                                </div>
                            } className="btn_grande" onClick={Logar} />
                        </form>
                    </div>
                    <div className={css.container_direito}>
                        <img src="https://wallpaper.forfun.com/fetch/74/74682d20b0f812d85188ada840956079.jpeg" alt="imagem de fundo" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
