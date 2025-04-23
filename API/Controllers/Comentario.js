import express, { json } from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

router.post("/novoComentario", async (req, res) => {
    try {
        const comentarioData = req.body;

        // Validação básica
        if (!comentarioData.comment || !comentarioData.authorId || !comentarioData.imovelId) {
            return res.status(400).json({ message: "Dados incompletos" });
        }

        // Verifica se o imóvel existe
        const imovel = await prisma.imovel.findUnique({
            where: { id: comentarioData.imovelId },
        });

        if (!imovel) {
            return res.status(404).json({ message: "Imóvel não encontrado" });
        }

        // Cria o comentário
        const novoComentario = await prisma.comment.create({
            data: {
                comment: comentarioData.comment,
                authorId: comentarioData.authorId,
                imovelId: comentarioData.imovelId
            },
        });

        return res.status(201).json({
            message: "Comentário criado com sucesso",
            novoComentario
        });

    } catch (error) {
        console.error("Erro detalhado:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao criar comentário",
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message,
                meta: error.meta
            })
        });
    }
});

router.get("/listAllComment", async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            include: {
                imovel: true,
                author: true
            }
        });

        return res.status(200).json({
            message: "Todos comentários listados com sucesso",
            comments
        });

    } catch (error) {
        console.error("Erro detalhado:", error);
        return res.status(500).json({
            message: "Erro ao listar comentários",
            error: error.message
        });
    }
});
router.get("/listAllComment/:imovelId", async (req, res) => {
    try {
        const { imovelId } = req.params;

        // 1. Verificar se o imóvel existe
        const imovelExists = await prisma.imovel.findUnique({
            where: { id: imovelId }
        });

        if (!imovelExists) {
            return res.status(404).json({
                success: false,
                message: "Imóvel não encontrado"
            });
        }

        // 2. Buscar comentários com os campos existentes do autor
        const comentarios = await prisma.comment.findMany({
            where: {imovelId},
            include:{
                author:true
            }
        })

return res.status(200).json({
    success: true,
    message: "Comentários encontrados",
    data: {
        imovel: {
            id: imovelExists.id,
            FotoCasa: imovelExists.FotoCasa
            // Outros campos do imóvel que você queira retornar
        },
        comments: comentarios
    }
});

    } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).json({
        success: false,
        message: "Erro ao buscar comentários",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
}
});
router.delete("/commentDelete/:id", async (req, res) => {
    try {
        const commentDb = await prisma.comment.findMany({
            where: { id: req.params.id }
        })
        if (!commentDb) {
            return res.status(404).json({ message: "Usuario Não existe" })
        }
        const deleteComment = await prisma.comment.deleteMany({
            where: { id: req.params.id }
        })
        return res.status(200).json("Comentario deletado com sucesso", commentDb)
    }
    catch (erro) {
        return res.status(500).json({ message: "Erro ao deletar comentario", erro })
    }
})
export default router;