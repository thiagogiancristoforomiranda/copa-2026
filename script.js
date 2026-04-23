let selecoes = [];
let grupos = {};
let classificados = [];
let vencedoresOitavas = [];
let vencedoresQuartas = [];
let vencedoresSemifinal = [];
let sorteioRealizado = false;
let classificacaoSimulada = false;
let oitavasSimuladas = false;
let quartasSimuladas = false;
let semifinalSimulada = false;
let finalSimulada = false;

function extrairNomeTime(time) {
    if (!time) return 'Unknown';
    
    if (typeof time === 'object') {
        return time.nome || time.name || time.teamName || 'Unknown';
    }
    
    return String(time).trim();
}

async function buscarSelecoes() {
    const url = 'https://development-internship-api.geopostenergy.com/WorldCup/GetAllTeams';

    try {
        const resposta = await fetch(url, {
            method: 'GET',
            headers: {
                'git-user': 'thiagogiancristoforomiranda'
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro: ${resposta.status}`);
        }

        const dados = await resposta.json();
        selecoes = dados || [];

        console.log(`✅ ${selecoes.length} seleções carregadas`);
        return selecoes;

    } catch (erro) {
        console.warn('⚠️ Usando dados mockados...');
        usarSelecoesMockadas();
        return selecoes;
    }
}

function usarSelecoesMockadas() {
    selecoes = [
        { name: 'Brazil' }, { name: 'Argentina' }, { name: 'Mexico' }, { name: 'Canada' },
        { name: 'USA' }, { name: 'Uruguay' }, { name: 'Colombia' }, { name: 'Ecuador' },
        { name: 'Peru' }, { name: 'Bolivia' }, { name: 'Paraguay' }, { name: 'Chile' },
        { name: 'Venezuela' }, { name: 'Germany' }, { name: 'France' }, { name: 'Spain' },
        { name: 'Italy' }, { name: 'England' }, { name: 'Portugal' }, { name: 'Netherlands' },
        { name: 'Belgium' }, { name: 'Switzerland' }, { name: 'Austria' }, { name: 'Poland' },
        { name: 'Czech Republic' }, { name: 'Sweden' }, { name: 'Denmark' }, { name: 'Norway' },
        { name: 'Finland' }, { name: 'Croatia' }, { name: 'Serbia' }, { name: 'Greece' }
    ];
}

function embaralhar(array) {
    const novoArray = [...array];
    for (let i = novoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
    }
    return novoArray;
}

function criarGrupos(selecoesList) {
    const grupos = {};
    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const selecoesMisturadas = embaralhar(selecoesList);

    letras.forEach((letra, index) => {
        const inicio = index * 4;
        const fim = inicio + 4;
        grupos[letra] = selecoesMisturadas.slice(inicio, fim);
    });

    return grupos;
}

function renderizarGrupos(gruposData) {
    const container = document.getElementById('container-grupos');
    container.innerHTML = '';

    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let delay = 0;

    letras.forEach((letra) => {
        const times = gruposData[letra];
        
        const grupoCard = document.createElement('div');
        grupoCard.className = 'grupo-card fade-in';
        grupoCard.style.animationDelay = `${delay}s`;
        
        let html = `<h3 class="grupo-titulo">GRUPO ${letra}</h3><div class="grupo-times">`;

        times.forEach((time) => {
            const nomePais = extrairNomeTime(time);
            html += `<div class="time-item"><span class="time-nome">${nomePais}</span></div>`;
        });

        html += '</div>';
        grupoCard.innerHTML = html;
        container.appendChild(grupoCard);
        
        delay += 0.05;
    });
}

function sortearGrupos() {
    if (sorteioRealizado) return;
    if (selecoes.length === 0) {
        alert('Carregando... Tente novamente');
        return;
    }

    sorteioRealizado = true;

    const btnSortear = document.getElementById('btn-sortear');
    if (btnSortear) {
        btnSortear.disabled = true;
        btnSortear.classList.add('btn-soccer-disabled');
        btnSortear.querySelector('.btn-soccer-content span:last-child').textContent = 'SORTEIO REALIZADO';
    }

    grupos = criarGrupos(selecoes);
    renderizarGrupos(grupos);

    document.getElementById('btn-simular-wrapper').style.display = 'flex';
    document.getElementById('container-resultados-grupos').innerHTML = '';

    classificados = [];
    document.getElementById('container-oitavas').innerHTML = '<div class="phase-locked"><i class="fas fa-lock"></i><p>Simule a fase de grupos primeiro</p></div>';
    document.getElementById('btn-oitavas-wrapper').style.display = 'none';
}

function simularClassificacao() {
    if (classificacaoSimulada) return;
    classificacaoSimulada = true;

    const btnSimular = document.getElementById('btn-simular');
    if (btnSimular) {
        btnSimular.disabled = true;
        btnSimular.classList.add('btn-soccer-disabled');
        btnSimular.querySelector('.btn-soccer-content span:last-child').textContent = 'CLASSIFICAÇÃO SIMULADA';
    }

    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const container = document.getElementById('container-resultados-grupos');
    container.innerHTML = '';
    classificados = [];

    letras.forEach((letra, i) => {
        const timesDoGrupo = grupos[letra];
        const tabela = processarFaseDeGrupos(timesDoGrupo);

        classificados.push(tabela[0], tabela[1]);

        const card = document.createElement('div');
        card.className = 'resultado-grupo-card fade-in';
        card.style.animationDelay = `${i * 0.08}s`;

        let html = `
            <div class="resultado-grupo-header">
                <span class="resultado-grupo-letra">GRUPO ${letra}</span>
                <span class="resultado-grupo-badge">Classificados</span>
            </div>
            <div class="resultado-tabela">
                <div class="resultado-tabela-header">
                    <span>Time</span>
                    <span>Pts</span>
                    <span>GF</span>
                    <span>GS</span>
                    <span>SG</span>
                </div>`;

        tabela.forEach((time, idx) => {
            const classificado = idx < 2;
            html += `
                <div class="resultado-tabela-row ${classificado ? 'classificado' : ''}">
                    <span class="resultado-time-nome">
                        ${classificado ? '<i class="fas fa-arrow-right classificado-icon"></i>' : '<span class="eliminado-dot"></span>'}
                        ${extrairNomeTime(time)}
                    </span>
                    <span class="resultado-pts">${time.pontos}</span>
                    <span>${time.golsFeitos}</span>
                    <span>${time.golsSofridos}</span>
                    <span class="${time.saldoGols >= 0 ? 'saldo-pos' : 'saldo-neg'}">${time.saldoGols >= 0 ? '+' : ''}${time.saldoGols}</span>
                </div>`;
        });

        html += '</div>';
        card.innerHTML = html;
        container.appendChild(card);
    });

    document.getElementById('btn-oitavas-wrapper').style.display = 'flex';
    renderizarOitavasPreview();

    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
}

function renderizarOitavasPreview() {
    const container = document.getElementById('container-oitavas');
    container.innerHTML = '';

    const confrontos = montarOitavas();

    confrontos.forEach((conf, i) => {
        const card = document.createElement('div');
        card.className = 'match-card fade-in';
        card.style.animationDelay = `${i * 0.07}s`;
        card.innerHTML = `
            <div class="match-card-label">Jogo ${i + 1}</div>
            <div class="match-teams">
                <div class="match-team">${extrairNomeTime(conf.timeA)}</div>
                <div class="match-vs">VS</div>
                <div class="match-team">${extrairNomeTime(conf.timeB)}</div>
            </div>`;
        container.appendChild(card);
    });
}

function montarOitavas() {
    return [
        { timeA: classificados[0], timeB: classificados[3] },
        { timeA: classificados[1], timeB: classificados[2] },
        { timeA: classificados[4], timeB: classificados[7] },
        { timeA: classificados[5], timeB: classificados[6] },
        { timeA: classificados[8], timeB: classificados[11] },
        { timeA: classificados[9], timeB: classificados[10] },
        { timeA: classificados[12], timeB: classificados[15] },
        { timeA: classificados[13], timeB: classificados[14] },
    ];
}

function simularFaseMataMata(confrontos, containerId, proxWrapper) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const vencedores = [];

    confrontos.forEach((conf, i) => {
        const { resultado, vencedor } = simularMataMata(conf.timeA, conf.timeB);
        vencedores.push(vencedor);

        const nomeA = resultado.timeA.nome;
        const nomeB = resultado.timeB.nome;
        const golsA = resultado.timeA.gols;
        const golsB = resultado.timeB.gols;
        const penA = resultado.timeA.penaltis;
        const penB = resultado.timeB.penaltis;
        const temPenaltis = penA > 0 || penB > 0;
        const nomeVencedor = extrairNomeTime(vencedor);

        const card = document.createElement('div');
        card.className = 'match-card match-card-resultado fade-in';
        card.style.animationDelay = `${i * 0.07}s`;

        let penaltisHtml = '';
        if (temPenaltis) {
            penaltisHtml = `<div class="match-penaltis">Pênaltis: ${penA} × ${penB}</div>`;
        }

        card.innerHTML = `
            <div class="match-card-label">Jogo ${i + 1}</div>
            <div class="match-teams">
                <div class="match-team ${nomeVencedor === nomeA ? 'team-winner' : 'team-loser'}">${nomeA}</div>
                <div class="match-score">${golsA} × ${golsB}</div>
                <div class="match-team ${nomeVencedor === nomeB ? 'team-winner' : 'team-loser'}">${nomeB}</div>
            </div>
            ${penaltisHtml}
            <div class="match-winner-tag"><i class="fas fa-check-circle"></i> ${nomeVencedor} avança</div>`;

        container.appendChild(card);
    });

    document.getElementById(proxWrapper).style.display = 'flex';
    return vencedores;
}

function simularOitavas() {
    if (oitavasSimuladas) return;
    oitavasSimuladas = true;

    const btnOitavas = document.getElementById('btn-simular-oitavas');
    if (btnOitavas) {
        btnOitavas.disabled = true;
        btnOitavas.classList.add('btn-soccer-disabled');
        btnOitavas.querySelector('.btn-soccer-content span:last-child').textContent = 'OITAVAS SIMULADAS';
    }

    const confrontos = montarOitavas();
    vencedoresOitavas = simularFaseMataMata(confrontos, 'container-oitavas', 'btn-quartas-wrapper');
    renderizarQuartasPreview();
    mudarAba('oitavas');
}

function renderizarQuartasPreview() {
    const container = document.getElementById('container-quartas');
    container.innerHTML = '';
    const confrontos = montarQuartas();

    confrontos.forEach((conf, i) => {
        const card = document.createElement('div');
        card.className = 'match-card fade-in';
        card.style.animationDelay = `${i * 0.07}s`;
        card.innerHTML = `
            <div class="match-card-label">Jogo ${i + 1}</div>
            <div class="match-teams">
                <div class="match-team">${extrairNomeTime(conf.timeA)}</div>
                <div class="match-vs">VS</div>
                <div class="match-team">${extrairNomeTime(conf.timeB)}</div>
            </div>`;
        container.appendChild(card);
    });
}

function montarQuartas() {
    return [
        { timeA: vencedoresOitavas[0], timeB: vencedoresOitavas[1] },
        { timeA: vencedoresOitavas[2], timeB: vencedoresOitavas[3] },
        { timeA: vencedoresOitavas[4], timeB: vencedoresOitavas[5] },
        { timeA: vencedoresOitavas[6], timeB: vencedoresOitavas[7] },
    ];
}

function simularQuartas() {
    if (quartasSimuladas) return;
    quartasSimuladas = true;

    const btnQuartas = document.getElementById('btn-simular-quartas');
    if (btnQuartas) {
        btnQuartas.disabled = true;
        btnQuartas.classList.add('btn-soccer-disabled');
        btnQuartas.querySelector('.btn-soccer-content span:last-child').textContent = 'QUARTAS SIMULADAS';
    }

    const confrontos = montarQuartas();
    vencedoresQuartas = simularFaseMataMata(confrontos, 'container-quartas', 'btn-semifinal-wrapper');
    renderizarSemifinalPreview();
    mudarAba('quartas');
}

function renderizarSemifinalPreview() {
    const container = document.getElementById('container-semifinal');
    container.innerHTML = '';
    const confrontos = montarSemifinal();

    confrontos.forEach((conf, i) => {
        const card = document.createElement('div');
        card.className = 'match-card fade-in';
        card.style.animationDelay = `${i * 0.07}s`;
        card.innerHTML = `
            <div class="match-card-label">Semifinal ${i + 1}</div>
            <div class="match-teams">
                <div class="match-team">${extrairNomeTime(conf.timeA)}</div>
                <div class="match-vs">VS</div>
                <div class="match-team">${extrairNomeTime(conf.timeB)}</div>
            </div>`;
        container.appendChild(card);
    });
}

function montarSemifinal() {
    return [
        { timeA: vencedoresQuartas[0], timeB: vencedoresQuartas[1] },
        { timeA: vencedoresQuartas[2], timeB: vencedoresQuartas[3] },
    ];
}

function simularSemifinal() {
    if (semifinalSimulada) return;
    semifinalSimulada = true;

    const btnSemifinal = document.getElementById('btn-simular-semifinal');
    if (btnSemifinal) {
        btnSemifinal.disabled = true;
        btnSemifinal.classList.add('btn-soccer-disabled');
        btnSemifinal.querySelector('.btn-soccer-content span:last-child').textContent = 'SEMIFINAL SIMULADA';
    }

    const confrontos = montarSemifinal();
    vencedoresSemifinal = simularFaseMataMata(confrontos, 'container-semifinal', 'btn-final-wrapper');
    renderizarFinalPreview();
    mudarAba('semifinal');
}

function renderizarFinalPreview() {
    const container = document.getElementById('container-final');
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'match-card match-card-grande-final fade-in';
    card.innerHTML = `
        <div class="match-card-label">🏆 Grande Final</div>
        <div class="match-teams">
            <div class="match-team">${extrairNomeTime(vencedoresSemifinal[0])}</div>
            <div class="match-vs">VS</div>
            <div class="match-team">${extrairNomeTime(vencedoresSemifinal[1])}</div>
        </div>`;
    container.appendChild(card);
}

async function simularFinal() {
    if (finalSimulada) return;
    finalSimulada = true;

    const btnFinalBtn = document.getElementById('btn-simular-final');
    if (btnFinalBtn) {
        btnFinalBtn.disabled = true;
        btnFinalBtn.classList.add('btn-soccer-disabled');
        btnFinalBtn.querySelector('.btn-soccer-content span:last-child').textContent = 'FINAL SIMULADA';
    }

    const timeA = vencedoresSemifinal[0];
    const timeB = vencedoresSemifinal[1];
    const { resultado, vencedor } = simularMataMata(timeA, timeB);

    const container = document.getElementById('container-final');
    container.innerHTML = '';

    const nomeA = resultado.timeA.nome;
    const nomeB = resultado.timeB.nome;
    const golsA = resultado.timeA.gols;
    const golsB = resultado.timeB.gols;
    const penA = resultado.timeA.penaltis;
    const penB = resultado.timeB.penaltis;
    const temPenaltis = penA > 0 || penB > 0;
    const nomeVencedor = extrairNomeTime(vencedor);

    let penaltisHtml = '';
    if (temPenaltis) {
        penaltisHtml = `<div class="match-penaltis">Pênaltis: ${penA} × ${penB}</div>`;
    }

    const card = document.createElement('div');
    card.className = 'match-card match-card-grande-final match-card-resultado fade-in';
    card.innerHTML = `
        <div class="match-card-label">🏆 Grande Final</div>
        <div class="match-teams">
            <div class="match-team ${nomeVencedor === nomeA ? 'team-winner' : 'team-loser'}">${nomeA}</div>
            <div class="match-score">${golsA} × ${golsB}</div>
            <div class="match-team ${nomeVencedor === nomeB ? 'team-winner' : 'team-loser'}">${nomeB}</div>
        </div>
        ${penaltisHtml}`;
    container.appendChild(card);

    const campeaoContainer = document.getElementById('container-campeao');
    campeaoContainer.innerHTML = `
        <div class="campeao-banner fade-in">
            <div class="campeao-glow"></div>
            <div class="campeao-trophy">🏆</div>
            <div class="campeao-label">CAMPEÃO DO MUNDO</div>
            <div class="campeao-nome">${nomeVencedor}</div>
            <div class="campeao-confetti">🎉🌟⭐🎊🏅</div>
        </div>`;

    document.getElementById('btn-final-wrapper').style.display = 'none';

    await registrarCampeao({
        timeA: resultado.timeA,
        timeB: resultado.timeB
    });

    mudarAba('final');

    setTimeout(() => {
        const reiniciarWrapper = document.getElementById('btn-reiniciar-wrapper');
        if (reiniciarWrapper) reiniciarWrapper.style.display = 'flex';
    }, 800);
}

function mudarAba(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', async () => {
    await buscarSelecoes();
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => mudarAba(btn.dataset.tab));
    });

    const btnSortear = document.getElementById('btn-sortear');
    if (btnSortear) btnSortear.addEventListener('click', sortearGrupos);

    const btnSimular = document.getElementById('btn-simular');
    if (btnSimular) btnSimular.addEventListener('click', simularClassificacao);

    const btnOitavas = document.getElementById('btn-simular-oitavas');
    if (btnOitavas) btnOitavas.addEventListener('click', simularOitavas);

    const btnQuartas = document.getElementById('btn-simular-quartas');
    if (btnQuartas) btnQuartas.addEventListener('click', simularQuartas);

    const btnSemifinal = document.getElementById('btn-simular-semifinal');
    if (btnSemifinal) btnSemifinal.addEventListener('click', simularSemifinal);

    const btnFinal = document.getElementById('btn-simular-final');
    if (btnFinal) btnFinal.addEventListener('click', simularFinal);

    const btnReiniciar = document.getElementById('btn-reiniciar');
    if (btnReiniciar) btnReiniciar.addEventListener('click', reiniciarSimulador);
});

window.sortearGrupos = sortearGrupos;

function reiniciarSimulador() {      // reset de estado
    grupos = {};
    classificados = [];
    vencedoresOitavas = [];
    vencedoresQuartas = [];
    vencedoresSemifinal = [];
    sorteioRealizado = false;
    classificacaoSimulada = false;
    oitavasSimuladas = false;
    quartasSimuladas = false;
    semifinalSimulada = false;
    finalSimulada = false;

    const btnSortear = document.getElementById('btn-sortear');     // reset botão sortear
    if (btnSortear) {
        btnSortear.disabled = false;
        btnSortear.classList.remove('btn-soccer-disabled');
        btnSortear.querySelector('.btn-soccer-content span:last-child').textContent = 'SORTEAR GRUPOS';
    }

    const btnSimular = document.getElementById('btn-simular');     // reset demais botões de simulação
    if (btnSimular) {
        btnSimular.disabled = false;
        btnSimular.classList.remove('btn-soccer-disabled');
        btnSimular.querySelector('.btn-soccer-content span:last-child').textContent = 'SIMULAR CLASSIFICAÇÃO';
    }

    const btnOitavas = document.getElementById('btn-simular-oitavas');
    if (btnOitavas) {
        btnOitavas.disabled = false;
        btnOitavas.classList.remove('btn-soccer-disabled');
        btnOitavas.querySelector('.btn-soccer-content span:last-child').textContent = 'SIMULAR OITAVAS';
    }

    const btnQuartas = document.getElementById('btn-simular-quartas');
    if (btnQuartas) {
        btnQuartas.disabled = false;
        btnQuartas.classList.remove('btn-soccer-disabled');
        btnQuartas.querySelector('.btn-soccer-content span:last-child').textContent = 'SIMULAR QUARTAS';
    }

    const btnSemifinal = document.getElementById('btn-simular-semifinal');
    if (btnSemifinal) {
        btnSemifinal.disabled = false;
        btnSemifinal.classList.remove('btn-soccer-disabled');
        btnSemifinal.querySelector('.btn-soccer-content span:last-child').textContent = 'SIMULAR SEMIFINAL';
    }

    const btnFinalReset = document.getElementById('btn-simular-final');
    if (btnFinalReset) {
        btnFinalReset.disabled = false;
        btnFinalReset.classList.remove('btn-soccer-disabled');
        btnFinalReset.querySelector('.btn-soccer-content span:last-child').textContent = 'SIMULAR A GRANDE FINAL';
    }
    // reset containers de grupos
    document.getElementById('container-grupos').innerHTML = `    
        <div class="grupos-placeholder">                                                    
            <div class="placeholder-content">
                <div class="spinner-ball"><i class="fas fa-futbol"></i></div>
                <p>Clique no botão para iniciar o sorteio</p>
                <div class="pulse-dots"><span></span><span></span><span></span></div>
            </div>
        </div>`;
    document.getElementById('container-resultados-grupos').innerHTML = '';
    document.getElementById('btn-simular-wrapper').style.display = 'none';
    document.getElementById('btn-oitavas-wrapper').style.display = 'none';

    // reset mata-mata
    document.getElementById('container-oitavas').innerHTML = '<div class="phase-locked"><i class="fas fa-lock"></i><p>Simule a fase de grupos primeiro</p></div>';
    document.getElementById('btn-quartas-wrapper').style.display = 'none';
    document.getElementById('container-quartas').innerHTML = '<div class="phase-locked"><i class="fas fa-lock"></i><p>Simule as oitavas primeiro</p></div>';
    document.getElementById('btn-semifinal-wrapper').style.display = 'none';
    document.getElementById('container-semifinal').innerHTML = '<div class="phase-locked"><i class="fas fa-lock"></i><p>Simule as quartas primeiro</p></div>';
    document.getElementById('btn-final-wrapper').style.display = 'none';

    // reset aba final
    document.getElementById('container-final').innerHTML = '<div class="phase-locked"><i class="fas fa-lock"></i><p>Simule a semifinal primeiro</p></div>';
    document.getElementById('container-campeao').innerHTML = '';
    document.getElementById('btn-reiniciar-wrapper').style.display = 'none';

    // volta para a aba de grupos
    mudarAba('grupos');
}

function simularPartida(timeA, timeB) {             // gera gols de 0 a 5, de forma aleatoria. 
    const golsA = Math.floor(Math.random() * 6);
    const golsB = Math.floor(Math.random() * 6);   

    return {
        timeA: {nome: extrairNomeTime(timeA), gols: golsA, id: timeA.id},
        timeB: {nome: extrairNomeTime(timeB), gols: golsB, id: timeB.id} 
    };
}

function processarFaseDeGrupos (timesDoGrupo) {        // as estatísticas de cada time
    const tabela = timesDoGrupo.map (time => ({
        ...time,
        pontos: 0,
        golsFeitos: 0,
        golsSofridos: 0,
        saldoGols: 0
    }));

    const confrontos = [      // definimos os confrontos (indices 0,1,2,3)
        [0, 1], [2, 3],       // rodada 1
        [0, 2], [1, 3],       // rodada 2
        [0, 3], [1, 2]        // rodada 3
    ];

    confrontos.forEach(([idxA, idxB]) => {     // simulamos cada jogo e atualizamos a tabela
        const resultado = simularPartida(tabela[idxA], tabela[idxB]);
        const golsA = resultado.timeA.gols;
        const golsB = resultado.timeB.gols;
    
        tabela[idxA].golsFeitos += golsA;     // atualiza gols e saldo
        tabela[idxA].golsSofridos += golsB;
        tabela[idxB].golsFeitos += golsB;
        tabela[idxB].golsSofridos += golsA;

        if (golsA > golsB) {                // atualiza pontos
            tabela[idxA].pontos += 3;
        } else if (golsA < golsB) {
            tabela[idxB].pontos += 3;
        } else {
            tabela[idxA].pontos += 1;
            tabela[idxB].pontos += 1;
        }
    });

    tabela.forEach(t => t.saldoGols = t.golsFeitos - t.golsSofridos);  // calculo saldo de gols final

    return tabela.sort((a, b) => {      // ordenamos pelos criterios de desempate 
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;     
        if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
        return Math.random() - 0.5;   
    });
}

function simularMataMata(timeA, timeB) {
    let jogo = simularPartida(timeA, timeB);
    
    if (jogo.timeA.gols === jogo.timeB.gols) {                     // se terminar empatado, começam os penaltis
        const base = Math.floor(Math.random() * 3) + 3;
        jogo.timeA.penaltis = base;
        jogo.timeB.penaltis = base;

        while (jogo.timeA.penaltis === jogo.timeB.penaltis) {     // garante que nao haja empate nos penaltis
            if (Math.random() > 0.5) {
                jogo.timeA.penaltis++;
            } else {
                jogo.timeB.penaltis++;
            }
        }
    } else {
        jogo.timeA.penaltis = 0;
        jogo.timeB.penaltis = 0;
    }

    const vencedor = (jogo.timeA.gols + jogo.timeA.penaltis > jogo.timeB.gols + jogo.timeB.penaltis)  // define o vencedor
                     ? timeA : timeB;

    return { resultado: jogo, vencedor: vencedor };
}

async function registrarCampeao(dadosFinal) {
    const urlFinal = 'https://development-internship-api.geopostenergy.com/WorldCup/FinalResult';

    const corpoPost = {
        "equipeA": dadosFinal.timeA.id,
        "equipeB": dadosFinal.timeB.id,
        "golsEquipeA": dadosFinal.timeA.gols,
        "golsEquipeB": dadosFinal.timeB.gols,
        "golsPenaltyTimeA": dadosFinal.timeA.penaltis || 0,
        "golsPenaltyTimeB": dadosFinal.timeB.penaltis || 0
    };

    try {
        const resposta = await fetch(urlFinal, {
            method: 'POST',
            headers: {
                'git-user': 'thiagogiancristoforomiranda',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(corpoPost)
        });

        if (resposta.ok) {
            console.log("🏆 Sucesso! O servidor da empresa recebeu o campeão.");
        } else {
            console.error("Status do erro:", resposta.status);
        }
    } catch (erro) {
        console.error("Erro na comunicação direta com a API:", erro);
    }
}