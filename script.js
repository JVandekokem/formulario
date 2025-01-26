document.getElementById('gerarPdf').addEventListener('click', async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Função para obter o valor selecionado de cada pergunta
    function getAnswer(questionName) {
        const radios = document.getElementsByName(questionName);
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return 'Não respondido';
    }

    // Coletar o valor do campo TAG
    const tag = document.getElementById('tag').value.trim();

    // Coletar o valor do campo de observação
    const observacao = document.getElementById('observacao').value.trim();

    // Nome do arquivo com fallback se o campo estiver vazio
    const fileName = tag ? `${tag}.pdf` : 'verificacao.pdf';

    // Coletando as respostas
    const respostas = [
        { pergunta: 'TAG', resposta: tag || 'Não informado' },
        { pergunta: 'VERIFICAR IDENTIFICAÇÃO FIXADA/LEGÍVEL?', resposta: getAnswer('identificacao') },
        { pergunta: 'VERIFICAR PRESENÇA DE EXTINTOR NO LOCAL', resposta: getAnswer('extintor') },
        { pergunta: 'VERIFICAR ILUMINAÇÃO DE EMERGÊNCIA', resposta: getAnswer('iluminacao') },
        { pergunta: 'VERIFICAR SINALIZAÇÕES OBRIGATÓRIAS', resposta: getAnswer('sinalização') },
        { pergunta: 'VERIFICAR CONDIÇÃO PAINEL EM GERAL', resposta: getAnswer('painel') },
        { pergunta: 'VERIFICAR CONDIÇÃO BOTÃO EMERGÊNCIA', resposta: getAnswer('botao') },
        { pergunta: 'VERIFICAR CONDIÇÃO CABO DE ATERRAMENTO', resposta: getAnswer('cabo') },
        { pergunta: 'VERIFICAR CONDIÇÃO BORRACHA VEDAÇÃO', resposta: getAnswer('borracha') },
        { pergunta: 'VERIFICAR MATERIAL OBSOLETO NO INTERIOR', resposta: getAnswer('obsoleto') },
        { pergunta: 'VERIFICAR DIAGRAMA ELÉTRICO DISPONÍVEL', resposta: getAnswer('eletrico') },
        { pergunta: 'VERIFICAR CANALETAS E ABERTURAS', resposta: getAnswer('caneleta') },
        { pergunta: 'VERIFICAR FUNCIONAMENTO COOLERS', resposta: getAnswer('cooler') },
        { pergunta: 'VERIFICAR PONTOS INFILTRAÇÃO SUJEIRA', resposta: getAnswer('sujeira') },
        { pergunta: 'VERIFICAR PONTOS INFILTRAÇÃO ÁGUA', resposta: getAnswer('infiltracao') },
        { pergunta: 'VERIFICAR COMPONENTES INTERNOS DANIFICADOS', resposta: getAnswer('danificado') },
        { pergunta: 'VERIFICAR PROTEÇÃO CONTRA PARTES VIVAS', resposta: getAnswer('protecao') },
        { pergunta: 'VERIFICAR CABOS/FIAÇÃO SOLTA OU EXPOSTA', resposta: getAnswer('solta') },
        { pergunta: 'VERIFICAR CABOS/FIAÇÃO SINAL AQUECIMENTO', resposta: getAnswer('sinal') },
        { pergunta: 'VERIFICAR ODOR TIPO QUEIMADO', resposta: getAnswer('queimado') },
        { pergunta: 'VERIFICAR RUÍDO ANORMAL PAINEL ELÉTRICO', resposta: getAnswer('anormal') },
        { pergunta: 'REMOVER MATERIAL SEM USO NO INTERIOR', resposta: getAnswer('interior') },
        { pergunta: 'CRIAR DOCUMENTO DE MEDIÇÃO', resposta: getAnswer('medicao') },
    ];

    // Adicionando o título do PDF
    let yPosition = 40; // Ajusta a posição Y após a logo
    doc.setFontSize(12);
    doc.text('Formulário de Verificação de Equipamentos', 20, yPosition);
    yPosition += 10;

    // Adicionando as respostas ao PDF
    respostas.forEach((item) => {
        doc.text(`${item.pergunta}: ${item.resposta}`, 20, yPosition);
        yPosition += 10;
    });

    // Adicionando a observação antes das imagens
    doc.addPage(); // Adiciona uma nova página
    yPosition = 10; // Reinicia a posição vertical

    // Adicionando a observação
    doc.text('Observação:', 20, yPosition);
    yPosition += 10;

    // Justificando o texto da observação
    const observacaoTexto = observacao || 'Nenhuma observação';
    const observacaoMaxWidth = 180; // Largura máxima para a observação
    const observacaoLines = doc.splitTextToSize(observacaoTexto, observacaoMaxWidth);
    
    // Adicionando o texto da observação
    observacaoLines.forEach((line) => {
        doc.text(line, 20, yPosition);
        yPosition += 10;
    });

    // Lendo as imagens e adicionando ao PDF
    const images = document.getElementById('uploadImagem').files;
    const imageWidth = 80; // Dimensão da imagem no PDF
    const imageHeight = 80;

    if (images.length > 0) {
        yPosition += 10; // Deixa um espaço antes das imagens
        doc.text('Fotos anexadas:', 20, yPosition);
        yPosition += 10;

        let xPosition = 20; // Posição inicial para a primeira imagem

        for (let i = 0; i < images.length; i++) {
            const base64Image = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(images[i]);
            });

            doc.addImage(base64Image, 'JPEG', xPosition, yPosition, imageWidth, imageHeight);

            // Atualiza a posição horizontal e vertical
            xPosition += imageWidth + 10; // Espaço entre as imagens
            if (xPosition + imageWidth > 190) { // Limite da largura da página
                xPosition = 20; // Reinicia a posição horizontal
                yPosition += imageHeight + 10; // Move para a próxima linha
            }

            // Se a posição Y exceder o limite da página, adiciona uma nova página
            if (yPosition + imageHeight > 280) {
                doc.addPage();
                xPosition = 20; // Reinicia a posição horizontal
                yPosition = 10; // Reinicia a posição vertical
            }
        }
    }

    // Gerar o PDF com o nome baseado no campo TAG
    doc.save(fileName);
});