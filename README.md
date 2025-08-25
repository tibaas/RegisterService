# 📋 App de Registro de Serviços

Este é um aplicativo desenvolvido em React + TypeScript, com autenticação via Google (Supabase Auth) e banco de dados gerenciado pelo Supabase.
O app permite que usuários registrem serviços e que o administrador visualize em uma admin page e gerencie esses registros.


## 🚀 Funcionalidades

### 🔑 Login seguro com Google (via Supabase Auth)

### 📝 Cadastro de serviços com formulário simples

- Seleção de data no calendário (não permite datas passadas)

- Tem limite de registros por dia em 4 horários diferentes

- Campo de comentários adicionais

### 📊 Painel administrativo para visualizar registros

- Status de cada serviço: **Pendente**, **Completo** ou **Cancelado**
- Botões que alteram o status de acordo com a escolha do administrador
  
![bgcardone](https://github.com/user-attachments/assets/1f6d9100-44fc-41e5-adf9-8eb6969530fd)

### 🎨 Estilização feita com styled-components e focada em mobile.

# 🛠️ Tecnologias utilizadas

### ⚛️ React

### 🔷 TypeScript

### 🛡️ Supabase (Auth + Database)

### 💅 Styled-components


# 📦 Como rodar o projeto
### 1. Clone este repositório:
```bash
git clone https://github.com/tibaas/registerservice.git
```
### 2. Acesse a pasta do projeto:

```bash
cd registerservice
```
### 3. Instale as dependências:
```bash
npm install
# ou
yarn install
```

### 4. Crie um arquivo .env na pasta raiz do projeto e adicione suas credênciais do supabase: 
```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```



### 5. Rode o projeto:

```bash
npm run dev
# ou
yarn dev

```

 

 

