# 📋 App de Registro de Serviços

Este é um aplicativo desenvolvido em React + TypeScript, com autenticação via Google (Supabase Auth) e banco de dados gerenciado pelo Supabase.
O app permite que usuários registrem serviços e que o administrador visualize em uma admin page e gerencie esses registros.


## 🚀 Funcionalidades

🔑 Login seguro com Google (via Supabase Auth)

### 📝 Cadastro de serviços com formulário simples

- Seleção de data no calendário (não permite datas passadas)

- Tem limite de registros por dia em 4 horários diferentes

- Campo de comentários adicionais

### 📊 Painel administrativo para visualizar registros

- Status de cada serviço: **Pendente**, **Completo** ou **Cancelado**
- Botões que alteram o status de acordo com a escolha do admistrador
  
![bgcardone](https://github.com/user-attachments/assets/1f6d9100-44fc-41e5-adf9-8eb6969530fd)

### 🎨 Estilização feita com styled-components e focada em mobile.

### 🌐 Rotas:

/ → *Página inicial*

/login → *Rota por onde o administrador efetua login com uma conta google*

/register → *Formulário de registro de serviço*

/admin → *Painel administrativo* 


# 🛠️ Tecnologias utilizadas

### ⚛️ React

### 🔷 TypeScript

### 🛡️ Supabase (Auth + Database)

### 💅 Styled-components
