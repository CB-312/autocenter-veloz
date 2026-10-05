# Auto Center Veloz

Site web que leva a comunicação da oficina Auto Center Veloz para o digital: o cliente acompanha o andamento do conserto e aprova orçamentos pela internet, sem precisar ligar para a recepção.

> Projeto desenvolvido como Estudo de Caso 3 da disciplina de Design Profissional.

---

## Sumário

- [Briefing do problema](#briefing-do-problema)
- [Justificativa da solução](#justificativa-da-solução)
- [Funcionalidades](#funcionalidades)
- [Protótipos e telas](#protótipos-e-telas)
- [Arquitetura](#arquitetura)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Instruções de execução](#instruções-de-execução)
- [Limitações e próximos passos](#limitações-e-próximos-passos)
- [Licença](#licença)
- [Autor](#autor)

---

## Briefing do problema

A Auto Center Veloz é uma oficina mecânica especializada em manutenção preventiva e corretiva de veículos de passeio, liderada pelos irmãos Eduardo (gerente de oficina) e Henrique (financeiro e compras). A oficina conta com 5 elevadores, 6 mecânicos e 2 recepcionistas, e tem excelente reputação técnica na cidade.

Hoje, a recepção cadastra o veículo e emite um orçamento impresso quando o cliente deixa o carro, e as peças extras são autorizadas por ligação. Com o crescimento da base de clientes, isso gerou gargalos:

- O telefone da recepção não para de tocar com clientes querendo saber se o carro está pronto ou pedindo fotos das peças com defeito.
- Os mecânicos interrompem o serviço para responder à recepção.
- Os clientes demoram horas para aprovar orçamentos por mensagem.
- O pátio fica lotado de carros parados aguardando resposta.

Se nada mudar, a oficina perde eficiência operacional e começa a acumular avaliações negativas por falha de comunicação. A concorrência é formada por concessionárias, que oferecem relatórios digitais a preços altos, e por oficinas pequenas e informais. A oportunidade da Auto Center Veloz é unir a confiança técnica que já tem a um canal de comunicação e aprovação rápido e transparente.

### Objetivos da solução

1. Reduzir as ligações sobre o status do conserto.
2. Acelerar a aprovação de orçamentos e de serviços adicionais.
3. Dar ao cliente transparência sobre o que foi feito no veículo.
4. Diminuir o tempo de permanência dos carros no pátio.

---

## Justificativa da solução

Entre aplicativo móvel, sistema/dashboard e site, a escolha foi um **site web responsivo** com área do cliente e área do funcionário:

- **Sem instalação:** o cliente acessa por qualquer navegador, no celular ou no computador. Isso é decisivo para um público de pouco tempo, que só precisa do sistema em momentos pontuais.
- **Dupla função:** o mesmo endereço é vitrine institucional (serviços, equipe, horários, garantia, pagamento e contato) e canal de acompanhamento, o que fortalece a presença digital da oficina diante da concorrência.
- **Status sem burocracia:** o cliente consulta o andamento pela placa e pelo protocolo recebido na recepção, sem criar conta, ou entra na conta para ver seus veículos automaticamente.
- **Aprovação no próprio site:** aceitar, recusar ou cancelar um orçamento na tela elimina a ligação de autorização e o tempo de espera.
- **Baixo custo de manutenção:** uma aplicação estática, sem dependências, é simples de publicar e de evoluir.
- **Por que não um app ou um dashboard:** um app nativo exigiria publicação em lojas e instalação pelo cliente, sem ganho real para as necessidades levantadas. Um dashboard atenderia só a equipe interna e não resolveria a dor principal, que é a comunicação com o cliente.

### Como a solução resolve a dor

| Dor | Resposta do site |
| --- | --- |
| Excesso de ligações sobre o status | Área **Status** com as etapas concluídas, consultável por conta ou por placa e protocolo |
| Pedidos de fotos das peças | A oficina anexa imagem ou PDF às etapas, e o cliente baixa direto no Status |
| Demora na aprovação de orçamentos | O cliente aceita, recusa ou cancela no próprio site, ou pede contato se tiver dúvida |
| Mecânicos interrompidos pela recepção | Menos perguntas por telefone e atualização do serviço em um só lugar |
| Novos clientes e agendamentos | Formulário de solicitação com dados do cliente, placa e descrição do problema |

### Decisões de design

- **Identidade visual:** fundo preto, detalhes em vermelho (`#d4161c`) e texto branco, remetendo a força e velocidade, em coerência com o nome "Veloz".
- **Tipografia:** apenas Arial, sem fontes externas, para carregamento rápido e funcionamento offline.
- **Navegação simples:** menu com Serviços, Contato e Status em uma única página e ícone de perfil sempre à direita.
- **Validação de dados:** e-mail, telefone, placa (padrão antigo e Mercosul), RENAVAM e senha são validados antes de qualquer envio.

---

## Funcionalidades

### Área pública e do cliente

- **Home** com carrossel automático de fotos da oficina e chamada para a seção de serviços.
- **Serviços:** seis cards expansíveis com a descrição de cada serviço.
- **Equipe e horários:** tabela da equipe e tabela de horários com os funcionários presentes em cada faixa.
- **Contato:** WhatsApp, telefone fixo, e-mail e redes sociais, mais um **formulário de solicitação de atendimento** (nome, contato, placa e descrição do problema).
- **Status do veículo:**
  - consulta por placa e protocolo, sem necessidade de conta;
  - com conta, os veículos cadastrados aparecem automaticamente;
  - lista das etapas concluídas, com anexos (foto ou PDF) quando a oficina os envia;
  - **orçamentos:** o cliente pode aceitar, recusar, cancelar o serviço ou entrar em contato;
  - **alterações propostas pela oficina:** aumento, alteração ou remoção de itens que o cliente permite ou recusa na própria tela.
- **Conta do cliente:** criar conta, entrar, sair e gerenciar a conta (cadastrar e remover veículos por placa e RENAVAM, alterar e-mail, número e senha).
- **Páginas institucionais:** Garantia e Sobre Nós.
- **Rodapé** com links institucionais, meios de pagamento (Visa, Mastercard, Hipercard, Elo, American Express, Pix, boleto e dinheiro), contato para "Trabalhe conosco", endereço, telefone e redes sociais.

### Área do funcionário

- Versão do site com a opção **Gerenciar Serviços** no menu.
- **Registro de novo serviço** (placa, modelo, cliente e orçamento), gerando o protocolo.
- **Lista de todos os serviços em andamento**, com atualização de cada um.
- **Registro de etapas concluídas**, com anexo opcional de foto ou PDF.
- **Aumento de orçamento** enviado para aprovação do cliente.
- **Proposta de alteração ou remoção** de um orçamento existente.

---

## Protótipos e telas

<!-- Ajuste os caminhos conforme as capturas de tela do repositório. -->

### Home

![Home](docs/telas/home.png)

### Status do cliente: etapas e aprovação de orçamento

![Status do cliente](docs/telas/status-cliente.png)

### Criar conta

![Criar conta](docs/telas/criar-conta.png)

### Área do funcionário

![Área do funcionário](docs/telas/area-funcionario.png)

### Versão mobile

<img src="docs/telas/mobile.png" alt="Home em tela de celular" width="300">

---

## Arquitetura

O projeto é uma aplicação **front-end estática**, sem build, sem framework e sem dependências externas. Todo o processamento acontece no navegador.

| Camada | Tecnologia | Papel |
| --- | --- | --- |
| Estrutura | HTML5 | Páginas semânticas e acessíveis (`aria-label`, `role="status"`, `aria-expanded`) |
| Estilo | CSS3 | Layout responsivo com Grid e Flexbox, variáveis CSS para as cores |
| Lógica | JavaScript (ES6+) | Validações, autenticação local, regras de orçamento e renderização dinâmica |
| Persistência | `localStorage` | Contas, sessão, serviços, orçamentos e agendamentos |

### Organização do código

Um único script (`js/app.js`) é carregado por todas as páginas. O atributo `data-page` do `<body>` indica qual página está aberta e qual módulo iniciar:

| `data-page` | Módulo | Responsabilidade |
| --- | --- | --- |
| `index` | `iniciarIndex` | Carrossel, cards de serviço, consulta de status, aprovação de orçamentos e formulário de agendamento |
| `conta` | `iniciarConta` | Cadastro, login e gerenciamento de conta e veículos |
| `func` | `iniciarFuncionario` | Registro de serviços, etapas e propostas de orçamento |

Funções compartilhadas (validadores, normalização de placa e contato, formatação de moeda, escape de HTML e acesso ao `localStorage`) ficam no topo do arquivo. Todo texto digitado pelo usuário é escapado antes de ser inserido na página, prevenindo injeção de HTML.

### Dados

| Chave | Conteúdo |
| --- | --- |
| `acv_usuarios` | Contas de clientes e seus veículos |
| `acv_sessao` | Sessão ativa |
| `acv_servicos` | Serviços, etapas concluídas e orçamentos |
| `acv_agendamentos` | Solicitações enviadas pelo formulário de contato |

Na primeira abertura é criado um serviço de demonstração (Honda Civic, placa `ABC1D23`, protocolo `1001`) para que a área de Status possa ser testada.

### Fluxo de aprovação de orçamento

```text
Funcionário registra o serviço e o orçamento (pendente)
        ↓
Cliente vê o orçamento em "Status"
        ↓
Aceita / Recusa / Cancela o serviço / Entra em contato
        ↓
Se a oficina precisar ajustar: propõe alteração, remoção ou aumento
        ↓
Cliente permite ou recusa a proposta
```

---

## Estrutura do projeto

```text
autocenter-veloz/
├── index.html          # Página principal (Home, Serviços, Contato e Status)
├── conta.html          # Entrar, criar conta e gerenciar conta
├── funcionario.html    # Gerenciamento de serviços
├── garantia.html       # Política de garantia
├── sobre-nos.html      # Sobre a oficina
├── css/
│   └── style.css       # Estilos de todas as páginas
├── js/
│   └── app.js          # Lógica da aplicação
├── img/
│   ├── logo.png
│   ├── favicon.png
│   ├── slide1.jpg      # Imagens do carrossel
│   ├── slide2.jpg
│   ├── slide3.jpg
│   └── pagamento/      # Logos dos meios de pagamento
├── docs/
│   └── telas/          # Capturas de tela usadas neste README
├── .gitignore
├── LICENSE
└── README.md
```

---

## Instruções de execução

### Requisitos

Apenas um navegador moderno (Chrome, Edge, Firefox ou Safari). Não há instalação nem dependências.

### Passo a passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/<seu-usuario>/autocenter-veloz.git
   cd autocenter-veloz
   ```

2. Abra o arquivo `index.html` no navegador (duplo clique ou arrastando para a janela).

Se preferir um servidor local, rode na pasta do projeto e acesse `http://localhost:8000`:

```bash
python -m http.server 8000
```

Também funciona com a extensão **Live Server** do VS Code.

### Roteiro de teste

**Consulta sem conta**

1. Na seção **Status**, informe a placa `ABC1D23` e o protocolo `1001`.
2. O serviço de demonstração aparece com suas etapas e um orçamento pendente para aceitar, recusar ou cancelar.

**Com conta de cliente**

1. No ícone de perfil, escolha **Criar conta** e cadastre um e-mail ou número e uma senha (6 a 32 caracteres, sem espaços).
2. Em **Gerenciar minha conta**, cadastre o veículo com a placa `ABC1D23` e o RENAVAM `00000000019`.
3. Volte à seção **Status**: o veículo aparece automaticamente.

**Solicitação de atendimento**

Preencha o formulário da seção **Contato**. Contato e placa precisam estar em formato válido.

> Os dados ficam salvos no navegador. Para voltar ao estado inicial, limpe os dados do site nas configurações do navegador.

---

## Limitações e próximos passos

Esta versão roda inteiramente no navegador. Por isso:

- Os dados ficam no dispositivo em que foram criados: uma atualização feita pela oficina não aparece em outro aparelho.
- Os anexos das etapas são limitados a 700 KB por arquivo.
- Os envios do formulário de contato ficam armazenados localmente, sem chegar a uma caixa de entrada real.
- Os links das redes sociais são ilustrativos.

Para uma versão em produção, os próximos passos naturais são:

1. **Back-end com API e banco de dados** para sincronizar serviços entre oficina e clientes.
2. **Autenticação segura**, com senhas protegidas por hash e controle de perfis.
3. **Notificações automáticas** por WhatsApp ou e-mail a cada nova etapa ou orçamento pendente.
4. **Armazenamento de arquivos** em nuvem para fotos das peças e laudos.
5. **Integração com o sistema de gestão** da oficina.

---

## Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Autor

**Gabriel Kazuya Matsumoto**: projeto individual para o Estudo de Caso 3 da disciplina de Design Profissional, sob orientação do Prof. Sedenilso Antonio Machado.
