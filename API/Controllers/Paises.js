import express from 'express';
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


router.get("/paises", async (req, res) => {
    try {
        const paises = await prisma.pais.findMany();
        if (!paises) {
            return res.status(404).json({ message: "Nenhum país encontrado" });
        }
        return res.status(200).json({ message: "Lista de países", paises });
    } catch (error) {
        console.error("Erro detalhado:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar países",
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message,
                meta: error.meta // Mostra detalhes do erro do Prisma
            })
        });
        
    }

})

export default router;