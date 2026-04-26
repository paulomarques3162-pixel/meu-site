
/* ══════════════════════════════════════════════════════
   SCRIPT.JS — Paulo Marques Portfolio
   Organizado em módulos comentados
══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────
   1. CURSOR GLOW
   Faz um círculo de brilho suave seguir
   o cursor com animação de "inércia"
───────────────────────────────────────── */
const cgEl = document.getElementById('cg');
let mx = innerWidth / 2;  // posição alvo X do mouse
let my = innerHeight / 2; // posição alvo Y do mouse
let gx = mx, gy = my;     // posição atual do glow (atrasada)

// Atualiza posição alvo ao mover o mouse
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

// Loop de animação: segue o mouse com suavização (lerp)
(function animateGlow() {
  gx += (mx - gx) * 0.07;  // interpolação linear: 7% por frame
  gy += (my - gy) * 0.07;
  cgEl.style.left = gx + 'px';
  cgEl.style.top  = gy + 'px';
  requestAnimationFrame(animateGlow);
})();


/* ─────────────────────────────────────────
   2. PARTÍCULAS NO CANVAS
   Pontos flutuantes interconectados por
   linhas quando estão próximos
───────────────────────────────────────── */
const canvas = document.getElementById('cv');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

// Ajusta canvas ao redimensionar a janela
function resizeCanvas() {
  W = canvas.width  = innerWidth;
  H = canvas.height = innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Classe de partícula
class Particle {
  constructor() { this.reset(); }

  // Inicializa em posição e velocidade aleatória
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.4 + 0.3;   // raio
    this.vx = (Math.random() - 0.5) * 0.4; // velocidade X
    this.vy = (Math.random() - 0.5) * 0.4; // velocidade Y
    this.a  = Math.random() * 0.5 + 0.1;   // opacidade
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    // Reinicia se sair da tela
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56,189,248,${this.a})`;
    ctx.fill();
  }
}

// Cria 90 partículas
for (let i = 0; i < 90; i++) particles.push(new Particle());

// Loop de animação do canvas
(function animateParticles() {
  ctx.clearRect(0, 0, W, H);

  // Atualiza e desenha cada partícula
  particles.forEach(p => { p.update(); p.draw(); });

  // Conecta partículas próximas com linhas
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        // Opacidade da linha: diminui com a distância
        const alpha = 0.08 * (1 - dist / 100);
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
})();


/* ─────────────────────────────────────────
   3. EFEITO DE DIGITAÇÃO (TYPING)
   Alterna entre frases com animação de
   digitação e apagamento progressivo
───────────────────────────────────────── */
const phrases = [
  'Desenvolvedor Front-End',
  'UI/UX Enthusiast',
  'Criador de Interfaces Modernas',
  'Transformando ideias em código ✨'
];

let phraseIndex = 0;  // frase atual
let charIndex   = 0;  // posição do cursor
let isDeleting  = false;
const typingEl  = document.getElementById('typingEl');

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    // Adiciona um caractere
    typingEl.textContent = currentPhrase.slice(0, ++charIndex);

    if (charIndex === currentPhrase.length) {
      // Pausa antes de começar a apagar
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    // Remove um caractere
    typingEl.textContent = currentPhrase.slice(0, --charIndex);

    if (charIndex === 0) {
      // Avança para a próxima frase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  // Velocidade: apagar mais rápido que digitar
  setTimeout(typeEffect, isDeleting ? 45 : 80);
}

typeEffect(); // Inicia o efeito


/* ─────────────────────────────────────────
   4. SCROLL REVEAL
   Anima elementos com .reveal quando
   entram na área visível da tela
───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

// Observa todos os elementos com classe .reveal
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────
   5. NAVBAR DINÂMICA
   Altera a opacidade do fundo da nav
   conforme o usuário rola a página
───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  navbar.style.background = scrollY > 50
    ? 'rgba(2,6,23,.95)' // mais opaco ao rolar
    : 'rgba(2,6,23,.7)'; // semi-transparente no topo
});


/* ─────────────────────────────────────────
   6. TROCA DE VIEW (portfólio <-> loja)
───────────────────────────────────────── */

/** Abre a view da loja virtual */
function openStore() {
  document.getElementById('view-portfolio').classList.remove('active');
  document.getElementById('view-store').classList.add('active');
  window.scrollTo(0, 0);
  renderProducts(products); // Renderiza os produtos ao abrir
}

/** Volta para o portfólio */
function closeStore() {
  document.getElementById('view-store').classList.remove('active');
  document.getElementById('view-portfolio').classList.add('active');
  window.scrollTo(0, 0);
}


/* ─────────────────────────────────────────
   7. FORMULÁRIO DE CONTATO (EmailJS)
   Valida os campos e envia via EmailJS
───────────────────────────────────────── */
function sendForm() {
  const name  = document.getElementById('inp-name').value.trim();
  const email = document.getElementById('inp-email').value.trim();
  const msg   = document.getElementById('inp-msg').value.trim();

  // Validação simples
  if (!name || !email || !msg) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  // Envio via EmailJS
  emailjs.send('service_tcx51ht', 'template_lf6jsb5', {
    from_name:  name,
    from_email: email,
    message:    msg
  })
  .then(() => {
    // Limpa os campos após envio
    document.getElementById('inp-name').value  = '';
    document.getElementById('inp-email').value = '';
    document.getElementById('inp-msg').value   = '';

    // Exibe notificação de sucesso
    const toast = document.getElementById('toastPf');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  })
  .catch(err => {
    alert('Erro ao enviar a mensagem. Tente novamente.');
    console.error('EmailJS error:', err);
  });
}


/* ─────────────────────────────────────────
   8. CATÁLOGO DE PRODUTOS
   Array com todos os produtos da loja
───────────────────────────────────────── */
const products = [
  {
    id: 1, name: 'Fone AirSound Pro', cat: 'Audio', emoji: '🎧',
    desc: 'Cancelamento de ruído ativo, 30h de bateria e som imersivo.',
    price: 299, old: 399, badge: 'hot', stars: 4.8, rev: 234
  },
  {
    id: 2, name: 'Tênis UltraRun X', cat: 'Calcados', emoji: '👟',
    desc: 'Tecnologia de amortecimento avançado para máxima performance.',
    price: 449, old: 599, badge: 'novo', stars: 4.9, rev: 178
  },
  {
    id: 3, name: 'Smartwatch FitPro', cat: 'Relogios', emoji: '⌚',
    desc: 'Monitor cardíaco, GPS e 7 dias de autonomia.',
    price: 599, old: 799, badge: 'off', stars: 4.7, rev: 312
  },
  {
    id: 4, name: 'Câmera MiniVlog', cat: 'Gadgets', emoji: '📷',
    desc: '4K 60fps, estabilização óptica e conexão sem fio.',
    price: 799, old: 999, badge: 'novo', stars: 4.6, rev: 89
  },
  {
    id: 5, name: 'Speaker BassMax', cat: 'Audio', emoji: '🔊',
    desc: "360° surround, à prova d'água e 24h de bateria.",
    price: 199, old: 279, badge: 'off', stars: 4.5, rev: 445
  },
  {
    id: 6, name: 'Óculos VR Dive', cat: 'Gadgets', emoji: '🥽',
    desc: 'VR imersivo com rastreamento de movimento 6DoF.',
    price: 1299, old: 1699, badge: 'hot', stars: 4.8, rev: 67
  },
  {
    id: 7, name: 'Teclado MechRGB', cat: 'Gadgets', emoji: '⌨️',
    desc: 'Mecânico compacto, RGB customizável e switches táteis.',
    price: 349, old: 449, badge: 'novo', stars: 4.7, rev: 156
  },
  {
    id: 8, name: 'Carregador MagCharge', cat: 'Gadgets', emoji: '🔋',
    desc: '65W GaN, carregamento rápido para até 3 dispositivos.',
    price: 149, old: 199, badge: 'off', stars: 4.6, rev: 523
  }
];

// Estado do filtro e da lista atual
let cart        = {};
let activeFilter = null;
let currentList  = [...products];


/* ─────────────────────────────────────────
   9. HELPERS DOS BADGES DE PRODUTO
───────────────────────────────────────── */

/** Retorna a classe CSS do badge */
function getBadgeClass(badge) {
  return badge === 'hot' ? 'b-hot' : badge === 'novo' ? 'b-novo' : 'b-off';
}

/** Retorna o texto do badge */
function getBadgeLabel(badge) {
  return badge === 'hot' ? '🔥 Hot' : badge === 'novo' ? '✨ Novo' : '% Off';
}


/* ─────────────────────────────────────────
   10. RENDERIZAÇÃO DOS PRODUTOS
   Gera o HTML dos cards dinamicamente
───────────────────────────────────────── */
function renderProducts(list) {
  currentList = list;
  const grid  = document.getElementById('prodGrid');
  const count = document.getElementById('prodCount');
  if (!grid) return;

  // Atualiza contador de produtos
  if (count) count.textContent = list.length + ' produto' + (list.length !== 1 ? 's' : '');

  // Estado vazio
  if (!list || !list.length) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:.9rem;grid-column:1/-1;text-align:center;padding:40px">Nenhum produto encontrado.</p>';
    return;
  }

  // Renderiza os cards
  grid.innerHTML = list.map(p => `
    <div class="prod-card">
      <div class="prod-img">
        ${p.emoji}
        <div class="pbadge ${getBadgeClass(p.badge)}">${getBadgeLabel(p.badge)}</div>
        <div class="wish-btn" onclick="toggleWish(this)">♡</div>
      </div>
      <div class="prod-body">
        <div class="prod-cat">${p.cat}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-stars">
          <span class="stars">${'★'.repeat(Math.floor(p.stars))}${'☆'.repeat(5 - Math.floor(p.stars))}</span>
          <span>${p.stars} (${p.rev})</span>
        </div>
        <div class="prod-desc">${p.desc}</div>
        <div class="prod-foot">
          <div class="prod-price">
            <span class="p-old">R$ ${p.old.toLocaleString('pt-BR')},00</span>
            <span class="p-new">R$ ${p.price.toLocaleString('pt-BR')},00</span>
          </div>
          <button class="add-btn" id="ab-${p.id}" onclick="addToCart(${p.id})">
            <i class="fa-solid fa-plus"></i> Adicionar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}


/* ─────────────────────────────────────────
   11. FILTROS DA LOJA
───────────────────────────────────────── */

/** Filtra por categoria */
function filterByCategory(cat) {
  activeFilter = cat;

  // Destaca botão de filtro ativo
  document.querySelectorAll('.filter-btn-cat').forEach(btn => {
    btn.classList.remove('active');
    const prefixes = { Audio: '🎧', Calcados: '👟', Relogios: '⌚', Gadgets: '📱' };
    if (btn.textContent.trim().startsWith(prefixes[cat])) btn.classList.add('active');
  });

  // Atualiza status do filtro
  const labels  = { Audio: '🎧 Áudio', Calcados: '👟 Calçados', Relogios: '⌚ Relógios', Gadgets: '📱 Gadgets' };
  const statusEl = document.getElementById('filterStatus');
  if (statusEl) statusEl.textContent = 'Filtro: ' + labels[cat];

  // Aplica filtro combinando com busca ativa
  const query = (document.getElementById('filterSearchInput') || {}).value?.toLowerCase() || '';
  renderProducts(products.filter(p => p.cat === cat && (query === '' || p.name.toLowerCase().includes(query))));

  document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
}

/** Remove todos os filtros */
function clearFilter() {
  activeFilter = null;

  // Remove destaques
  document.querySelectorAll('.filter-btn-cat').forEach(b => b.classList.remove('active'));

  // Limpa campos de busca
  const searchMain   = document.getElementById('searchInput');
  const searchFilter = document.getElementById('filterSearchInput');
  if (searchMain)   searchMain.value   = '';
  if (searchFilter) searchFilter.value = '';

  // Atualiza status
  const statusEl = document.getElementById('filterStatus');
  if (statusEl) statusEl.textContent = 'Todos os produtos';

  renderProducts(products);
}

/** Busca pela barra principal (topbar) */
function filterProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const base  = activeFilter ? products.filter(p => p.cat === activeFilter) : products;
  renderProducts(base.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.desc.toLowerCase().includes(query)
  ));
}

/** Busca pelo campo interno do filtro */
function filterProducts2() {
  const query = document.getElementById('filterSearchInput').value.toLowerCase();
  const base  = activeFilter ? products.filter(p => p.cat === activeFilter) : products;
  renderProducts(base.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.desc.toLowerCase().includes(query)
  ));
}

/** Ordena os produtos pelo critério selecionado */
function sortProducts(value) {
  const sorted = [...currentList];
  if      (value === 'menor')      sorted.sort((a, b) => a.price  - b.price);
  else if (value === 'maior')      sorted.sort((a, b) => b.price  - a.price);
  else if (value === 'avaliacao')  sorted.sort((a, b) => b.stars  - a.stars);
  else if (value === 'popularidade') sorted.sort((a, b) => b.rev  - a.rev);
  renderProducts(sorted);
}


/* ─────────────────────────────────────────
   12. CARRINHO DE COMPRAS
───────────────────────────────────────── */

/** Adiciona produto ao carrinho */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  // Incrementa quantidade ou cria entrada
  cart[id] = cart[id]
    ? { ...cart[id], qty: cart[id].qty + 1 }
    : { ...product, qty: 1 };

  updateCartUI();

  // Feedback visual no botão (temporário)
  const btn = document.getElementById('ab-' + id);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Adicionado';
    setTimeout(() => {
      const b = document.getElementById('ab-' + id);
      if (b) {
        b.classList.remove('added');
        b.innerHTML = '<i class="fa-solid fa-plus"></i> Adicionar';
      }
    }, 1500);
  }

  showToastStore('✅ ' + product.name + ' adicionado!');
}

/** Altera a quantidade de um item no carrinho */
function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id]; // Remove se chegar a 0
  updateCartUI();
}

/** Atualiza toda a UI do carrinho (badge, lista, total) */
function updateCartUI() {
  const keys = Object.keys(cart);

  // Calcula totais
  const totalQty = keys.reduce((sum, k) => sum + cart[k].qty, 0);
  const totalVal = keys.reduce((sum, k) => sum + cart[k].qty * cart[k].price, 0);

  // Atualiza badge e valores
  document.getElementById('cartBadge').textContent = totalQty;
  const formattedTotal = 'R$ ' + totalVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('subtotal').textContent  = formattedTotal;
  document.getElementById('cartTotal').textContent = formattedTotal;

  // Reconstrói lista de itens
  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

  if (!keys.length) {
    emptyEl.style.display = 'flex';
    return;
  }

  emptyEl.style.display = 'none';

  keys.forEach(k => {
    const item = cart[k];
    const div  = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">R$ ${(item.price * item.qty).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
      </div>
      <div class="ci-qty">
        <button class="qty-btn" onclick="changeQty(${k}, -1)">−</button>
        <span class="qty-n">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${k}, +1)">+</button>
      </div>
    `;
    itemsEl.appendChild(div);
  });
}

/** Abre/fecha o drawer do carrinho */
function toggleCart() {
  document.getElementById('cartOv').classList.toggle('open');
}

/** Fecha o carrinho ao clicar no overlay (fora do drawer) */
function closeCartOut(event) {
  if (event.target === document.getElementById('cartOv')) toggleCart();
}


/* ─────────────────────────────────────────
   13. CHECKOUT & COMPROVANTE
───────────────────────────────────────── */

/** Inicia o processo de checkout */
function checkout() {
  if (!Object.keys(cart).length) {
    showToastStore('⚠️ Adicione produtos ao carrinho!');
    return;
  }

  // Fecha o carrinho e abre o comprovante
  document.getElementById('cartOv').classList.remove('open');
  buildReceipt();
  document.getElementById('receiptOverlay').classList.add('open');
}

/** Constrói e exibe o comprovante do pedido */
function buildReceipt() {
  const keys   = Object.keys(cart);
  const total  = keys.reduce((sum, k) => sum + cart[k].qty * cart[k].price, 0);
  const orderNum = 'TST-' + Math.floor(100000 + Math.random() * 900000);

  // Formata data e hora atual
  const now     = new Date();
  const dateStr = now.toLocaleDateString('pt-BR') +
    ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Preenche informações do comprovante
  document.getElementById('receiptNum').textContent   = '#' + orderNum;
  document.getElementById('rDate').textContent        = dateStr;
  document.getElementById('rSubtotal').textContent    = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('rTotal').textContent       = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  // Lista de itens no comprovante
  document.getElementById('receiptItems').innerHTML = keys.map(k => {
    const item = cart[k];
    return `
      <div class="receipt-item">
        <div class="ri-emoji">${item.emoji}</div>
        <div class="ri-info">
          <div class="ri-name">${item.name}</div>
          <div class="ri-qty">Qtd: ${item.qty} × R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="ri-price">R$ ${(item.price * item.qty).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
      </div>
    `;
  }).join('');

  // Esvazia o carrinho após gerar comprovante
  cart = {};
  updateCartUI();
}

/** Fecha o modal do comprovante */
function closeReceipt() {
  document.getElementById('receiptOverlay').classList.remove('open');
}

/** Abre o feedback direto do comprovante */
function openFeedbackFromReceipt() {
  document.getElementById('receiptOverlay').classList.remove('open');
  openFeedback();
}


/* ─────────────────────────────────────────
   14. SISTEMA DE FEEDBACK
   Coleta avaliação do cliente em 3 abas:
   Atendimento, Produtos e Sugestões
───────────────────────────────────────── */
let feedbackStarRating   = 0; // Avaliação da loja (1-5)
let feedbackStarQuality  = 0; // Avaliação dos produtos (1-5)

/** Abre o modal de feedback */
function openFeedback() {
  document.getElementById('feedbackForm').style.display = 'block';
  document.getElementById('feedbackDone').style.display = 'none';
  document.getElementById('feedbackOverlay').classList.add('open');
}

/** Fecha o modal de feedback */
function closeFeedback() {
  document.getElementById('feedbackOverlay').classList.remove('open');
}

/** Troca entre as abas do formulário */
function switchFbTab(index, element) {
  document.querySelectorAll('.fb-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.fb-tab-content').forEach(content => content.style.display = 'none');
  element.classList.add('active');
  document.getElementById('fbt-' + index).style.display = 'block';
}

/** Seleciona nota (estrelas) de atendimento */
function selectStar(n) {
  feedbackStarRating = n;
  document.querySelectorAll('#starsSelect .star-opt').forEach((star, i) => {
    star.classList.toggle('active', i < n);
  });
}

/** Seleciona nota (estrelas) de qualidade dos produtos */
function selectStarQ(n) {
  feedbackStarQuality = n;
  document.querySelectorAll('#starsQuality .star-opt').forEach((star, i) => {
    star.classList.toggle('active', i < n);
  });
}

/** Alterna seleção de opções de múltipla escolha */
function toggleOpt(btn) {
  btn.classList.toggle('sel');
}

/** Seleciona botão de recomendação (exclusivo) */
function selectRec(btn) {
  document.querySelectorAll('.fb-rec-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

/** Envia o feedback via EmailJS */
function submitFeedback() {
  // Coleta todas as opções selecionadas
  const selectedOpts = [];
  document.querySelectorAll('.fb-opt.sel').forEach(opt => {
    selectedOpts.push(opt.textContent.trim());
  });

  // Coleta recomendação
  let recommend = '';
  document.querySelectorAll('.fb-rec-btn.sel').forEach(btn => {
    recommend = btn.textContent.trim();
  });

  // Coleta comentário livre
  const comment = document.getElementById('fbComment').value.trim();

  // Monta mensagem de feedback
  let message = `Nova avaliação da TechStore!\n\n`;
  message += `⭐ Avaliação da Loja: ${feedbackStarRating} estrela(s)\n`;
  message += `⭐ Qualidade dos Produtos: ${feedbackStarQuality} estrela(s)\n`;
  if (selectedOpts.length) message += `\n✅ Destaques:\n${selectedOpts.map(o => '• ' + o).join('\n')}\n`;
  if (recommend)           message += `\n👍 Recomendaria: ${recommend}\n`;
  if (comment)             message += `\n💬 Comentário:\n${comment}\n`;

  // Envia via EmailJS
  emailjs.send('service_tcx51ht', 'template_lf6jsb5', {
    from_name:  'Feedback TechStore',
    from_email: 'feedback@techstore.com',
    message:    message
  })
  .then(() => {
    // Mostra tela de confirmação
    document.getElementById('feedbackForm').style.display = 'none';
    document.getElementById('feedbackDone').style.display = 'block';
    showToastStore('🎉 Obrigado pelo feedback!');

    // Reseta o formulário
    feedbackStarRating  = 0;
    feedbackStarQuality = 0;
    document.querySelectorAll('.star-opt').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.fb-opt').forEach(b => b.classList.remove('sel'));
    document.querySelectorAll('.fb-rec-btn').forEach(b => b.classList.remove('sel'));
    document.getElementById('fbComment').value = '';
  })
  .catch(() => {
    showToastStore('⚠️ Erro ao enviar feedback. Tente novamente!');
  });
}


/* ─────────────────────────────────────────
   15. FAVORITOS (wishlist)
───────────────────────────────────────── */
function toggleWish(btn) {
  btn.classList.toggle('on');
  btn.textContent = btn.classList.contains('on') ? '♥' : '♡';
  showToastStore(
    btn.classList.contains('on')
      ? '💖 Adicionado aos favoritos!'
      : '🗑️ Removido dos favoritos'
  );
}


/* ─────────────────────────────────────────
   16. TOAST DA LOJA
   Exibe notificação temporária centralizada
───────────────────────────────────────── */
function showToastStore(message) {
  const toast = document.getElementById('toastStore');
  toast.textContent = message;
  toast.classList.add('show');

  // Remove após 2.8s (cancela timer anterior se houver)
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2800);
}


/* ─────────────────────────────────────────
   17. NEWSLETTER
   Coleta e-mail e envia via EmailJS
───────────────────────────────────────── */
function subscribeNL() {
  const input = document.getElementById('nlEmail');
  const email = input.value.trim();

  // Validação básica de e-mail
  if (!email || !email.includes('@')) {
    showToastStore('⚠️ Digite um e-mail válido!');
    return;
  }

  emailjs.send('service_tcx51ht', 'template_lf6jsb5', {
    from_name:  'Newsletter',
    from_email: email,
    message:    `Nova inscrição na newsletter da TechStore!\nEmail: ${email}`
  })
  .then(() => {
    showToastStore('📬 Inscrição confirmada! Você receberá nossas ofertas.');
    input.value = '';
  })
  .catch(() => {
    showToastStore('⚠️ Erro ao processar inscrição. Tente novamente!');
  });
}
