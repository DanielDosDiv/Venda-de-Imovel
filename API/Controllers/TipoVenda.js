import express from 'express';
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/tiposVenda", async (req, res) => {
    try{
        const tiposVenda = await prisma.tipoVenda.findMany();
        return res.status(200).json({ message: "Lista de tipos", tiposVenda });
    }
    catch(erro){
        return res.status(500).json({ message: "Erro ao buscar tipos" });
    }

})
export default router;