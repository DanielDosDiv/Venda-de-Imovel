import { PrismaClient } from '@prisma/client'
import express, { json } from 'express'
import bcrypt from 'bcrypt'
const router = express.Router()
const prisma = new PrismaClient()
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET
router.post("/novoImovel", async (req, res) => {

})
router.post("/cadastro", async (req, res) => {
    try {
        const infoUser = req.body
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(infoUser.password, salt)
        const UserDb = await prisma.user.create({
            data: {
                name: infoUser.name,
                email: infoUser.email,
                password: hashPassword
            }
        })
        return res.status(201).json(UserDb)
    } catch (error) {
        return res.status(404).json({ message: "Não foi possível cirar o usuário", error })
    }
})

//Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; // Destructuring para pegar email e password

        // Validação básica dos campos
        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        // Busca o usuário (mantive UserDb como você tinha originalmente)
        const UserDb = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!UserDb) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Compara a senha
        const isMatch = await bcrypt.compare(password, UserDb.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Verifica se JWT_SECRET está definido
        if (!process.env.JWT_SECRET) {
            throw new Error("Chave JWT não configurada no ambiente");
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: UserDb.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove a senha do objeto de resposta
        const { password: _, ...userWithoutPassword } = UserDb;

        return res.status(200).json({
            token,
            user: userWithoutPassword,
            expiresIn: '4d'
        });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ 
            message: "Erro durante o login",
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const UserDb = await prisma.user.findMany({
            where: { id: req.params.id }
        })
        if (!UserDb) {
            return res.status(404).json({ message: "Usuario Não existe" })
        }
        const deleteUser = await prisma.user.deleteMany({
            where: { id: req.params.id }
        })
        return res.status(200).json({ message: "Usuario deletado", UserDb })

    } catch (error) {
        return res.status(404).json({ message: "Erro no servidor" })
    }

})

router.get("/listUser", async (req, res) => {
    try {
      const includeComments = req.query.includeComments === 'true';
      const includeImoveis = req.query.includeImoveis === 'true';
  
      const UserDb = await prisma.user.findMany({
        include: {
          comments: includeComments,
          imoveis: includeImoveis
        }
      });
  
      res.status(200).json({
        message: "Todos Usuários listados com sucesso",
        UserDb
      });
  
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({
        message: "Erro ao listar usuários"
      });
    }
  });

export default router