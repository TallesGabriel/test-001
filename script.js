// BASE DE DADOS INTERNA
const defaultDatabase = {
  "7891008114003": {
    name: "Caixa de Bombom Garoto 250g",
    material: "Papelão Cartão Reciclável",
    decomposition: "3 a 6 meses",
    score: 8,
    binColor: "azul",
    binName: "Azul (Papel / Papelão)",
    disposal: "Retire a embalagem plástica externa e os papéis dos chocolates. Dobrar a caixa de papelão e descartar na Lixeira Azul."
  },
  "7891000325131": {
    name: "Caixa de Bombom Nestlé Especialidades 251g",
    material: "Papelão Cartão Reciclável",
    decomposition: "3 a 6 meses",
    score: 8,
    binColor: "azul",
    binName: "Azul (Papel / Papelão)",
    disposal: "Separe os plásticos internos dos chocolates. Dobre a caixa e descarte na Lixeira Azul."
  },
  "7894900704211": {
    name: "Coca-Cola Zero RefPET Retornável 2L",
    material: "Plástico RefPET Reutilizável",
    decomposition: "Reutilizável até 25 vezes",
    score: 10,
    binColor: "retornavel",
    binName: "Ponto de Troca / Retornável",
    disposal: "Guardar a garrafa intacta e efetuar a troca no supermercado parceiro."
  },
  "7894900011517": {
    name: "Coca-Cola Original Lata 350ml",
    material: "Alumínio 100% Reciclável",
    decomposition: "200 anos",
    score: 9,
    binColor: "amarelo",
    binName: "Amarelo (Metais)",
    disposal: "Esvaziar completamente, amassar a lata e descartar na Lixeira Amarela."
  },
  "7896066300013": {
    name: "Bisnaguinha Wickbold Original 300g",
    material: "Plástico PP Flexível",
    decomposition: "400 anos",
    score: 4,
    binColor: "vermelho",
    binName: "Vermelho (Plásticos)",
    disposal: "Remover o arame de vedação e descartar a embalagem na Lixeira Vermelha."
  }
};

let customDatabase = {};
let html5QrCode = null;
let currentUnrecognizedCode = "";

function loadDatabase() {
  const stored = localStorage.getItem('ascensao_custom_db');
  if (stored) customDatabase = JSON.parse(stored);
}

// SUGESTÃO AUTOMÁTICA DE MATERIAL DURANTE CADASTRO
function autoSuggestMaterial() {
  const name = document.getElementById('regName').value.toLowerCase();
  const binSelect = document.getElementById('regBinColor');
  const matInput = document.getElementById('regMaterial');
  const decompInput = document.getElementById('regDecomp');
  const disposalInput = document.getElementById('regDisposal');

  if (name.includes("caixa") || name.includes("bombom") || name.includes("chocolate") || name.includes("sabao em po") || name.includes("papel")) {
    binSelect.value = "azul";
    matInput.value = "Papelão Cartão Reciclável";
    decompInput.value = "3 a 6 meses";
    disposalInput.value = "Desmonte a caixa para economizar espaço e descarte na Lixeira Azul (Papel).";
  } else if (name.includes("lata") || name.includes("cerveja") || name.includes("refrigerante lata")) {
    binSelect.value = "amarelo";
    matInput.value = "Alumínio Reciclável";
    decompInput.value = "200 anos";
    disposalInput.value = "Esvazie, amasse a lata e jogue na Lixeira Amarela (Metais).";
  } else if (name.includes("vidro") || name.includes("pote") || name.includes("garrafa vidro")) {
    binSelect.value = "verde";
    matInput.value = "Vidro Reciclável";
    decompInput.value = "Indeterminado";
    disposalInput.value = "Lave o recipiente e descarte sem quebrar na Lixeira Verde.";
  } else if (name.includes("pet") || name.includes("plastico") || name.includes("saco") || name.includes("shampoo")) {
    binSelect.value = "vermelho";
    matInput.value = "Plástico Reciclável (PET/PP)";
    decompInput.value = "400 anos";
    disposalInput.value = "Esvazie o conteúdo restante e descarte na Lixeira Vermelha.";
  }
}

function analyzeBarcode(code) {
  document.getElementById('resultCard').classList.add('hidden');
  document.getElementById('notFoundCard').classList.add('hidden');

  const fullDatabase = { ...defaultDatabase, ...customDatabase };
  const item = fullDatabase[code];

  if (item) {
    document.getElementById('productName').innerText = item.name;
    document.getElementById('productBarcode').innerText = `EAN: ${code}`;
    document.getElementById('productMaterial').innerText = item.material;
    document.getElementById('decompositionTime').innerText = item.decomposition;
    document.getElementById('productScore').innerText = item.score;
    document.getElementById('disposalGuide').innerText = item.disposal;

    const binContainer = document.getElementById('binColorContainer');
    const binName = document.getElementById('binColorName');
    const binBadge = document.getElementById('binBadge');
    const binIcon = document.getElementById('binColorIcon');

    binName.innerText = item.binName || "Lixeira Seletiva";
    binBadge.innerText = (item.binColor || "geral").toUpperCase();

    if (item.binColor === 'azul') {
      binContainer.className = "p-3.5 rounded-2xl flex items-center justify-between bg-blue-950/80 border border-blue-500/50 text-blue-200 shadow-lg";
      binBadge.className = "text-[10px] font-black px-3 py-1 rounded-lg bg-blue-500 text-slate-950 shadow";
      binIcon.innerText = "🟦";
    } else if (item.binColor === 'vermelho') {
      binContainer.className = "p-3.5 rounded-2xl flex items-center justify-between bg-red-950/80 border border-red-500/50 text-red-200 shadow-lg";
      binBadge.className = "text-[10px] font-black px-3 py-1 rounded-lg bg-red-500 text-slate-950 shadow";
      binIcon.innerText = "🟥";
    } else if (item.binColor === 'amarelo') {
      binContainer.className = "p-3.5 rounded-2xl flex items-center justify-between bg-yellow-950/80 border border-yellow-500/50 text-yellow-200 shadow-lg";
      binBadge.className = "text-[10px] font-black px-3 py-1 rounded-lg bg-yellow-500 text-slate-950 shadow";
      binIcon.innerText = "🟨";
    } else if (item.binColor === 'verde') {
      binContainer.className = "p-3.5 rounded-2xl flex items-center justify-between bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 shadow-lg";
      binBadge.className = "text-[10px] font-black px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 shadow";
      binIcon.innerText = "🟩";
    } else {
      binContainer.className = "p-3.5 rounded-2xl flex items-center justify-between bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 shadow-lg";
      binBadge.className = "text-[10px] font-black px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 shadow";
      binIcon.innerText = "♻️";
    }

    document.getElementById('resultCard').classList.remove('hidden');
  } else {
    currentUnrecognizedCode = code;
    document.getElementById('unregisteredCode').innerText = code;
    document.getElementById('notFoundCard').classList.remove('hidden');
  }
}

function scanImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!html5QrCode) html5QrCode = new Html5Qrcode("reader");

  html5QrCode.scanFile(file, true)
    .then(decodedText => analyzeBarcode(decodedText))
    .catch(() => alert("Não foi possível identificar o código de barras nesta imagem. Tente uma foto mais nítida."));
}

function initScanner() {
  html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 15, qrbox: { width: 250, height: 120 } },
    (decodedText) => {
      if (navigator.vibrate) navigator.vibrate(80);
      analyzeBarcode(decodedText);
    },
    () => {}
  ).catch(() => document.getElementById('camStatus').innerText = "Câmera Inativa");
}

function restartScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => initScanner()).catch(() => initScanner());
  } else {
    initScanner();
  }
}

function submitManualCode() {
  const input = document.getElementById('manualCode').value.trim();
  if (input) analyzeBarcode(input);
}

function openRegisterWithCode() {
  switchTab('register');
  document.getElementById('regBarcode').value = currentUnrecognizedCode;
  document.getElementById('regName').focus();
}

function saveProduct(event) {
  event.preventDefault();
  const code = document.getElementById('regBarcode').value.trim();
  const binColor = document.getElementById('regBinColor').value;
  const binNames = {
    azul: "Azul (Papel / Papelão)",
    vermelho: "Vermelho (Plásticos)",
    amarelo: "Amarelo (Metais)",
    verde: "Verde (Vidros)",
    marrom: "Marrom (Orgânico)",
    cinza: "Cinza (Não Reciclável)"
  };

  customDatabase[code] = {
    name: document.getElementById('regName').value.trim(),
    binColor: binColor,
    binName: binNames[binColor],
    material: document.getElementById('regMaterial').value.trim(),
    decomposition: document.getElementById('regDecomp').value.trim(),
    score: parseInt(document.getElementById('regScore').value),
    disposal: document.getElementById('regDisposal').value.trim()
  };

  localStorage.setItem('ascensao_custom_db', JSON.stringify(customDatabase));
  alert("Produto registado com sucesso!");
  document.getElementById('registerForm').reset();
  loadDatabase();
  switchTab('scanner');
  analyzeBarcode(code);
}

function switchTab(tab) {
  document.getElementById('tabScanner').classList.toggle('hidden', tab !== 'scanner');
  document.getElementById('tabDisposal').classList.toggle('hidden', tab !== 'disposal');
  document.getElementById('tabGuide').classList.toggle('hidden', tab !== 'guide');
  document.getElementById('tabRegister').classList.toggle('hidden', tab !== 'register');

  document.getElementById('navScanner').className = tab === 'scanner' ? "flex flex-col items-center py-1 text-emerald-300 font-bold" : "flex flex-col items-center py-1 text-slate-400";
  document.getElementById('navDisposal').className = tab === 'disposal' ? "flex flex-col items-center py-1 text-emerald-300 font-bold" : "flex flex-col items-center py-1 text-slate-400";
  document.getElementById('navGuide').className = tab === 'guide' ? "flex flex-col items-center py-1 text-emerald-300 font-bold" : "flex flex-col items-center py-1 text-slate-400";
  document.getElementById('navRegister').className = tab === 'register' ? "flex flex-col items-center py-1 text-emerald-300 font-bold" : "flex flex-col items-center py-1 text-slate-400";
}

window.addEventListener('load', () => {
  loadDatabase();
  initScanner();
});
