// World Conqueror 3 Style SVG World Map Data
// Contains all strategic provinces, vector SVG boundary paths, connections, resources, and starting units.

const MapData = {
    viewBox: "0 0 2000 1100",
    width: 2000,
    height: 1100,

    // Turn information
    startYear: 1939,
    startMonth: "Eylül",
    
    // Territories / Provinces
    territories: {
        // ==================== TÜRKİYE ====================
        turkey_istanbul: {
            id: 'turkey_istanbul',
            name: 'İstanbul',
            regionName: 'Marmara & Boğazlar',
            country: 'TUR',
            cityX: 1115,
            cityY: 465,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 20,
            oil: 10,
            defense: 30,
            // SVG Path for Marmara / Thrace / NW Anatolia
            path: "M 1085,445 L 1125,440 L 1145,460 L 1135,485 L 1100,485 L 1080,470 Z",
            neighbors: ['turkey_ankara', 'greece_athens', 'balkans_belgrade', 'ussr_caucasus'],
            startingUnits: [
                { type: 'infantry', tier: 'smg', hp: 70, maxHp: 70, level: 2 }
            ]
        },
        turkey_ankara: {
            id: 'turkey_ankara',
            name: 'Ankara',
            regionName: 'Anadolu & Başkent',
            country: 'TUR',
            cityX: 1175,
            cityY: 485,
            isCapital: true,
            cityLevel: 3,
            gold: 50,
            steel: 35,
            oil: 25,
            defense: 40,
            // SVG Path for Central/Eastern Anatolia
            path: "M 1135,455 L 1195,450 L 1225,480 L 1210,520 L 1150,525 L 1125,485 Z",
            neighbors: ['turkey_istanbul', 'ussr_caucasus', 'middle_east_baghdad', 'egypt_cairo'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 120, maxHp: 120, level: 2 },
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },

        // ==================== ALMANYA (GERMANY) ====================
        germany_berlin: {
            id: 'germany_berlin',
            name: 'Berlin',
            regionName: 'Prusya & Başkent',
            country: 'GER',
            cityX: 1025,
            cityY: 345,
            isCapital: true,
            cityLevel: 3,
            gold: 60,
            steel: 55,
            oil: 20,
            defense: 45,
            path: "M 995,315 L 1055,315 L 1065,360 L 1020,380 L 985,355 Z",
            neighbors: ['germany_ruhr', 'poland_warsaw', 'scandinavia_oslo', 'france_paris'],
            startingUnits: [
                { type: 'tank', tier: 'heavy', hp: 180, maxHp: 180, level: 3 }, // Tiger!
                { type: 'plane', tier: 'fighter', hp: 90, maxHp: 90, level: 2 }
            ]
        },
        germany_ruhr: {
            id: 'germany_ruhr',
            name: 'Münih / Ruhr',
            regionName: 'Güney Almanya & Ağır Sanayi',
            country: 'GER',
            cityX: 990,
            cityY: 395,
            isCapital: false,
            cityLevel: 3,
            gold: 50,
            steel: 60,
            oil: 20,
            defense: 35,
            path: "M 965,365 L 1015,360 L 1025,420 L 970,425 L 950,385 Z",
            neighbors: ['germany_berlin', 'france_paris', 'italy_rome', 'balkans_belgrade'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 130, maxHp: 130, level: 2 }, // Panzer IV
                { type: 'infantry', tier: 'antitank', hp: 65, maxHp: 65, level: 2 }
            ]
        },

        // ==================== POLONYA (POLAND) ====================
        poland_warsaw: {
            id: 'poland_warsaw',
            name: 'Varşova',
            regionName: 'Polonya Ovası',
            country: 'GER', // 1939 German occupied front
            cityX: 1085,
            cityY: 345,
            isCapital: false,
            cityLevel: 2,
            gold: 30,
            steel: 25,
            oil: 10,
            defense: 25,
            path: "M 1055,315 L 1120,320 L 1130,375 L 1065,370 Z",
            neighbors: ['germany_berlin', 'ussr_kiev', 'ussr_leningrad', 'balkans_belgrade'],
            startingUnits: [
                { type: 'infantry', tier: 'smg', hp: 60, maxHp: 60, level: 2 }
            ]
        },

        // ==================== BÜYÜK BRİTANYA (UK) ====================
        uk_london: {
            id: 'uk_london',
            name: 'Londra',
            regionName: 'Güney İngiltere',
            country: 'UK',
            cityX: 910,
            cityY: 340,
            isCapital: true,
            cityLevel: 3,
            gold: 60,
            steel: 45,
            oil: 30,
            defense: 40,
            path: "M 885,320 L 935,320 L 945,360 L 895,365 Z",
            neighbors: ['uk_scotland', 'france_paris', 'germany_ruhr'],
            startingUnits: [
                { type: 'tank', tier: 'heavy', hp: 160, maxHp: 160, level: 2 }, // Churchill
                { type: 'plane', tier: 'fighter', hp: 90, maxHp: 90, level: 3 } // Spitfire
            ]
        },
        uk_scotland: {
            id: 'uk_scotland',
            name: 'İskoçya',
            regionName: 'Kuzey Ada & Donanma',
            country: 'UK',
            cityX: 895,
            cityY: 275,
            isCapital: false,
            cityLevel: 2,
            gold: 30,
            steel: 30,
            oil: 15,
            defense: 30,
            path: "M 880,245 L 925,245 L 930,310 L 880,310 Z",
            neighbors: ['uk_london', 'scandinavia_oslo', 'canada_ottawa'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },

        // ==================== FRANSA (FRANCE) ====================
        france_paris: {
            id: 'france_paris',
            name: 'Paris',
            regionName: 'Kuzey Fransa & Başkent',
            country: 'FRA',
            cityX: 930,
            cityY: 385,
            isCapital: true,
            cityLevel: 3,
            gold: 55,
            steel: 40,
            oil: 20,
            defense: 40,
            path: "M 905,365 L 960,360 L 970,410 L 910,415 Z",
            neighbors: ['uk_london', 'germany_ruhr', 'germany_berlin', 'france_marseille', 'spain_madrid'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 110, maxHp: 110, level: 2 },
                { type: 'infantry', tier: 'rifle', hp: 55, maxHp: 55, level: 2 }
            ]
        },
        france_marseille: {
            id: 'france_marseille',
            name: 'Marsilya',
            regionName: 'Güney Fransa & Akdeniz',
            country: 'FRA',
            cityX: 935,
            cityY: 440,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 25,
            oil: 15,
            defense: 30,
            path: "M 910,415 L 965,415 L 955,470 L 910,465 Z",
            neighbors: ['france_paris', 'italy_rome', 'spain_madrid', 'algeria_algiers'],
            startingUnits: [
                { type: 'infantry', tier: 'smg', hp: 60, maxHp: 60, level: 1 }
            ]
        },

        // ==================== İTALYA (ITALY) ====================
        italy_rome: {
            id: 'italy_rome',
            name: 'Roma',
            regionName: 'İtalyan Yarımadası',
            country: 'ITA',
            cityX: 1005,
            cityY: 460,
            isCapital: true,
            cityLevel: 3,
            gold: 50,
            steel: 35,
            oil: 20,
            defense: 35,
            path: "M 975,425 L 1025,420 L 1035,495 L 995,505 Z",
            neighbors: ['germany_ruhr', 'france_marseille', 'balkans_belgrade', 'north_africa_tripoli', 'greece_athens'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 110, maxHp: 110, level: 2 },
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },

        // ==================== BALKANLAR & YUNANİSTAN ====================
        balkans_belgrade: {
            id: 'balkans_belgrade',
            name: 'Belgrad',
            regionName: 'Balkanlar',
            country: 'GER',
            cityX: 1060,
            cityY: 425,
            isCapital: false,
            cityLevel: 2,
            gold: 30,
            steel: 25,
            oil: 30, // Ploiești oil fields
            defense: 25,
            path: "M 1025,395 L 1090,395 L 1105,450 L 1040,450 Z",
            neighbors: ['germany_ruhr', 'poland_warsaw', 'italy_rome', 'greece_athens', 'turkey_istanbul', 'ussr_kiev'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },
        greece_athens: {
            id: 'greece_athens',
            name: 'Atina',
            regionName: 'Ege & Helen',
            country: 'UK',
            cityX: 1075,
            cityY: 490,
            isCapital: false,
            cityLevel: 2,
            gold: 25,
            steel: 15,
            oil: 10,
            defense: 30,
            path: "M 1050,455 L 1095,455 L 1090,515 L 1055,510 Z",
            neighbors: ['balkans_belgrade', 'turkey_istanbul', 'italy_rome', 'egypt_cairo'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 45, maxHp: 45, level: 1 }
            ]
        },

        // ==================== İSKANDİNAVYA & İSPANYA ====================
        scandinavia_oslo: {
            id: 'scandinavia_oslo',
            name: 'Oslo / Stockholm',
            regionName: 'İskandinavya',
            country: 'GER',
            cityX: 1025,
            cityY: 220,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 50, // Kiruna iron ore
            oil: 10,
            defense: 30,
            path: "M 985,175 L 1060,175 L 1055,275 L 985,275 Z",
            neighbors: ['germany_berlin', 'uk_scotland', 'ussr_leningrad'],
            startingUnits: [
                { type: 'infantry', tier: 'smg', hp: 55, maxHp: 55, level: 1 }
            ]
        },
        spain_madrid: {
            id: 'spain_madrid',
            name: 'Madrid',
            regionName: 'İber Yarımadası',
            country: 'GER', // Neutral/Axis leaning
            cityX: 860,
            cityY: 460,
            isCapital: false,
            cityLevel: 2,
            gold: 30,
            steel: 20,
            oil: 10,
            defense: 30,
            path: "M 825,420 L 895,420 L 890,500 L 820,490 Z",
            neighbors: ['france_paris', 'france_marseille', 'algeria_algiers'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },

        // ==================== SOVYETLER BİRLİĞİ (USSR) ====================
        ussr_moscow: {
            id: 'ussr_moscow',
            name: 'Moskova',
            regionName: 'Merkez Rusya & Başkent',
            country: 'USSR',
            cityX: 1225,
            cityY: 305,
            isCapital: true,
            cityLevel: 3,
            gold: 65,
            steel: 55,
            oil: 30,
            defense: 50,
            path: "M 1180,265 L 1265,260 L 1275,340 L 1185,340 Z",
            neighbors: ['ussr_leningrad', 'ussr_stalingrad', 'ussr_kiev', 'ussr_urals'],
            startingUnits: [
                { type: 'tank', tier: 'heavy', hp: 180, maxHp: 180, level: 3 }, // KV-1
                { type: 'plane', tier: 'bomber', hp: 100, maxHp: 100, level: 2 } // Il-2
            ]
        },
        ussr_leningrad: {
            id: 'ussr_leningrad',
            name: 'Leningrad',
            regionName: 'Baltık & Kuzey Rusya',
            country: 'USSR',
            cityX: 1160,
            cityY: 235,
            isCapital: false,
            cityLevel: 3,
            gold: 45,
            steel: 40,
            oil: 15,
            defense: 45,
            path: "M 1115,190 L 1195,190 L 1185,270 L 1110,270 Z",
            neighbors: ['scandinavia_oslo', 'poland_warsaw', 'ussr_moscow', 'ussr_kiev'],
            startingUnits: [
                { type: 'infantry', tier: 'smg', hp: 65, maxHp: 65, level: 2 } // PPSh
            ]
        },
        ussr_kiev: {
            id: 'ussr_kiev',
            name: 'Kiev',
            regionName: 'Ukrayna & Sanayi Havzası',
            country: 'USSR',
            cityX: 1155,
            cityY: 360,
            isCapital: false,
            cityLevel: 2,
            gold: 40,
            steel: 45,
            oil: 20,
            defense: 35,
            path: "M 1115,320 L 1190,320 L 1195,400 L 1120,400 Z",
            neighbors: ['poland_warsaw', 'balkans_belgrade', 'ussr_moscow', 'ussr_stalingrad', 'ussr_leningrad'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 130, maxHp: 130, level: 2 }, // T-34
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },
        ussr_stalingrad: {
            id: 'ussr_stalingrad',
            name: 'Stalingrad',
            regionName: 'Volga Savunması & Sanayi',
            country: 'USSR',
            cityX: 1255,
            cityY: 385,
            isCapital: false,
            cityLevel: 3,
            gold: 45,
            steel: 50,
            oil: 25,
            defense: 45,
            path: "M 1205,345 L 1290,345 L 1300,430 L 1215,430 Z",
            neighbors: ['ussr_moscow', 'ussr_kiev', 'ussr_caucasus', 'ussr_urals'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 130, maxHp: 130, level: 2 }, // T-34
                { type: 'infantry', tier: 'antitank', hp: 65, maxHp: 65, level: 2 } // PTRS-41
            ]
        },
        ussr_caucasus: {
            id: 'ussr_caucasus',
            name: 'Bakü / Kafkaslar',
            regionName: 'Hazar & Zengin Petrol Havzası',
            country: 'USSR',
            cityX: 1255,
            cityY: 465,
            isCapital: false,
            cityLevel: 2,
            gold: 40,
            steel: 30,
            oil: 70, // Major oil prize!
            defense: 35,
            path: "M 1215,430 L 1295,430 L 1290,505 L 1220,505 Z",
            neighbors: ['ussr_stalingrad', 'turkey_istanbul', 'turkey_ankara', 'middle_east_baghdad'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },
        ussr_urals: {
            id: 'ussr_urals',
            name: 'Çelyabinsk (Tankograd)',
            regionName: 'Ural Dağları & Tank Fabrikaları',
            country: 'USSR',
            cityX: 1355,
            cityY: 285,
            isCapital: false,
            cityLevel: 3,
            gold: 40,
            steel: 70, // Massive steel
            oil: 25,
            defense: 40,
            path: "M 1285,225 L 1410,225 L 1400,345 L 1285,345 Z",
            neighbors: ['ussr_moscow', 'ussr_stalingrad', 'ussr_siberia'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 130, maxHp: 130, level: 2 }
            ]
        },
        ussr_siberia: {
            id: 'ussr_siberia',
            name: 'Novosibirsk',
            regionName: 'Sibirya Genişliği',
            country: 'USSR',
            cityX: 1495,
            cityY: 255,
            isCapital: false,
            cityLevel: 2,
            gold: 30,
            steel: 40,
            oil: 30,
            defense: 30,
            path: "M 1415,185 L 1575,185 L 1565,335 L 1410,335 Z",
            neighbors: ['ussr_urals', 'ussr_vladivostok', 'china_beijing'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 55, maxHp: 55, level: 2 }
            ]
        },
        ussr_vladivostok: {
            id: 'ussr_vladivostok',
            name: 'Vladivostok',
            regionName: 'Uzak Doğu & Pasifik Limanı',
            country: 'USSR',
            cityX: 1675,
            cityY: 305,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 30,
            oil: 20,
            defense: 35,
            path: "M 1585,235 L 1730,235 L 1720,360 L 1580,355 Z",
            neighbors: ['ussr_siberia', 'manchuria', 'japan_tokyo'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },

        // ==================== ORTA DOĞU & KUZEY AFRİKA ====================
        middle_east_baghdad: {
            id: 'middle_east_baghdad',
            name: 'Bağdat / Tahran',
            regionName: 'Basra & Zengin Petrol Sahaları',
            country: 'UK',
            cityX: 1255,
            cityY: 560,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 15,
            oil: 75, // Rich oil!
            defense: 25,
            path: "M 1220,515 L 1315,515 L 1300,605 L 1225,600 Z",
            neighbors: ['turkey_ankara', 'ussr_caucasus', 'egypt_cairo', 'india_delhi'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },
        egypt_cairo: {
            id: 'egypt_cairo',
            name: 'Kahire & Süveyş',
            regionName: 'Nil & Stratejik Kanal',
            country: 'UK',
            cityX: 1145,
            cityY: 575,
            isCapital: false,
            cityLevel: 3,
            gold: 45,
            steel: 20,
            oil: 35,
            defense: 35,
            path: "M 1105,530 L 1195,530 L 1215,630 L 1115,630 Z",
            neighbors: ['turkey_ankara', 'greece_athens', 'north_africa_tripoli', 'middle_east_baghdad'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 115, maxHp: 115, level: 2 }, // Matilda
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },
        north_africa_tripoli: {
            id: 'north_africa_tripoli',
            name: 'Trablus & Tobruk',
            regionName: 'Libya Çölü & Afrika Kolordusu',
            country: 'ITA',
            cityX: 1025,
            cityY: 575,
            isCapital: false,
            cityLevel: 2,
            gold: 25,
            steel: 15,
            oil: 30,
            defense: 25,
            path: "M 985,525 L 1095,525 L 1105,635 L 975,630 Z",
            neighbors: ['italy_rome', 'egypt_cairo', 'algeria_algiers'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 110, maxHp: 110, level: 2 } // M13
            ]
        },
        algeria_algiers: {
            id: 'algeria_algiers',
            name: 'Cezayir',
            regionName: 'Mağrip & Fransız Kuzey Afrika',
            country: 'FRA',
            cityX: 885,
            cityY: 565,
            isCapital: false,
            cityLevel: 2,
            gold: 25,
            steel: 15,
            oil: 15,
            defense: 25,
            path: "M 835,515 L 970,515 L 965,635 L 825,620 Z",
            neighbors: ['spain_madrid', 'france_marseille', 'north_africa_tripoli'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 45, maxHp: 45, level: 1 }
            ]
        },

        // ==================== ASYA & PASİFİK ====================
        japan_tokyo: {
            id: 'japan_tokyo',
            name: 'Tokyo',
            regionName: 'Honshu & İmparatorluk Başkenti',
            country: 'JAP',
            cityX: 1795,
            cityY: 425,
            isCapital: true,
            cityLevel: 3,
            gold: 60,
            steel: 45,
            oil: 20,
            defense: 45,
            path: "M 1765,385 L 1825,385 L 1835,465 L 1765,465 Z",
            neighbors: ['japan_osaka', 'ussr_vladivostok', 'pacific_midway'],
            startingUnits: [
                { type: 'plane', tier: 'fighter', hp: 95, maxHp: 95, level: 3 }, // Zero
                { type: 'tank', tier: 'light', hp: 90, maxHp: 90, level: 2 }   // Type 95
            ]
        },
        japan_osaka: {
            id: 'japan_osaka',
            name: 'Osaka / Hiroşima',
            regionName: 'Güney Japonya & Tersaneler',
            country: 'JAP',
            cityX: 1775,
            cityY: 485,
            isCapital: false,
            cityLevel: 3,
            gold: 50,
            steel: 50,
            oil: 15,
            defense: 35,
            path: "M 1745,465 L 1815,465 L 1810,535 L 1740,530 Z",
            neighbors: ['japan_tokyo', 'manchuria', 'china_shanghai', 'philippines_manila'],
            startingUnits: [
                { type: 'infantry', tier: 'smg', hp: 65, maxHp: 65, level: 2 }
            ]
        },
        manchuria: {
            id: 'manchuria',
            name: 'Mançurya (Mukden)',
            regionName: 'Kuantung Ordusu Bölgesi',
            country: 'JAP',
            cityX: 1645,
            cityY: 385,
            isCapital: false,
            cityLevel: 2,
            gold: 40,
            steel: 45,
            oil: 20,
            defense: 35,
            path: "M 1585,345 L 1715,345 L 1710,435 L 1580,430 Z",
            neighbors: ['ussr_vladivostok', 'japan_osaka', 'china_beijing'],
            startingUnits: [
                { type: 'tank', tier: 'light', hp: 85, maxHp: 85, level: 1 },
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },
        china_beijing: {
            id: 'china_beijing',
            name: 'Pekin',
            regionName: 'Kuzey Çin',
            country: 'JAP', // Occupied by Japan
            cityX: 1565,
            cityY: 415,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 30,
            oil: 15,
            defense: 30,
            path: "M 1500,365 L 1585,365 L 1585,455 L 1500,455 Z",
            neighbors: ['ussr_siberia', 'manchuria', 'china_shanghai', 'china_chongqing'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },
        china_shanghai: {
            id: 'china_shanghai',
            name: 'Şanghay / Nanjing',
            regionName: 'Doğu Çin Limanları',
            country: 'JAP',
            cityX: 1595,
            cityY: 485,
            isCapital: false,
            cityLevel: 3,
            gold: 45,
            steel: 30,
            oil: 15,
            defense: 30,
            path: "M 1545,455 L 1640,455 L 1630,545 L 1540,540 Z",
            neighbors: ['china_beijing', 'japan_osaka', 'china_chongqing', 'southeast_asia', 'philippines_manila'],
            startingUnits: [
                { type: 'infantry', tier: 'smg', hp: 60, maxHp: 60, level: 1 }
            ]
        },
        china_chongqing: {
            id: 'china_chongqing',
            name: 'Çongçing',
            regionName: 'İç Çin & Direniş Üssü',
            country: 'UK', // Allies faction (Representing China / Allies)
            cityX: 1485,
            cityY: 485,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 20,
            oil: 10,
            defense: 40,
            path: "M 1435,445 L 1535,445 L 1535,545 L 1435,540 Z",
            neighbors: ['china_beijing', 'china_shanghai', 'india_calcutta', 'southeast_asia'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 55, maxHp: 55, level: 2 }
            ]
        },
        india_delhi: {
            id: 'india_delhi',
            name: 'Yeni Delhi',
            regionName: 'İngiliz Hindistanı Başkenti',
            country: 'UK',
            cityX: 1375,
            cityY: 565,
            isCapital: false,
            cityLevel: 3,
            gold: 50,
            steel: 30,
            oil: 20,
            defense: 35,
            path: "M 1320,515 L 1420,515 L 1405,625 L 1315,615 Z",
            neighbors: ['middle_east_baghdad', 'india_calcutta', 'china_chongqing'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 55, maxHp: 55, level: 1 },
                { type: 'tank', tier: 'medium', hp: 110, maxHp: 110, level: 1 }
            ]
        },
        india_calcutta: {
            id: 'india_calcutta',
            name: 'Kalküta',
            regionName: 'Bengal Körfezi & Sanayi',
            country: 'UK',
            cityX: 1445,
            cityY: 605,
            isCapital: false,
            cityLevel: 2,
            gold: 40,
            steel: 25,
            oil: 15,
            defense: 30,
            path: "M 1410,565 L 1495,565 L 1480,680 L 1395,670 Z",
            neighbors: ['india_delhi', 'china_chongqing', 'southeast_asia'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },
        southeast_asia: {
            id: 'southeast_asia',
            name: 'Burma & Singapur',
            regionName: 'Malakka Boğazı & Kauçuk Deposu',
            country: 'UK',
            cityX: 1545,
            cityY: 655,
            isCapital: false,
            cityLevel: 2,
            gold: 40,
            steel: 20,
            oil: 40, // Rich resources
            defense: 35,
            path: "M 1495,605 L 1600,605 L 1585,735 L 1485,725 Z",
            neighbors: ['india_calcutta', 'china_chongqing', 'china_shanghai', 'philippines_manila', 'australia_sydney'],
            startingUnits: [
                { type: 'infantry', tier: 'smg', hp: 60, maxHp: 60, level: 1 }
            ]
        },
        philippines_manila: {
            id: 'philippines_manila',
            name: 'Manila',
            regionName: 'Filipin Takımadaları',
            country: 'USA',
            cityX: 1665,
            cityY: 625,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 20,
            oil: 25,
            defense: 30,
            path: "M 1635,575 L 1705,575 L 1700,695 L 1630,690 Z",
            neighbors: ['china_shanghai', 'japan_osaka', 'southeast_asia', 'pacific_pearl'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 55, maxHp: 55, level: 2 }
            ]
        },
        pacific_midway: {
            id: 'pacific_midway',
            name: 'Midway Atolü',
            regionName: 'Merkez Pasifik Üssü',
            country: 'USA',
            cityX: 1885,
            cityY: 485,
            isCapital: false,
            cityLevel: 1,
            gold: 20,
            steel: 10,
            oil: 20,
            defense: 35,
            path: "M 1855,455 L 1925,455 L 1925,525 L 1855,525 Z",
            neighbors: ['japan_tokyo', 'pacific_pearl'],
            startingUnits: [
                { type: 'plane', tier: 'bomber', hp: 90, maxHp: 90, level: 2 }
            ]
        },
        pacific_pearl: {
            id: 'pacific_pearl',
            name: 'Pearl Harbor',
            regionName: 'Hawaii Donanma Karargahı',
            country: 'USA',
            cityX: 1915,
            cityY: 575,
            isCapital: false,
            cityLevel: 3,
            gold: 40,
            steel: 30,
            oil: 40,
            defense: 45,
            path: "M 1875,540 L 1955,540 L 1950,635 L 1870,630 Z",
            neighbors: ['pacific_midway', 'philippines_manila', 'usa_west'],
            startingUnits: [
                { type: 'plane', tier: 'fighter', hp: 100, maxHp: 100, level: 3 }, // P-51
                { type: 'tank', tier: 'medium', hp: 120, maxHp: 120, level: 2 }
            ]
        },
        australia_sydney: {
            id: 'australia_sydney',
            name: 'Sidney',
            regionName: 'Avustralya & Pasifik Savunması',
            country: 'UK',
            cityX: 1755,
            cityY: 865,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 35,
            oil: 20,
            defense: 30,
            path: "M 1680,780 L 1845,780 L 1830,945 L 1665,935 Z",
            neighbors: ['southeast_asia', 'pacific_pearl'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },

        // ==================== KUZEY & GÜNEY AMERİKA ====================
        usa_washington: {
            id: 'usa_washington',
            name: 'Washington D.C.',
            regionName: 'Atlantik Kıyısı & Başkent',
            country: 'USA',
            cityX: 385,
            cityY: 385,
            isCapital: true,
            cityLevel: 3,
            gold: 70,
            steel: 60,
            oil: 45,
            defense: 45,
            path: "M 345,345 L 425,345 L 420,435 L 340,430 Z",
            neighbors: ['usa_newyork', 'usa_midwest', 'usa_texas'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 135, maxHp: 135, level: 3 }, // Sherman
                { type: 'plane', tier: 'bomber', hp: 110, maxHp: 110, level: 3 } // B-17 Flying Fortress
            ]
        },
        usa_newyork: {
            id: 'usa_newyork',
            name: 'New York',
            regionName: 'Doğu Kıyısı & Finans Limanı',
            country: 'USA',
            cityX: 415,
            cityY: 320,
            isCapital: false,
            cityLevel: 3,
            gold: 65,
            steel: 50,
            oil: 30,
            defense: 40,
            path: "M 380,280 L 460,280 L 450,355 L 380,355 Z",
            neighbors: ['usa_washington', 'canada_ottawa', 'usa_midwest'],
            startingUnits: [
                { type: 'infantry', tier: 'smg', hp: 65, maxHp: 65, level: 2 } // Thompson
            ]
        },
        usa_midwest: {
            id: 'usa_midwest',
            name: 'Şikago / Detroit',
            regionName: 'Otomotiv & Tank Sanayisi',
            country: 'USA',
            cityX: 315,
            cityY: 335,
            isCapital: false,
            cityLevel: 3,
            gold: 55,
            steel: 75, // Huge steel production
            oil: 35,
            defense: 35,
            path: "M 270,290 L 365,290 L 360,380 L 265,375 Z",
            neighbors: ['usa_washington', 'usa_newyork', 'usa_west', 'usa_texas', 'canada_ottawa'],
            startingUnits: [
                { type: 'tank', tier: 'medium', hp: 130, maxHp: 130, level: 2 }
            ]
        },
        usa_texas: {
            id: 'usa_texas',
            name: 'Teksas / Houston',
            regionName: 'Meksika Körfezi & Petrol Havzası',
            country: 'USA',
            cityX: 295,
            cityY: 445,
            isCapital: false,
            cityLevel: 3,
            gold: 50,
            steel: 40,
            oil: 80, // Massive oil
            defense: 35,
            path: "M 245,400 L 345,400 L 335,490 L 235,485 Z",
            neighbors: ['usa_washington', 'usa_midwest', 'usa_west', 'brazil_rio'],
            startingUnits: [
                { type: 'infantry', tier: 'antitank', hp: 60, maxHp: 60, level: 2 } // Bazooka
            ]
        },
        usa_west: {
            id: 'usa_west',
            name: 'San Francisco',
            regionName: 'Kaliforniya & Pasifik Filosu',
            country: 'USA',
            cityX: 185,
            cityY: 375,
            isCapital: false,
            cityLevel: 3,
            gold: 55,
            steel: 50,
            oil: 40,
            defense: 40,
            path: "M 130,315 L 245,315 L 235,445 L 120,440 Z",
            neighbors: ['usa_midwest', 'usa_texas', 'pacific_pearl'],
            startingUnits: [
                { type: 'tank', tier: 'light', hp: 95, maxHp: 95, level: 2 }, // Stuart
                { type: 'plane', tier: 'fighter', hp: 95, maxHp: 95, level: 2 } // Mustang
            ]
        },
        canada_ottawa: {
            id: 'canada_ottawa',
            name: 'Ottawa',
            regionName: 'Kanada Konfederasyonu',
            country: 'UK', // Allies
            cityX: 385,
            cityY: 235,
            isCapital: false,
            cityLevel: 2,
            gold: 40,
            steel: 45,
            oil: 25,
            defense: 35,
            path: "M 290,170 L 475,170 L 465,275 L 285,270 Z",
            neighbors: ['usa_newyork', 'usa_midwest', 'uk_scotland'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        },
        brazil_rio: {
            id: 'brazil_rio',
            name: 'Rio de Janeiro',
            regionName: 'Güney Amerika & Müttefikler',
            country: 'USA',
            cityX: 475,
            cityY: 785,
            isCapital: false,
            cityLevel: 2,
            gold: 35,
            steel: 25,
            oil: 35,
            defense: 30,
            path: "M 410,695 L 545,695 L 530,885 L 395,875 Z",
            neighbors: ['usa_texas', 'algeria_algiers'],
            startingUnits: [
                { type: 'infantry', tier: 'rifle', hp: 50, maxHp: 50, level: 1 }
            ]
        }
    }
};

window.MapData = MapData;

