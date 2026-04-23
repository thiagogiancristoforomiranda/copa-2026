Simulador Copa do Mundo 2026

Projeto desenvolvido como parte do processo seletivo para a vaga de **Estágio em Desenvolvimento de Software 2026** na **Katalyst Data Management / Geopost**.

O sistema consiste em um simulador completo que consome dados de seleções via API, organiza sorteios de grupos e processa todas as etapas de um torneio de futebol até a grande final.

Funcionalidades

- **Consumo de API:** Integração com endpoint REST para buscar as 32 seleções oficiais.
- **Sorteio Randômico:** Distribuição automatizada das seleções em 8 grupos (A-H).
- **Simulação de Partidas:** Geração de placares aleatórios para a fase de grupos.
- **Lógica de Classificação:** Tabela dinâmica com critérios de pontos, saldo de gols e sorteio.
- **Mata-mata Completo:** Chaveamento automático de Oitavas, Quartas, Semifinal e Final.
- **Resolução de Empates:** Sistema de disputa de pênaltis para fases eliminatórias.
- **Registro de Resultado:** Envio automático do campeão e dados da final para a API da Geopost.

Tecnologias Utilizadas

- **HTML5:** Estrutura semântica e acessível.
- **CSS3:** Estilização moderna com Grid, Flexbox e animações customizadas.
- **JavaScript (ES6+):** Lógica de simulação, manipulação de DOM e requisições assíncronas (Async/Await).
- **Bootstrap 5:** Responsividade e componentes de interface.
- **Font Awesome:** Ícones para UI/UX.

Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone [https://github.com/thiagogiancristoforomiranda/copa-2026.git](https://github.com/thiagogiancristoforomiranda/copa-2026.git)
