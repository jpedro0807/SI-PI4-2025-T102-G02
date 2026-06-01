[README.md](https://github.com/user-attachments/files/23967391/README.md)
# 🧾 HealthMoney --- Sistema de Gestão Financeira e Clínica

O **HealthMoney** é uma aplicação completa para gestão financeira e
administrativa de clínicas, permitindo controle de pacientes, despesas,
notas fiscais, relatórios financeiros e integração com a Google Agenda.

O projeto é dividido em dois módulos:

-  **healthmoney_dashboard_vite** → Frontend (Vite + React)
-  **healthmoney_server** → Backend (Java + Spring Boot)

---

## 📌 **Equipe**

-  **Caio Eduardo Monforte Medeiros** --- RA **24017959**
-  **Johnas Pereira Ignacio** --- RA **24009371**
-  **João Pedro Barbosa da Silva** --- RA **25016974**
-  **Hector Lopes** --- RA **25013988**

---

# 🚀 Tecnologias Utilizadas

### **Frontend**

-  Vite
-  React
-  Axios
-  Tailwind (se aplicável)
-  XLSX (geração de arquivos Excel)

### **Backend**

-  Java 17+
-  Spring Boot
-  Spring Security
-  JPA / Hibernate
-  MySQL
-  Maven
-  Integração com Google API (Agenda)

---

# 📁 Estrutura do Projeto

    projetoIntegrador04/
    │
    ├── healthmoney_dashboard_vite/   # Frontend (React + Vite)
    │
    └── healthmoney_server/           # Backend (Spring Boot)

---

# ⚙️ Como Executar o Projeto

A seguir estão todos os passos para que os professores consigam **baixar
o código e executá-lo em ambiente de testes**.

---

# 🖥️ Backend --- Spring Boot

## ✅ **1. Requisitos**

-  Java 17+
-  Maven
-  MySQL
-  Google Credentials (para integração com Agenda --- opcional)

---

## 🔧 **2. Configurar o Banco de Dados**

Crie o banco:

```sql
CREATE DATABASE healthmoney;
```

Edite:

    healthmoney_server/src/main/resources/application.properties

E configure:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthmoney
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## ▶️ **3. Rodar o Backend**

```bash
cd healthmoney_server
mvn spring-boot:run
```

A API estará em:

    http://localhost:8080

---

# 🌐 Frontend --- Vite + React

## ✅ **1. Requisitos**

-  Node.js 18+

---

## 📦 **2. Instalar Dependências**

```bash
cd healthmoney_dashboard_vite
npm install
```

---

## ▶️ **3. Rodar o Frontend**

```bash
npm run dev
```

Rodará em:

    http://localhost:5173

---

# 🔐 Login

> Ajustar conforme configuração do Spring Security.

Exemplo:

    Usuário: admin
    Senha: admin123

---

# 📡 Integração com Google Agenda

Colocar o arquivo `credentials.json` em:

    healthmoney_server/src/main/resources/credentials.json

---

# 📦 Build Produção

### Backend

```bash
mvn clean package
```

Gera:

    healthmoney_server/target/healthmoney.jar

### Frontend

```bash
npm run build
```

---

# 📄 Licença

Projeto acadêmico --- PUC / Projeto Integrador.
