# Desafio Montink E-commerce

Este é um projeto front-end simples que demonstra uma página de detalhes de produto para um e-commerce, construído com Next.js e TypeScript. Ele exibe informações do produto, permite selecionar variantes (cores e tamanhos) e calcular o frete.

[👉 Acesse o projeto aqui](https://desafio-montink.netlify.app)

## Tecnologias Utilizadas

* **Next.js:** Framework React para desenvolvimento web.
* **React:** Biblioteca JavaScript para construir interfaces de usuário.
* **TypeScript:** Adiciona tipagem estática ao JavaScript.
* **Tailwind CSS:** Framework CSS para estilização rápida e responsiva.
* **Radix UI:** Componentes acessíveis (usados como base).
* **Lucide React:** Ícones para a interface.
* **Sonner:** Para notificações (toasts).
* Integração com API para calcular frete (ViaCEP).
* Gerenciamento de estado com React Context API.
Integração com API para calcular frete (ViaCEP).
* Gerenciamento de estado com React Context API: Utilizada para compartilhar dados importantes entre componentes sem a necessidade de passar props manualmente em múltiplos níveis. Ideal para gerenciar o estado do produto selecionado, variações, informações do carrinho ou resultados do cálculo de frete, centralizando o estado e evitando o "prop drilling".

## Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o projeto na sua máquina.

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/EriveltonMGit/Desafio_Montink.git
    cd ecommerce
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

O projeto estará disponível em `http://localhost:3000`.
