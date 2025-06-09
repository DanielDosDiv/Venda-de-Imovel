import jwt from "jsonwebtoken";
const JWT_SECREAT = process.env.JWT_SECREAT

const auth = (req, res, next) =>{
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: "Nenhum token enviado" });
    }
    if (!token.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Formato de token inválido" });

    }
    try {
        // Remove o prefixo "Bearer " e verifica o token
        const tokenWithoutBearer = token.replace('Bearer ', '');
        const decodedToken = jwt.verify(tokenWithoutBearer, JWT_SECRET);

        // Adiciona o ID do usuário à requisição
        req.userId = decodedToken.id;

        // Prossegue para a próxima função/middleware
        next();
    } catch (error) {
        // Captura erros relacionados ao token (inválido, expirado, etc.)
        console.error("Erro na verificação do token:", error);
        return res.status(401).json({ message: "Não Autorizado" });
    }
};
export default auth