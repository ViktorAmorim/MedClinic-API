import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateDTO } from "../middlewares/validateDTO";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { LoginUserDTO } from "../dtos/LoginUserDTO";

const authRoutes = Router();
const authController = new AuthController();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDTO'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso, sem perfil de acesso atribuído.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             examples:
 *               usuarioSemPerfil:
 *                 summary: Cadastro público sem perfil de acesso
 *                 value:
 *                   id: "3c0c4c4c-3c0c-4c0c-3c0c-3c0c0c0c0c0c"
 *                   nome: "João da Silva"
 *                   email: "joao@medclinic.com"
 *                   role: null
 *                   criado_em: "2026-10-23T23:00:00.000Z"
 *       400:
 *         description: Dados de entrada inválidos.
 *       409:
 *         description: Email já cadastrado.
 *       500:
 *         description: Erro interno no servidor.
 */
authRoutes.post(
  "/register",
  validateDTO(CreateUserDTO),
  asyncHandler((req, res) => authController.register(req, res)),
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDTO'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticação.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             examples:
 *               loginSucesso:
 *                 summary: Login de usuário autenticado
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIs..."
 *                   user:
 *                     id: "3c0c4c4c-3c0c-4c0c-3c0c-3c0c0c0c0c0c"
 *                     nome: "João da Silva"
 *                     email: "joao@medclinic.com"
 *                     role: null
 *                     criado_em: "2026-10-23T23:00:00.000Z"
 *       400:
 *         description: Dados de entrada invalidos.
 *       401:
 *         description: Email ou senha incorretos.
 *       500:
 *         description: Erro interno no servidor.
 */
authRoutes.post(
  "/login",
  validateDTO(LoginUserDTO),
  asyncHandler((req, res) => authController.login(req, res)),
);

export { authRoutes };
