#include <SPI.h>
#include <Ethernet.h>

// Pino onde o sensor de umidade do solo está conectado
const int pinoSensor = A0;

// Variáveis para armazenar os valores
int valorSensor = 0;      // Valor lido diretamente do sensor (0-1023)
int umidadePercentual = 0; // Valor convertido para porcentagem (0-100%)

// Defina aqui os valores de calibragem do seu sensor
// Coloque o sensor no ar (seco) e anote o valor lido em 'valorSensorSeco'
// Mergulhe o sensor na água (úmido) e anote o valor em 'valorSensorUmido'
const int valorSensorSeco = 850;  // Exemplo: 850. Ajuste para o seu sensor.
const int valorSensorUmido = 400; // Exemplo: 400. Ajuste para o seu sensor.

// Configuração de rede (ajuste conforme necessário)
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 177); // Altere para um IP válido na sua rede

EthernetServer server(80);

void setup() {
  Serial.begin(9600);
  Ethernet.begin(mac, ip);
  server.begin();
}

void loop() {
  // Lê o valor do sensor
  valorSensor = analogRead(pinoSensor);

  // Converte (mapeia) o valor lido para uma escala de 0 a 100%
  umidadePercentual = map(valorSensor, valorSensorSeco, valorSensorUmido, 0, 100);

  // Garante que a porcentagem não saia do intervalo 0-100
  if (umidadePercentual > 100) {
    umidadePercentual = 100;
  }
  if (umidadePercentual < 0) {
    umidadePercentual = 0;
  }

  // Envia o valor da umidade pela porta serial
  Serial.println(umidadePercentual);

  // Aguarda conexões HTTP
  EthernetClient client = server.available();
  if (client) {
    boolean currentLineIsBlank = true;
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        // Detecta fim da requisição HTTP
        if (c == '\n' && currentLineIsBlank) {
          // Envia cabeçalho HTTP
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: text/html");
          client.println("Connection: close");
          client.println();

          // Envia página HTML
          client.println("<!DOCTYPE HTML>");
          client.println("<html>");
          client.println("<head><meta charset='utf-8'><title>Umidade do Solo</title></head>");
          client.print("<body><h1>Umidade do Solo</h1><p>Umidade: <b>");
          client.print(umidadePercentual);
          client.println("%</b></p></body></html>");
          break;
        }
        if (c == '\n') {
          currentLineIsBlank = true;
        } else if (c != '\r') {
          currentLineIsBlank = false;
        }
      }
    }
    delay(1);
    client.stop();
  }

  // Espera 500 milissegundos antes de fazer a próxima leitura
  // delay(500);
}
