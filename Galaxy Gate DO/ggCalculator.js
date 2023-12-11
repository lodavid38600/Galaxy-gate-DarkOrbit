const gateRewards = {
    gamma: {
        base: { pe: 12000000, honour: 300000, uri: 60000, x4: 60000, repairVouchers: 6, logfiles: 10, xenomits: 600 },
        double: { pe: 29040000, honour: 660000, uri: 60000, x4: 60000, repairVouchers: 12, logfiles: 20, xenomits: 1200 },
        npc: { pe: 7500000, honour: 37500, credits: 34500000, uri: 19700 }
    },
    beta: {
        base: { pe: 8000000, honour: 200000, uri: 40000, x4: 40000, repairVouchers: 4, logfiles: 4, xenomits: 400 },
        double: { pe: 17600000, honour: 484000, uri: 40000, x4: 40000, repairVouchers: 8, logfiles: 8, xenomits: 800 },
        npc: { pe: 4998400, honour: 24992, credits: 22995200, uri: 13136 }
    },
    alpha: {
        base: { pe: 4000000, honour: 100000, uri: 20000, x4: 20000, repairVouchers: 2, logfiles: 2, xenomits: 200 },
        double: { pe: 8000000, honour: 286000, uri: 20000, x4: 20000, repairVouchers: 4, logfiles: 4, xenomits: 400 },
        npc: { pe: 2499200, honour: 12496, credits: 11497600, uri: 6568 }
    },
    eternalBlackLight: {
        npc: {
            pe: 50000000,          // Expérience
            honour: 400000,        // Honneur
            credits: 200000000,    // Crédits
            uri: 75000,            // Uridium
            rinusk: 7800,          // Rinusk
            blacklightTrace: 1100, // Blacklight Trace
            blacklightShard: 1500  // Blacklight Shard
        }
    }
};

function calculateRewards() {
    var isDoubleEvent = document.getElementById('doubleRewardEvent').checked;
    var expBoost = parseFloat(document.getElementById('expBoost').value) / 100;
    var honourBoost = parseFloat(document.getElementById('honourBoost').value) / 100;
    var gammaCount = parseInt(document.getElementById('gammaCount').value) || 0;
    var betaCount = parseInt(document.getElementById('betaCount').value) || 0;
    var alphaCount = parseInt(document.getElementById('alphaCount').value) || 0;
    var eternalBlackLightCount = parseInt(document.getElementById('eternalBlackLightCount').value) || 0;

    var totalRewards = calculateTotalRewards(gammaCount, betaCount, alphaCount, eternalBlackLightCount, isDoubleEvent, expBoost, honourBoost);

    displayResults(totalRewards, eternalBlackLightCount);
}


function calculateTotalRewards(gammaCount, betaCount, alphaCount, eternalBlackLightCount, isDoubleEvent, expBoost, honourBoost) {
    var rewards = {
        pe: 0,
        honour: 0,
        credits: 0,
        uri: 0,
        x4: 0,
        repairVouchers: 0,
        logfiles: 0,
        xenomits: 0,
        rinusk: 0,
        blacklightTrace: 0,
        blacklightShard: 0
    };

    // Logique pour Gamma, Beta, Alpha
    for (const gateType of ['gamma', 'beta', 'alpha']) {
        const count = (gateType === 'gamma') ? gammaCount :
                      (gateType === 'beta') ? betaCount : alphaCount;
        const gateData = gateRewards[gateType];
        const baseRewards = isDoubleEvent ? gateData.double : gateData.base;

        rewards.pe += (baseRewards.pe + gateData.npc.pe) * count;
        rewards.honour += (baseRewards.honour + gateData.npc.honour) * count;
        rewards.credits += (gateData.npc.credits) * count; // Assuming credits are only from NPCs
        rewards.uri += (baseRewards.uri + gateData.npc.uri) * count;
        rewards.x4 += (baseRewards.x4) * count;
        rewards.repairVouchers += (baseRewards.repairVouchers) * count;
        rewards.logfiles += (baseRewards.logfiles) * count;
        rewards.xenomits += (baseRewards.xenomits) * count;
    }

    // Logique spécifique pour Eternal Black Light
    if (eternalBlackLightCount > 0) {
        const eblRewards = gateRewards.eternalBlackLight.npc;
        rewards.pe += eblRewards.pe * eternalBlackLightCount;
        rewards.honour += eblRewards.honour * eternalBlackLightCount;
        rewards.credits += eblRewards.credits * eternalBlackLightCount;
        rewards.uri += eblRewards.uri * eternalBlackLightCount;
        rewards.rinusk += eblRewards.rinusk * eternalBlackLightCount;
        rewards.blacklightTrace += eblRewards.blacklightTrace * eternalBlackLightCount;
        rewards.blacklightShard += eblRewards.blacklightShard * eternalBlackLightCount;
    }

    // Appliquer les boosts à l'expérience et à l'honneur
    rewards.pe *= (1 + expBoost);
    rewards.honour *= (1 + honourBoost);

    return rewards;
}


function displayResults(rewards, eternalBlackLightCount) {
    function formatNumber(num) {
        return num.toLocaleString('fr-FR');
    }

    var honourPoints = Math.floor(rewards.honour / 100);
    var expPoints = Math.floor(rewards.pe / 100000);
    var gradePoints = honourPoints + expPoints;

    var resultArea = document.getElementById('results');
    resultArea.innerHTML = `
        <b>PE:</b> ${formatNumber(rewards.pe)}<br>
        <b>Honneur:</b> ${formatNumber(rewards.honour)}<br>
        <b>Points de Grade:</b> ${formatNumber(gradePoints)}<br>
        <b>Uri:</b> ${formatNumber(rewards.uri)}<br>
        <b>X4:</b> ${formatNumber(rewards.x4)}<br>
        <b>Bons de réparation:</b> ${formatNumber(rewards.repairVouchers)}<br>
        <b>Logfiles:</b> ${formatNumber(rewards.logfiles)}<br>
        <b>Xénomits:</b> ${formatNumber(rewards.xenomits)}<br>
        <b>Crédits:</b> ${formatNumber(rewards.credits)}<br>
    `;

    // Ajoutez seulement si une Eternal Black Light est ajoutée à l'affichage final
    if (eternalBlackLightCount > 0) {
        resultArea.innerHTML += `
        <b>Rinusk:</b> ${formatNumber(rewards.rinusk)}<br>
        <b>Blacklight Trace:</b> ${formatNumber(rewards.blacklightTrace)}<br>
        <b>Blacklight Shard:</b> ${formatNumber(rewards.blacklightShard)}<br>
        `;
    }
}