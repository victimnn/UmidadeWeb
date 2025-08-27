# 🌱 Horta Inteligente - Sistema de Monitoramento de Umidade

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Arduino](https://img.shields.io/badge/Arduino-Compatible-blue.svg)](https://www.arduino.cc/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Sistema completo de monitoramento de umidade do solo com interface web moderna e comunicação em tempo real**

## 📋 **Índice**

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Requisitos](#️-requisitos)
- [🔌 Hardware](#-hardware)
- [⚙️ Instalação](#️-instalação)
- [🔧 Configuração](#-configuração)
- [🚀 Como Usar](#-como-usar)
- [🧪 Testes](#-testes)
- [🔍 Solução de Problemas](#-solução-de-problemas)
- [📱 Interface Web](#-interface-web)
- [🔄 Desenvolvimento](#-desenvolvimento)
- [📚 Documentação](#-documentação)

## 🎯 **Sobre o Projeto**

A **Horta Inteligente** é um sistema completo de monitoramento de umidade do solo que combina:

- **Arduino** para leitura do sensor
- **Node.js** para servidor backend
- **Interface web moderna** para visualização em tempo real
- **Comunicação serial** para dados em tempo real
- **Sistema de alertas** inteligente

### **Arquitetura do Sistema**

```
┌─────────────┐    USB    ┌─────────────┐    HTTP    ┌─────────────┐
│   Sensor    │ ────────→ │   Arduino   │ ────────→ │   Node.js   │
│  Umidade    │           │   (A0)      │           │   Server    │
└─────────────┘           └─────────────┘           └─────────────┘
                                                           │
                                                           ▼
                                                   ┌─────────────┐
                                                   │   Browser   │
                                                   │  Interface  │
                                                   └─────────────┘
```

## ✨ **Funcionalidades**

### **🎨 Interface Web Moderna**
- **Design responsivo** para todos os dispositivos
- **Círculo de progresso circular** para visualização da umidade
- **Gráfico em tempo real** com histórico de 30 pontos
- **Sistema de alertas** contextual e inteligente
- **Estatísticas em tempo real** (média, máximo, mínimo)

### **📊 Monitoramento Inteligente**
- **Leitura contínua** a cada segundo
- **Calibração automática** do sensor
- **Alertas baseados em níveis** críticos
- **Histórico de dados** para análise
- **Status de conexão** em tempo real

### **🔌 Comunicação Robusta**
- **Comunicação serial** via USB
- **Tratamento de erros** avançado
- **Reconexão automática** em caso de falha
- **Validação de dados** em tempo real

## 🛠️ **Requisitos**

### **Software**
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Arduino IDE** ([Download](https://www.arduino.cc/en/software))
- **Navegador web** moderno (Chrome, Firefox, Safari, Edge)

### **Hardware**
- **Arduino** (qualquer modelo com porta USB)
- **Sensor de umidade do solo** (capacitivo ou resistivo)
- **Cabo USB** para conectar ao computador
- **Jumpers** para conexões (opcional)

## 🔌 **Hardware**

### **Tipos de Sensores Suportados**

#### **1. Sensor Capacitivo (Recomendado)**
- **Modelo**: VH400, Capacitive Soil Moisture Sensor
- **Vantagens**: Não oxida, mais durável, leitura estável
- **Preço**: R$ 15-25
- **Tensão**: 3.3V ou 5V

#### **2. Sensor Resistivo (Mais Barato)**
- **Modelo**: FC-28, Resistive Soil Moisture Sensor
- **Vantagens**: Mais barato, fácil de encontrar
- **Desvantagens**: Oxida com o tempo, menos preciso
- **Tensão**: Apenas 5V

### **Conexões dos Pinos**

```
Sensor → Arduino
┌─────────────┐      ┌─────────────┐
│ VCC         │──────│ 5V ou 3.3V │
│ GND         │──────│ GND         │
│ AO/SIG      │──────│ A0          │ ← Pino analógico
│ DO          │──────│ [NÃO USAR]  │ ← Deixe desconectado
└─────────────┘      └─────────────┘
```

**⚠️ Importante**: Use apenas o pino **AO** (analógico). O pino **DO** (digital) não é necessário para este projeto.

### **📁 Estrutura de Pastas Arduino**

O projeto Arduino está organizado em uma pasta separada (`teste_umidade/`) para facilitar:
- **Abertura no Arduino IDE** usando "Arquivo → Abrir Pasta"
- **Organização** do código e recursos
- **Compatibilidade** com diferentes versões do Arduino IDE
- **Versionamento** independente do código Arduino

## ⚙️ **Instalação**

### **1. Clone o Repositório**
```bash
git clone https://github.com/victimnn/UmidadeWeb.git
cd UmidadeWeb
```

### **2. Instale as Dependências**
```bash
npm install
```

### **3. Verifique a Instalação**
```bash
npm list
```

## 🔧 **Configuração**

### **1. Configurar o Arduino**

#### **Abrir o Projeto no Arduino IDE**
1. **Abra o Arduino IDE**
2. **Arquivo → Abrir Pasta** (ou **File → Open Folder**)
3. **Navegue até** a pasta `teste_umidade/` do projeto
4. **Selecione a pasta** e clique em **Abrir**
5. O Arduino IDE abrirá automaticamente o arquivo `teste_umidade.ino`

#### **Upload do Código**
1. Conecte o Arduino via USB
2. Selecione a porta correta em **Ferramentas → Porta**
3. Selecione o modelo correto em **Ferramentas → Placa**
4. Clique em **Upload** (ou pressione **Ctrl+U**)

#### **Calibração do Sensor**
```cpp
// Ajuste estes valores no arquivo teste_umidade/teste_umidade.ino:
const int valorSensorSeco = 850;   // ← Sensor no AR
const int valorSensorUmido = 400;  // ← Sensor na ÁGUA
```

**Como calibrar:**
1. Abra o **Monitor Serial** (9600 baud)
2. Coloque o sensor no **ar** e anote o valor
3. Mergulhe o sensor na **água** e anote o valor
4. Atualize as constantes no código

### **2. Configurar o Servidor**

#### **Verificar Porta COM**
```bash
npx @serialport/list
```

#### **Ajustar Porta no Código**
```javascript
// Em server.js, linha 18:
const ARDUINO_PORT_PATH = 'COM3'; // ← Mude para sua porta
```

### **3. Configurar Interface Web**

A interface web é configurada automaticamente e não requer configuração adicional.

## 🚀 **Como Usar**

### **1. Iniciar o Sistema**

#### **Opção A: Comando Direto**
```bash
npm start
```

#### **Opção B: Desenvolvimento**
```bash
# Para desenvolvimento com auto-reload
npm run dev
```

### **2. Acessar a Interface**

1. **Abra o navegador**
2. **Acesse**: `http://localhost:3000`
3. **Aguarde** a conexão com o Arduino

### **3. Monitorar a Umidade**

- **Círculo de progresso**: Mostra umidade atual
- **Gráfico**: Histórico em tempo real
- **Estatísticas**: Média, máximo, mínimo
- **Alertas**: Notificações automáticas

## 🧪 **Testes**

### **Teste 1: Comunicação Serial**
1. Abra o **Monitor Serial** do Arduino IDE
2. Você deve ver:
```
Sensor de Umidade do Solo - Iniciado
Enviando dados a cada 1 segundo...
45
46
47
```

### **Teste 2: Servidor Node.js**
1. Execute `npm start`
2. Verifique o console:
```
Servidor rodando na porta 3000
Conexão serial com a porta COM3 aberta.
Dados do Arduino: 45
```

### **Teste 3: Interface Web**
1. Acesse `http://localhost:3000`
2. Deve aparecer: **"✅ Conectado ao Arduino"**
3. Medidor deve mostrar valores em tempo real

### **Teste 4: Sensor**
- **Sensor no ar**: Valores altos (800-1023)
- **Sensor na água**: Valores baixos (0-400)
- **Sensor no solo**: Valores intermediários

## 🔍 **Solução de Problemas**

### **Erro: "Falha ao iniciar a conexão serial"**
```bash
# Verificar portas disponíveis
npx @serialport/list

# Verificar se Arduino está conectado
# Verificar se porta está correta em server.js
```

### **Erro: "Sem dados do Arduino"**
- Verificar se código foi enviado para Arduino
- Abrir Monitor Serial para ver dados
- Verificar conexões do sensor

### **Valores de umidade incorretos**
- Calibrar sensor (ar vs. água)
- Verificar conexões (A0, VCC, GND)
- Testar com valores conhecidos

### **Interface não atualiza**
- Verificar console do navegador (F12)
- Verificar se servidor está rodando
- Verificar erros no console do servidor

### **Problemas de Hardware**

#### **Valores sempre 0**
- **Causa**: Sensor não conectado
- **Solução**: Verificar todas as conexões

#### **Valores sempre 1023**
- **Causa**: Sensor em curto-circuito
- **Solução**: Verificar se fios não se tocam

#### **Valores instáveis**
- **Causa**: Conexões frouxas
- **Solução**: Firmar conexões, adicionar capacitor 100nF

## 📱 **Interface Web**

### **Componentes Principais**

#### **1. Header Inteligente**
- Logo animado com ícone de planta
- Badge de status de conexão
- Subtítulo descritivo

#### **2. Card de Umidade Atual**
- Círculo de progresso circular
- Valor central grande
- Status contextual por cores
- Timestamp de atualização

#### **3. Card de Estatísticas**
- Média dos últimos 100 registros
- Valor máximo e mínimo
- Contador total de leituras

#### **4. Gráfico em Tempo Real**
- 30 pontos de dados
- Tooltips interativos
- Botão de reset

#### **5. Sistema de Alertas**
- Alertas contextuais
- Auto-remoção após 10s
- Categorias: Info, Success, Warning, Error

### **Cores por Status**
- **🟢 Verde (70-100%)**: Solo úmido - Condições ideais
- **🟡 Amarelo (30-69%)**: Umidade moderada
- **🔴 Vermelho (0-29%)**: Solo seco - Regar necessário

### **Responsividade**
- **Desktop**: Layout em grid com cards lado a lado
- **Mobile**: Layout empilhado otimizado
- **Breakpoints**: 1200px, 768px, 480px

## 🔄 **Desenvolvimento**

### **Estrutura do Projeto**
```
UmidadeWeb/
├── public/                 # Interface web
│   ├── index.html         # Página principal
│   ├── style.css          # Estilos CSS
│   └── script.js          # JavaScript frontend
├── teste_umidade/         # Projeto Arduino
│   └── teste_umidade.ino  # Código Arduino
├── server.js              # Servidor Node.js
├── package.json           # Dependências
└── README.md              # Este arquivo
```

### **Scripts Disponíveis**
```bash
npm start          # Iniciar servidor
npm run dev        # Modo desenvolvimento
npm test           # Executar testes
npm run build      # Build para produção
```

### **Dependências Principais**
- **express**: Servidor web
- **socket.io**: Comunicação em tempo real
- **serialport**: Comunicação serial com Arduino
- **chart.js**: Gráficos interativos

## 📚 **Documentação**

### **Arquivos de Documentação**
- **`INSTRUCOES.md`**: Guia de configuração detalhado
- **`CONEXAO_SENSOR.md`**: Guia de conexão do hardware
- **`DEMO_INTERFACE.md`**: Documentação da interface web

### **APIs e Endpoints**

#### **WebSocket Events**
```javascript
// Receber dados de umidade
socket.on('humidity', (data) => {
    console.log('Umidade:', data);
});

// Receber erros
socket.on('error', (message) => {
    console.error('Erro:', message);
});
```

#### **HTTP Endpoints**
- **`GET /`**: Interface web principal
- **`GET /api/status`**: Status do sistema
- **`GET /api/humidity`**: Última leitura de umidade

### **Configurações Avançadas**

#### **Variáveis de Ambiente**
```bash
# .env
ARDUINO_PORT=COM3
BAUD_RATE=9600
SERVER_PORT=3000
```

#### **Personalização de Alertas**
```javascript
// Em script.js
const ALERT_THRESHOLDS = {
    critical: 20,    // Umidade crítica
    warning: 30,     // Umidade baixa
    optimal: 70      // Umidade ideal
};
```

## 🚀 **Próximas Melhorias**

### **Funcionalidades Planejadas**
1. **Dashboard expandido** com múltiplos sensores
2. **Histórico persistente** em banco de dados
3. **Notificações push** por email/SMS
4. **Exportação de dados** em CSV/PDF
5. **Modo escuro/claro** toggle
6. **Configurações personalizáveis**

### **Integrações Futuras**
- **Home Assistant** para automação residencial
- **IFTTT** para ações automáticas
- **API REST** para integração com outros sistemas
- **Módulo WiFi** para comunicação sem fio

## 🤝 **Contribuição**

### **Como Contribuir**
1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

### **Padrões de Código**
- **JavaScript**: ES6+, Prettier
- **CSS**: CSS3, variáveis CSS
- **HTML**: HTML5 semântico
- **Arduino**: C++ padrão

## 📄 **Licença**

Este projeto está licenciado sob a licença **ISC** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 **Agradecimentos**

- **Arduino** pela plataforma de desenvolvimento
- **Node.js** pela plataforma JavaScript
- **Chart.js** pelos gráficos interativos
- **Font Awesome** pelos ícones
- **Comunidade open source** pelo suporte

---

## 📞 **Suporte**

### **Problemas Comuns**
- [Issues do GitHub](https://github.com/seu-usuario/UmidadeWeb/issues)
- [Wiki do Projeto](https://github.com/seu-usuario/UmidadeWeb/wiki)
- [FAQ](https://github.com/seu-usuario/UmidadeWeb/wiki/FAQ)

### **Contato**
- **Email**: seu-email@exemplo.com
- **GitHub**: [@seu-usuario](https://github.com/seu-usuario)
- **Discord**: [Servidor da Comunidade](https://discord.gg/seu-servidor)

---

**🌱 Feito com ❤️ para agricultura sustentável**

> **Dica**: Se este projeto te ajudou, considere dar uma ⭐ no GitHub!
