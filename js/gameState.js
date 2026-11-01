// Core Game State and Mechanics (World Conqueror 3 Engine)
class GameState {
    constructor() {
        this.playerCountry = 'TUR';
        this.currentActingCountry = 'TUR';
        this.turn = 1;
        this.year = 1939;
        this.month = 'Eylül';
        this.months = ['Eylül', 'Aralık', 'Mart', 'Haziran'];
        
        this.territories = {};
        this.resources = {};
        this.assignedGenerals = {}; // { territoryId: generalId }
        this.playerGenerals = []; // List of general IDs recruited by player
        
        this.selectedTerritoryId = null;
        this.selectedUnitIndex = 0;
        this.targetTerritoryId = null;
        
        this.isProcessingAi = false;
        this.warLog = [];
        this.victory = false;
        this.defeat = false;

        this.unitCosts = {
            infantry: {
                rifle: { gold: 35, steel: 0, oil: 0, hp: 50, atk: 14, def: 10, range: 1, name: 'Hafif Piyade' },
                smg: { gold: 65, steel: 20, oil: 0, hp: 65, atk: 22, def: 12, range: 1, name: 'Taarruz Piyadesi' },
                antitank: { gold: 80, steel: 35, oil: 0, hp: 60, atk: 26, def: 15, range: 1, tankBonus: 1.6, name: 'Tanksavar Piyadesi' }
            },
            tank: {
                light: { gold: 110, steel: 50, oil: 20, hp: 90, atk: 28, def: 18, range: 2, name: 'Hafif Zırhlı Tank' },
                medium: { gold: 160, steel: 90, oil: 35, hp: 130, atk: 38, def: 25, range: 2, name: 'Orta Muharebe Tankı' },
                heavy: { gold: 230, steel: 140, oil: 55, hp: 180, atk: 52, def: 35, range: 1, name: 'Ağır Zırhlı Tank' }
            },
            plane: {
                fighter: { gold: 130, steel: 70, oil: 35, hp: 90, atk: 32, def: 15, range: 3, name: 'Avcı Uçağı' },
                bomber: { gold: 190, steel: 110, oil: 50, hp: 105, atk: 45, def: 18, range: 3, name: 'Bombardıman Uçağı' }
            }
        };

        this.airStrikeCost = { gold: 75, oil: 40 };
        this.fortifyCost = { gold: 50, steel: 40 };
    }

    // Initialize or Reset Game with Selected Country
    initGame(playerCountryId = 'TUR') {
        this.playerCountry = playerCountryId;
        this.currentActingCountry = playerCountryId;
        this.turn = 1;
        this.year = 1939;
        this.month = 'Eylül';
        this.assignedGenerals = {};
        this.playerGenerals = [];
        this.selectedTerritoryId = null;
        this.selectedUnitIndex = 0;
        this.isProcessingAi = false;
        this.warLog = [];
        this.victory = false;
        this.defeat = false;

        // Clone territories from MapData
        this.territories = JSON.parse(JSON.stringify(MapData.territories));
        
        // Setup initial resources for all nations
        this.resources = {};
        Object.keys(AssetManager.nations).forEach(nId => {
            this.resources[nId] = {
                gold: nId === this.playerCountry ? 200 : 150,
                steel: nId === this.playerCountry ? 120 : 90,
                oil: nId === this.playerCountry ? 100 : 70
            };
        });

        // Initialize units state
        Object.values(this.territories).forEach(terr => {
            if (terr.startingUnits) {
                terr.units = terr.startingUnits.map(u => ({
                    ...u,
                    hasMoved: false,
                    hasAttacked: false,
                    nation: terr.country
                }));
            } else {
                terr.units = [];
            }
        });

        // Auto-assign iconic national general to player capital if available
        const defaultGen = GeneralsData.generals.find(g => g.nation === this.playerCountry);
        if (defaultGen) {
            const playerCapital = AssetManager.nations[this.playerCountry].capital;
            this.assignedGenerals[playerCapital] = defaultGen.id;
            this.playerGenerals.push(defaultGen.id);
            this.addLog(`🎖️ ${defaultGen.name} başkent savunmasına atandı!`, 'system');
        }

        // Select player's capital initially
        const capitalId = AssetManager.nations[this.playerCountry].capital;
        if (this.territories[capitalId]) {
            this.selectedTerritoryId = capitalId;
        }

        this.addLog(`⚔️ 1939 Dünya Harbi Başladı! ${AssetManager.nations[this.playerCountry].name} komutası sende!`, 'important');
    }

    addLog(msg, type = 'normal') {
        const timeStr = `${this.year} ${this.month}`;
        this.warLog.unshift({ text: msg, type, time: timeStr });
        if (this.warLog.length > 50) this.warLog.pop();
    }

    // Refresh Action points for units of acting country
    refreshTurnUnits(countryId) {
        Object.values(this.territories).forEach(terr => {
            if (terr.units) {
                terr.units.forEach(u => {
                    u.hasMoved = false;
                    u.hasAttacked = false;
                });
            }
        });
    }

    // Collect income for a country
    collectIncome(countryId) {
        let goldIncome = 0;
        let steelIncome = 0;
        let oilIncome = 0;

        Object.values(this.territories).forEach(terr => {
            if (terr.country === countryId) {
                goldIncome += terr.gold || 0;
                steelIncome += terr.steel || 0;
                oilIncome += terr.oil || 0;
            }
        });

        // National traits
        if (countryId === 'USA') {
            steelIncome = Math.round(steelIncome * 1.30);
            oilIncome = Math.round(oilIncome * 1.30);
        }

        const res = this.resources[countryId];
        if (res) {
            res.gold += goldIncome;
            res.steel += steelIncome;
            res.oil += oilIncome;
        }

        return { gold: goldIncome, steel: steelIncome, oil: oilIncome };
    }

    // Can a unit move from origin to destination?
    canMove(fromTerrId, toTerrId, unitIndex = 0) {
        const fromTerr = this.territories[fromTerrId];
        const toTerr = this.territories[toTerrId];
        if (!fromTerr || !toTerr || !fromTerr.units || !fromTerr.units[unitIndex]) return false;
        
        const unit = fromTerr.units[unitIndex];
        if (unit.hasMoved) return false;
        if (fromTerr.country !== this.currentActingCountry) return false;

        // Must be adjacent neighbors
        if (!fromTerr.neighbors.includes(toTerrId)) return false;

        // Friendly territory: can move if space permits (max 3 units per territory)
        if (toTerr.country === fromTerr.country) {
            return toTerr.units.length < 3;
        }

        // Enemy territory: moving there triggers attack/combat!
        return !unit.hasAttacked;
    }

    // Execute Move or Trigger Attack
    executeMoveOrAttack(fromTerrId, toTerrId, unitIndex = 0, onBattleNeeded = null) {
        const fromTerr = this.territories[fromTerrId];
        const toTerr = this.territories[toTerrId];
        if (!fromTerr || !toTerr || !fromTerr.units[unitIndex]) return false;

        const unit = fromTerr.units[unitIndex];

        // 1. Friendly territory movement
        if (toTerr.country === fromTerr.country) {
            fromTerr.units.splice(unitIndex, 1);
            unit.hasMoved = true;
            toTerr.units.push(unit);
            window.soundEngine.playSelect();
            this.selectedTerritoryId = toTerrId;
            this.selectedUnitIndex = toTerr.units.length - 1;
            return { action: 'move', success: true };
        }

        // 2. Enemy territory combat or occupation
        if (toTerr.units && toTerr.units.length > 0) {
            // There is an enemy garrison: Battle is required!
            if (onBattleNeeded) {
                onBattleNeeded(fromTerrId, toTerrId, unitIndex);
            }
            return { action: 'battle', success: true };
        } else {
            // Empty enemy territory: Occupy immediately!
            fromTerr.units.splice(unitIndex, 1);
            unit.hasMoved = true;
            unit.hasAttacked = true;
            toTerr.units.push(unit);
            
            const prevOwner = toTerr.country;
            toTerr.country = fromTerr.country;
            toTerr.defense = Math.max(10, Math.floor(toTerr.defense * 0.5));
            
            window.soundEngine.playCapture();
            this.addLog(`🚩 ${AssetManager.nations[fromTerr.country].name}, ${toTerr.name} bölgesini ele geçirdi! (${AssetManager.nations[prevOwner].name} kaybetti)`, 'important');
            this.selectedTerritoryId = toTerrId;
            this.selectedUnitIndex = 0;
            this.checkVictoryDefeat();
            return { action: 'capture', success: true };
        }
    }

    // Air Strike execution
    executeAirStrike(fromTerrId, targetTerrId) {
        const fromTerr = this.territories[fromTerrId];
        const targetTerr = this.territories[targetTerrId];
        const country = fromTerr.country;
        const res = this.resources[country];

        if (!res || res.gold < this.airStrikeCost.gold || res.oil < this.airStrikeCost.oil) {
            return { success: false, message: 'Yetersiz Altın veya Petrol!' };
        }

        // Check if fromTerr has plane or general air bonus
        const hasPlane = fromTerr.units && fromTerr.units.some(u => u.type === 'plane');
        if (!hasPlane && !fromTerr.isCapital) {
            return { success: false, message: 'Bu bölgede hava üssü veya uçak bulunmuyor!' };
        }

        // Deduct resources
        res.gold -= this.airStrikeCost.gold;
        res.oil -= this.airStrikeCost.oil;

        window.soundEngine.playAirStrike();

        // Calculate damage to target
        let totalDamage = 35 + Math.floor(Math.random() * 25);
        if (targetTerr.units && targetTerr.units.length > 0) {
            const defender = targetTerr.units[0];
            defender.hp -= totalDamage;
            let logMsg = `✈️ ${fromTerr.name} üzerinden ${targetTerr.name} hedefine hava taarruzu! Düşmana ${totalDamage} hasar verildi!`;
            
            if (defender.hp <= 0) {
                targetTerr.units.shift();
                logMsg += ` Düşman birliği imha edildi!`;
            }
            this.addLog(logMsg, 'combat');
        } else {
            targetTerr.defense = Math.max(0, targetTerr.defense - 20);
            this.addLog(`✈️ ${targetTerr.name} tahkimatına hava bombardımanı yapıldı! Savunma kırıldı.`, 'combat');
        }

        return { success: true, damage: totalDamage };
    }

    // Fortify / Repair defense of territory
    executeFortify(territoryId) {
        const terr = this.territories[territoryId];
        const res = this.resources[terr.country];
        if (!res || res.gold < this.fortifyCost.gold || res.steel < this.fortifyCost.steel) {
            return { success: false, message: 'Yetersiz Altın veya Çelik!' };
        }

        res.gold -= this.fortifyCost.gold;
        res.steel -= this.fortifyCost.steel;

        terr.defense = Math.min(60, (terr.defense || 20) + 15);
        window.soundEngine.playSelect();
        this.addLog(`🛡️ ${terr.name} bölgesinde savunma siperleri ve tabyalar güçlendirildi (+15 Savunma).`, 'system');
        return { success: true };
    }

    // Produce Unit in Territory
    produceUnit(territoryId, unitType, unitTier = 'medium') {
        const terr = this.territories[territoryId];
        if (!terr || terr.country !== this.playerCountry) {
            return { success: false, message: 'Yalnızca kendi bölgelerinde üretim yapabilirsin!' };
        }

        if (terr.units.length >= 3) {
            return { success: false, message: 'Bu bölgede maksimum birlik kapasitesine (3) ulaşıldı!' };
        }

        const costData = this.unitCosts[unitType][unitTier];
        const res = this.resources[this.playerCountry];

        if (res.gold < costData.gold || res.steel < costData.steel || res.oil < costData.oil) {
            return { success: false, message: 'Yetersiz kaynak! (Gerekli: Altın ' + costData.gold + ', Çelik ' + costData.steel + ', Petrol ' + costData.oil + ')' };
        }

        // Deduct resources
        res.gold -= costData.gold;
        res.steel -= costData.steel;
        res.oil -= costData.oil;

        // Create unit
        const newUnit = {
            type: unitType,
            tier: unitTier,
            hp: costData.hp,
            maxHp: costData.hp,
            level: 1,
            hasMoved: true, // newly trained units cannot move on the same turn
            hasAttacked: false,
            nation: this.playerCountry
        };

        terr.units.push(newUnit);
        window.soundEngine.playSelect();
        this.addLog(`🏭 ${terr.name} bölgesinde yeni ${costData.name} üretildi ve göreve başladı.`, 'system');

        return { success: true, unit: newUnit };
    }

    // Assign General to Territory
    assignGeneral(generalId, territoryId) {
        const gen = GeneralsData.generals.find(g => g.id === generalId);
        const terr = this.territories[territoryId];
        if (!gen || !terr) return false;

        const res = this.resources[this.playerCountry];
        if (res.gold < gen.cost) {
            return { success: false, message: 'Komutan atamak için yeterli altınınız yok! (Gereken: ' + gen.cost + ')' };
        }

        res.gold -= gen.cost;
        this.assignedGenerals[territoryId] = generalId;
        if (!this.playerGenerals.includes(generalId)) {
            this.playerGenerals.push(generalId);
        }

        // Buff units in territory
        if (terr.units) {
            terr.units.forEach(u => {
                u.hp += (gen.buffs.hpBonus || 25);
                u.maxHp += (gen.buffs.hpBonus || 25);
            });
        }

        window.soundEngine.playCapture();
        this.addLog(`⭐ ${gen.name}, ${terr.name} cephesine başkomutan olarak atandı!`, 'important');
        return { success: true };
    }

    // End Turn & Run AI Turns
    endPlayerTurn(onProgressUpdate, onTurnComplete) {
        if (this.isProcessingAi) return;
        this.isProcessingAi = true;
        window.soundEngine.playEndTurn();

        this.addLog(`⌛ ${this.year} ${this.month} dönemi sona erdi. Yapay zeka cepheleri harekete geçiyor...`, 'system');

        const aiCountries = Object.keys(AssetManager.nations).filter(n => n !== this.playerCountry);
        let currentAiIndex = 0;

        const runNextAi = () => {
            if (currentAiIndex >= aiCountries.length) {
                // All AI completed! Advance game turn
                this.turn++;
                this.month = this.months[(this.turn - 1) % 4];
                this.year = 1939 + Math.floor((this.turn - 1) / 4);

                // Collect Player Income
                const income = this.collectIncome(this.playerCountry);
                this.refreshTurnUnits(this.playerCountry);
                this.currentActingCountry = this.playerCountry;
                this.isProcessingAi = false;

                this.addLog(`🌟 YENİ DÖNEM: ${this.year} ${this.month}! Gelir: +${income.gold} Altın, +${income.steel} Çelik, +${income.oil} Petrol`, 'important');
                this.checkVictoryDefeat();

                if (onTurnComplete) onTurnComplete();
                return;
            }

            const countryId = aiCountries[currentAiIndex];
            const nation = AssetManager.nations[countryId];
            
            if (onProgressUpdate) {
                onProgressUpdate(nation.name, nation.flag, nation.color);
            }

            // Process AI Country
            setTimeout(() => {
                this.processAiTurn(countryId);
                currentAiIndex++;
                runNextAi();
            }, 350);
        };

        runNextAi();
    }

    // AI Decision Making Engine
    processAiTurn(countryId) {
        this.collectIncome(countryId);
        const myTerritories = Object.values(this.territories).filter(t => t.country === countryId);
        if (myTerritories.length === 0) return; // Eliminated

        const res = this.resources[countryId];

        // 1. Production Phase: If AI has resources, produce units in capital or threatened cities
        myTerritories.forEach(terr => {
            if (terr.units.length < 2 && res.gold >= 160 && res.steel >= 90 && res.oil >= 35) {
                // Build Tank
                res.gold -= 160;
                res.steel -= 90;
                res.oil -= 35;
                terr.units.push({
                    type: 'tank',
                    tier: 'medium',
                    hp: 120,
                    maxHp: 120,
                    level: 1,
                    hasMoved: true,
                    hasAttacked: false,
                    nation: countryId
                });
            } else if (terr.units.length === 0 && res.gold >= 35) {
                // Emergency infantry garrison
                res.gold -= 35;
                terr.units.push({
                    type: 'infantry',
                    tier: 'rifle',
                    hp: 50,
                    maxHp: 50,
                    level: 1,
                    hasMoved: true,
                    hasAttacked: false,
                    nation: countryId
                });
            }
        });

        // 2. Tactical Movement & Attack Phase
        myTerritories.forEach(fromTerr => {
            if (!fromTerr.units || fromTerr.units.length === 0) return;

            // Loop through units
            for (let i = fromTerr.units.length - 1; i >= 0; i--) {
                const unit = fromTerr.units[i];
                if (unit.hasMoved || unit.hasAttacked) continue;

                // Find neighbor options
                const neighbors = fromTerr.neighbors.map(nId => this.territories[nId]).filter(Boolean);
                
                // Prioritize attacking empty enemy territory or weak enemy
                const emptyEnemy = neighbors.find(n => n.country !== countryId && n.units.length === 0);
                if (emptyEnemy) {
                    fromTerr.units.splice(i, 1);
                    unit.hasMoved = true;
                    unit.hasAttacked = true;
                    emptyEnemy.units.push(unit);
                    const oldOwner = emptyEnemy.country;
                    emptyEnemy.country = countryId;
                    this.addLog(`⚔️ ${AssetManager.nations[countryId].name}, savunmasız ${emptyEnemy.name} bölgesini ele geçirdi! (${AssetManager.nations[oldOwner].name} kaybetti)`, 'combat');
                    continue;
                }

                // Attack enemy with favorable odds
                const enemyTarget = neighbors.find(n => n.country !== countryId && n.units.length > 0);
                if (enemyTarget && Math.random() < 0.65) {
                    // Quick simulated AI attack
                    const defender = enemyTarget.units[0];
                    const attackPower = unit.type === 'tank' ? 38 : (unit.type === 'plane' ? 42 : 20);
                    const defensePower = enemyTarget.defense * 0.3;
                    const dmgToDef = Math.max(15, Math.floor(attackPower * (0.8 + Math.random() * 0.4) - defensePower));
                    const dmgToAtk = Math.max(8, Math.floor((defender.type === 'tank' ? 25 : 12) * (0.8 + Math.random() * 0.4)));

                    defender.hp -= dmgToDef;
                    unit.hp -= dmgToAtk;
                    unit.hasAttacked = true;
                    unit.hasMoved = true;

                    if (defender.hp <= 0) {
                        enemyTarget.units.shift();
                        if (enemyTarget.units.length === 0 && unit.hp > 0) {
                            // Conquer!
                            fromTerr.units.splice(i, 1);
                            enemyTarget.units.push(unit);
                            const prevOwner = enemyTarget.country;
                            enemyTarget.country = countryId;
                            this.addLog(`💥 ${AssetManager.nations[countryId].name}, ${enemyTarget.name} bölgesini fethederek ${AssetManager.nations[prevOwner].name} ordusunu yendi!`, 'important');
                        }
                    }
                    if (unit.hp <= 0) {
                        fromTerr.units.splice(i, 1);
                    }
                }
            }
        });
    }

    // Check Victory or Defeat Conditions
    checkVictoryDefeat() {
        const playerTerrs = Object.values(this.territories).filter(t => t.country === this.playerCountry);
        const totalTerrs = Object.values(this.territories).length;
        const playerCapitalId = AssetManager.nations[this.playerCountry].capital;
        const playerHasCapital = this.territories[playerCapitalId] && this.territories[playerCapitalId].country === this.playerCountry;

        // Victory: Own > 60% of all territories or conquer 20+ provinces
        if (playerTerrs.length >= Math.floor(totalTerrs * 0.55)) {
            this.victory = true;
            window.soundEngine.playVictory();
            this.addLog(`🏆 ZAFER! ${AssetManager.nations[this.playerCountry].name} tüm dünyayı fethetti ve savaşı kazandı!`, 'important');
        }

        // Defeat: Lost capital and zero units remaining
        const totalPlayerUnits = playerTerrs.reduce((sum, t) => sum + (t.units ? t.units.length : 0), 0);
        if (!playerHasCapital && totalPlayerUnits === 0) {
            this.defeat = true;
            this.addLog(`💀 YENİLGİ! Başkentiniz ve tüm ordularınız imha edildi.`, 'important');
        }
    }
}

window.GameState = new GameState();

