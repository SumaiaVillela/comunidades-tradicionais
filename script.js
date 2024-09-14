window.onload = function () {

    const comunidades = ['AGROEXTRATIVISTAS', 'CAATINGUEIROS', 'CAIÇARAS', 'COMUNIDADES DE FUNDO E FECHO DE PASTO', 
        'COMUNIDADES DO CERRADO', 'EXTRATIVISTAS', 'FAXINALENSES', 'GERAIZEIROS', 'MARISQUEIROS', 'OUTROS', 
        'PANTANEIROS', 'PESCADORES ARTESANAIS', 'POMERANOS', 'POVOS CIGANOS', 'POVOS DE TERREIRO', 
        'POVOS QUILOMBOLAS', 'QUEBRADEIRAS DE COCO-DE-BABAÇU', 'RETIREIROS', 'RIBEIRINHOS', 
        'SERINGUEIROS', 'VAZANTEIROS'];

    const dropdown = document.getElementById('comunidadeDropdown');

    // PLACEHOLDER DA COMUNIDADE
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "CLIQUE PARA SELECIONAR A COMUNIDADE";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    comunidades.forEach(comunidade => {
        const option = document.createElement('option');
        option.value = comunidade;
        option.textContent = comunidade;
        dropdown.appendChild(option);
    });

    fetch('dados/dados_para_flourish_barras.csv')
    .then(response => response.text())
    .then(csvData => {
        Papa.parse(csvData, {
            header: true,
            complete: function(results) {
                const parsedData = results.data;

                function atualizarGrafico(comunidadeSelecionada) {
                    // CATEOGIRAS NUTRICIONAIS
                    const categorias = [
                        'Muito baixo peso para a idade %',
                        'Baixo peso para a idade %', 
                        'Peso adequado para idade %', 
                        'Peso elevado para a idade %'
                    ];

                    // PALHETA DE CORES
                    const cores = [
                        "#FF6347",  // Cor para 'Muito baixo peso para a idade %'
                        "#EEE8AA",  // Cor para 'Baixo peso para a idade %'
                        "#b1bfae",  // Cor para 'Peso adequado para idade %'
                        "#BA55D3"   // Cor para 'Peso elevado para a idade %'
                    ];

                    let chartData = [];

                    categorias.forEach((categoria, index) => {
                        let dataPoints = [];

                        // TRANSFORMA NA MARRA OS ANOS DE STRING PARA INT

                        parsedData.forEach(item => {
                            if (item.categoria === categoria) {
                                const valor = parseFloat(item[comunidadeSelecionada]) || 0;
                                const ano = parseInt(item.ano.trim()) || 0;

                                if (!isNaN(ano) && ano > 0) {
                                    dataPoints.push({ y: valor, label: ano });
                                }
                            }
                        });

                        // ORDENA OS ANOS DO MENOR PARA O MAIOR
                        dataPoints.sort((b, a) => a.label - b.label);

                        // MUDA PARA HORIZONTAL 100%
                        chartData.push({
                            type: "stackedBar100",
                            toolTipContent: "<b>{name}:</b> #percent%",
                            showInLegend: true,
                            name: categoria,
                            dataPoints: dataPoints,
                            color: cores[index],
                        });
                    });

                    // CRIA GRÁFICO
                    var chart = new CanvasJS.Chart("chartContainer", {
                        animationEnabled: false,
                        theme: "light2",
                        title: {
                            text: `Situação Nutricional da Comunidade: ${comunidadeSelecionada}`,
                            fontFamily: 'Courier New',
                            fontSize: 14,
                            padding: {
                                top: 10,
                                bottom: 20,
                                left: 10,
                                right: 10,
                            }
                        },
                        axisY: {
                            interval: 10,
                            suffix: "%",
                            labelFontFamily:'Courier New',
                        },
                        axisX: {
                            // title: "Ano" TIREI PARA VISUALIZAR MELHOR AS BARRAS, 
                            interval:1,
                            labelFontFamily:'Courier New',

                        },
                        legend:{
                            fontFamily:'Courier New',
                            horizontalAlign: 'center',
                        },
                        toolTip: {
                            shared: false,
                            fontFamily:'Courier New',
                            borderThickness:1,
                            backgroundColor:'#fff',
                            borderColor:'#000',
                        },
                        data: chartData,
                        
                    });

                    chart.render();
                }

                // DROPDOWN COMUNIDADE
                dropdown.addEventListener('change', function() {
                    const comunidadeSelecionada = dropdown.value;
                    atualizarGrafico(comunidadeSelecionada);
                });

                // COMEÇA O GRÁFICO COM A PRIMEIRA COMUNIDADE
                atualizarGrafico(comunidades[0]);
            }
        });
    });
}