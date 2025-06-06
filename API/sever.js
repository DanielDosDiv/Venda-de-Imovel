import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './Controllers/User.js';
import privateRouter from './Routers/privateRouter.js';
import Imovel from './Controllers/Imovel.js';
import auth from './middleware/auth.js';
import comentario from './Controllers/Comentario.js';
import paises from './Controllers/Paises.js';
import tipos from './Controllers/Tipos.js';
import tiposVenda from './Controllers/TipoVenda.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", comentario);
app.use("/", Imovel);
app.use("/", User);
app.use("/", paises);
app.use("/", tipos);
app.use("/", tiposVenda);
app.use("/private", auth, privateRouter);

// 🔥 ESTE BLOCO DEVE EXISTIR PARA O RENDER FUNCIONAR
app.listen( PORT, () => {
  console.log(`Servidor rodando 🚀 na porta ${PORT}`);
});
