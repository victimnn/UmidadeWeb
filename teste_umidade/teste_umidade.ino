// Código simplificado para sensor de umidade do solo
// Comunicação via porta serial (USB)

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

void setup() {
  // Inicializa a comunicação serial
  Serial.begin(9600);
  
  // Aguarda a conexão serial ser estabelecida
  while (!Serial) {
    ; // Aguarda a porta serial estar disponível
  }
  
  Serial.println("Sensor de Umidade do Solo - Iniciado");
  Serial.println("Enviando dados a cada 1 segundo...");
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
  
  // Aguarda 1 segundo antes da próxima leitura
  delay(1000);
}
