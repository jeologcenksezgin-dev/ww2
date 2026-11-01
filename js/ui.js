// UI Controller: Manages HUD, Panels, Production Modals, Generals, and Country Selector
class UIController {
    constructor() {
        this.selectedTab = 'infantry';
        this.airStrikeMode = false;
    }

    init() {
        this.bindEvents();
        this.updateHUD();
        this.renderWarLog();
    }

    bindEvents() {
        // End Turn Button
        const endTurnBtn = document.getElementById('endTurnBtn');
        if (endTurnBtn) {
            endTurnBtn.addEventListener('click', () => {
                this.triggerEndTurn();
            });
        }

        // Sound Toggle Button
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                const enabled = window.soundEngine.toggleMute();
                soundBtn.innerHTML = enabled ? '🔊 Ses: Açık' : '🔇 Ses: Kapalı';
                soundBtn.classList.toggle('muted', !enabled);
            });
        }

        // Map Control Buttons
        document.getElementById('zoomInBtn')?.addEventListener('click', () => window.MapRenderer.zoomIn());
        document.getElementById('zoomOutBtn')?.addEventListener('click', () => window.MapRenderer.zoomOut());
        document.getElementById('resetViewBtn')?.addEventListener('click', () => window.MapRenderer.resetView());
        document.getElementById('centerCapitalBtn')?.addEventListener('click', () => {
            const capitalId = AssetManager.nations[window.GameState.playerCountry].capital;
            window.MapRenderer.centerOnTerritory(capitalId);
        });

        // Modals close buttons
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) modal.classList.add('hidden');
            });
        });

        // Production Modal Tabs
        document.querySelectorAll('.prod-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.prod-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedTab = btn.getAttribute('data-tab');
                this.renderProductionList();
            });
        });

        // Air Strike Toggle
        document.getElementById('actionAirStrikeBtn')?.addEventListener('click', () => {
            this.toggleAirStrikeMode();
        });

        // Fortify Action
        document.getElementById('actionFortifyBtn')?.addEventListener('click', () => {
            const terrId = window.GameState.selectedTerritoryId;
            if (!terrId) return;
            const res = window.GameState.executeFortify(terrId);
            if (res.success) {
                this.updateHUD();
                this.updateSelectedTerritoryPanel();
                window.MapRenderer.update();
            } else {
                alert(res.message);
            }
        });

        // Open Production Modal
        document.getElementById('actionProduceBtn')?.addEventListener('click', () => {
            this.openProductionModal();
        });

        // Open Generals Modal
        document.getElementById('actionGeneralBtn')?.addEventListener('click', () => {
            this.openGeneralsModal();
        });

        // Country Selection Buttons
        document.getElementById('selectCountryBtn')?.addEventListener('click', () => {
            document.getElementById('countrySelectModal').classList.remove('hidden');
            this.renderCountrySelectionList();
        });

        // Help Modal Button
        document.getElementById('helpBtn')?.addEventListener('click', () => {
            document.getElementById('helpModal').classList.remove('hidden');
        });
    }

    // Top Header HUD Refresh
    updateHUD() {
        const gs = window.GameState;
        const playerNation = AssetManager.nations[gs.playerCountry];
        const res = gs.resources[gs.playerCountry] || { gold: 0, steel: 0, oil: 0 };
        const income = gs.collectIncome ? this.previewIncome(gs.playerCountry) : { gold: 0, steel: 0, oil: 0 };

        // Country Info
        document.getElementById('playerFlagIcon').innerText = playerNation.flag;
        document.getElementById('playerNameText').innerText = playerNation.name;
        document.getElementById('turnDateText').innerText = `${gs.year} ${gs.month} (Tur: ${gs.turn})`;

        // Resources with income tags
        document.getElementById('resGoldText').innerHTML = `<strong>${res.gold}</strong> <small>(+${income.gold})</small>`;
        document.getElementById('resSteelText').innerHTML = `<strong>${res.steel}</strong> <small>(+${income.steel})</small>`;
        document.getElementById('resOilText').innerHTML = `<strong>${res.oil}</strong> <small>(+${income.oil})</small>`;

        // Territories conquered
        const playerTerrs = Object.values(gs.territories).filter(t => t.country === gs.playerCountry).length;
        const totalTerrs = Object.values(gs.territories).length;
        const victoryPercent = Math.round((playerTerrs / totalTerrs) * 100);
        document.getElementById('victoryProgressBar').style.width = `${victoryPercent}%`;
        document.getElementById('victoryProgressText').innerText = `%${victoryPercent} Dünya Hakimiyeti (${playerTerrs}/${totalTerrs})`;

        // Check Victory / Defeat banners
        if (gs.victory) {
            document.getElementById('victoryBanner').classList.remove('hidden');
        } else if (gs.defeat) {
            document.getElementById('defeatBanner').classList.remove('hidden');
        }
    }

    previewIncome(countryId) {
        let gold = 0, steel = 0, oil = 0;
        Object.values(window.GameState.territories).forEach(t => {
            if (t.country === countryId) {
                gold += t.gold || 0;
                steel += t.steel || 0;
                oil += t.oil || 0;
            }
        });
        if (countryId === 'USA') {
            steel = Math.round(steel * 1.30);
            oil = Math.round(oil * 1.30);
        }
        return { gold, steel, oil };
    }

    // Territory Selected Panel Update
    updateSelectedTerritoryPanel() {
        const gs = window.GameState;
        const panel = document.getElementById('selectedTerritoryPanel');
        if (!panel) return;

        const terrId = gs.selectedTerritoryId;
        if (!terrId || !gs.territories[terrId]) {
            panel.classList.add('hidden');
            return;
        }

        panel.classList.remove('hidden');
        const terr = gs.territories[terrId];
        const nation = AssetManager.nations[terr.country];
        const isMine = terr.country === gs.playerCountry;
        const generalId = gs.assignedGenerals[terr.id];
        const general = generalId ? GeneralsData.generals.find(g => g.id === generalId) : null;

        // Details
        document.getElementById('terrName').innerText = terr.name;
        document.getElementById('terrRegion').innerText = `${terr.regionName} • ${terr.isCapital ? '⭐ Başkent' : 'Eyalet'}`;
        document.getElementById('terrFlag').innerText = nation.flag;
        document.getElementById('terrOwnerName').innerText = nation.name;
        document.getElementById('terrOwnerName').style.color = nation.color;
        document.getElementById('terrDefenseVal').innerText = `%${terr.defense || 20}`;
        document.getElementById('terrIncomeVal').innerText = `+${terr.gold} Altın, +${terr.steel} Çelik, +${terr.oil} Petrol`;

        // General Info
        const genBox = document.getElementById('terrGeneralBox');
        if (general) {
            genBox.classList.remove('hidden');
            genBox.innerHTML = `⭐ <strong>${general.name}</strong> (${general.rank})<br><small>${general.buffDesc}</small>`;
        } else {
            genBox.classList.add('hidden');
        }

        // Action Buttons visibility
        const produceBtn = document.getElementById('actionProduceBtn');
        const airStrikeBtn = document.getElementById('actionAirStrikeBtn');
        const fortifyBtn = document.getElementById('actionFortifyBtn');
        const generalBtn = document.getElementById('actionGeneralBtn');

        if (isMine) {
            produceBtn.style.display = 'inline-flex';
            airStrikeBtn.style.display = 'inline-flex';
            fortifyBtn.style.display = 'inline-flex';
            generalBtn.style.display = 'inline-flex';
        } else {
            produceBtn.style.display = 'none';
            airStrikeBtn.style.display = 'none';
            fortifyBtn.style.display = 'none';
            generalBtn.style.display = 'none';
        }

        // Render Stationed Units in this territory
        this.renderTerritoryUnitsList(terr, isMine);
    }

    renderTerritoryUnitsList(terr, isMine) {
        const listContainer = document.getElementById('stationedUnitsList');
        if (!listContainer) return;

        if (!terr.units || terr.units.length === 0) {
            listContainer.innerHTML = `<div class="empty-units-note">Bu bölgede konuşlanmış birlik yok. Savunmasız!</div>`;
            return;
        }

        let html = '';
        terr.units.forEach((u, idx) => {
            const uNation = AssetManager.nations[u.nation || terr.country];
            const asset = AssetManager.getUnitAsset(uNation.id, u.type, u.tier);
            const isSelected = isMine && window.GameState.selectedUnitIndex === idx;
            const canAct = isMine && !u.hasMoved && !u.hasAttacked;

            // Generate thumbnail sprite
            let spriteThumb = '';
            if (asset.isTank) {
                spriteThumb = `
                    <div class="thumb-tank">
                        <img src="${asset.hullUrl}" class="thumb-hull" />
                        <img src="${asset.turretUrl}" class="thumb-turret" />
                    </div>
                `;
            } else if (asset.isPlane) {
                spriteThumb = `<img src="${asset.url}" class="thumb-plane" />`;
            } else {
                spriteThumb = `<img src="${asset.url}" class="thumb-weapon" />`;
            }

            html += `
                <div class="unit-card ${isSelected ? 'selected-unit-card' : ''} ${canAct ? 'unit-can-act' : 'unit-exhausted'}" data-idx="${idx}">
                    <div class="unit-card-header">
                        ${spriteThumb}
                        <div class="unit-card-titles">
                            <span class="unit-card-name">${asset.name}</span>
                            <span class="unit-card-type">${u.type.toUpperCase()} • Rütbe ⭐${u.level || 1}</span>
                        </div>
                        <span class="unit-status-tag ${canAct ? 'status-ready' : 'status-done'}">${canAct ? 'HAZIR' : 'BEKLEMEDE'}</span>
                    </div>

                    <div class="unit-card-hp-bar">
                        <div class="hp-fill" style="width: ${(u.hp / u.maxHp) * 100}%"></div>
                    </div>
                    <div class="unit-card-stats">
                        <span>HP: ${u.hp}/${u.maxHp}</span>
                        ${isMine && u.hp < u.maxHp ? `
                            <button class="heal-unit-btn" data-idx="${idx}">➕ Takviye (15🪙)</button>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = html;

        // Click on unit card to select it
        listContainer.querySelectorAll('.unit-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('heal-unit-btn')) return;
                const idx = parseInt(card.getAttribute('data-idx'));
                window.GameState.selectedUnitIndex = idx;
                window.soundEngine.playSelect();
                this.updateSelectedTerritoryPanel();
                window.MapRenderer.update();
            });
        });

        // Heal button listener
        listContainer.querySelectorAll('.heal-unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute('data-idx'));
                this.healUnit(terr, idx);
            });
        });
    }

    healUnit(terr, unitIdx) {
        const gs = window.GameState;
        const res = gs.resources[gs.playerCountry];
        const unit = terr.units[unitIdx];
        if (!unit || res.gold < 15) {
            alert('Takviye için en az 15 Altın gerekiyor!');
            return;
        }

        res.gold -= 15;
        unit.hp = Math.min(unit.maxHp, unit.hp + 35);
        window.soundEngine.playSelect();
        gs.addLog(`🩹 ${terr.name} birliğine taze kuvvet takviye edildi (+35 Can).`, 'system');
        this.updateHUD();
        this.updateSelectedTerritoryPanel();
        window.MapRenderer.update();
    }

    // Toggle Air Strike Targeting
    toggleAirStrikeMode() {
        this.airStrikeMode = !this.airStrikeMode;
        const btn = document.getElementById('actionAirStrikeBtn');
        if (this.airStrikeMode) {
            btn.classList.add('btn-active-targeting');
            btn.innerText = '🎯 Hedefe Tıkla (İptal)';
            window.GameState.addLog('🎯 HAVA HAREKATI: Haritada bombalamak istediğin düşman bölgesine tıkla!', 'important');
        } else {
            btn.classList.remove('btn-active-targeting');
            btn.innerText = '✈️ Hava Saldırısı';
        }
    }

    // Open Production Modal
    openProductionModal() {
        const terrId = window.GameState.selectedTerritoryId;
        const terr = window.GameState.territories[terrId];
        if (!terr || terr.country !== window.GameState.playerCountry) {
            alert('Üretim yapmak için kendi bölgelerinden birini seçmelisin!');
            return;
        }

        document.getElementById('prodModalTerrName').innerText = `${terr.name} Askeri Fabrikaları`;
        document.getElementById('productionModal').classList.remove('hidden');
        this.renderProductionList();
    }

    renderProductionList() {
        const container = document.getElementById('productionListContainer');
        if (!container) return;

        const gs = window.GameState;
        const nation = AssetManager.nations[gs.playerCountry];
        const tab = this.selectedTab; // 'infantry', 'tank', 'plane'
        const costs = gs.unitCosts[tab];
        const playerRes = gs.resources[gs.playerCountry];

        let html = '';
        Object.entries(costs).forEach(([tierKey, data]) => {
            const asset = AssetManager.getUnitAsset(nation.id, tab, tierKey);
            const canAfford = playerRes.gold >= data.gold && playerRes.steel >= data.steel && playerRes.oil >= data.oil;

            // Generate sprite display
            let spriteHtml = '';
            if (asset.isTank) {
                spriteHtml = `
                    <div class="prod-tank-preview">
                        <img src="${asset.hullUrl}" class="p-hull" />
                        <img src="${asset.turretUrl}" class="p-turret" />
                    </div>
                `;
            } else if (asset.isPlane) {
                spriteHtml = `<img src="${asset.url}" class="prod-plane-preview" />`;
            } else {
                spriteHtml = `<img src="${asset.url}" class="prod-weapon-preview" />`;
            }

            html += `
                <div class="prod-item-card ${canAfford ? '' : 'disabled-prod'}">
                    <div class="prod-item-preview">
                        ${spriteHtml}
                    </div>
                    <div class="prod-item-info">
                        <h4>${asset.name}</h4>
                        <p class="prod-unit-subtitle">${data.name}</p>
                        <div class="prod-stats-row">
                            <span>❤️ Can: <strong>${data.hp}</strong></span>
                            <span>⚔️ Saldırı: <strong>${data.atk}</strong></span>
                            <span>🛡️ Zırh: <strong>${data.def}</strong></span>
                            <span>⚡ Menzil: <strong>${data.range}</strong></span>
                        </div>
                        <div class="prod-cost-row">
                            <span class="cost-tag gold">🪙 ${data.gold}</span>
                            ${data.steel > 0 ? `<span class="cost-tag steel">⚙️ ${data.steel}</span>` : ''}
                            ${data.oil > 0 ? `<span class="cost-tag oil">🛢️ ${data.oil}</span>` : ''}
                        </div>
                    </div>
                    <button class="prod-buy-btn ${canAfford ? 'btn-gold' : 'btn-disabled'}" data-type="${tab}" data-tier="${tierKey}" ${canAfford ? '' : 'disabled'}>
                        ${canAfford ? 'Emri Ver ➔' : 'Yetersiz Kaynak'}
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;

        // Buy buttons
        container.querySelectorAll('.prod-buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                const tier = btn.getAttribute('data-tier');
                const terrId = window.GameState.selectedTerritoryId;

                const result = window.GameState.produceUnit(terrId, type, tier);
                if (result.success) {
                    document.getElementById('productionModal').classList.add('hidden');
                    this.updateHUD();
                    this.updateSelectedTerritoryPanel();
                    window.MapRenderer.update();
                } else {
                    alert(result.message);
                }
            });
        });
    }

    // Open Generals Modal
    openGeneralsModal() {
        const terrId = window.GameState.selectedTerritoryId;
        const terr = window.GameState.territories[terrId];
        if (!terr || terr.country !== window.GameState.playerCountry) {
            alert('Komutan atamak için kendi bölgelerinden birini seçmelisin!');
            return;
        }

        document.getElementById('generalsModal').classList.remove('hidden');
        this.renderGeneralsList(terrId);
    }

    renderGeneralsList(terrId) {
        const container = document.getElementById('generalsListContainer');
        if (!container) return;

        const gs = window.GameState;
        const playerRes = gs.resources[gs.playerCountry];
        const assignedGenId = gs.assignedGenerals[terrId];

        let html = '';
        GeneralsData.generals.forEach(gen => {
            const nation = AssetManager.nations[gen.nation];
            const isAssignedHere = assignedGenId === gen.id;
            const canAfford = playerRes.gold >= gen.cost;

            html += `
                <div class="general-card ${isAssignedHere ? 'general-active-here' : ''}">
                    <div class="general-portrait">
                        <span class="gen-portrait-icon">${gen.portraitIcon}</span>
                        <span class="gen-flag">${nation.flag}</span>
                    </div>
                    <div class="general-info">
                        <h4>${gen.name}</h4>
                        <span class="general-rank-badge">${gen.rank} • ${nation.name}</span>
                        <p class="general-buff-text">${gen.buffDesc}</p>
                        <small class="general-bio">${gen.bio}</small>
                    </div>
                    <div class="general-action">
                        <span class="gen-cost-badge">🪙 ${gen.cost} Altın</span>
                        ${isAssignedHere ? `
                            <button class="btn-disabled" disabled>Bu Cephede Görevde</button>
                        ` : `
                            <button class="recruit-gen-btn ${canAfford ? 'btn-gold' : 'btn-disabled'}" data-id="${gen.id}" ${canAfford ? '' : 'disabled'}>
                                Cepheye Ata ⭐
                            </button>
                        `}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Recruit General
        container.querySelectorAll('.recruit-gen-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const genId = btn.getAttribute('data-id');
                const res = window.GameState.assignGeneral(genId, terrId);
                if (res.success) {
                    document.getElementById('generalsModal').classList.add('hidden');
                    this.updateHUD();
                    this.updateSelectedTerritoryPanel();
                    window.MapRenderer.update();
                } else {
                    alert(res.message);
                }
            });
        });
    }

    // Country Selection Modal
    renderCountrySelectionList() {
        const container = document.getElementById('countrySelectionList');
        if (!container) return;

        let html = '';
        Object.values(AssetManager.nations).forEach(n => {
            const isSelected = n.id === window.GameState.playerCountry;
            html += `
                <div class="country-pick-card ${isSelected ? 'active-country-card' : ''}" data-id="${n.id}">
                    <div class="pick-flag" style="background:${n.color}">${n.flag}</div>
                    <div class="pick-details">
                        <h4>${n.name}</h4>
                        <p class="pick-trait">${n.trait}</p>
                        <small>Lider: ${n.leader}</small>
                    </div>
                    <button class="pick-select-btn ${isSelected ? 'btn-disabled' : 'btn-gold'}">
                        ${isSelected ? 'Seçili' : 'Ülkeyi Yönet'}
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;

        container.querySelectorAll('.country-pick-card').forEach(card => {
            card.addEventListener('click', () => {
                const nId = card.getAttribute('data-id');
                window.GameState.initGame(nId);
                document.getElementById('countrySelectModal').classList.add('hidden');
                this.updateHUD();
                this.updateSelectedTerritoryPanel();
                window.MapRenderer.update();
                const cap = AssetManager.nations[nId].capital;
                window.MapRenderer.centerOnTerritory(cap);
            });
        });
    }

    // Trigger End Turn sequence with WC3 AI Turn Notification Toast
    triggerEndTurn() {
        const banner = document.getElementById('aiTurnBanner');
        const flagEl = document.getElementById('aiTurnFlag');
        const textEl = document.getElementById('aiTurnText');

        banner.classList.remove('hidden');

        window.GameState.endPlayerTurn(
            // On AI Progress Update
            (countryName, flag, color) => {
                flagEl.innerText = flag;
                textEl.innerText = `${countryName} Harekete Geçiyor...`;
                textEl.style.color = color;
                window.MapRenderer.update();
            },
            // On All AI Completed
            () => {
                banner.classList.add('hidden');
                this.updateHUD();
                this.updateSelectedTerritoryPanel();
                window.MapRenderer.update();
                this.renderWarLog();
            }
        );
    }

    // Render War Log
    renderWarLog() {
        const container = document.getElementById('warLogContainer');
        if (!container) return;

        const logs = window.GameState.warLog;
        let html = '';
        logs.forEach(l => {
            html += `
                <div class="log-entry log-${l.type}">
                    <span class="log-time">[${l.time}]</span>
                    <span class="log-msg">${l.text}</span>
                </div>
            `;
        });
        container.innerHTML = html;
        container.scrollTop = 0;
    }
}

window.UIController = new UIController();

