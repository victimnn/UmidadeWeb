document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Elementos do DOM
    const humidityFill = document.getElementById('humidity-fill');
    const humidityValue = document.getElementById('humidity-value');
    const humidityStatus = document.getElementById('humidity-status');
    const lastUpdate = document.getElementById('last-update');
    const connectionStatus = document.getElementById('connection-status');
    const ctx = document.getElementById('humidity-chart').getContext('2d');
    const resetChartBtn = document.getElementById('reset-chart');
    const alertsList = document.getElementById('alerts-list');
    const alertsCounter = document.getElementById('alerts-counter');
    
    // Elementos de estatísticas
    const avgHumidity = document.getElementById('avg-humidity');
    const maxHumidity = document.getElementById('max-humidity');
    const minHumidity = document.getElementById('min-humidity');
    const readingsCount = document.getElementById('readings-count');

    // Variáveis para estatísticas
    let humidityReadings = [];
    let chartData = {
        labels: [],
        data: []
    };

    // Configuração do gráfico
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Umidade do Solo (%)',
                data: [],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2ecc71',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#2ecc71',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#b8c5d6',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#b8c5d6',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#2ecc71'
                }
            }
        }
    });

    // Funções utilitárias
    function updateConnectionStatus(status, message = '') {
        connectionStatus.className = `status-badge ${status}`;
        
        switch(status) {
            case 'connected':
                connectionStatus.innerHTML = '<i class="fas fa-circle"></i><span>Conectado ao Arduino</span>';
                break;
            case 'disconnected':
                connectionStatus.innerHTML = '<i class="fas fa-circle"></i><span>Desconectado</span>';
                break;
            case 'connecting':
                connectionStatus.innerHTML = '<i class="fas fa-circle"></i><span>Conectando...</span>';
                break;
            case 'error':
                connectionStatus.innerHTML = `<i class="fas fa-circle"></i><span>${message}</span>`;
                break;
        }
    }

    function updateHumidityDisplay(humidity) {
        // Atualiza o círculo de progresso
        const degrees = (humidity / 100) * 360;
        humidityFill.style.background = `conic-gradient(from 0deg, #2ecc71 0deg, #2ecc71 ${degrees}deg, #2d3447 ${degrees}deg)`;
        
        // Atualiza o valor central
        humidityValue.textContent = humidity.toFixed(1);
        
        // Atualiza o status baseado no nível de umidade
        humidityStatus.className = 'humidity-status';
        if (humidity < 30) {
            humidityStatus.classList.add('dry');
            humidityStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Solo seco - Regar necessário</span>';
        } else if (humidity < 70) {
            humidityStatus.classList.add('moderate');
            humidityStatus.innerHTML = '<i class="fas fa-info-circle"></i><span>Umidade moderada</span>';
        } else {
            humidityStatus.classList.add('wet');
            humidityStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Solo úmido - Condições ideais</span>';
        }
        
        // Atualiza timestamp
        const now = new Date();
        lastUpdate.textContent = now.toLocaleTimeString('pt-BR');
    }

    function updateStatistics(humidity) {
        humidityReadings.push(humidity);
        
        // Mantém apenas os últimos 100 valores
        if (humidityReadings.length > 100) {
            humidityReadings.shift();
        }
        
        // Calcula estatísticas
        const avg = humidityReadings.reduce((a, b) => a + b, 0) / humidityReadings.length;
        const max = Math.max(...humidityReadings);
        const min = Math.min(...humidityReadings);
        const count = humidityReadings.length;
        
        // Atualiza display
        avgHumidity.textContent = avg.toFixed(1);
        maxHumidity.textContent = max.toFixed(1);
        minHumidity.textContent = min.toFixed(1);
        readingsCount.textContent = count;
    }

    function updateChart(humidity) {
        const now = new Date();
        const time = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        chartData.labels.push(time);
        chartData.data.push(humidity);
        
        // Mantém apenas os últimos 30 pontos
        if (chartData.labels.length > 30) {
            chartData.labels.shift();
            chartData.data.shift();
        }
        
        chart.data.labels = chartData.labels;
        chart.data.datasets[0].data = chartData.data;
        chart.update('none'); // Atualiza sem animação para melhor performance
    }

    function addAlert(type, message, icon = null) {
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item ${type}`;
        alertItem.style.opacity = '0';
        alertItem.style.transform = 'translateX(-20px)';
        
        const iconElement = icon || getDefaultIcon(type);
        alertItem.innerHTML = `<i class="${iconElement}"></i><span>${message}</span>`;
        
        // Remove alertas antigos se houver muitos (mantém no máximo 5)
        while (alertsList.children.length >= 5) {
            const oldestAlert = alertsList.firstChild;
            oldestAlert.style.opacity = '0';
            oldestAlert.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                if (oldestAlert.parentNode) {
                    oldestAlert.remove();
                    updateAlertsCounter();
                }
            }, 300);
        }
        
        alertsList.appendChild(alertItem);
        
        // Anima a entrada do novo alerta
        setTimeout(() => {
            alertItem.style.opacity = '1';
            alertItem.style.transform = 'translateX(0)';
        }, 50);
        
        // Atualiza o contador
        updateAlertsCounter();
        
        // Remove o alerta após 10 segundos
        setTimeout(() => {
            if (alertItem.parentNode) {
                alertItem.style.opacity = '0';
                alertItem.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    if (alertItem.parentNode) {
                        alertItem.remove();
                        updateAlertsCounter();
                    }
                }, 300);
            }
        }, 10000);
    }

    function getDefaultIcon(type) {
        switch(type) {
            case 'success': return 'fas fa-check-circle';
            case 'warning': return 'fas fa-exclamation-triangle';
            case 'error': return 'fas fa-times-circle';
            case 'info': return 'fas fa-info-circle';
            default: return 'fas fa-info-circle';
        }
    }
    
    function updateAlertsCounter() {
        const count = alertsList.children.length;
        alertsCounter.textContent = count;
        
        // Atualiza a cor do contador baseado no número de alertas
        if (count === 0) {
            alertsCounter.style.background = 'var(--text-muted)';
        } else if (count <= 2) {
            alertsCounter.style.background = 'var(--primary-color)';
        } else if (count <= 4) {
            alertsCounter.style.background = 'var(--warning-color)';
        } else {
            alertsCounter.style.background = 'var(--danger-color)';
        }
    }

    function resetChart() {
        chartData.labels = [];
        chartData.data = [];
        humidityReadings = [];
        
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.update();
        
        // Reset estatísticas
        avgHumidity.textContent = '--';
        maxHumidity.textContent = '--';
        minHumidity.textContent = '--';
        readingsCount.textContent = '0';
        
        addAlert('info', 'Gráfico e estatísticas resetados', 'fas fa-refresh');
        updateAlertsCounter();
    }

    // Event listeners
    resetChartBtn.addEventListener('click', resetChart);

    // Eventos do Socket.IO
    socket.on('connect', () => {
        console.log('Conectado ao servidor!');
        updateConnectionStatus('connected');
        addAlert('success', 'Conectado ao servidor com sucesso!', 'fas fa-server');
    });

    socket.on('disconnect', () => {
        console.log('Desconectado do servidor!');
        updateConnectionStatus('disconnected');
        addAlert('warning', 'Desconectado do servidor', 'fas fa-exclamation-triangle');
    });

    socket.on('humidity', (data) => {
        console.log('Dados de umidade recebidos:', data);

        const humidity = parseFloat(data);
        if (!isNaN(humidity) && humidity >= 0 && humidity <= 100) {
            updateHumidityDisplay(humidity);
            updateStatistics(humidity);
            updateChart(humidity);
            updateConnectionStatus('connected');
            
            // Adiciona alerta para valores críticos
            if (humidity < 20) {
                addAlert('error', `ALERTA: Umidade muito baixa (${humidity.toFixed(1)}%) - Regar imediatamente!`, 'fas fa-exclamation-triangle');
            } else if (humidity > 90) {
                addAlert('warning', `Atenção: Umidade muito alta (${humidity.toFixed(1)}%) - Verificar drenagem`, 'fas fa-tint');
            }
        } else {
            console.warn('Dados de umidade inválidos recebidos:', data);
            addAlert('error', 'Dados inválidos recebidos do sensor', 'fas fa-exclamation-triangle');
        }
    });

    socket.on('error', (errorMessage) => {
        console.error('Erro recebido:', errorMessage);
        updateConnectionStatus('error', errorMessage);
        addAlert('error', errorMessage, 'fas fa-times-circle');
    });

    // Verifica se há dados sendo recebidos
    let lastDataTime = Date.now();
    const checkDataInterval = setInterval(() => {
        const now = Date.now();
        if (now - lastDataTime > 10000) { // 10 segundos sem dados
            updateConnectionStatus('warning', 'Sem dados recentes');
            addAlert('warning', 'Sem dados do Arduino nos últimos 10 segundos', 'fas fa-clock');
        }
    }, 5000);

    // Atualiza timestamp quando dados são recebidos
    socket.on('humidity', () => {
        lastDataTime = Date.now();
    });

    // Limpa o intervalo quando a página é fechada
    window.addEventListener('beforeunload', () => {
        clearInterval(checkDataInterval);
    });

    // Inicialização
    addAlert('info', 'Sistema iniciado. Aguardando dados do sensor...', 'fas fa-play');
    updateConnectionStatus('connecting');
});