import css from './Cadastro.module.css'
import Btn from '../../components/Button.jsx'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'
import InputPreset from '../../components/Input.jsx'
import { Helmet } from 'react-helmet';
import ModalDeSatus from '../../components/Modal/ModalDeSatus/ModalDeSatus.jsx'

function Cadastro() {
    const navigate = useNavigate()
    const NomeUser = useRef()
    const EmailUser = useRef()
    const PasswordUser = useRef()
    const [mostrarModal, setMostrarModal] = useState(false)
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(null)

    async function Cadastrar(event) {
        event.preventDefault()
        setIsLoading(true)
        if (!EmailUser || !PasswordUser || !NomeUser) {
            setStatus(false)
            setMostrarModal(true)
        }
        else {

            try {
                const guardarApi = await api.post('/cadastro', {
                    name: NomeUser.current.value,
                    email: EmailUser.current.value,
                    password: PasswordUser.current.value
                })
                // setUser(guardarApi.data)
                setIsLoading(false)
                navigate("/login")
            } catch (error) {
                console.error("Erro ao cadastrar usuário:", error.response?.data?.message || error.message)
                setStatus(false)
                setMostrarModal(true)

            }
        }

    }
    function fecharModal() {
        setMostrarModal(false)
        if (status) {
            navigate('/login')
        }
        else {
            setIsLoading(false)
        }
    }
    return (
        <>
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                />
            </Helmet>
            {mostrarModal && (
                <ModalDeSatus
                    isOpen={mostrarModal}
                    onClose={fecharModal}
                    Titulo={status ? "Cadastro bem-sucedido!" : "Erro ao cadastrar"}
                    status={status}
                    descricao={status ? `Cadastro realizado com sucesso!` : "Não foi possível realizar seu cadastro, dados incompletos ou email já cadastrado."}
                />
            )}
            <div className={css.body}>
                <div className={css.container}>
                    <div className={css.container_esquerdo}>
                        <form action="">
                            <h1>Cadastro</h1>
                            {/* <p className={css.subTitulo}>Hoje é um novo dia. É o seu dia. Você o molda. Entre para começar a procurar a casa dos seus sonhos.</p> */}
                            <InputPreset type={"text"} id={"text"} placeholder={"Fulano da Silva"} label={"Nome"} ref={NomeUser} />
                            <InputPreset type={"email"} id={"email"} placeholder={"Exemple@email.com"} label={"Email"} ref={EmailUser} />

                            <InputPreset type={"password"} id={"password"} placeholder={"*******"} label={"Senha"} ref={PasswordUser} />

                            <Btn text={!isLoading ? "Cadastrar" :
                                <div class="spinner-border spinner-border" role="status"
                                    style={{ width: '1.5rem', height: '1.5rem' }}>
                                    <span class="sr-only">Loading...</span>
                                </div>
                            } className="btn_grande" onClick={Cadastrar} />
                        </form>
                    </div>
                    <div className={css.container_direito}>
                        <img src="https://wallpaper.forfun.com/fetch/74/74682d20b0f812d85188ada840956079.jpeg" alt="" />
                    </div>
                </div>
            </div>
        </>
    )

}
export default Cadastro