import { PrismaClient } from '@prisma/client'
import express, { json } from 'express'
const router = express.Router()
const prisma = new PrismaClient()
router.use(express.json()); 

//List Users


router.get("/listUser/:id", async (req, res) => {
    try {
        const UserDb = await prisma.user.findMany({
            where: { id: req.params.id }
        })
        if (!UserDb) {
            return res.status(404).json({ message: "Usuario Não existe" })
        }
        res.status(200).json({ message: "Usuario Listado com sucesso", UserDb })
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({
            message: "Erro durante o login",
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
})



export default router