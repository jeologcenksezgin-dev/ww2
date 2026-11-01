// Tactical Battle System with Animated Duels, Sprites, and Sound Effects (WC3 Combat Experience)
class BattleSystem {
    constructor() {
        this.isBattling = false;
        this.battleModal = null;
        this.onCompleteCallback = null;
    }

    init() {
        this.battleModal = document.getElementById('battleModal');
    }

    // Start a battle between attacker unit and defender unit
    startBattle(fromTerrId, toTerrId, attackerUnitIndex = 0, onComplete = null) {
        if (this.isBattling) return;
        this.isBattling = true;
        this.onCompleteCallback = onComplete;

        const fromTerr = window.GameState.territories[fromTerrId];
        const toTerr = window.GameState.territories[toTerrId];
        const attackerUnit = fromTerr.units[attackerUnitIndex];
        const defenderUnit = toTerr.units[0]; // Frontline defender

        const atkNation = AssetManager.nations[attackerUnit.nation || fromTerr.country];
        const defNation = AssetManager.nations[defenderUnit.nation || toTerr.country];

        const atkAsset = AssetManager.getUnitAsset(atkNation.id, attackerUnit.type, attackerUnit.tier);
        const defAsset = AssetManager.getUnitAsset(defNation.id, defenderUnit.type, defenderUnit.tier);

        // General buffs check
        const atkGeneralId = window.GameState.assignedGenerals[fromTerrId];
        const atkGeneral = atkGeneralId ? GeneralsData.generals.find(g => g.id === atkGeneralId) : null;
        const defGeneralId = window.GameState.assignedGenerals[toTerrId];
        const defGeneral = defGeneralId ? GeneralsData.generals.find(g => g.id === defGeneralId) : null;

        // Populate Modal UI
        this.renderBattleModal({
            fromTerr,
            toTerr,
            attackerUnit,
            defenderUnit,
            atkNation,
            defNation,
            atkAsset,
            defAsset,
            atkGeneral,
            defGeneral
        });

        // Show Modal
        if (this.battleModal) {
            this.battleModal.classList.remove('hidden');
        }

        // Run Animated Battle Rounds
        this.runCombatAnimation(attackerUnit, defenderUnit, fromTerr, toTerr, atkGeneral, defGeneral);
    }

    renderBattleModal(data) {
        const { fromTerr, toTerr, attackerUnit, defenderUnit, atkNation, defNation, atkAsset, defAsset, atkGeneral, defGeneral } = data;

        document.getElementById('battleTitle').innerHTML = `
            <span style="color:${atkNation.color}">${atkNation.flag} ${fromTerr.name}</span>
            <span class="vs-text"> ⚔️ TAARRUZ ➔ </span>
            <span style="color:${defNation.color}">${defNation.flag} ${toTerr.name}</span>
        `;

        // Attacker Side
        document.getElementById('atkName').innerText = `${atkNation.name} - ${atkAsset.name}`;
        document.getElementById('atkGeneralTag').innerText = atkGeneral ? `⭐ ${atkGeneral.name}` : 'Meydan Komutanı';
        document.getElementById('atkHpBar').style.width = `${(attackerUnit.hp / attackerUnit.maxHp) * 100}%`;
        document.getElementById('atkHpText').innerText = `${attackerUnit.hp} / ${attackerUnit.maxHp} HP`;
        
        const atkSpriteContainer = document.getElementById('atkSpriteContainer');
        atkSpriteContainer.innerHTML = this.generateSpriteHTML(atkAsset, false);

        // Defender Side
        document.getElementById('defName').innerText = `${defNation.name} - ${defAsset.name}`;
        document.getElementById('defGeneralTag').innerText = defGeneral ? `⭐ ${defGeneral.name}` : `🛡️ Siper Savunması (+%${toTerr.defense})`;
        document.getElementById('defHpBar').style.width = `${(defenderUnit.hp / defenderUnit.maxHp) * 100}%`;
        document.getElementById('defHpText').innerText = `${defenderUnit.hp} / ${defenderUnit.maxHp} HP`;
        
        const defSpriteContainer = document.getElementById('defSpriteContainer');
        defSpriteContainer.innerHTML = this.generateSpriteHTML(defAsset, true);

        // Clear Battle log
        document.getElementById('battleCombatLog').innerHTML = `<p class="combat-start">💥 Muharebe Başladı! Siperler ve zırhlılar ateşe hazır!</p>`;
    }

    generateSpriteHTML(asset, isFlipped = false) {
        const flipStyle = isFlipped ? 'transform: scaleX(-1);' : '';
        if (asset.isTank) {
            return `
                <div class="tank-sprite-box" style="${flipStyle}">
                    <img src="${asset.hullUrl}" class="tank-hull-img" alt="tank hull" />
                    <img src="${asset.turretUrl}" class="tank-turret-img" alt="tank turret" id="${isFlipped ? 'defTurret' : 'atkTurret'}" />
                </div>
            `;
        } else if (asset.isPlane) {
            return `
                <div class="plane-sprite-box" style="${flipStyle}">
                    <img src="${asset.url}" class="plane-img" alt="plane" />
                </div>
            `;
        } else {
            // Weapon / Infantry
            return `
                <div class="weapon-sprite-box" style="${flipStyle}">
                    <img src="${asset.url}" class="weapon-img" alt="weapon" />
                </div>
            `;
        }
    }

    runCombatAnimation(attackerUnit, defenderUnit, fromTerr, toTerr, atkGeneral, defGeneral) {
        const logBox = document.getElementById('battleCombatLog');

        // Step 1: Attacker Fires
        setTimeout(() => {
            if (!this.isBattling) return;
            
            this.animateFire('atk');
            if (attackerUnit.type === 'tank') {
                window.soundEngine.playCannon();
            } else if (attackerUnit.type === 'plane') {
                window.soundEngine.playAirStrike();
            } else {
                window.soundEngine.playGunfire(4);
            }

            // Calculate Attacker Damage
            let atkBase = window.GameState.unitCosts[attackerUnit.type][attackerUnit.tier].atk;
            if (atkGeneral) atkBase *= (atkGeneral.buffs.attackMult || 1.0);
            if (attackerUnit.tier === 'antitank' && defenderUnit.type === 'tank') {
                atkBase *= 1.6; // Anti-tank bonus!
            }
            const isCrit = Math.random() < (atkGeneral && atkGeneral.buffs.critBonus ? atkGeneral.buffs.critBonus : 0.15);
            const critMult = isCrit ? 1.5 : 1.0;
            const defTerrainReduction = (toTerr.defense || 20) * 0.25;
            const rawDmg = Math.floor((atkBase * (0.85 + Math.random() * 0.3) * critMult) - defTerrainReduction);
            const dmgToDef = Math.max(12, rawDmg);

            defenderUnit.hp = Math.max(0, defenderUnit.hp - dmgToDef);
            document.getElementById('defHpBar').style.width = `${(defenderUnit.hp / defenderUnit.maxHp) * 100}%`;
            document.getElementById('defHpText').innerText = `${defenderUnit.hp} / ${defenderUnit.maxHp} HP`;

            this.showFloatingDamage('defSpriteContainer', `-${dmgToDef}${isCrit ? ' (KRİTİK!)' : ''}`, isCrit ? '#FFD700' : '#FF5252');

            const logEntry = document.createElement('p');
            logEntry.innerHTML = `💥 <strong>Taarruz:</strong> Düşmana <strong>${dmgToDef}</strong> hasar verildi! ${isCrit ? '⭐ KRİTİK İSABET!' : ''}`;
            logBox.appendChild(logEntry);
            logBox.scrollTop = logBox.scrollHeight;

            // Check if Defender is dead
            if (defenderUnit.hp <= 0) {
                setTimeout(() => this.finishBattle(true, attackerUnit, defenderUnit, fromTerr, toTerr), 800);
                return;
            }

            // Step 2: Defender Return Fire
            setTimeout(() => {
                if (!this.isBattling) return;

                this.animateFire('def');
                if (defenderUnit.type === 'tank') {
                    window.soundEngine.playCannon();
                } else {
                    window.soundEngine.playGunfire(3);
                }

                let defBase = window.GameState.unitCosts[defenderUnit.type][defenderUnit.tier].atk * 0.75;
                if (defGeneral) defBase *= (defGeneral.buffs.attackMult || 1.0);
                const dmgToAtk = Math.max(8, Math.floor(defBase * (0.8 + Math.random() * 0.4)));

                attackerUnit.hp = Math.max(0, attackerUnit.hp - dmgToAtk);
                document.getElementById('atkHpBar').style.width = `${(attackerUnit.hp / attackerUnit.maxHp) * 100}%`;
                document.getElementById('atkHpText').innerText = `${attackerUnit.hp} / ${attackerUnit.maxHp} HP`;

                this.showFloatingDamage('atkSpriteContainer', `-${dmgToAtk}`, '#FF5252');

                const retEntry = document.createElement('p');
                retEntry.innerHTML = `🛡️ <strong>Karşı Ateş:</strong> Düşman birlikleri <strong>${dmgToAtk}</strong> hasar ile karşılık verdi.`;
                logBox.appendChild(retEntry);
                logBox.scrollTop = logBox.scrollHeight;

                // Check if Attacker died
                if (attackerUnit.hp <= 0) {
                    setTimeout(() => this.finishBattle(false, attackerUnit, defenderUnit, fromTerr, toTerr), 800);
                    return;
                }

                // Both survived
                setTimeout(() => this.finishBattle('draw', attackerUnit, defenderUnit, fromTerr, toTerr), 800);
            }, 900);

        }, 500);
    }

    animateFire(side) {
        const spriteBox = document.getElementById(side === 'atk' ? 'atkSpriteContainer' : 'defSpriteContainer');
        if (!spriteBox) return;

        spriteBox.classList.add('fire-kickback');
        setTimeout(() => spriteBox.classList.remove('fire-kickback'), 300);

        // Muzzle flash element
        const flash = document.createElement('div');
        flash.className = 'muzzle-flash';
        spriteBox.appendChild(flash);
        setTimeout(() => flash.remove(), 250);
    }

    showFloatingDamage(containerId, text, color) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const floater = document.createElement('div');
        floater.className = 'damage-floater';
        floater.innerText = text;
        floater.style.color = color;
        container.appendChild(floater);

        setTimeout(() => floater.remove(), 1000);
    }

    finishBattle(outcome, attackerUnit, defenderUnit, fromTerr, toTerr) {
        attackerUnit.hasAttacked = true;
        attackerUnit.hasMoved = true;

        const logBox = document.getElementById('battleCombatLog');
        const endBanner = document.createElement('div');
        endBanner.className = 'combat-end-banner';

        if (outcome === true) {
            // Attacker Won! Defender destroyed!
            toTerr.units.shift(); // Remove dead defender
            
            // If territory is now cleared of enemies, attacker captures it!
            if (toTerr.units.length === 0) {
                const atkIdx = fromTerr.units.indexOf(attackerUnit);
                if (atkIdx !== -1) fromTerr.units.splice(atkIdx, 1);
                toTerr.units.push(attackerUnit);

                const prevOwner = toTerr.country;
                toTerr.country = fromTerr.country;
                toTerr.defense = Math.max(10, Math.floor(toTerr.defense * 0.5));

                window.soundEngine.playCapture();
                endBanner.innerHTML = `<h3 style="color:#4CAF50">🏆 ZAFER! ${toTerr.name} Bölgesi Fethedildi!</h3>`;
                window.GameState.addLog(`🚩 ${toTerr.name} fethedildi! ${AssetManager.nations[prevOwner].name} birlikleri bozguna uğratıldı.`, 'important');
                window.GameState.selectedTerritoryId = toTerr.id;
            } else {
                endBanner.innerHTML = `<h3 style="color:#81C784">⚔️ Düşman Ön Hattı İmha Edildi!</h3>`;
            }
        } else if (outcome === false) {
            // Attacker destroyed!
            const atkIdx = fromTerr.units.indexOf(attackerUnit);
            if (atkIdx !== -1) fromTerr.units.splice(atkIdx, 1);
            endBanner.innerHTML = `<h3 style="color:#E53935">💀 Taarruz Birliklerimiz İmha Edildi!</h3>`;
            window.GameState.addLog(`⚠️ ${fromTerr.name} birliklerimizin taarruzu püskürtüldü ve birlik kaybedildi!`, 'combat');
        } else {
            // Draw / Skirmish
            endBanner.innerHTML = `<h3 style="color:#FFB74D">⚡ Çatışma Sona Erdi: İki Taraf da Ağır Hasar Aldı.</h3>`;
        }

        logBox.appendChild(endBanner);
        logBox.scrollTop = logBox.scrollHeight;

        // Auto close after brief pause
        setTimeout(() => {
            this.closeBattle();
        }, 1800);
    }

    closeBattle() {
        if (this.battleModal) {
            this.battleModal.classList.add('hidden');
        }
        this.isBattling = false;
        window.GameState.checkVictoryDefeat();
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
            this.onCompleteCallback = null;
        }
    }
}

window.BattleSystem = new BattleSystem();

