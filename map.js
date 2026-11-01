// ===== MAP.JS — SVG World Map with Provinces =====

// Province definitions: id, name, svgPath (simplified), x/y center, production value, owner
const PROVINCES = [
  // ============ EUROPE ============
  { id:"uk", name:"İngiltere", owner:"UK", prod:8, troops:40, x:480, y:148,
    path:"M 460,120 L 500,115 L 510,130 L 505,150 L 495,165 L 480,168 L 465,160 L 455,145 L 460,120 Z" },
  { id:"ireland", name:"İrlanda", owner:"UK", prod:3, troops:15, x:447, y:143,
    path:"M 438,135 L 452,132 L 455,145 L 448,155 L 438,150 L 435,140 Z" },
  { id:"scotland", name:"İskoçya", owner:"UK", prod:4, troops:18, x:473, y:125,
    path:"M 462,110 L 482,108 L 488,120 L 480,128 L 465,126 L 460,118 Z" },
  { id:"france", name:"Fransa", owner:"GER", prod:10, troops:45, x:495, y:190,
    path:"M 465,168 L 520,165 L 535,178 L 530,200 L 510,215 L 488,210 L 468,198 L 462,182 Z" },
  { id:"spain", name:"İspanya", owner:"NEUTRAL", prod:6, troops:25, x:487, y:225,
    path:"M 454,212 L 528,210 L 535,225 L 525,245 L 495,252 L 465,248 L 448,232 Z" },
  { id:"portugal", name:"Portekiz", owner:"NEUTRAL", prod:3, troops:12, x:455, y:235,
    path:"M 448,218 L 460,216 L 462,235 L 454,248 L 445,240 L 442,228 Z" },
  { id:"germany", name:"Almanya", owner:"GER", prod:14, troops:80, x:530, y:168,
    path:"M 518,148 L 560,145 L 572,160 L 568,180 L 548,190 L 522,185 L 510,172 L 512,155 Z" },
  { id:"netherlands", name:"Hollanda", owner:"GER", prod:5, troops:20, x:514, y:152,
    path:"M 510,143 L 526,140 L 530,152 L 520,158 L 508,154 Z" },
  { id:"belgium", name:"Belçika", owner:"GER", prod:5, troops:18, x:510, y:162,
    path:"M 505,155 L 525,153 L 528,166 L 514,170 L 502,165 Z" },
  { id:"denmark", name:"Danimarka", owner:"GER", prod:4, troops:16, x:532, y:135,
    path:"M 525,125 L 545,123 L 548,138 L 535,142 L 522,138 Z" },
  { id:"norway", name:"Norveç", owner:"GER", prod:5, troops:20, x:530, y:110,
    path:"M 510,90 L 560,85 L 575,105 L 565,125 L 545,130 L 518,125 L 505,110 Z" },
  { id:"sweden", name:"İsveç", owner:"NEUTRAL", prod:5, troops:22, x:548, y:105,
    path:"M 538,88 L 575,82 L 590,100 L 582,125 L 562,130 L 545,122 L 535,108 Z" },
  { id:"poland", name:"Polonya", owner:"GER", prod:7, troops:35, x:562, y:158,
    path:"M 548,143 L 590,140 L 602,155 L 598,175 L 572,180 L 548,175 L 542,162 Z" },
  { id:"czechoslovakia", name:"Çekoslovakya", owner:"GER", prod:6, troops:25, x:558, y:175,
    path:"M 542,168 L 590,165 L 598,178 L 580,188 L 550,185 Z" },
  { id:"austria", name:"Avusturya", owner:"GER", prod:5, troops:20, x:542, y:185,
    path:"M 525,178 L 565,175 L 572,187 L 555,195 L 528,192 Z" },
  { id:"hungary", name:"Macaristan", owner:"NEUTRAL", prod:4, troops:18, x:565, y:192,
    path:"M 548,185 L 595,182 L 600,195 L 585,205 L 552,202 Z" },
  { id:"romania", name:"Romanya", owner:"NEUTRAL", prod:7, troops:28, x:592, y:195,
    path:"M 578,182 L 622,178 L 630,195 L 618,212 L 590,215 L 572,205 Z" },
  { id:"bulgaria", name:"Bulgaristan", owner:"NEUTRAL", prod:4, troops:15, x:590, y:215,
    path:"M 568,208 L 620,205 L 625,220 L 600,230 L 572,225 Z" },
  { id:"yugoslavia", name:"Yugoslavya", owner:"NEUTRAL", prod:4, troops:18, x:562, y:205,
    path:"M 535,195 L 580,192 L 585,210 L 562,222 L 538,215 Z" },
  { id:"greece", name:"Yunanistan", owner:"NEUTRAL", prod:4, troops:16, x:582, y:232,
    path:"M 558,222 L 605,218 L 610,238 L 590,248 L 562,242 Z" },
  { id:"italy", name:"İtalya", owner:"ITA", prod:8, troops:38, x:535, y:205,
    path:"M 520,192 L 548,190 L 555,205 L 550,225 L 535,240 L 520,235 L 510,218 L 512,202 Z" },
  { id:"switzerland", name:"İsviçre", owner:"NEUTRAL", prod:3, troops:14, x:520, y:188,
    path:"M 510,180 L 538,178 L 540,192 L 520,196 L 508,190 Z" },
  { id:"finland", name:"Finlandiya", owner:"NEUTRAL", prod:4, troops:20, x:575, y:100,
    path:"M 558,85 L 600,80 L 620,95 L 610,118 L 580,125 L 560,115 Z" },
  { id:"estonia", name:"Estonya", owner:"USSR", prod:3, troops:10, x:590, y:132,
    path:"M 578,125 L 608,122 L 612,136 L 592,140 L 574,136 Z" },
  { id:"latvia", name:"Letonya", owner:"USSR", prod:3, troops:10, x:590, y:143,
    path:"M 575,138 L 612,135 L 616,150 L 592,154 L 572,148 Z" },
  { id:"lithuania", name:"Litvanya", owner:"USSR", prod:3, troops:12, x:582, y:155,
    path:"M 565,148 L 608,145 L 612,160 L 585,164 L 562,158 Z" },
  { id:"belorussia", name:"Beyaz Rusya", owner:"USSR", prod:5, troops:25, x:610, y:155,
    path:"M 590,142 L 648,138 L 652,160 L 625,168 L 592,162 Z" },
  { id:"ukraine", name:"Ukrayna", owner:"USSR", prod:10, troops:55, x:635, y:180,
    path:"M 598,165 L 680,158 L 690,182 L 665,200 L 618,205 L 595,188 Z" },
  { id:"ussr", name:"Rusya (Batı)", owner:"USSR", prod:12, troops:70, x:670, y:140,
    path:"M 640,100 L 740,90 L 760,130 L 720,160 L 665,165 L 635,150 L 625,125 Z" },
  { id:"ussr_central", name:"Rusya (Merkez)", owner:"USSR", prod:10, troops:60, x:750, y:140,
    path:"M 740,95 L 850,88 L 865,130 L 820,155 L 762,158 L 738,135 Z" },
  { id:"ussr_east", name:"Sibirya", owner:"USSR", prod:8, troops:40, x:880, y:120,
    path:"M 858,80 L 1000,72 L 1010,140 L 950,160 L 878,152 L 852,125 Z" },
  { id:"ussr_far", name:"Uzak Doğu Rusya", owner:"USSR", prod:5, troops:30, x:1020, y:110,
    path:"M 1005,70 L 1100,65 L 1105,145 L 1055,158 L 1008,148 Z" },

  // ============ MIDDLE EAST / TURKEY ============
  { id:"turkey", name:"Türkiye", owner:"NEUTRAL", prod:6, troops:28, x:630, y:225,
    path:"M 598,215 L 680,210 L 690,228 L 665,242 L 608,238 Z" },
  { id:"iran", name:"İran", owner:"NEUTRAL", prod:7, troops:25, x:700, y:235,
    path:"M 680,218 L 750,215 L 758,242 L 728,258 L 688,252 L 672,238 Z" },
  { id:"iraq", name:"Irak", owner:"UK", prod:6, troops:20, x:668, y:248,
    path:"M 648,238 L 695,235 L 700,258 L 675,268 L 645,260 Z" },
  { id:"syria", name:"Suriye", owner:"NEUTRAL", prod:4, troops:15, x:640, y:240,
    path:"M 618,230 L 655,227 L 658,248 L 635,255 L 615,248 Z" },
  { id:"egypt", name:"Mısır", owner:"UK", prod:7, troops:32, x:618, y:270,
    path:"M 592,258 L 660,252 L 665,280 L 635,295 L 598,288 Z" },
  { id:"libya", name:"Libya", owner:"ITA", prod:4, troops:18, x:552, y:268,
    path:"M 528,255 L 598,250 L 602,280 L 568,295 L 530,285 Z" },
  { id:"algeria", name:"Cezayir", owner:"NEUTRAL", prod:4, troops:15, x:502, y:262,
    path:"M 468,250 L 542,245 L 548,275 L 510,288 L 465,280 Z" },
  { id:"morocco", name:"Fas", owner:"NEUTRAL", prod:4, troops:12, x:468, y:258,
    path:"M 440,248 L 490,245 L 495,272 L 462,282 L 435,270 Z" },
  { id:"ethiopia", name:"Etiyopya", owner:"ITA", prod:4, troops:15, x:648, y:315,
    path:"M 620,298 L 680,295 L 685,330 L 652,342 L 618,332 Z" },
  { id:"southafrica", name:"Güney Afrika", owner:"UK", prod:6, troops:22, x:610, y:398,
    path:"M 575,380 L 650,375 L 658,415 L 620,430 L 575,420 Z" },
  { id:"westafr", name:"Batı Afrika", owner:"NEUTRAL", prod:5, troops:15, x:500, y:320,
    path:"M 465,295 L 558,290 L 565,345 L 510,355 L 460,340 Z" },
  { id:"eastafr", name:"Doğu Afrika", owner:"NEUTRAL", prod:4, troops:12, x:648, y:355,
    path:"M 618,330 L 685,325 L 690,380 L 655,390 L 612,378 Z" },

  // ============ ASIA ============
  { id:"india", name:"Hindistan", owner:"UK", prod:9, troops:45, x:758, y:268,
    path:"M 730,245 L 800,240 L 810,272 L 788,305 L 748,312 L 722,292 L 718,262 Z" },
  { id:"burma", name:"Burma", owner:"UK", prod:4, troops:18, x:812, y:272,
    path:"M 800,248 L 840,245 L 848,278 L 825,295 L 798,285 Z" },
  { id:"indochina", name:"Hindiçini", owner:"JAP", prod:5, troops:22, x:848, y:295,
    path:"M 832,270 L 872,268 L 878,305 L 852,318 L 830,305 Z" },
  { id:"malaya", name:"Malaya", owner:"UK", prod:5, troops:20, x:852, y:330,
    path:"M 838,312 L 870,308 L 875,342 L 848,350 L 832,338 Z" },
  { id:"philippine", name:"Filipinler", owner:"USA", prod:4, troops:18, x:910, y:312,
    path:"M 895,295 L 932,292 L 938,328 L 915,340 L 892,325 Z" },
  { id:"indonesia", name:"Endonezya", owner:"NEUTRAL", prod:6, troops:20, x:900, y:358,
    path:"M 862,342 L 960,338 L 968,368 L 918,380 L 858,372 Z" },
  { id:"china_north", name:"Kuzey Çin", owner:"JAP", prod:8, troops:40, x:890, y:220,
    path:"M 855,195 L 960,190 L 968,230 L 935,255 L 870,258 L 848,238 Z" },
  { id:"china_south", name:"Güney Çin", owner:"NEUTRAL", prod:7, troops:30, x:888, y:265,
    path:"M 850,250 L 968,245 L 972,290 L 930,310 L 858,308 L 838,280 Z" },
  { id:"manchuria", name:"Mançurya", owner:"JAP", prod:7, troops:35, x:955, y:178,
    path:"M 932,158 L 1008,152 L 1015,185 L 985,205 L 940,208 L 918,192 Z" },
  { id:"korea", name:"Kore", owner:"JAP", prod:5, troops:22, x:988, y:210,
    path:"M 972,195 L 1012,192 L 1018,218 L 995,228 L 970,222 Z" },
  { id:"japan", name:"Japonya", owner:"JAP", prod:12, troops:60, x:1028, y:210,
    path:"M 1012,185 L 1055,180 L 1065,215 L 1042,235 L 1010,228 Z" },
  { id:"taiwan", name:"Tayvan", owner:"JAP", prod:3, troops:14, x:970, y:268,
    path:"M 958,258 L 985,255 L 990,278 L 968,282 L 955,270 Z" },
  { id:"mongolia", name:"Moğolistan", owner:"NEUTRAL", prod:3, troops:12, x:882, y:168,
    path:"M 840,148 L 960,140 L 965,175 L 920,192 L 858,188 L 832,172 Z" },
  { id:"afghanistan", name:"Afganistan", owner:"NEUTRAL", prod:3, troops:12, x:745, y:238,
    path:"M 718,222 L 778,218 L 785,248 L 750,258 L 715,250 Z" },

  // ============ AMERICAS ============
  { id:"usa_east", name:"ABD (Doğu)", owner:"USA", prod:15, troops:75, x:232, y:210,
    path:"M 188,178 L 295,172 L 302,230 L 270,258 L 210,262 L 180,240 L 175,208 Z" },
  { id:"usa_west", name:"ABD (Batı)", owner:"USA", prod:10, troops:50, x:155, y:208,
    path:"M 112,175 L 195,170 L 200,238 L 162,258 L 115,250 L 100,225 Z" },
  { id:"usa_south", name:"ABD (Güney)", owner:"USA", prod:8, troops:35, x:222, y:258,
    path:"M 175,245 L 285,240 L 292,268 L 248,285 L 185,280 Z" },
  { id:"canada", name:"Kanada", owner:"USA", prod:8, troops:35, x:195, y:148,
    path:"M 118,95 L 320,88 L 328,168 L 285,178 L 185,175 L 115,165 Z" },
  { id:"alaska", name:"Alaska", owner:"USA", prod:3, troops:12, x:102, y:118,
    path:"M 55,88 L 125,82 L 130,135 L 95,148 L 52,138 Z" },
  { id:"mexico", name:"Meksika", owner:"NEUTRAL", prod:5, troops:18, x:178, y:290,
    path:"M 140,268 L 238,265 L 242,300 L 208,318 L 152,315 L 135,298 Z" },
  { id:"cuba", name:"Küba & Karayipler", owner:"NEUTRAL", prod:3, troops:10, x:248, y:285,
    path:"M 230,275 L 282,272 L 285,292 L 252,300 L 225,295 Z" },
  { id:"colombia", name:"Kolombiya & Venezuela", owner:"NEUTRAL", prod:5, troops:15, x:240, y:335,
    path:"M 208,318 L 290,315 L 295,350 L 252,362 L 205,355 Z" },
  { id:"brazil", name:"Brezilya", owner:"NEUTRAL", prod:8, troops:25, x:268, y:390,
    path:"M 215,355 L 338,350 L 345,420 L 290,445 L 222,440 L 205,405 Z" },
  { id:"argentina", name:"Arjantin & Şili", owner:"NEUTRAL", prod:5, troops:15, x:248, y:450,
    path:"M 215,435 L 292,430 L 295,490 L 255,510 L 218,498 Z" },

  // ============ OCEANIA ============
  { id:"australia", name:"Avustralya", owner:"UK", prod:7, troops:30, x:972, y:408,
    path:"M 900,370 L 1062,365 L 1068,440 L 1010,458 L 905,452 L 890,418 Z" },
  { id:"newzealand", name:"Yeni Zelanda", owner:"UK", prod:3, troops:12, x:1092, y:450,
    path:"M 1070,435 L 1108,432 L 1112,465 L 1085,472 L 1065,460 Z" },
];

// ====================== SVG MAP RENDERER ======================
function initMap() {
  const svgGroup = document.getElementById('mapRegions');
  const labelsGroup = document.getElementById('mapLabels');

  PROVINCES.forEach(prov => {
    // Draw province
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', 'prov_' + prov.id);
    path.setAttribute('d', prov.path);
    path.setAttribute('class', 'province');
    path.setAttribute('data-id', prov.id);
    path.setAttribute('stroke', '#000');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linejoin', 'round');
    path.style.fill = getFactionColor(prov.owner);
    path.style.fillOpacity = '0.85';

    path.addEventListener('click', () => onProvinceClick(prov.id));
    svgGroup.appendChild(path);

    // Province label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('id', 'label_' + prov.id);
    text.setAttribute('x', prov.x);
    text.setAttribute('y', prov.y + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Segoe UI, Arial, sans-serif');
    text.setAttribute('font-size', '7');
    text.setAttribute('fill', '#fff');
    text.setAttribute('pointer-events', 'none');
    text.setAttribute('filter', 'url(#shadow2)');
    text.textContent = prov.name.length > 14 ? prov.name.substring(0,12)+'…' : prov.name;
    labelsGroup.appendChild(text);

    // Troop count badge
    const badge = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    badge.setAttribute('id', 'troops_' + prov.id);
    badge.setAttribute('x', prov.x);
    badge.setAttribute('y', prov.y + 14);
    badge.setAttribute('text-anchor', 'middle');
    badge.setAttribute('font-family', 'monospace');
    badge.setAttribute('font-size', '7');
    badge.setAttribute('fill', '#f5d78e');
    badge.setAttribute('pointer-events', 'none');
    badge.textContent = '⚔' + prov.troops;
    labelsGroup.appendChild(badge);
  });

  // Draw ocean connections / grid faint lines for aesthetics
  drawOceanRoutes();
}

function drawOceanRoutes() {
  const routesGroup = document.getElementById('mapBorders');

  // Draw a graticule (lat/lon grid) for the ocean
  for(let x = 0; x <= 1400; x += 140) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x); line.setAttribute('y1', 0);
    line.setAttribute('x2', x); line.setAttribute('y2', 700);
    line.setAttribute('stroke', '#1e4a6a');
    line.setAttribute('stroke-width', '0.3');
    line.setAttribute('opacity', '0.5');
    routesGroup.appendChild(line);
  }
  for(let y = 0; y <= 700; y += 70) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 0); line.setAttribute('y1', y);
    line.setAttribute('x2', 1400); line.setAttribute('y2', y);
    line.setAttribute('stroke', '#1e4a6a');
    line.setAttribute('stroke-width', '0.3');
    line.setAttribute('opacity', '0.5');
    routesGroup.appendChild(line);
  }

  // Draw WW2 era compass rose
  drawCompassRose(1340, 60, 42);
}

function drawCompassRose(cx, cy, r) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const dirs = [
    {angle:-90, label:'K'}, {angle:0, label:'D'}, {angle:90, label:'G'}, {angle:180, label:'B'}
  ];
  dirs.forEach(d => {
    const rad = d.angle * Math.PI / 180;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', cx + Math.cos(rad)*r); line.setAttribute('y2', cy + Math.sin(rad)*r);
    line.setAttribute('stroke', '#c8a96e'); line.setAttribute('stroke-width', '1.5'); line.setAttribute('opacity', '0.6');
    g.appendChild(line);

    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', cx + Math.cos(rad)*(r+8));
    txt.setAttribute('y', cy + Math.sin(rad)*(r+8) + 4);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('fill', '#c8a96e'); txt.setAttribute('font-size', '9');
    txt.setAttribute('font-family', 'Georgia'); txt.setAttribute('opacity', '0.7');
    txt.textContent = d.label;
    g.appendChild(txt);
  });
  // Circle
  const circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circ.setAttribute('cx', cx); circ.setAttribute('cy', cy); circ.setAttribute('r', 4);
  circ.setAttribute('fill', '#c8a96e'); circ.setAttribute('opacity', '0.6');
  g.appendChild(circ);

  document.getElementById('mapBorders').appendChild(g);
}

function getFactionColor(owner) {
  const colors = {
    'GER': '#5a5a5a',
    'USSR': '#882222',
    'USA': '#1a4a9a',
    'UK': '#2244aa',
    'JAP': '#8a1a1a',
    'ITA': '#2a7a2a',
    'NEUTRAL': '#4a5a3a'
  };
  return colors[owner] || '#4a5a3a';
}

function updateProvinceColor(provId, owner) {
  const path = document.getElementById('prov_' + provId);
  if(path) path.style.fill = getFactionColor(owner);
}

function updateTroopLabel(provId, troops) {
  const badge = document.getElementById('troops_' + provId);
  if(badge) badge.textContent = '⚔' + troops;
}

function flashProvince(provId, color='#f5d78e') {
  const path = document.getElementById('prov_' + provId);
  if(!path) return;
  const origFill = path.style.fill;
  path.style.fill = color;
  path.style.transition = 'fill 0.3s';
  setTimeout(() => { path.style.fill = origFill; }, 600);
}

// Map drag/zoom
let mapScale = 1, mapX = 0, mapY = 0, isDragging = false, dragStart = null;
const mapContainer = document.getElementById ? document.getElementById('mapContainer') : null;

function initMapInteraction() {
  const container = document.getElementById('mapContainer');
  const svg = document.getElementById('worldMap');

  container.addEventListener('mousedown', e => {
    if(e.target.classList.contains('province')) return;
    isDragging = true;
    dragStart = { x: e.clientX - mapX, y: e.clientY - mapY };
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if(!isDragging) return;
    mapX = e.clientX - dragStart.x;
    mapY = e.clientY - dragStart.y;
    applyMapTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    if(container) container.style.cursor = 'grab';
  });

  container.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    mapScale = Math.max(0.5, Math.min(3, mapScale * delta));
    applyMapTransform();
  });
}

function applyMapTransform() {
  const svg = document.getElementById('worldMap');
  svg.style.transform = `translate(${mapX}px, ${mapY}px) scale(${mapScale})`;
  svg.style.transformOrigin = '0 0';
}

