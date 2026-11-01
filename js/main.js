// Main Entry Point & Interaction Controller
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Game State with Turkey as default playable nation
    window.GameState.initGame('TUR');

    // 2. Initialize Battle System
    window.BattleSystem.init();

    // 3. Initialize SVG Map Renderer with territory click callback
    window.MapRenderer.init('worldMapSvg', (clickedTerrId) => {
        handleTerritoryClick(clickedTerrId);
    });

    // 4. Initialize UI Controller
    window.UIController.init();

    // 5. Initial Focus on Capital
    const playerCapital = AssetManager.nations[window.GameState.playerCountry].capital;
    window.MapRenderer.centerOnTerritory(playerCapital);
    window.UIController.updateSelectedTerritoryPanel();

    // Setup Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!window.GameState.isProcessingAi && !window.BattleSystem.isBattling) {
                window.UIController.triggerEndTurn();
            }
        } else if (e.code === 'Escape') {
            window.GameState.selectedTerritoryId = null;
            window.UIController.updateSelectedTerritoryPanel();
            window.MapRenderer.update();
        } else if (e.key === '+' || e.key === '=') {
            window.MapRenderer.zoomIn();
        } else if (e.key === '-' || e.key === '_') {
            window.MapRenderer.zoomOut();
        }
    });

    console.log('Dünya Fatihi 3: 1939 Dünya Harbi Motoru Başarıyla Yüklendi!');
});

// Primary Tactical Click Handler
function handleTerritoryClick(clickedTerrId) {
    const gs = window.GameState;
    const ui = window.UIController;

    // 1. Air Strike Mode Check
    if (ui.airStrikeMode) {
        const fromTerrId = gs.selectedTerritoryId;
        if (fromTerrId === clickedTerrId) {
            alert('Kendi bölgene hava saldırısı yapamazsın!');
            return;
        }

        const res = gs.executeAirStrike(fromTerrId, clickedTerrId);
        if (res.success) {
            ui.toggleAirStrikeMode();
            ui.updateHUD();
            ui.updateSelectedTerritoryPanel();
            window.MapRenderer.update();
            ui.renderWarLog();
        } else {
            alert(res.message);
        }
        return;
    }

    // 2. Movement & Attack Handler
    const currentSelId = gs.selectedTerritoryId;
    if (currentSelId && currentSelId !== clickedTerrId) {
        const fromTerr = gs.territories[currentSelId];
        const isMyTerr = fromTerr.country === gs.playerCountry;

        // If I own the origin territory and it has active units, check if destination is an adjacent neighbor
        if (isMyTerr && fromTerr.units && fromTerr.units.length > 0) {
            const unitIdx = gs.selectedUnitIndex || 0;
            const activeUnit = fromTerr.units[unitIdx];

            if (activeUnit && !activeUnit.hasMoved && fromTerr.neighbors.includes(clickedTerrId)) {
                // Execute Tactical Move or Attack!
                const toTerr = gs.territories[clickedTerrId];

                if (toTerr.country !== gs.playerCountry && toTerr.units && toTerr.units.length > 0) {
                    // Enemy territory with garrison -> Start Battle!
                    window.BattleSystem.startBattle(currentSelId, clickedTerrId, unitIdx, () => {
                        ui.updateHUD();
                        ui.updateSelectedTerritoryPanel();
                        window.MapRenderer.update();
                        ui.renderWarLog();
                    });
                    return;
                } else {
                    // Friendly territory or empty enemy territory
                    const result = gs.executeMoveOrAttack(currentSelId, clickedTerrId, unitIdx);
                    if (result && result.success) {
                        ui.updateHUD();
                        ui.updateSelectedTerritoryPanel();
                        window.MapRenderer.update();
                        ui.renderWarLog();
                        return;
                    }
                }
            }
        }
    }

    // 3. Simple Territory Selection
    gs.selectedTerritoryId = clickedTerrId;
    gs.selectedUnitIndex = 0;
    window.soundEngine.playSelect();
    ui.updateSelectedTerritoryPanel();
    window.MapRenderer.update();
}

