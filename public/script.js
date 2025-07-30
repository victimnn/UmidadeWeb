document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const humidityLevel = document.getElementById('humidity-level');
    const humidityText = document.getElementById('humidity-text');
    const ctx = document.getElementById('humidity-chart').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Umidade do Solo (%)',
                data: [],
                borderColor: '#90ee90', /* Verde claro */
                backgroundColor: 'rgba(144, 238, 144, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#f0f0f0'
                    }
                },
                x: {
                    ticks: {
                        color: '#f0f0f0'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f0f0f0'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    socket.on('humidity', (data) => {
        console.log('Dados de umidade recebidos:', data);

        const humidity = parseFloat(data);
        if (!isNaN(humidity)) {
            // Atualiza o medidor visual
            humidityLevel.style.height = `${humidity}%`;
            humidityText.textContent = `${humidity.toFixed(1)}%`;

            // Atualiza o gráfico
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            
            chart.data.labels.push(time);
            chart.data.datasets[0].data.push(humidity);

            if (chart.data.labels.length > 15) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }

            chart.update();
        }
    });
});