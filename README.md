# PayAuth Frontend

Frontend moderno para sistema de autenticação integrado com NestJS backend.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **TailwindCSS** para estilização
- **React Router 6** para roteamento
- **React Hook Form** + **Zod** para validação de formulários
- **Radix UI** componentes acessíveis
- **ViaCEP API** para validação de CEP brasileiro

## 🔧 Configuração

### 1. Clonar e instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e configure a URL do seu backend NestJS:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Executar o frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🔌 Integração com Backend

Este frontend foi projetado para funcionar com o backend NestJS disponível em:
**https://github.com/Giovana-Manuquian/paynet-task**

### Endpoints esperados pelo frontend:

- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login do usuário
- `POST /auth/forgot-password` - Recuperação de senha
- `GET /auth/profile` - Perfil do usuário autenticado
- `PATCH /auth/profile` - Atualização do perfil
- `POST /auth/refresh` - Refresh do token JWT

### Estrutura esperada para registro:

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "address": {
    "street": "string",
    "neighborhood": "string",
    "number": "string",
    "city": "string",
    "state": "string",
    "cep": "string"
  }
}
```

### Resposta esperada da autenticação:

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "createdAt": "string"
  },
  "access_token": "string"
}
```

## 🎨 Características

### Design

- ✅ Visual moderno inspirado em fintechs
- ✅ Paleta de cores azul/verde profissional
- ✅ Totalmente responsivo
- ✅ Componentes acessíveis (ARIA)

### Funcionalidades

- ✅ Cadastro com validação de CEP brasileiro
- ✅ Login com JWT
- ✅ Recuperação de senha
- ✅ Dashboard protegido
- ✅ Validação de formulários em tempo real
- ✅ Notificações toast
- ✅ Estados de loading

### Segurança

- ✅ Autenticação JWT
- ✅ Rotas protegidas
- ✅ Validação client-side e server-side
- ✅ Sanitização de inputs

## 📝 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run typecheck    # Verificação de tipos
npm test             # Executar testes
```

## 🌐 Integração com ViaCEP

O sistema utiliza a API pública do ViaCEP para validação e preenchimento automático de endereços brasileiros. Não requer configuração adicional.

## 🔒 Autenticação

O sistema utiliza JWT tokens para autenticação. O token é armazenado no localStorage e incluído automaticamente em todas as requisições para endpoints protegidos.

## 📱 Responsividade

O frontend é totalmente responsivo e funciona perfeitamente em:

- 📱 Mobile (320px+)
- 📋 Tablet (768px+)
- 🖥️ Desktop (1024px+)

## 🛠️ Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   └── ui/           # Componentes de UI (shadcn)
├── contexts/         # Context providers (Auth)
├── pages/            # Páginas da aplicação
├── services/         # Serviços de API
├── hooks/            # Custom hooks
├── lib/              # Utilitários
└── config/           # Configurações
```

## 🎯 Próximos Passos

Para usar este frontend:

1. ✅ Configure e execute o backend NestJS
2. ✅ Configure as variáveis de ambiente
3. ✅ Execute `npm run dev`
4. ✅ Acesse `http://localhost:5173`
5. ✅ Crie uma conta ou faça login

## 🐛 Troubleshooting

### Erro de CORS

Se encontrar problemas de CORS, configure o backend NestJS para permitir requisições do frontend:

```typescript
// main.ts no NestJS
app.enableCors({
  origin: "http://localhost:5173",
  credentials: true,
});
```

### Erro de conexão

Verifique se:

- O backend está rodando na porta correta
- A variável `VITE_API_URL` está configurada corretamente
- Não há firewall bloqueando as conexões

---
