import Btn from '../../components/Button.jsx'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'
import InputPreset from '../../components/Input.jsx'
import css from './Login.module.css'
import { Link } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    const NomeUser = useRef()
    const EmailUser = useRef()
    const PasswordUser = useRef()

    async function Logar(event) {
        event.preventDefault()
        try {
            const response = await api.post('/login', {
                email: EmailUser.current.value,
                password: PasswordUser.current.value
            })

            console.log('Resposta completa:', response) // Verifique toda a resposta

            // Verifique se a resposta tem os dados esperados
            if (response.data && response.data.token && response.data.user) {
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('id', response.data.user.id)
                localStorage.setItem('name', response.data.user.name) // Adicionei o nome também

                console.log('Dados salvos:', {
                    token: response.data.token,
                    id: response.data.user.id,
                    name: response.data.user.name
                })

                window.alert(`Login bem-sucedido! ID: ${response.data.user.id}`)
                navigate('/') // Redireciona após login
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
                    <form action="">
                        <h1 className={css.titulo}>Login</h1>

                        <InputPreset type={"email"} id={"text"} placeholder={"Exemple@email.com"} label={"Email"} ref={EmailUser} />

                        <InputPreset type={"password"} id={"password"} placeholder={"*******"} label={"Senha"} ref={PasswordUser} />
                        <Link to="/cadastro">Não tem conta ainda? </Link>

                        <Btn text={"Login"} className={"btn_grande"} onClick={Logar} />
                    </form>
                </div>
                <div className={css.container_direito}>
                    <img src="https://wallpaper.forfun.com/fetch/74/74682d20b0f812d85188ada840956079.jpeg" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Login
