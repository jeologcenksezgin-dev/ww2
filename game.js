// ===== GAME.JS — Core Game Logic =====

// ============ STATE ============
let state = {
  player: null,         // faction key
  turn: 1,
  year: 1939,
  resources: 0,
  selectedProvince: null,
  provinces: {},        // id -> { owner, troops, fortified, prod }
  factions: {},         // key -> { resources, army }
  log: [],
  gameOver: false,
};

// Province adjacency map (which provinces border which)
const ADJACENCY = {
  uk: ['ireland','scotland','france','netherlands'],
  ireland: ['uk','scotland'],
  scotland: ['uk','ireland','norway'],
  france: ['uk','netherlands','belgium','germany','switzerland','italy','spain'],
  spain: ['france','portugal','morocco'],
  portugal: ['spain'],
  germany: ['netherlands','belgium','france','switzerland','austria','czechoslovakia','poland','denmark'],
  netherlands: ['uk','germany','belgium','france'],
  belgium: ['uk','netherlands','germany','france'],
  denmark: ['germany','norway','sweden'],
  norway: ['scotland','sweden','denmark'],
  sweden: ['norway','denmark','finland','estonia'],
  poland: ['germany','czechoslovakia','austria','belorussia','ukraine','lithuania'],
  czechoslovakia: ['germany','austria','hungary','poland'],
  austria: ['germany','czechoslovakia','hungary','switzerland','italy','yugoslavia'],
  hungary: ['austria','czechoslovakia','romania','yugoslavia','ukraine'],
  romania: ['ukraine','hungary','yugoslavia','bulgaria','ussr'],
  bulgaria: ['romania','yugoslavia','greece','turkey'],
  yugoslavia: ['austria','hungary','romania','bulgaria','greece','italy'],
  greece: ['yugoslavia','bulgaria','turkey'],
  italy: ['france','switzerland','austria','yugoslavia','libya'],
  switzerland: ['france','germany','austria','italy'],
  finland: ['sweden','estonia','ussr','belorussia'],
  estonia: ['sweden','latvia','finland','belorussia'],
  latvia: ['estonia','lithuania','belorussia'],
  lithuania: ['latvia','poland','belorussia'],
  belorussia: ['poland','ukraine','ussr','estonia','latvia','lithuania','finland'],
  ukraine: ['poland','hungary','romania','ussr','belorussia'],
  ussr: ['finland','belorussia','ukraine','ussr_central','turkey','iran'],
  ussr_central: ['ussr','ussr_east','mongolia','afghanistan','iran'],
  ussr_east: ['ussr_central','ussr_far','mongolia','manchuria'],
  ussr_far: ['ussr_east','manchuria','korea','japan'],
  turkey: ['greece','bulgaria','syria','iraq','iran','ussr'],
  iran: ['turkey','iraq','afghanistan','ussr_central'],
  iraq: ['turkey','iran','syria','egypt'],
  syria: ['turkey','iraq','egypt'],
  egypt: ['libya','iraq','syria','eastafr','ethiopia'],
  libya: ['italy','egypt','algeria','ethiopia'],
  algeria: ['morocco','libya','westafr'],
  morocco: ['spain','algeria'],
  ethiopia: ['egypt','libya','eastafr','kenya'],
  southafrica: ['eastafr','westafr'],
  westafr: ['morocco','algeria','colombia','brazil'],
  eastafr: ['egypt','ethiopia','southafrica'],
  india: ['iran','afghanistan','burma','china_south'],
  burma: ['india','indochina','china_south'],
  indochina: ['burma','malaya','china_south'],
  malaya: ['indochina','indonesia','philippine'],
  philippine: ['malaya','indonesia','taiwan','japan'],
  indonesia: ['malaya','philippine','australia'],
  china_north: ['mongolia','manchuria','korea','china_south','ussr_east'],
  china_south: ['china_north','india','burma','indochina','taiwan'],
  manchuria: ['ussr_east','korea','china_north','mongolia'],
  korea: ['manchuria','china_north','japan','ussr_far'],
  japan: ['korea','ussr_far','taiwan','philippine'],
  taiwan: ['china_south','japan','philippine'],
  mongolia: ['ussr_central','ussr_east','china_north','manchuria'],
  afghanistan: ['iran','ussr_central','india'],
  usa_east: ['canada','usa_west','usa_south','cuba'],
  usa_west: ['canada','usa_east','alaska','mexico'],
  usa_south: ['usa_east','mexico','cuba'],
  canada: ['alaska','usa_east','usa_west'],
  alaska: ['canada','usa_west','ussr_far'],
  mexico: ['usa_west','usa_south','cuba','colombia'],
  cuba: ['usa_east','usa_south','mexico','colombia'],
  colombia: ['mexico','cuba','brazil','westafr'],
  brazil: ['colombia','westafr','argentina'],
  argentina: ['brazil'],
  australia: ['indonesia','newzealand'],
  newzealand: ['australia'],
};

// ============ INIT ============
function init() {
  // Initialize provinces from map data
  PROVINCES.forEach(p => {
    state.provinces[p.id] = {
      owner: p.owner,
      troops: p.troops,
      prod: p.prod,
      fortified: false,
      x: p.x,
      y: p.y,
      name: p.name,
    };
  });

  // Initialize factions
  Object.keys(FACTIONS).forEach(f => {
    state.factions[f] = {
      resources: FACTIONS[f].resources,
      army: FACTIONS[f].army,
      eliminated: false,
    };
  });

  // Build faction cards
  buildFactionCards();
}

function buildFactionCards() {
  const container = document.getElementById('factionCards');
  container.innerHTML = '';
  Object.entries(FACTIONS).forEach(([key, fac]) => {
    const card = document.createElement('div');
    card.className = 'faction-card' + (key === 'GER' ? ' selected' : '');
    card.dataset.key = key;
    card.innerHTML = `
      <span class="fc-flag">${fac.flag}</span>
      <div class="fc-name">${fac.name}</div>
      <div class="fc-desc">${fac.description}</div>
      <div class="fc-desc" style="color:#c8a96e;margin-top:4px">${fac.bonus}</div>
    `;
    card.addEventListener('click', () => selectFaction(key));
    container.appendChild(card);
  });
  state.player = 'GER';
}

function selectFaction(key) {
  document.querySelectorAll('.faction-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`[data-key="${key}"]`).classList.add('selected');
  state.player = key;
}

function startGame() {
  if(!state.player) { alert('Lütfen bir cephe seçin!'); return; }
  document.getElementById('mainMenu').classList.remove('active');
  document.getElementById('gameScreen').style.display = 'flex';

  initMap();
  initMapInteraction();
  updateTopBar();
  buildUnitsPanel();
  addLog('⚔️ Savaş başlıyor! İyi şanslar, General!', 'info');
  addLog(`🎖️ ${FACTIONS[state.player].name} olarak oynuyorsunuz.`, 'info');

  // After a short delay, draw unit icons on map
  setTimeout(drawUnitIcons, 500);
}

// ============ UI UPDATE ============
function updateTopBar() {
  const p = state.player;
  const fac = FACTIONS[p];
  document.getElementById('playerFlagIcon').textContent = fac.flag;
  document.getElementById('playerName').textContent = fac.name;
  document.getElementById('turnDisplay').textContent = state.turn;
  document.getElementById('yearDisplay').textContent = state.year;
  document.getElementById('resourceDisplay').textContent = state.factions[p].resources;

  // Count player provinces & armies
  let provCount = 0, totalTroops = 0;
  Object.entries(state.provinces).forEach(([id, prov]) => {
    if(prov.owner === p) { provCount++; totalTroops += prov.troops; }
  });
  document.getElementById('provinceDisplay').textContent = provCount;
  document.getElementById('armyDisplay').textContent = totalTroops;
}

// ============ PROVINCE CLICK ============
function onProvinceClick(provId) {
  const prov = state.provinces[provId];
  const prevSelected = state.selectedProvince;
  state.selectedProvince = provId;

  // Remove old selection highlight
  if(prevSelected) {
    const oldPath = document.getElementById('prov_' + prevSelected);
    if(oldPath) oldPath.classList.remove('selected');
  }

  // Highlight new
  const path = document.getElementById('prov_' + provId);
  if(path) path.classList.add('selected');

  // Highlight adjacencies
  document.querySelectorAll('.province').forEach(p => p.classList.remove('adjacent'));
  const adj = ADJACENCY[provId] || [];
  adj.forEach(adjId => {
    const adjPath = document.getElementById('prov_' + adjId);
    if(adjPath) adjPath.classList.add('adjacent');
  });

  showProvinceInfo(provId);
  updateActionButtons(provId);
}

function showProvinceInfo(provId) {
  const prov = state.provinces[provId];
  const provData = PROVINCES.find(p => p.id === provId);
  if(!prov) return;

  const owner = prov.owner === 'NEUTRAL' ? 'Tarafsız' :
    FACTIONS[prov.owner] ? `${FACTIONS[prov.owner].flag} ${FACTIONS[prov.owner].name}` : prov.owner;

  document.getElementById('selectedName').textContent = prov.name;
  document.getElementById('selectedFlag').textContent = prov.owner !== 'NEUTRAL' && FACTIONS[prov.owner] ? FACTIONS[prov.owner].flag : '🏳️';
  document.getElementById('selectedDetails').innerHTML = `
    <div>🏴 Sahip: <span>${owner}</span></div>
    <div>⚔️ Asker: <span>${prov.troops.toLocaleString()}</span></div>
    <div>🏭 Üretim: <span>${prov.prod} 💰/tur</span></div>
    <div>🛡️ Tahkimat: <span>${prov.fortified ? '✅ Var' : '❌ Yok'}</span></div>
    <div>🗺️ Komşular: <span>${(ADJACENCY[provId]||[]).length} bölge</span></div>
  `;
}

function updateActionButtons(provId) {
  const prov = state.provinces[provId];
  const isPlayer = prov.owner === state.player;
  const isAdjacent = (ADJACENCY[provId]||[]).some(adjId =>
    state.provinces[adjId] && state.provinces[adjId].owner === state.player
  );
  const isEnemy = prov.owner !== state.player && prov.owner !== 'NEUTRAL';
  const isNeutral = prov.owner === 'NEUTRAL';
  const canAttack = !isPlayer && isAdjacent;

  document.getElementById('btnAttack').disabled = !canAttack;
  document.getElementById('btnAttack').textContent = isNeutral ? '🏳️ İŞGAL ET' : '⚔️ SALDIR';
  document.getElementById('btnReinforce').disabled = !isPlayer;
  document.getElementById('btnBuild').disabled = !isPlayer || prov.fortified;
}

// ============ ACTIONS ============
function attackProvince() {
  const targetId = state.selectedProvince;
  if(!targetId) return;
  const target = state.provinces[targetId];

  // Find best adjacent attacker province
  const adj = ADJACENCY[targetId] || [];
  let bestAttacker = null, bestTroops = 0;
  adj.forEach(adjId => {
    const p = state.provinces[adjId];
    if(p && p.owner === state.player && p.troops > bestTroops) {
      bestAttacker = adjId; bestTroops = p.troops;
    }
  });

  if(!bestAttacker || state.provinces[bestAttacker].troops < 5) {
    showNotification('Yeterli asker yok! En az 5 askere ihtiyacınız var.');
    return;
  }

  const attacker = state.provinces[bestAttacker];
  showBattleModal(bestAttacker, targetId, attacker, target);
}

function reinforceProvince() {
  const provId = state.selectedProvince;
  const prov = state.provinces[provId];
  const cost = 20;
  if(state.factions[state.player].resources < cost) {
    showNotification(`Yetersiz kaynak! ${cost} 💰 gerekli.`);
    return;
  }
  state.factions[state.player].resources -= cost;
  prov.troops += 25;
  updateTroopLabel(provId, prov.troops);
  addLog(`💂 ${prov.name} bölgesine 25 takviye gönderildi.`, 'info');
  updateTopBar();
  showProvinceInfo(provId);
  flashProvince(provId, '#2266cc');
}

function buildFortification() {
  const provId = state.selectedProvince;
  const prov = state.provinces[provId];
  const cost = 40;
  if(state.factions[state.player].resources < cost) {
    showNotification(`Yetersiz kaynak! ${cost} 💰 gerekli.`);
    return;
  }
  state.factions[state.player].resources -= cost;
  prov.fortified = true;
  addLog(`🏰 ${prov.name}'da kalecik inşa edildi! Savunma +20%.`, 'info');
  updateTopBar();
  showProvinceInfo(provId);
  flashProvince(provId, '#c8a96e');
}

// ============ BATTLE SYSTEM ============
function showBattleModal(attackerId, defenderId, attacker, defender) {
  const playerFac = FACTIONS[state.player];
  const defOwner = defender.owner;
  const defFac = defOwner !== 'NEUTRAL' ? FACTIONS[defOwner] : null;

  // Pick unit images
  const playerTank = playerFac.tanks[0];
  const defTank = defFac ? defFac.tanks[0] : 'type 95';
  const playerTankImg = getTankImage(playerTank, state.player);
  const defTankImg = getTankImage(defTank, defOwner);

  document.getElementById('attackerTitle').textContent = `${playerFac.flag} ${playerFac.name}`;
  document.getElementById('defenderTitle').textContent = defFac ? `${defFac.flag} ${defFac.name}` : '🏳️ Tarafsız';

  if(playerTankImg) {
    document.getElementById('attackerImg').src = playerTankImg;
    document.getElementById('attackerImg').style.display = 'block';
  } else {
    document.getElementById('attackerImg').style.display = 'none';
  }
  if(defTankImg) {
    document.getElementById('defenderImg').src = defTankImg;
    document.getElementById('defenderImg').style.display = 'block';
  } else {
    document.getElementById('defenderImg').style.display = 'none';
  }

  // Stats
  const tankStat = TANK_STATS[playerTank] || { attack: 65, defense: 60, speed: 50 };
  const defTankStat = TANK_STATS[defTank] || { attack: 55, defense: 55, speed: 50 };

  document.getElementById('attackerStats').innerHTML = `
    <div style="font-size:11px;color:#aaa">⚔️ Saldırı: <b style="color:#f5d78e">${tankStat.attack}</b></div>
    <div style="font-size:11px;color:#aaa">💂 Asker: <b style="color:#f5d78e">${attacker.troops}</b></div>
    <div style="font-size:11px;color:#aaa">🛡️ Zırh: <b style="color:#f5d78e">${tankStat.defense}</b></div>
  `;
  document.getElementById('defenderStats').innerHTML = `
    <div style="font-size:11px;color:#aaa">⚔️ Saldırı: <b style="color:#f5d78e">${defTankStat.attack}</b></div>
    <div style="font-size:11px;color:#aaa">💂 Asker: <b style="color:#f5d78e">${defender.troops}</b></div>
    <div style="font-size:11px;color:#aaa">🛡️ Tahkimat: <b style="color:#f5d78e">${defender.fortified ? 'VAR +20%' : 'YOK'}</b></div>
  `;

  // Clear battle log
  document.getElementById('battleLog').innerHTML = '';
  document.getElementById('battleResult').classList.add('hidden');
  document.getElementById('battleContinue').disabled = true;

  document.getElementById('battleModal').classList.remove('hidden');

  // Run battle simulation
  setTimeout(() => runBattle(attackerId, defenderId, attacker, defender, tankStat, defTankStat), 400);
}

function runBattle(attackerId, defenderId, attackerProv, defenderProv, atkStat, defStat) {
  const logEl = document.getElementById('battleLog');
  const attackerName = PROVINCES.find(p => p.id === attackerId)?.name || attackerId;
  const defenderName = PROVINCES.find(p => p.id === defenderId)?.name || defenderId;

  let atkTroops = attackerProv.troops;
  let defTroops = defenderProv.troops;

  // Defense bonus
  const defMult = defenderProv.fortified ? 1.2 : 1.0;
  // Faction bonus
  const atkBonus = state.player === 'GER' ? 1.15 : 1.0;
  const defBonus = state.player === 'USSR' ? 1.2 : defenderProv.owner === 'USSR' ? 1.2 : 1.0;

  const rounds = [];
  let round = 0;

  function battleRound() {
    round++;
    if(round > 8) { finalizeBattle(); return; }
    if(atkTroops <= 0 || defTroops <= 0) { finalizeBattle(); return; }

    const atkRoll = Math.random() * atkStat.attack * atkBonus;
    const defRoll = Math.random() * defStat.defense * defMult * defBonus;
    const atkHit = Math.floor(atkRoll * (atkTroops / 50) * 0.2 + Math.random() * 8);
    const defHit = Math.floor(defRoll * (defTroops / 50) * 0.18 + Math.random() * 7);

    defTroops = Math.max(0, defTroops - atkHit);
    atkTroops = Math.max(0, atkTroops - defHit);

    const entry = document.createElement('div');
    const icons = ['💥','🔥','⚡','💣','🎯','🚀'];
    const icon = icons[round % icons.length];
    entry.textContent = `${icon} Tur ${round}: Saldırı -${atkHit} düşman, Savunma -${defHit} asker`;
    entry.style.color = atkHit > defHit ? '#44cc66' : '#cc4444';
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;

    setTimeout(battleRound, 350);
  }

  function finalizeBattle() {
    const resultEl = document.getElementById('battleResult');
    resultEl.classList.remove('hidden');

    if(defTroops <= 0) {
      // VICTORY
      resultEl.textContent = `🏆 ZAFERİNİZ! ${defenderName} ele geçirildi!`;
      resultEl.className = 'battle-result victory';

      // Apply results
      const remainTroops = Math.max(5, Math.floor(atkTroops * 0.7));
      attackerProv.troops = Math.max(5, atkTroops);
      defenderProv.owner = state.player;
      defenderProv.troops = remainTroops;

      // Move some troops
      if(attackerProv.troops > remainTroops) attackerProv.troops -= remainTroops;

      updateProvinceColor(defenderId, state.player);
      updateTroopLabel(attackerId, attackerProv.troops);
      updateTroopLabel(defenderId, defenderProv.troops);
      flashProvince(defenderId, '#22cc44');

      addLog(`🏆 ${defenderName} fethEdildi! ${defenderProv.prod} üretim kazanıldı.`, 'win');
      state.factions[state.player].resources += defenderProv.prod * 5;

    } else {
      // DEFEAT
      resultEl.textContent = `💀 YENİLDİNİZ! ${defenderName} savunuldu.`;
      resultEl.className = 'battle-result defeat';

      attackerProv.troops = Math.max(1, atkTroops);
      defenderProv.troops = defTroops;
      updateTroopLabel(attackerId, attackerProv.troops);
      updateTroopLabel(defenderId, defenderProv.troops);
      flashProvince(attackerId, '#cc2222');

      addLog(`💀 ${defenderName} saldırısı başarısız. ${attackerProv.troops} asker hayatta.`, 'lose');
    }

    document.getElementById('battleContinue').disabled = false;
    updateTopBar();
    showProvinceInfo(defenderId);
    checkVictory();
  }

  battleRound();
}

function closeBattle() {
  document.getElementById('battleModal').classList.add('hidden');
}

// ============ AI TURNS ============
function endTurn() {
  state.turn++;
  if(state.turn % 4 === 0) state.year++;

  // Collect resources
  let earned = 0;
  Object.values(state.provinces).forEach(prov => {
    if(prov.owner === state.player) earned += prov.prod;
  });
  state.factions[state.player].resources += earned;
  addLog(`🏭 ${earned} kaynak kazanıldı. Yeni toplam: ${state.factions[state.player].resources}`, 'info');

  // Replenish troops
  Object.entries(state.provinces).forEach(([id, prov]) => {
    if(prov.owner === state.player) {
      prov.troops = Math.min(prov.troops + Math.floor(prov.prod * 1.5), 999);
      updateTroopLabel(id, prov.troops);
    }
  });

  updateTopBar();

  // AI turns for other major factions
  const aiFactions = ['GER','USSR','USA','UK','JAP','ITA'].filter(f => f !== state.player);
  showAIOverlay(true);
  let delay = 0;
  aiFactions.forEach(fac => {
    delay += 300;
    setTimeout(() => doAITurn(fac), delay);
  });
  setTimeout(() => {
    showAIOverlay(false);
    addLog(`📅 Tur ${state.turn} başladı — ${state.year}`, 'info');
    updateTopBar();
    checkVictory();
  }, delay + 600);
}

function doAITurn(fac) {
  if(state.factions[fac]?.eliminated) return;

  // Collect AI resources
  let earned = 0;
  Object.values(state.provinces).forEach(prov => {
    if(prov.owner === fac) { earned += prov.prod; prov.troops = Math.min(prov.troops + Math.floor(prov.prod * 1.2), 999); }
  });
  state.factions[fac].resources += earned;

  // AI attacks a random adjacent enemy province
  const aiProvs = Object.entries(state.provinces).filter(([id, p]) => p.owner === fac && p.troops >= 15);
  if(aiProvs.length === 0) return;

  // Pick a random province to attack from
  const [fromId, fromProv] = aiProvs[Math.floor(Math.random() * Math.min(aiProvs.length, 4))];
  const adj = ADJACENCY[fromId] || [];
  const targets = adj.filter(tid => {
    const tp = state.provinces[tid];
    return tp && tp.owner !== fac && tp.troops < fromProv.troops * 1.2;
  });

  if(targets.length === 0) return;
  const targetId = targets[Math.floor(Math.random() * targets.length)];
  const target = state.provinces[targetId];

  // Simple AI battle resolution
  const atkStrength = fromProv.troops * (0.6 + Math.random() * 0.4);
  const defStrength = target.troops * (0.7 + Math.random() * 0.3) * (target.fortified ? 1.2 : 1.0);

  if(atkStrength > defStrength) {
    const losses = Math.floor(target.troops * (0.3 + Math.random() * 0.3));
    fromProv.troops = Math.max(5, fromProv.troops - losses);
    target.owner = fac;
    target.troops = Math.floor(fromProv.troops * 0.3);
    fromProv.troops -= target.troops;
    updateProvinceColor(targetId, fac);
    updateTroopLabel(targetId, target.troops);
    updateTroopLabel(fromId, fromProv.troops);

    const tName = PROVINCES.find(p => p.id === targetId)?.name || targetId;
    const fName = PROVINCES.find(p => p.id === fromId)?.name || fromId;
    if(target.owner === state.player || fromProv.owner === state.player) {
      addLog(`⚠️ ${FACTIONS[fac].flag} ${FACTIONS[fac].name}, ${tName} bölgesini ele geçirdi!`, 'lose');
    }
  } else {
    fromProv.troops = Math.max(5, fromProv.troops - Math.floor(target.troops * 0.2));
    updateTroopLabel(fromId, fromProv.troops);
  }
}

// ============ VICTORY CHECK ============
function checkVictory() {
  if(state.gameOver) return;

  // Win: control 60% of all provinces
  const total = PROVINCES.length;
  let playerCount = 0;
  PROVINCES.forEach(p => { if(state.provinces[p.id]?.owner === state.player) playerCount++; });
  const pct = playerCount / total;

  if(pct >= 0.6) {
    endGame(true, `Dünyanın %${Math.round(pct*100)}'ini kontrol ediyorsunuz! Tarihin en büyük zaferi!`);
    return;
  }

  // Lose: player has fewer than 2 provinces
  if(playerCount <= 1) {
    endGame(false, 'Tüm bölgeleriniz kaybedildi! Savaş kaybedildi...');
    return;
  }

  // Win: control all opponent capitals
  const capitals = { GER:'germany', USSR:'ussr', USA:'usa_east', UK:'uk', JAP:'japan', ITA:'italy' };
  let capturedAll = true;
  Object.entries(capitals).forEach(([fac, cap]) => {
    if(fac !== state.player && state.provinces[cap]?.owner !== state.player) capturedAll = false;
  });
  if(capturedAll) {
    endGame(true, 'Tüm düşman başkentleri fethedildi! Mükemmel zafer!');
  }
}

function endGame(victory, msg) {
  state.gameOver = true;
  const modal = document.getElementById('endModal');
  document.getElementById('endIcon').textContent = victory ? '🏆' : '💀';
  document.getElementById('endTitle').textContent = victory ? 'ZAFERİNİZ!' : 'YENİLGİ!';
  document.getElementById('endMsg').textContent = msg;
  modal.classList.remove('hidden');
}

// ============ UNITS PANEL ============
function buildUnitsPanel() {
  const fac = FACTIONS[state.player];
  const content = document.getElementById('unitsContent');
  content.innerHTML = '';

  // TANKS
  const tankSection = document.createElement('div');
  tankSection.className = 'unit-section';
  tankSection.innerHTML = '<h4>🛡️ Zırhlı Araçlar</h4>';
  fac.tanks.forEach(tankName => {
    const stat = TANK_STATS[tankName] || {};
    const imgPath = getTankImage(tankName, state.player);
    const card = document.createElement('div');
    card.className = 'unit-card';
    card.innerHTML = `
      ${imgPath ? `<img src="${imgPath}" alt="${tankName}" onerror="this.style.display='none'">` : '<span style="font-size:24px">🛡️</span>'}
      <div class="unit-info">
        <div class="unit-name">${tankName}</div>
        <div class="unit-stats">⚔️ ${stat.attack||'?'} | 🛡️ ${stat.defense||'?'} | 💨 ${stat.speed||'?'}</div>
      </div>
    `;
    tankSection.appendChild(card);
  });
  content.appendChild(tankSection);

  // PLANES
  const planeSection = document.createElement('div');
  planeSection.className = 'unit-section';
  planeSection.innerHTML = '<h4>✈️ Hava Kuvvetleri</h4>';
  fac.planes.forEach(planeName => {
    const stat = PLANE_STATS[planeName] || {};
    const card = document.createElement('div');
    card.className = 'unit-card';
    card.innerHTML = `
      <img src="${getPlaneImage(planeName)}" alt="${planeName}" onerror="this.style.display='none'" style="width:50px;height:35px;object-fit:contain">
      <div class="unit-info">
        <div class="unit-name">${planeName.replace('GER_','').replace('USSR_','').replace('US_','').replace('UK_','').replace('JAP_','')}</div>
        <div class="unit-stats">⚔️ ${stat.attack||'?'} | ✈️ ${stat.role||'Savaş'} | 🔋 ${stat.range||'?'} menzil</div>
      </div>
    `;
    planeSection.appendChild(card);
  });
  content.appendChild(planeSection);

  // WEAPONS
  const weapSection = document.createElement('div');
  weapSection.className = 'unit-section';
  weapSection.innerHTML = '<h4>🔫 Piyade Silahları</h4>';
  fac.weapons.forEach(wname => {
    const stat = WEAPON_STATS[wname] || {};
    const card = document.createElement('div');
    card.className = 'unit-card';
    card.innerHTML = `
      <img src="${getWeaponImage(wname)}" alt="${wname}" onerror="this.style.display='none'" style="width:70px;height:28px;object-fit:contain">
      <div class="unit-info">
        <div class="unit-name">${wname.replace('GER_','').replace('USSR_','').replace('US_','').replace('UK_','').replace('JAP_','')}</div>
        <div class="unit-stats">💥 ${stat.damage||'?'} | 🎯 ${stat.accuracy||'?'}% | 📏 ${stat.range||'?'}m | ${stat.type||''}</div>
      </div>
    `;
    weapSection.appendChild(card);
  });
  content.appendChild(weapSection);
}

function toggleUnitsPanel() {
  document.getElementById('unitsPanel').classList.toggle('hidden');
}

// ============ UNIT ICONS ON MAP ============
function drawUnitIcons() {
  const unitsGroup = document.getElementById('mapUnits');
  // Draw player faction icon on their capital
  const capitals = { GER:'germany', USSR:'ussr', USA:'usa_east', UK:'uk', JAP:'japan', ITA:'italy' };
  Object.entries(FACTIONS).forEach(([key, fac]) => {
    const capId = capitals[key];
    const capData = PROVINCES.find(p => p.id === capId);
    if(!capData) return;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', capData.x);
    text.setAttribute('y', capData.y - 8);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '14');
    text.setAttribute('pointer-events', 'none');
    text.textContent = fac.flag;
    unitsGroup.appendChild(text);
  });
}

// ============ LOG ============
function addLog(msg, type='info') {
  state.log.unshift({ msg, type });
  if(state.log.length > 30) state.log.pop();

  const el = document.getElementById('logContent');
  const entry = document.createElement('div');
  entry.className = 'log-entry ' + type;
  entry.textContent = msg;
  el.insertBefore(entry, el.firstChild);
  if(el.children.length > 20) el.removeChild(el.lastChild);
}

// ============ NOTIFICATION ============
function showNotification(msg) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = msg;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ============ AI OVERLAY ============
function showAIOverlay(show) {
  let overlay = document.getElementById('aiOverlay');
  if(!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'aiOverlay';
    overlay.innerHTML = `<div class="ai-box"><h3>⚔️ Düşman Turu</h3><p style="color:#888;font-size:12px">Diğer güçler hamle yapıyor...</p><div class="spinner"></div></div>`;
    document.body.appendChild(overlay);
  }
  overlay.style.display = show ? 'flex' : 'none';
}

// ============ RULES ============
function showRules() {
  document.getElementById('rulesScreen').style.display = 'flex';
  document.getElementById('mainMenu').style.display = 'none';
}
function hideRules() {
  document.getElementById('rulesScreen').style.display = 'none';
  document.getElementById('mainMenu').style.display = 'flex';
}

// ============ BOOT ============
window.addEventListener('DOMContentLoaded', init);

