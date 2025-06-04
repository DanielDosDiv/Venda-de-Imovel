import express , {json} from 'express'
import User from './Controllers/User.js'
import privateRouter from './Routers/privateRouter.js'
import Imovel from './Controllers/Imovel.js'
import auth from './middleware/auth.js'
import cors from 'cors'
import dotenv from 'dotenv'
import comentario from './Controllers/Comentario.js'
import paises from './Controllers/Paises.js'
import tipos from './Controllers/Tipos.js'
import tiposVenda from './Controllers/TipoVenda.js'
const app = express()
app.use(cors())
// app.use(cors({
//   origin: 'https://venda-de-imovel.netlify.app',
// }));
const PORT = process.env.PORT
app.use(express.json())
app.use("/",  comentario)
app.use("/",  Imovel)
app.use("/", User)
app.use("/", paises)
app.use("/", tipos)
app.use("/", tiposVenda)
app.use("/",auth, privateRouter)
app.listen(PORT, ()=>{
    console.log("Servidor rodando 🚀")
})
//iUs8QhyJS3xze4k3
//https://venda-de-imovel.netlify.app/