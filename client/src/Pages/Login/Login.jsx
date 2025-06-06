import Btn from '../../components/Button.jsx'
import { useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api.js'
import InputPreset from '../../components/Input.jsx'
import css from './Login.module.css'

function Login() {
    const navigate = useNavigate()
    const EmailUser = useRef()
    const PasswordUser = useRef()

    async function Logar(event) {
        event.preventDefault()

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

                window.alert(`Login bem-sucedido!`)
                navigate('/')
            } else {
                throw new Error('Estrutura de resposta inesperada')
            }
        } catch (error) {
            console.error('Erro no login:', error)
            window.alert(`Falha no login: ${error.response?.data?.message || error.message}`)
        }
    }

    return (
        <div className={css.body}>
            <div className={css.container}>
                <div className={css.container_esquerdo}>
                    <form onSubmit={Logar}>
                        <h1 className={css.titulo}>Login</h1>

                        <InputPreset type="email" id="email" placeholder="Exemple@email.com" label="Email" ref={EmailUser} />
                        <InputPreset type="password" id="password" placeholder="*******" label="Senha" ref={PasswordUser} />
                        
                        <Link to="/cadastro">Não tem conta ainda?</Link>
                        <Btn text="Login" className="btn_grande" onClick={Logar} />
                    </form>
                </div>
                <div className={css.container_direito}>
                    <img src="https://wallpaper.forfun.com/fetch/74/74682d20b0f812d85188ada840956079.jpeg" alt="imagem de fundo" />
                </div>
            </div>
        </div>
    )
}

export default Login
