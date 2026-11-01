// Palcos: cada projeto roda num iframe "maior" e é reduzido para caber na tela,
// assim ele aparece como no computador e não espremido.
function ajustarTela(tela, iframe) {
    const largura = tela.clientWidth;
    const altura = tela.clientHeight;
    // no computador mostra como em ~1280px; no celular, como em ~760px
    const escala = Math.max(0.45, Math.min(1, largura / 1280));
    iframe.style.width = `${largura / escala}px`;
    iframe.style.height = `${altura / escala}px`;
    iframe.style.transform = `scale(${escala})`;
}

document.querySelectorAll('[data-palco]').forEach((palco) => {
    const nome = palco.dataset.palco;
    const tela = palco.querySelector('.tela');
    const iframe = tela.querySelector('iframe');
    const abas = palco.querySelectorAll('.abas a');
    const infos = document.querySelectorAll(`[data-info-de="${nome}"] .info`);

    ajustarTela(tela, iframe);
    new ResizeObserver(() => ajustarTela(tela, iframe)).observe(tela);

    // Mostra só o texto do projeto que está no palco
    function mostrarInfo(chave) {
        infos.forEach((info) => {
            info.hidden = info.dataset.info !== chave;
        });
    }

    abas.forEach((aba) => {
        aba.addEventListener('click', () => {
            abas.forEach((a) => {
                a.classList.remove('ativo');
                a.removeAttribute('aria-current');
            });
            aba.classList.add('ativo');
            aba.setAttribute('aria-current', 'true');
            iframe.title = `Projeto rodando: ${aba.textContent}`;
            mostrarInfo(aba.dataset.info);
        });
    });

    mostrarInfo(palco.querySelector('.abas a.ativo').dataset.info);
});

// Loja: cada card abre uma janela com a galeria e os detalhes do produto
document.querySelectorAll('[data-abre]').forEach((botao) => {
    const janela = document.getElementById(botao.dataset.abre);
    botao.addEventListener('click', () => {
        janela.showModal();
        janela.scrollTop = 0;
        // o botão Voltar do celular fecha a janela em vez de sair do site
        history.pushState({ detalhe: janela.id }, '');
    });
});

document.querySelectorAll('.detalhe').forEach((janela) => {
    const miniaturas = [...janela.querySelectorAll('[data-imagem]')];
    const imagem = janela.querySelector('.detalhe-imagem');
    const legenda = janela.querySelector('figcaption');

    function mostrarImagem(miniatura) {
        imagem.src = miniatura.dataset.imagem;
        imagem.alt = miniatura.dataset.legenda;
        legenda.textContent = miniatura.dataset.legenda;
        miniaturas.forEach((m) => m.setAttribute('aria-pressed', m === miniatura));
        miniatura.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    miniaturas.forEach((m) => m.addEventListener('click', () => mostrarImagem(m)));

    janela.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const atual = miniaturas.findIndex((m) => m.getAttribute('aria-pressed') === 'true');
        const passo = e.key === 'ArrowRight' ? 1 : -1;
        mostrarImagem(miniaturas[(atual + passo + miniaturas.length) % miniaturas.length]);
    });

    janela.querySelector('[data-fecha]').addEventListener('click', () => janela.close());

    // clicar fora da janela também fecha
    janela.addEventListener('click', (e) => {
        if (e.target === janela) janela.close();
    });

    janela.addEventListener('close', () => {
        if (history.state && history.state.detalhe === janela.id) history.back();
    });
});

window.addEventListener('popstate', () => {
    const aberta = document.querySelector('.detalhe[open]');
    if (aberta) aberta.close();
});

// Entradas: cada parte de uma seção aparece em sequência quando chega na tela
const revelar = document.querySelectorAll('.revelar');

revelar.forEach((el) => {
    const irmaos = [...el.parentElement.children].filter((c) => c.classList.contains('revelar'));
    el.style.setProperty('--atraso', `${irmaos.indexOf(el) * 80}ms`);
});

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revelar.forEach((el) => observador.observe(el));
