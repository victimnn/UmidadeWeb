

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const ARDUINO_PORT_PATH = 'COM3'; // <--- SUBSTITUA AQUI PELA PORTA DO SEU ARDUINO
const BAUD_RATE = 9600;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Usuário conectado!');
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000. Acesse http://localhost:3000');
});

// --- Conexão com o Arduino ---
try {
    const port = new SerialPort({ path: ARDUINO_PORT_PATH, baudRate: BAUD_RATE });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.on('open', () => {
        console.log(`Conexão serial com a porta ${ARDUINO_PORT_PATH} aberta.`);
    });

    parser.on('data', (data) => {
        console.log('Dados do Arduino:', data);
        // Envia os dados para todos os clientes conectados
        io.emit('humidity', data);
    });

    port.on('error', (err) => {
        console.error('Erro na porta serial:', err.message);
        io.emit('error', 'Erro ao conectar com o Arduino. Verifique a porta e a conexão.');
    });

} catch (err) {
    console.error('Falha ao iniciar a conexão serial:', err.message);
    console.log('-------------------------------------------------------------------');
    console.log('AVISO: O servidor está rodando, mas não conseguiu conectar ao Arduino.');
    console.log(`Verifique se a porta "${ARDUINO_PORT_PATH}" está correta e disponível.`);
    console.log('Você pode listar as portas seriais disponíveis com o comando:');
    console.log('npx @serialport/list');
    console.log('-------------------------------------------------------------------');
}
