import express from 'express';
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/tipos", async (req, res) => {
    try{
        const tipos = await prisma.tipoImovel.findMany();
        return res.status(200).json({ message: "Lista de tipos", tipos });
    }
    catch(erro){
        return res.status(500).json({ message: "Erro ao buscar tipos" });
    }

})
router.get("/tipos/:id", async (req, res) =>{
    const id = req.params.id
    const tipoImovel = await prisma.tipoImovel.findUnique({
        where:{
            id: id
        }
    })
    return res.status(200).json({message: "Imovel listado com sucesso", tipoImovel})
})
export default router;