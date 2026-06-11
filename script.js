/**
 * Script do projeto Agro Futuro Brasil
 * Controla os modais, interações de formulários e renderização de dados com p5.js
 */

// Massa de dados estruturada para o gráfico p5.js de Commodities brasileiras
const data = [
    { label: 'Soja', val: 169, color: [26, 71, 49] },      // Verde Escuro
    { label: 'Milho', val: 122, color: [45, 106, 79] },    // Verde Claro
    { label: 'Arroz', val: 15, color: [212, 160, 23] },     // Amber
    { label: 'Algodão', val: 3.5, color: [107, 114, 128] }  // Cinza Muted
];

const maxVal = 169;
let anim = 0;

// Inicialização do ambiente gráfico p5.js em modo de instância isolada
const p5Instance = new p5((s) => {
    s.setup = function() {
        const wrap = s.select('#data-canvas-wrap');
        // Define o tamanho baseado no elemento pai ou fallback de 900px
        const canvasW = wrap ? wrap.elt.offsetWidth : 900;
        const c = s.createCanvas(canvasW, 320);
        c.parent('data-canvas-wrap');
    };

    s.draw = function() {
        s.background(255);
        // Incrementa o multiplicador de animação de forma suave até atingir 1 (100%)
        anim = s.min(anim + 0.025, 1);
        
        const pad = 50;
        // Calcula a largura dinâmica das barras proporcionalmente ao tamanho disponível
        const barW = Math.floor((s.width - pad * 2) / data.length) - 24;
        
        s.textFont('Arial'); 
        s.textAlign(s.CENTER);
        
        // Renderização do Título Interno do Canvas
        s.fill(26, 71, 49); 
        s.textSize(13); 
        s.textStyle(s.BOLD);
        s.text('Produção Brasileira 2024 — Principais Commodities (milhões de toneladas)', s.width / 2, 25);
        
        // Loop de renderização das colunas de dados
        data.forEach((d, i) => {
            const x = pad + i * (barW + 24) + 12;
            const maxH = s.height - 95;
            const h = (d.val / maxVal) * maxH * anim;
            const y = s.height - 50 - h;
            
            // Desenho do Retângulo (Barra)
            s.fill(d.color[0], d.color[1], d.color[2]);
            s.noStroke();
            s.rect(x, y, barW, h, 4, 4, 0, 0);
            
            // Valor acima da barra
            s.fill(26, 71, 49); 
            s.textSize(11); 
            s.textStyle(s.BOLD);
            s.text(d.val + 'M', x + barW / 2, y - 8);
            
            // Rótulo de texto abaixo da barra
            s.fill(107, 114, 128); 
            s.textSize(11); 
            s.textStyle(s.NORMAL);
            s.text(d.label, x + barW / 2, s.height - 30);
        });
    };

    // Ajusta o gráfico automaticamente caso o navegador mude de tamanho
    s.windowResized = function() {
        const wrap = s.select('#data-canvas-wrap');
        if (wrap) {
            s.resizeCanvas(wrap.elt.offsetWidth, 320);
        }
    };
});

// DOM Elements e controle das janelas interativas (Modais)
document.addEventListener("DOMContentLoaded", () => {
    
    // Controles de Modais
    const contactModal = document.getElementById("contact-modal");
    const manifestoModal = document.getElementById("manifesto-modal-box");
    
    const openContactNav = document.getElementById("open-contact-nav");
    const openContactFooter = document.getElementById("open-contact-footer");
    const openManifestoBtn = document.getElementById("open-manifesto");
    
    const closeContactModal = document.getElementById("close-contact-modal");
    const closeManifestoModal = document.getElementById("close-manifesto-modal");
    
    // Smooth Scroll botão saber mais
    const scrollToAbout = document.getElementById("scroll-to-about");
    if(scrollToAbout) {
        scrollToAbout.addEventListener("click", () => {
            document.getElementById("sobre").scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Handlers para abrir modal de Contato
    if (openContactNav) openContactNav.addEventListener("click", () => contactModal.style.display = "flex");
    if (openContactFooter) openContactFooter.addEventListener("click", () => contactModal.style.display = "flex");
    
    // Handler para abrir modal de Manifesto
    if (openManifestoBtn) openManifestoBtn.addEventListener("click", () => manifestoModal.style.display = "flex");

    // Handlers para fechar modais
    if (closeContactModal) closeContactModal.addEventListener("click", () => contactModal.style.display = "none");
    if (closeManifestoModal) closeManifestoModal.addEventListener("click", () => manifestoModal.style.display = "none");

    // Fecha o modal caso o usuário clique fora da caixa de diálogo ativa
    window.addEventListener("click", (e) => {
        if (e.target === contactModal) contactModal.style.display = "none";
        if (e.target === manifestoModal) manifestoModal.style.display = "none";
    });

    // Lógica dos Botões de Perfil (Formulário)
    const perfilBtns = document.querySelectorAll(".perfil-btn");
    let perfilSelecionado = "Produtor"; // Valor inicial padrāo

    perfilBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            perfilBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            perfilSelecionado = btn.getAttribute("data-perfil");
        });
    });

    // Validação e Envio do Formulário de Contato
    const formContato = document.getElementById("form-contato");
    const inputNome = document.getElementById("input-nome");
    const errorNome = document.getElementById("error-nome");
    const successMsg = document.getElementById("modal-success-msg");

    if (formContato) {
        formContato.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Validação simples de preenchimento
            if (!inputNome.value.trim()) {
                errorNome.style.display = "block";
                inputNome.style.borderColor = "#ef4444";
                return;
            } else {
                errorNome.style.display = "none";
                inputNome.style.borderColor = "var(--border)";
            }

            // Exibe mensagem de sucesso simulando o envio
            formContato.style.display = "none";
            successMsg.style.display = "block";

            console.log("Formulário Enviado com sucesso:", {
                nome: inputNome.value,
                perfil: perfilSelecionado
            });

            // Reseta e fecha o modal após um intervalo de 2 segundos
            setTimeout(() => {
                formContato.reset();
                formContato.style.display = "block";
                successMsg.style.display = "none";
                contactModal.style.display = "none";
            }, 2000);
        });
    }
});