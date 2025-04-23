import { PrismaClient } from '@prisma/client'
import express, { json } from 'express'
const router = express.Router()
const prisma = new PrismaClient()

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






//New imovel

router.post('/novoImovel', async (req, res) => {
    try {
        const {
            cidade,
            paisId,
            tipoImovelId,
            tipoVendaId,
            preco,
            largura,
            comprimento,
            fotoCasa,
            qtdQuartos,
            usuarioId
        } = req.body;

        // Validação adicional no backend
        if (!cidade || !paisId || !tipoImovelId || !tipoVendaId ||
            !preco || !largura || !comprimento || !fotoCasa || !qtdQuartos) {
            return res.status(400).json({
                success: false,
                message: "Todos os campos são obrigatórios"
            });
        }

        const novoImovel = await prisma.imovel.create({
            data: {
                Cidade: cidade,
                paisId: paisId,
                tipoImovelId: tipoImovelId,
                tipoVendaId: tipoVendaId,
                Preco: parseFloat(preco),
                Largura: parseFloat(largura),
                Comprimento: parseFloat(comprimento),
                FotoCasa: fotoCasa,
                QtdQuartos: parseInt(qtdQuartos),
                usuarioId: usuarioId
            }
        });

        res.json({
            success: true,
            imovel: novoImovel
        });
    } catch (error) {
        console.error("Erro no backend:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
export default router