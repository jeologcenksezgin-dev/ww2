// Generals & Commanders Data (World Conqueror 3 Commander System)
const GeneralsData = {
    generals: [
        {
            id: 'gen_ataturk',
            name: 'Mareşal M. Kemal Atatürk',
            nation: 'TUR',
            rank: 'Başkomutan ⭐⭐⭐⭐⭐',
            portraitIcon: '⚔️',
            cost: 200,
            buffDesc: 'Tüm Birliklere +30% Taarruz, +25% Savunma ve +1 Hareket Menzi̇li̇.',
            buffs: { attackMult: 1.30, defenseMult: 1.25, movementAdd: 1, hpBonus: 40 },
            bio: 'Türk Kurtuluş Savaşı\'nın ebedi lideri ve dahi askeri stratejist.'
        },
        {
            id: 'gen_inonu',
            name: 'İsmet İnönü',
            nation: 'TUR',
            rank: 'Orgeneral ⭐⭐⭐⭐',
            portraitIcon: '🛡️',
            cost: 130,
            buffDesc: 'Savunma +35%, Bölge tahkimat etkisi +20%.',
            buffs: { attackMult: 1.10, defenseMult: 1.35, movementAdd: 0, hpBonus: 30 },
            bio: 'İnönü Savaşları muzafferi ve ustalıklı savunma doktrini mimarı.'
        },
        {
            id: 'gen_guderian',
            name: 'Heinz Guderian',
            nation: 'GER',
            rank: 'Generaloberst ⭐⭐⭐⭐⭐',
            portraitIcon: '⚡',
            cost: 180,
            buffDesc: 'Blitzkrieg Dehası: Tank Taarruzu +40%, Tank Hareketi +1.',
            buffs: { attackMult: 1.40, defenseMult: 1.15, movementAdd: 1, hpBonus: 35 },
            bio: 'Yıldırım Savaşı (Blitzkrieg) teorisyeni ve efsanevi panzer lideri.'
        },
        {
            id: 'gen_rommel',
            name: 'Erwin Rommel',
            nation: 'GER',
            rank: 'Generalfeldmarschall ⭐⭐⭐⭐⭐',
            portraitIcon: '🦊',
            cost: 190,
            buffDesc: 'Çöl Tilkisi: Tank Taarruzu +35%, Kritik Darbe İhtimali +30%.',
            buffs: { attackMult: 1.35, defenseMult: 1.20, critBonus: 0.30, movementAdd: 1, hpBonus: 35 },
            bio: 'Kuzey Afrika ve Fransa muharebelerinde düşmanlarını şaşırtan taktisyen.'
        },
        {
            id: 'gen_zhukov',
            name: 'Georgy Zhukov',
            nation: 'USSR',
            rank: 'Sovyetler Birliği Mareşali ⭐⭐⭐⭐⭐',
            portraitIcon: '🎖️',
            cost: 200,
            buffDesc: 'Moskova & Berlin Fatihi: Birlik Canı +60, Karşı Saldırı +35%.',
            buffs: { attackMult: 1.35, defenseMult: 1.30, movementAdd: 0, hpBonus: 60 },
            bio: 'Stalingrad ve Kursk meydan muharebelerinde Kızıl Ordu\'yu zafere taşıyan komutan.'
        },
        {
            id: 'gen_rokossovsky',
            name: 'Konstantin Rokossovsky',
            nation: 'USSR',
            rank: 'Mareşal ⭐⭐⭐⭐',
            portraitIcon: '🛡️',
            cost: 150,
            buffDesc: 'Bagration Harekatı Mimarı: Zırhlı Birlik Dayanıklılığı +35%.',
            buffs: { attackMult: 1.20, defenseMult: 1.35, movementAdd: 1, hpBonus: 40 },
            bio: 'Kızıl Ordu\'nun en yetenekli zırhlı manevra komutanlarından biri.'
        },
        {
            id: 'gen_patton',
            name: 'George S. Patton',
            nation: 'USA',
            rank: 'General ⭐⭐⭐⭐⭐',
            portraitIcon: '🦅',
            cost: 180,
            buffDesc: 'Eski Çelik ve Kan: Tank Taarruzu +40%, İntikal Hızı +1.',
            buffs: { attackMult: 1.40, defenseMult: 1.15, movementAdd: 1, hpBonus: 35 },
            bio: 'Agresif zırhlı taarruzları ve hızlı yarma harekatlarıyla ünlü Amerikan generali.'
        },
        {
            id: 'gen_eisenhower',
            name: 'Dwight D. Eisenhower',
            nation: 'USA',
            rank: 'Beş Yıldızlı General ⭐⭐⭐⭐⭐',
            portraitIcon: '🌐',
            cost: 170,
            buffDesc: 'Normandiya Başkomutanı: Hava Harekatı Gücü +30%, Şehir Geliri +20%.',
            buffs: { attackMult: 1.25, defenseMult: 1.25, airBonus: 1.30, hpBonus: 30 },
            bio: 'D-Day Çıkarması ve Müttefik Kuvvetler Yüksek Komutanı.'
        },
        {
            id: 'gen_montgomery',
            name: 'Bernard Montgomery',
            nation: 'UK',
            rank: 'Field Marshal ⭐⭐⭐⭐',
            portraitIcon: '🦁',
            cost: 160,
            buffDesc: 'El Alamein Kahramanı: Savunma +30%, Topçu ve Piyade +25%.',
            buffs: { attackMult: 1.25, defenseMult: 1.30, movementAdd: 0, hpBonus: 35 },
            bio: '8. İngiliz Ordusu komutanı ve çöl muharebeleri galibi.'
        },
        {
            id: 'gen_yamamoto',
            name: 'Isoroku Yamamoto',
            nation: 'JAP',
            rank: 'Büyük Amiral ⭐⭐⭐⭐⭐',
            portraitIcon: '⚓',
            cost: 180,
            buffDesc: 'Pasifik Kartalı: Uçak ve Hava Saldırısı +45%, Kritik Şansı +25%.',
            buffs: { attackMult: 1.35, defenseMult: 1.15, airBonus: 1.45, critBonus: 0.25, hpBonus: 30 },
            bio: 'Japon Birleşik Filosu komutanı ve deniz havacılığı stratejisti.'
        }
    ]
};

window.GeneralsData = GeneralsData;

