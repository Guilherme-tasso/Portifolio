/* AutoForce: código compartilhado: ícones, catálogo, carrinho e checkout */
document.documentElement.classList.add("js");

const STORE = {
  name: "AutoForce Mecânica",
  whatsapp: "5511999998888", // troque pelo número real (DDI + DDD + número)
  phone: "(11) 99999-8888",
  freeShipping: 299,
  shippingFee: 24.9,
  // 0 = domingo … 6 = sábado; [abre, fecha] em horas
  hours: { 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 13] },
};

/* ---------- Ícones (traços estilo Lucide) ---------- */
const ICONS = {
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
  disc: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  gauge: '<path d="m12 14 4-4M3.34 19a10 10 0 1 1 17.32 0"/>',
  steering: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 15v7M9.2 10.5 2.5 9M14.8 10.5 21.5 9"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83ZM22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
};
const icon = (name) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
function hydrateIcons(root = document) {
  root.querySelectorAll("[data-i]").forEach((el) => {
    el.insertAdjacentHTML(el.dataset.iPos === "end" ? "beforeend" : "afterbegin", icon(el.dataset.i));
    el.removeAttribute("data-i");
  });
}

/* ---------- Catálogo ---------- */
const CATEGORIES = [
  { id: "oleos", name: "Óleos" },
  { id: "filtros", name: "Filtros" },
  { id: "freios", name: "Freios" },
  { id: "suspensao", name: "Suspensão" },
  { id: "acessorios", name: "Acessórios" },
];

const PRODUCTS = [
  { id: 1, cat: "oleos", icon: "droplet", name: "Óleo sintético 5W30 · 4 L", price: 189.9, old: 229.9, sold: 412, install: true,
    desc: "100% sintético para motores flex e gasolina. Troca grátis na oficina.",
    specs: ["Viscosidade 5W30", "API SP / ILSAC GF-6", "Troca inclusa"] },
  { id: 2, cat: "oleos", icon: "droplet", name: "Óleo semissintético 10W40 · 4 L", price: 129.9, sold: 268,
    desc: "Para carros com mais quilometragem.",
    specs: ["Viscosidade 10W40", "API SN"] },
  { id: 3, cat: "filtros", icon: "filter", name: "Filtro de óleo", price: 45.9, sold: 520,
    desc: "Alta eficiência, com válvula antirretorno.",
    specs: ["Elemento de celulose", "Compatível com a maioria dos populares"] },
  { id: 4, cat: "filtros", icon: "wind", name: "Kit filtros ar + cabine", price: 199.9, old: 249.9, sold: 187, install: true,
    desc: "Filtro de ar do motor e de cabine com carvão ativado. Instalação inclusa.",
    specs: ["Filtro de ar do motor", "Filtro de cabine com carvão ativado", "Instalação inclusa"] },
  { id: 5, cat: "freios", icon: "disc", name: "Pastilha de freio cerâmica", price: 159.9, sold: 301,
    desc: "Menos ruído e menos pó nas rodas.",
    specs: ["Jogo dianteiro (4 peças)", "Composto cerâmico"] },
  { id: 6, cat: "freios", icon: "disc", name: "Disco de freio ventilado · par", price: 329.9, old: 399.9, sold: 142,
    desc: "Melhor dissipação de calor e frenagem estável.",
    specs: ["Par dianteiro", "Tratamento anticorrosivo"] },
  { id: 7, cat: "suspensao", icon: "car", name: "Amortecedor dianteiro · par", price: 459.9, sold: 96,
    desc: "Pressurizado a gás, 1 ano de garantia.",
    specs: ["Par dianteiro", "Garantia de 1 ano"] },
  { id: 8, cat: "suspensao", icon: "gauge", name: "Kit suspensão completo", price: 1299.9, old: 1599.9, sold: 58, install: true,
    desc: "Amortecedores, molas e batentes, com instalação e alinhamento.",
    specs: ["4 amortecedores + 4 molas", "Batentes e coxins", "Instalação + alinhamento"] },
  { id: 9, cat: "acessorios", icon: "steering", name: "Capa de volante em couro", price: 79.9, sold: 233,
    desc: "Couro sintético, tamanho universal 37–39 cm.",
    specs: ["Couro sintético", "37–39 cm"] },
  { id: 10, cat: "acessorios", icon: "layers", name: "Jogo de tapetes de borracha", price: 89.9, sold: 275,
    desc: "Cinco peças, encaixe universal.",
    specs: ["5 peças", "Borracha atóxica"] },
  { id: 11, cat: "acessorios", icon: "camera", name: "Câmera de ré com sensor", price: 249.9, old: 299.9, sold: 121, install: true,
    desc: "Visão noturna e linhas-guia. Instalação inclusa.",
    specs: ["Visão noturna", "Linhas-guia", "Instalação inclusa"] },
  { id: 12, cat: "acessorios", icon: "monitor", name: "Central multimídia 9\"", price: 899.9, old: 1099.9, sold: 74, install: true,
    desc: "Android Auto e Apple CarPlay. Instalação inclusa.",
    specs: ["Tela 9\" touch", "Android Auto e CarPlay", "Instalação inclusa"] },
];

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || "";
const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);
const productArt = (p) => `<div class="p-art">${icon(p.icon)}</div>`;
const waLink = (text) => `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- Aberto agora? ---------- */
function openStatus(now = new Date()) {
  const h = STORE.hours[now.getDay()];
  const t = now.getHours() + now.getMinutes() / 60;
  if (h && t >= h[0] && t < h[1]) return { open: true, text: `Aberto agora · fecha às ${h[1]}h` };
  for (let i = 0; i < 7; i++) {
    const d = (now.getDay() + i) % 7;
    const hh = STORE.hours[d];
    if (!hh || (i === 0 && t >= hh[0])) continue;
    const day = i === 0 ? "hoje" : i === 1 ? "amanhã" : ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][d];
    return { open: false, text: `Fechado · abre ${day} às ${hh[0]}h` };
  }
  return { open: false, text: "Fechado" };
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.innerHTML = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

/* ---------- Carrinho (persistido no navegador) ---------- */
const Cart = {
  key: "autoforce_cart",
  items: [],
  load() {
    try { this.items = JSON.parse(localStorage.getItem(this.key)) || []; } catch { this.items = []; }
    this.items = this.items.filter((it) => PRODUCTS.some((p) => p.id === it.id));
  },
  save() {
    try { localStorage.setItem(this.key, JSON.stringify(this.items)); } catch {}
    renderCart();
  },
  add(id, qty = 1) {
    const it = this.items.find((i) => i.id === id);
    if (it) it.qty += qty; else this.items.push({ id, qty });
    this.save();
    toast(`${PRODUCTS.find((x) => x.id === id).name} no carrinho`);
  },
  setQty(id, qty) {
    if (qty <= 0) this.items = this.items.filter((i) => i.id !== id);
    else this.items.find((i) => i.id === id).qty = qty;
    this.save();
  },
  clear() { this.items = []; this.save(); },
  lines() { return this.items.map((i) => ({ ...i, p: PRODUCTS.find((p) => p.id === i.id) })); },
  count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  subtotal() { return this.lines().reduce((s, l) => s + l.p.price * l.qty, 0); },
};

function injectShell() {
  document.body.insertAdjacentHTML("beforeend", `
  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="cartDrawer" aria-label="Carrinho" aria-hidden="true">
    <div class="drawer-head"><h3>Carrinho</h3><button class="x-btn" data-close aria-label="Fechar carrinho">${icon("x")}</button></div>
    <div class="drawer-body" id="cartBody"></div>
    <div class="drawer-foot" id="cartFoot"></div>
  </aside>
  <div class="modal" id="checkoutModal" role="dialog" aria-modal="true" aria-labelledby="coTitle">
    <div class="modal-box">
      <div class="modal-head"><h3 id="coTitle">Finalizar pedido</h3><button class="x-btn" data-close aria-label="Fechar">${icon("x")}</button></div>
      <form class="modal-body co-grid" id="checkoutForm" novalidate>
        <div>
          <div class="field-row">
            <div class="field"><label for="coName">Nome</label><input id="coName" name="name" required autocomplete="name"></div>
            <div class="field"><label for="coPhone">WhatsApp</label><input id="coPhone" name="phone" required inputmode="tel" placeholder="(11) 90000-0000" autocomplete="tel"></div>
          </div>
          <div class="field"><span class="label">Recebimento</span>
            <div class="opt-group">
              <div class="opt"><input type="radio" name="delivery" id="dlPick" value="retirada" checked><label for="dlPick"><b>Retirar na loja</b><small>Grátis, pronto em 2h</small></label></div>
              <div class="opt"><input type="radio" name="delivery" id="dlShip" value="entrega"><label for="dlShip"><b>Entrega</b><small>Grátis acima de ${brl(STORE.freeShipping)}</small></label></div>
            </div>
          </div>
          <div class="field hidden" id="addrField"><label for="coAddr">Endereço</label><input id="coAddr" name="address" placeholder="Rua, número, bairro" autocomplete="street-address"></div>
          <div class="field"><label for="coPay">Pagamento</label>
            <select id="coPay" name="payment">
              <option>Pix (5% de desconto)</option>
              <option>Cartão de crédito (até 3x)</option>
              <option>Cartão de débito</option>
              <option>Dinheiro</option>
            </select>
          </div>
          <div class="field"><label for="coCar">Carro (opcional)</label><input id="coCar" name="car" placeholder="Ex.: Onix 2020"></div>
        </div>
        <div class="co-summary" id="coSummary"></div>
      </form>
    </div>
  </div>
  <div class="modal" id="productModal" role="dialog" aria-modal="true" aria-labelledby="pmTitle">
    <div class="modal-box">
      <div class="modal-head"><h3 id="pmTitle">Produto</h3><button class="x-btn" data-close aria-label="Fechar">${icon("x")}</button></div>
      <div class="modal-body" id="pmBody"></div>
    </div>
  </div>`);

  document.getElementById("overlay").addEventListener("click", closeAll);
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeAll));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll());
  document.querySelectorAll("[data-open-cart]").forEach((b) => b.addEventListener("click", openCart));
  document.querySelectorAll(".modal").forEach((m) => m.addEventListener("click", (e) => e.target === m && closeAll()));

  const form = document.getElementById("checkoutForm");
  form.addEventListener("change", (e) => {
    if (e.target.name === "delivery" || e.target.name === "payment") {
      document.getElementById("addrField").classList.toggle("hidden", form.delivery.value !== "entrega");
      renderSummary();
    }
  });
  form.addEventListener("submit", submitOrder);
}

function openLayer(el) {
  closeAll();
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  document.getElementById("overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeAll() {
  document.querySelectorAll(".drawer.open, .modal.open").forEach((el) => {
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
  });
  document.getElementById("overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}
function openCart() { openLayer(document.getElementById("cartDrawer")); }

function totals(delivery = "retirada", payment = "") {
  const sub = Cart.subtotal();
  const ship = delivery === "entrega" && sub < STORE.freeShipping ? STORE.shippingFee : 0;
  const pix = payment.startsWith("Pix") ? sub * 0.05 : 0;
  return { sub, ship, pix, total: sub + ship - pix };
}

function renderCart() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    const n = Cart.count();
    el.textContent = n;
    el.dataset.n = n;
  });
  const body = document.getElementById("cartBody");
  const foot = document.getElementById("cartFoot");
  if (!body) return;
  const lines = Cart.lines();
  if (!lines.length) {
    body.innerHTML = `<div class="cart-empty"><p>Seu carrinho está vazio.</p><a class="btn" href="loja.html">Ver a loja</a></div>`;
    foot.innerHTML = "";
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  const sub = Cart.subtotal();
  const left = STORE.freeShipping - sub;
  body.innerHTML = `
    <div class="ship-note">${left > 0 ? `Faltam <b>${brl(left)}</b> para frete grátis` : `<b>Frete grátis liberado</b>`}
      <div class="ship-track"><i style="width:${Math.min(100, (sub / STORE.freeShipping) * 100)}%"></i></div>
    </div>` +
    lines.map((l) => `
    <div class="cart-item">
      <div class="cart-thumb">${productArt(l.p)}</div>
      <div>
        <h4>${l.p.name}</h4>
        <div class="price">${brl(l.p.price * l.qty)}</div>
        <div class="qty">
          <button data-q="${l.id}" data-d="-1" aria-label="Diminuir">${icon("minus")}</button>
          <span>${l.qty}</span>
          <button data-q="${l.id}" data-d="1" aria-label="Aumentar">${icon("plus")}</button>
        </div>
      </div>
      <button class="rm" data-rm="${l.id}" aria-label="Remover ${l.p.name}">${icon("trash")}</button>
    </div>`).join("");
  foot.innerHTML = `
    <div class="sum-row total"><span>Subtotal</span><span>${brl(sub)}</span></div>
    <p class="note">5% de desconto no Pix. Frete calculado no próximo passo.</p>
    <button class="btn btn-accent btn-block" id="goCheckout">Finalizar pedido ${icon("arrow")}</button>`;
  body.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => {
    const id = +b.dataset.q;
    Cart.setQty(id, Cart.items.find((i) => i.id === id).qty + +b.dataset.d);
  }));
  body.querySelectorAll("[data-rm]").forEach((b) => b.addEventListener("click", () => Cart.setQty(+b.dataset.rm, 0)));
  document.getElementById("goCheckout").addEventListener("click", openCheckout);
}

function openCheckout() {
  renderSummary();
  openLayer(document.getElementById("checkoutModal"));
  setTimeout(() => document.getElementById("coName").focus(), 50);
}

function renderSummary() {
  const form = document.getElementById("checkoutForm");
  const t = totals(form.delivery.value, form.payment.value);
  document.getElementById("coSummary").innerHTML = `
    <h4>Resumo</h4>
    ${Cart.lines().map((l) => `<div class="co-line"><span>${l.qty}× ${l.p.name}</span><span>${brl(l.p.price * l.qty)}</span></div>`).join("")}
    <div class="co-line" style="margin-top:8px"><span>Frete</span><span>${t.ship ? brl(t.ship) : "Grátis"}</span></div>
    ${t.pix ? `<div class="co-line"><span>Desconto Pix</span><span>− ${brl(t.pix)}</span></div>` : ""}
    <div class="sum-row total" style="margin-top:8px"><span>Total</span><span>${brl(t.total)}</span></div>
    <button type="submit" class="btn btn-accent btn-block">${icon("chat")} Enviar pelo WhatsApp</button>
    <p class="note">Pagamento e entrega são confirmados na conversa.</p>`;
}

function submitOrder(e) {
  e.preventDefault();
  const f = e.target;
  const need = [f.name, f.phone];
  if (f.delivery.value === "entrega") need.push(f.address);
  need.forEach((el) => el.classList.toggle("invalid", !el.value.trim()));
  const bad = need.find((el) => !el.value.trim());
  if (bad) { bad.focus(); return; }

  const t = totals(f.delivery.value, f.payment.value);
  const orderId = "AF" + Date.now().toString().slice(-6);
  const msg = [
    `*Pedido ${orderId} | ${STORE.name}*`,
    "",
    ...Cart.lines().map((l) => `• ${l.qty}x ${l.p.name}: ${brl(l.p.price * l.qty)}`),
    "",
    `Frete: ${t.ship ? brl(t.ship) : "Grátis"}`,
    t.pix ? `Desconto Pix: -${brl(t.pix)}` : null,
    `*Total: ${brl(t.total)}*`,
    "",
    `Cliente: ${f.name.value.trim()}`,
    `WhatsApp: ${f.phone.value.trim()}`,
    `Recebimento: ${f.delivery.value === "entrega" ? "Entrega: " + f.address.value.trim() : "Retirada na loja"}`,
    `Pagamento: ${f.payment.value}`,
    f.car.value.trim() ? `Carro: ${f.car.value.trim()}` : null,
  ].filter((x) => x !== null).join("\n");

  window.open(waLink(msg), "_blank", "noopener");
  Cart.clear();
  f.reset();
  document.getElementById("addrField").classList.add("hidden");
  closeAll();
  toast(`Pedido ${orderId} pronto. Envie a mensagem no WhatsApp.`);
}

function openProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  document.getElementById("pmTitle").textContent = catName(p.cat);
  document.getElementById("pmBody").innerHTML = `
    <div class="pd">
      <div class="p-media">${productArt(p)}${p.old ? `<span class="p-tag">−${discount(p)}%</span>` : ""}</div>
      <div>
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <ul>${p.specs.map((s) => `<li>${s}</li>`).join("")}</ul>
        <div class="p-price-row"><span class="p-price">${brl(p.price)}</span>${p.old ? `<span class="p-old">${brl(p.old)}</span>` : ""}</div>
        <p class="note">ou 3x de ${brl(p.price / 3)} · ${brl(p.price * 0.95)} no Pix</p>
        <div class="pd-actions">
          <button class="btn btn-accent" id="pmAdd">Adicionar ao carrinho</button>
          <a class="btn btn-line" target="_blank" rel="noopener" href="${waLink(`Olá! Tenho uma dúvida sobre: ${p.name}`)}">${icon("chat")} Perguntar no WhatsApp</a>
        </div>
      </div>
    </div>`;
  openLayer(document.getElementById("productModal"));
  document.getElementById("pmAdd").addEventListener("click", () => { Cart.add(p.id); openCart(); });
}

function productCard(p) {
  return `
  <article class="product">
    <div class="p-media" data-view="${p.id}" role="button" tabindex="0" aria-label="Ver ${p.name}">
      ${productArt(p)}
      ${p.old ? `<span class="p-tag">−${discount(p)}%</span>` : ""}
    </div>
    <div class="p-body">
      <h3 class="p-name" data-view="${p.id}">${p.name}</h3>
      <span class="p-cat">${catName(p.cat)}${p.install ? " · instalação inclusa" : ""}</span>
      <div class="p-price-row"><span class="p-price">${brl(p.price)}</span>${p.old ? `<span class="p-old">${brl(p.old)}</span>` : ""}</div>
      <button class="btn btn-sm p-add" data-add="${p.id}" aria-label="Adicionar ${p.name} ao carrinho">Adicionar</button>
    </div>
  </article>`;
}

function bindProductCards(root) {
  root.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => Cart.add(+b.dataset.add)));
  root.querySelectorAll("[data-view]").forEach((b) => {
    b.addEventListener("click", () => openProduct(+b.dataset.view));
    b.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openProduct(+b.dataset.view)));
  });
}

/* ---------- Entradas ao rolar ---------- */
function observeRise(root = document) {
  const els = root.querySelectorAll(".rise:not(.in)");
  if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("in"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  els.forEach((el) => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateIcons();
  injectShell();
  Cart.load();
  renderCart();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".bar nav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa || "Olá! Vim pelo site da AutoForce.");
    a.target = "_blank";
    a.rel = "noopener";
  });

  const st = openStatus();
  document.querySelectorAll("[data-status]").forEach((el) => {
    el.textContent = st.text;
    el.classList.toggle("open", st.open);
  });

  observeRise();
});
