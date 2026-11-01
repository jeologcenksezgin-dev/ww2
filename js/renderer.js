// World Conqueror 3 SVG Map Renderer
// Handles SVG rendering, unit tokens, movement lines, selection highlights, pan & zoom, and minimap radar.

class MapRenderer {
    constructor() {
        this.svg = null;
        this.mapGroup = null;
        this.minimapCanvas = null;

        // Pan & Zoom state
        this.scale = 1.0;
        this.panX = -100;
        this.panY = -50;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.minScale = 0.6;
        this.maxScale = 3.0;

        this.onTerritoryClickCallback = null;
    }

    init(svgElementId, onTerritoryClick) {
        this.svg = document.getElementById(svgElementId);
        this.mapGroup = document.getElementById('mapContentGroup');
        this.onTerritoryClickCallback = onTerritoryClick;
        this.setupPanAndZoom();
        this.renderBaseMap();
    }

    setupPanAndZoom() {
        const svgContainer = document.getElementById('mapContainer');

        // Mouse Down (Start Pan)
        svgContainer.addEventListener('mousedown', (e) => {
            // Only start pan if clicking map background or middle/right click, or left click not on a unit
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
            svgContainer.style.cursor = 'grabbing';
        });

        // Mouse Move (Pan)
        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.panX = e.clientX - this.dragStartX;
            this.panY = e.clientY - this.dragStartY;
            this.updateTransform();
        });

        // Mouse Up (End Pan)
        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                svgContainer.style.cursor = 'grab';
                this.updateMinimap();
            }
        });

        // Wheel (Zoom)
        svgContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
            const newScale = Math.min(this.maxScale, Math.max(this.minScale, this.scale * zoomFactor));
            
            // Zoom towards mouse position
            const rect = svgContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
            this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
            this.scale = newScale;

            this.updateTransform();
            this.updateMinimap();
        }, { passive: false });

        // Touch support for mobile/tablets
        let touchStartDist = 0;
        svgContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.dragStartX = e.touches[0].clientX - this.panX;
                this.dragStartY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                this.isDragging = false;
                touchStartDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        });

        svgContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && this.isDragging) {
                this.panX = e.touches[0].clientX - this.dragStartX;
                this.panY = e.touches[0].clientY - this.dragStartY;
                this.updateTransform();
            } else if (e.touches.length === 2) {
                const dist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const zoomFactor = dist / (touchStartDist || dist);
                this.scale = Math.min(this.maxScale, Math.max(this.minScale, this.scale * zoomFactor));
                touchStartDist = dist;
                this.updateTransform();
            }
        });

        svgContainer.addEventListener('touchend', () => {
            this.isDragging = false;
        });

        this.updateTransform();
    }

    updateTransform() {
        if (this.mapGroup) {
            this.mapGroup.setAttribute('transform', `translate(${this.panX}, ${this.panY}) scale(${this.scale})`);
        }
    }

    zoomIn() {
        this.scale = Math.min(this.maxScale, this.scale * 1.25);
        this.updateTransform();
        this.updateMinimap();
    }

    zoomOut() {
        this.scale = Math.max(this.minScale, this.scale * 0.8);
        this.updateTransform();
        this.updateMinimap();
    }

    resetView() {
        this.scale = 1.0;
        this.panX = -200;
        this.panY = -80;
        this.updateTransform();
        this.updateMinimap();
    }

    centerOnTerritory(terrId) {
        const terr = window.GameState.territories[terrId];
        if (!terr) return;
        const container = document.getElementById('mapContainer');
        const cx = container.clientWidth / 2;
        const cy = container.clientHeight / 2;

        this.panX = cx - terr.cityX * this.scale;
        this.panY = cy - terr.cityY * this.scale;
        this.updateTransform();
        this.updateMinimap();
    }

    // Render Full SVG Elements
    renderBaseMap() {
        if (!this.mapGroup) return;

        let html = '';

        // 1. Sea Lanes & Tactical Connection lines
        html += '<g id="connectionsLayer" class="connections-layer">';
        const drawnLines = new Set();
        Object.values(MapData.territories).forEach(t1 => {
            t1.neighbors.forEach(nId => {
                const t2 = MapData.territories[nId];
                if (!t2) return;
                const pairKey = [t1.id, t2.id].sort().join('--');
                if (!drawnLines.has(pairKey)) {
                    drawnLines.add(pairKey);
                    html += `<line x1="${t1.cityX}" y1="${t1.cityY}" x2="${t2.cityX}" y2="${t2.cityY}" class="tactical-lane" />`;
                }
            });
        });
        html += '</g>';

        // 2. Territories SVG Paths
        html += '<g id="territoriesLayer" class="territories-layer">';
        Object.values(MapData.territories).forEach(terr => {
            html += `
                <g id="terr-group-${terr.id}" class="territory-group" data-id="${terr.id}">
                    <path id="terr-path-${terr.id}" d="${terr.path}" class="territory-path" />
                </g>
            `;
        });
        html += '</g>';

        // 3. Strategic City Pins & Labels
        html += '<g id="citiesLayer" class="cities-layer">';
        Object.values(MapData.territories).forEach(terr => {
            const isCapital = terr.isCapital;
            html += `
                <g class="city-pin-group" transform="translate(${terr.cityX}, ${terr.cityY})" data-id="${terr.id}">
                    <!-- City badge -->
                    <circle r="${isCapital ? 14 : 9}" class="city-pin-bg ${isCapital ? 'capital-pin' : ''}" />
                    <text y="${isCapital ? 4 : 3}" class="city-icon">${isCapital ? '★' : '🏛️'}</text>
                    
                    <!-- City Name Label -->
                    <rect x="-45" y="16" width="90" height="18" rx="4" class="city-label-box" />
                    <text x="0" y="28" class="city-name-text">${terr.name}</text>
                </g>
            `;
        });
        html += '</g>';

        // 4. Military Units & Token Slot Layer
        html += '<g id="unitsLayer" class="units-layer"></g>';

        // 5. Highlights and Tactical Range Layer (Move arrows & Target reticles)
        html += '<g id="highlightsLayer" class="highlights-layer"></g>';

        this.mapGroup.innerHTML = html;

        // Attach click listeners to territory paths and city pins
        document.querySelectorAll('.territory-group, .city-pin-group').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const terrId = el.getAttribute('data-id');
                if (this.onTerritoryClickCallback) {
                    this.onTerritoryClickCallback(terrId);
                }
            });
        });

        this.update();
    }

    // Refresh Dynamic Colors, Units, and Selections
    update() {
        const gameState = window.GameState;
        if (!gameState) return;

        // 1. Update territory fills with faction colors
        Object.values(gameState.territories).forEach(terr => {
            const pathEl = document.getElementById(`terr-path-${terr.id}`);
            const nation = AssetManager.nations[terr.country];
            if (pathEl && nation) {
                pathEl.setAttribute('fill', nation.color);
                pathEl.setAttribute('fill-opacity', '0.62');
                pathEl.setAttribute('stroke', '#1E293B');
                pathEl.setAttribute('stroke-width', '2');
            }
        });

        // 2. Clear & Redraw Highlights
        const highlightsGroup = document.getElementById('highlightsLayer');
        if (highlightsGroup) {
            highlightsGroup.innerHTML = '';

            const selId = gameState.selectedTerritoryId;
            if (selId && gameState.territories[selId]) {
                const selTerr = gameState.territories[selId];
                const selNation = AssetManager.nations[selTerr.country];

                // Glow on selected territory path
                const selPath = document.getElementById(`terr-path-${selId}`);
                if (selPath) {
                    selPath.setAttribute('stroke', '#FFD700');
                    selPath.setAttribute('stroke-width', '4');
                }

                // If territory belongs to player, show movement and attack options for its units
                if (selTerr.country === gameState.playerCountry && selTerr.units && selTerr.units.length > 0) {
                    const activeUnit = selTerr.units[gameState.selectedUnitIndex || 0];

                    if (activeUnit && !activeUnit.hasMoved) {
                        selTerr.neighbors.forEach(nId => {
                            const nTerr = gameState.territories[nId];
                            if (!nTerr) return;

                            const isFriendly = nTerr.country === gameState.playerCountry;
                            const isEnemy = !isFriendly;

                            if (isFriendly) {
                                // Green Movement Halo
                                highlightsGroup.innerHTML += `
                                    <g class="move-highlight" transform="translate(${nTerr.cityX}, ${nTerr.cityY})">
                                        <circle r="28" class="move-ring-halo" />
                                        <text y="5" class="move-arrow-icon">➔</text>
                                    </g>
                                `;
                            } else if (isEnemy) {
                                // Red Attack Target Reticle
                                highlightsGroup.innerHTML += `
                                    <g class="attack-highlight" transform="translate(${nTerr.cityX}, ${nTerr.cityY})">
                                        <circle r="32" class="attack-ring-pulse" />
                                        <line x1="-36" y1="0" x2="36" y2="0" class="reticle-line" />
                                        <line x1="0" y1="-36" x2="0" y2="36" class="reticle-line" />
                                        <text y="-20" class="attack-label-badge">HEDEF</text>
                                    </g>
                                `;
                            }
                        });
                    }
                }
            }
        }

        // 3. Render Stationed Unit Tokens
        const unitsLayer = document.getElementById('unitsLayer');
        if (unitsLayer) {
            let unitsHTML = '';

            Object.values(gameState.territories).forEach(terr => {
                if (!terr.units || terr.units.length === 0) return;

                const primaryUnit = terr.units[0];
                const nation = AssetManager.nations[primaryUnit.nation || terr.country];
                const asset = AssetManager.getUnitAsset(nation.id, primaryUnit.type, primaryUnit.tier);
                const isSelectedTerr = gameState.selectedTerritoryId === terr.id;
                const hasGeneral = gameState.assignedGenerals[terr.id];

                // Unit Token coordinates (slightly offset from city center)
                const uX = terr.cityX;
                const uY = terr.cityY - 32;

                const hpPercent = Math.max(0, Math.min(100, (primaryUnit.hp / primaryUnit.maxHp) * 100));
                const hpColor = hpPercent > 60 ? '#4CAF50' : (hpPercent > 30 ? '#FF9800' : '#F44336');

                // Generate inner sprite image URL
                let spriteContent = '';
                if (asset.isTank) {
                    spriteContent = `
                        <image href="${asset.hullUrl}" x="-22" y="-22" width="44" height="44" />
                        <image href="${asset.turretUrl}" x="-22" y="-22" width="44" height="44" />
                    `;
                } else if (asset.isPlane) {
                    spriteContent = `<image href="${asset.url}" x="-22" y="-22" width="44" height="44" />`;
                } else {
                    spriteContent = `<image href="${asset.url}" x="-20" y="-12" width="40" height="24" />`;
                }

                unitsHTML += `
                    <g class="unit-token-group ${isSelectedTerr ? 'unit-selected' : ''}" transform="translate(${uX}, ${uY})" data-id="${terr.id}">
                        <!-- Military Shield/Hex Background -->
                        <polygon points="0,-24 24,-10 24,14 0,26 -24,14 -24,-10" fill="#1A202C" stroke="${nation.color}" stroke-width="3" class="unit-token-hex" />
                        
                        <!-- Sprite -->
                        ${spriteContent}

                        <!-- Unit Count Badge if > 1 -->
                        ${terr.units.length > 1 ? `
                            <circle cx="18" cy="-18" r="9" fill="#FF5722" stroke="#FFFFFF" stroke-width="1.5" />
                            <text x="18" y="-15" class="unit-count-text">x${terr.units.length}</text>
                        ` : ''}

                        <!-- General Star Badge -->
                        ${hasGeneral ? `
                            <circle cx="-18" cy="-18" r="9" fill="#FFD700" stroke="#000000" stroke-width="1.5" />
                            <text x="-18" y="-14" class="general-star-icon">★</text>
                        ` : ''}

                        <!-- Health Bar -->
                        <rect x="-22" y="29" width="44" height="5" rx="2" fill="#2D3748" stroke="#000" stroke-width="0.5" />
                        <rect x="-22" y="29" width="${(hpPercent / 100) * 44}" height="5" rx="2" fill="${hpColor}" />

                        <!-- Action point dot (green = ready to act) -->
                        ${(!primaryUnit.hasMoved && !primaryUnit.hasAttacked && terr.country === gameState.playerCountry) ? `
                            <circle cx="0" cy="-28" r="4.5" fill="#00E676" class="ready-dot-pulse" />
                        ` : ''}
                    </g>
                `;
            });

            unitsLayer.innerHTML = unitsHTML;

            // Unit tokens click
            unitsLayer.querySelectorAll('.unit-token-group').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const terrId = el.getAttribute('data-id');
                    if (this.onTerritoryClickCallback) {
                        this.onTerritoryClickCallback(terrId);
                    }
                });
            });
        }

        this.updateMinimap();
    }

    // Mini radar map in HUD
    updateMinimap() {
        const canvas = document.getElementById('minimapCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, w, h);

        const gameState = window.GameState;
        if (!gameState) return;

        // Draw territories as dots
        Object.values(gameState.territories).forEach(terr => {
            const nation = AssetManager.nations[terr.country];
            const mx = (terr.cityX / MapData.width) * w;
            const my = (terr.cityY / MapData.height) * h;

            ctx.fillStyle = nation ? nation.color : '#64748B';
            ctx.beginPath();
            ctx.arc(mx, my, terr.isCapital ? 3.5 : 2.0, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw active viewport box
        const container = document.getElementById('mapContainer');
        if (container) {
            const vpW = (container.clientWidth / (MapData.width * this.scale)) * w;
            const vpH = (container.clientHeight / (MapData.height * this.scale)) * h;
            const vpX = (-this.panX / (MapData.width * this.scale)) * w;
            const vpY = (-this.panY / (MapData.height * this.scale)) * h;

            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(vpX, vpY, vpW, vpH);
        }
    }
}

window.MapRenderer = new MapRenderer();

