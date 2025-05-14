import { PrismaClient } from "@prisma/client";
import express, { json } from 'express'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import api from "../../client/src/services/api";
const router = express.Router();
router.use(express.json());

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
router.post('/novoImovel', async (req, res) => {
    console.log("🔵 Requisição recebida");

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
        usuarioId,
        rua,
        bairro,
        numCasa
    } = req.body;

    // 1️⃣ Validação de existência dos campos obrigatórios
    if (!cidade || !paisId || !tipoImovelId || !tipoVendaId ||
        !preco || !largura || !comprimento || !fotoCasa || !qtdQuartos || !rua || !bairro || !numCasa) {
        console.log("⚠️ Campos faltando");
        return res.status(400).json({
            success: false,
            message: "Todos os campos são obrigatórios"
        });
    }

    // // 2️⃣ Validação de ObjectId
    // if (
    //     !isValidObjectId(paisId) ||
    //     !isValidObjectId(tipoImovelId) ||
    //     !isValidObjectId(tipoVendaId) ||
    //     (usuarioId && !isValidObjectId(usuarioId))
    // ) {
    //     return res.status(400).json({ message: "Um ou mais IDs estão inválidos (não são ObjectId válidos)" });
    // }

    console.log("📦 Body validado:", req.body);

    // 3️⃣ Verificação no banco
    try {
        const [pais, tipoImovel, tipoVenda] = await Promise.all([
            prisma.pais.findUnique({ where: { id: paisId } }),
            prisma.tipoImovel.findUnique({ where: { id: tipoImovelId } }),
            prisma.tipoVenda.findUnique({ where: { id: tipoVendaId } }),
        ]);

        if (!pais || !tipoImovel || !tipoVenda) {
            return res.status(400).json({ message: "IDs de referência não encontrados no banco" });
        }

        // 4️⃣ Criação do imóvel
        const novoImovel = await prisma.imovel.create({
            data: {
                Cidade: cidade,
                paisId,
                tipoImovelId,
                tipoVendaId,
                Preco: parseFloat(preco),
                Largura: parseFloat(largura),
                Comprimento: parseFloat(comprimento),
                FotoCasa: fotoCasa,
                QtdQuartos: parseInt(qtdQuartos),
                usuarioId,
                Bairro: bairro,
                NumCasa: parseInt(numCasa),
                Rua: rua
            }
        });

        console.log("✅ Imóvel criado com sucesso");
        return res.status(200).json({ message: "Imovel criado com sucesso", novoImovel });

    } catch (error) {
        console.error("❌ Erro ao criar imóvel:", error);
        return res.status(500).json({
            message: "Erro durante a criação",
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
});
router.delete("/deleteImovel/:id", async (req, res) => {
    const { id } = req.params; // ID do imóvel a ser deletado
    try {
        const imovelDeletado = await prisma.imovel.delete({
            where: { id: parseInt(id) },
        });
        return res.status(200).json({ message: "Imóvel deletado com sucesso", imovelDeletado });
    } catch (error) {
        console.error("Erro detalhado:", error);
        return res.status(500).json({
          success: false,
          message: "Erro ao deletar imóvel",
          ...(process.env.NODE_ENV === 'development' && {
            error: error.message,
            meta: error.meta // Mostra detalhes do erro do Prisma
          })
        });
      }
});
//List Imovel

router.get("/listImovel", async (req, res) => {
    try {
        const imovelDb = await prisma.imovel.findMany({
            include: {
                Pais: true // Isso carrega os dados do país relacionado
            }
        })
        return res.status(200).json({ message: "Todos Imóveis Listados com sucesso", imovelDb })
    } catch (error) {
        return res.status(500).json({ message: "Erro ao listar imóveis" });
        
    }
}
)
router.get("/listImovel/:id", async (req, res) => {
    try{

        const imovelDb = await prisma.imovel.findUnique({
            where: { id: req.params.id },
            include: {
                Pais: true,
                tipoVenda: true,
                TipoImovel: true,
                usuario: true,
                comments: true
            }
        })
        if (!imovelDb) {
            return res.status(404).json({ message: "Imóvel não encontrado" })
        }
        return res.status(200).json({ message: "Imóvel encontrado", imovelDb })
    }
    catch(error){
        return res.status(500).json({ message: "Erro ao listar imóveis" });
    }
})
router.get("/filtroImovel/:paisId/:tipoImovelId/:precoMax", async (req, res) => {
    try {
      // Converter parâmetros para os tipos corretos
      const paisId = req.params.paisId;
      const tipoImovelId = req.params.tipoImovelId;
      const precoMax = parseFloat(req.params.precoMax);
  
      // Validar conversão do preço
      if (isNaN(precoMax)) {
        return res.status(400).json({ error: "O preço máximo deve ser um número válido" });
      }
  
      // Consulta com filtros
      const imoveis = await prisma.imovel.findMany({
        where: {
          paisId: paisId,
          tipoImovelId: tipoImovelId,
          Preco: {
            lte: precoMax // "less than or equal" (menor ou igual)
          }
        },
                include: {
                Pais: true,
                tipoVenda: true,
                TipoImovel: true,
                usuario: true,
                comments: true
            }
      });
  
      return res.status(200).json(imoveis);
  
    } catch (error) {
      console.error("Erro ao filtrar imóveis:", error);
      return res.status(500).json({ 
        error: "Erro interno ao filtrar imóveis",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
export default router;