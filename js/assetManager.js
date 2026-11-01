// Asset Manager: Maps nations and unit archetypes to authentic sprites (Weapons, Tanks, Planes)
const AssetManager = {
    // Faction definitions
    nations: {
        TUR: {
            id: 'TUR',
            name: 'Türkiye',
            adjective: 'Türk',
            color: '#D32F2F',
            textColor: '#FFFFFF',
            flag: '🇹🇷',
            leader: 'İsmet İnönü / Atatürk Mirası',
            capital: 'turkey_ankara',
            trait: 'Bağımsız Savunma: Kendi topraklarında savunma +25%',
            tanks: {
                light: { name: 'T-26 Tank', folder: 'T-26' },
                medium: { name: 'Panzer IV (Türk Süvarisi)', folder: 'Panzer_4' },
                heavy: { name: 'Sherman M4A3', folder: 'Sherman' }
            },
            weapons: {
                rifle: { name: 'Türk Mauser Tüfeği', file: 'GER_Kar98.png' },
                smg: { name: 'MP40 Hafif Makineli', file: 'GER_MP40.png' },
                antitank: { name: 'Tanksavar Bataryası', file: 'GER_Panzerschreck.png' },
                heavy: { name: 'MG42 Makineli Tüfek', file: 'GER_MG42.png' }
            },
            planes: {
                fighter: { name: 'Spitfire Mk.V', file: 'UK_Spitfire.png' },
                bomber: { name: 'Blenheim Bombardıman', file: 'UK_Blenheim.png' }
            }
        },
        GER: {
            id: 'GER',
            name: 'Almanya',
            adjective: 'Alman',
            color: '#424242',
            textColor: '#FFD700',
            flag: '🇩🇪',
            leader: 'Wehrmacht Yüksek Komutası',
            capital: 'germany_berlin',
            trait: 'Blitzkrieg (Yıldırım Savaşı): Tank saldırı gücü +20%, Hareket +1',
            tanks: {
                light: { name: 'Panzer II/III', folder: 'Panzer_4' },
                medium: { name: 'Panzer IV Ausf. H', folder: 'Panzer_4' },
                heavy: { name: 'Tiger I Ağır Tank', folder: 'Tiger' },
                elite: { name: 'Panther Zırhlısı', folder: 'Panther' }
            },
            weapons: {
                rifle: { name: 'Karabiner 98k', file: 'GER_Kar98.png' },
                smg: { name: 'MP40 Schmeisser', file: 'GER_MP40.png' },
                antitank: { name: 'Panzerschreck', file: 'GER_Panzerschreck.png' },
                heavy: { name: 'MG42 "Hitler Testeresi"', file: 'GER_MG42.png' }
            },
            planes: {
                fighter: { name: 'Messerschmitt Bf 109', file: 'GER_bf109.png' },
                bomber: { name: 'Junkers Ju 87 Stuka', file: 'GER_Ju87.png' },
                heavyBomber: { name: 'Heinkel He 111', file: 'GER_He111.png' }
            }
        },
        USSR: {
            id: 'USSR',
            name: 'Sovyetler Birliği',
            adjective: 'Sovyet',
            color: '#B71C1C',
            textColor: '#FFEB3B',
            flag: '⭐',
            leader: 'Kızıl Ordu Komutanlığı',
            capital: 'ussr_moscow',
            trait: 'Büyük Vatanseverlik: Piyade ve tank üretim maliyeti -15%',
            tanks: {
                light: { name: 'T-26 Hafif Tank', folder: 'T-26' },
                medium: { name: 'T-34/85 Efsane Tank', folder: 'T-34' },
                heavy: { name: 'KV-1 Ağır Muharebe Tankı', folder: 'KV-1' }
            },
            weapons: {
                rifle: { name: 'Mosin-Nagant M91/30', file: 'USSR_Mosin_Nagant.png' },
                smg: { name: 'PPSh-41 Şpagin', file: 'USSR_PPSh.png' },
                antitank: { name: 'PTRS-41 Tanksavar', file: 'USSR_PTRS41.png' },
                heavy: { name: 'DP-28 Degtyaryov', file: 'USSR_DP28.png' }
            },
            planes: {
                fighter: { name: 'Lavochkin La-5', file: 'USSR_La5.png' },
                bomber: { name: 'İlyuşin Il-2 Şturmovik', file: 'USSR_Il2.png' },
                heavyBomber: { name: 'Tupolev Tu-2', file: 'USSR_Tu2.png' }
            }
        },
        USA: {
            id: 'USA',
            name: 'Amerika Birleşik Devletleri',
            adjective: 'Amerikan',
            color: '#1565C0',
            textColor: '#FFFFFF',
            flag: '🇺🇸',
            leader: 'Müttefik Seferi Kuvvetleri',
            capital: 'usa_washington',
            trait: 'Demokrasinin Cephaneliği: Tur başı Sanayi & Petrol geliri +30%',
            tanks: {
                light: { name: 'M3 Stuart', folder: 'Stuart' },
                medium: { name: 'M4 Sherman', folder: 'Sherman' },
                heavy: { name: 'M3 Lee Zırhlısı', folder: 'Lee' }
            },
            weapons: {
                rifle: { name: 'M1 Garand', file: 'US_M1_Garand.png' },
                smg: { name: 'Thompson Submachine Gun', file: 'US_Thompson.png' },
                antitank: { name: 'M1 Bazooka', file: 'US_Bazooka.png' },
                heavy: { name: 'M1918 BAR Otomatik Tüfek', file: 'US_BAR.png' }
            },
            planes: {
                fighter: { name: 'P-51 Mustang', file: 'US_p51.png' },
                bomber: { name: 'P-38 Lightning', file: 'US_p38.png' },
                heavyBomber: { name: 'B-17 Uçan Kale', file: 'US_b17.png' }
            }
        },
        UK: {
            id: 'UK',
            name: 'Büyük Britanya',
            adjective: 'İngiliz',
            color: '#6D4C41',
            textColor: '#FFFFFF',
            flag: '🇬🇧',
            leader: 'Kraliyet İmparatorluk Karargahı',
            capital: 'uk_london',
            trait: 'Denizlerin ve Göklerin Hakimi: Hava saldırısı menzili +1 bölge',
            tanks: {
                light: { name: 'Crusader Kruvazör Tankı', folder: 'Crusader' },
                medium: { name: 'Matilda II Piyade Tankı', folder: 'Matilda' },
                heavy: { name: 'Churchill Ağır Zırhlı', folder: 'Churchill' }
            },
            weapons: {
                rifle: { name: 'Lee-Enfield No. 4 Mk I', file: 'UK_Lee_Enfield.png' },
                smg: { name: 'Sten Mk II Hafif Makineli', file: 'UK_Sten.png' },
                antitank: { name: 'PIAT Tanksavar', file: 'UK_Piat.png' },
                heavy: { name: 'Bren Hafif Makineli Tüfek', file: 'UK_Bren.png' }
            },
            planes: {
                fighter: { name: 'Supermarine Spitfire', file: 'UK_Spitfire.png' },
                bomber: { name: 'Hawker Typhoon', file: 'UK_typhoon.png' },
                heavyBomber: { name: 'Avro Lancaster Ağır Bombardıman', file: 'UK_Lancaster.png' }
            }
        },
        JAP: {
            id: 'JAP',
            name: 'Japon İmparatorluğu',
            adjective: 'Japon',
            color: '#E65100',
            textColor: '#FFFFFF',
            flag: '🇯🇵',
            leader: 'İmparatorluk Genel Karargahı',
            capital: 'japan_honshu',
            trait: 'Samuray Ruhu (Bushido): Birlikler düşük canda +25% kritik vuruş yapar',
            tanks: {
                light: { name: 'Type 95 Ha-Go', folder: 'type_95' },
                medium: { name: 'Type 97 Chi-Ha', folder: 'type_95' },
                heavy: { name: 'Type 1 Chi-He', folder: 'type_95' }
            },
            weapons: {
                rifle: { name: 'Arisaka Type 38', file: 'JAP_Arisaka.png' },
                smg: { name: 'Type 100 Makineli', file: 'JAP_Type100.png' },
                antitank: { name: 'Type 97 Tanksavar Tüfeği', file: 'JAP_Type97.png' },
                heavy: { name: 'Type 99 Hafif Makineli', file: 'JAP_Type99.png' }
            },
            planes: {
                fighter: { name: 'Mitsubishi A6M Zero', file: 'JAP_a6m.png' },
                bomber: { name: 'Kawasaki Ki-45 Toryu', file: 'JAP_Ki45.png' },
                heavyBomber: { name: 'Mitsubishi Ki-21', file: 'JAP_Ki21.png' }
            }
        },
        ITA: {
            id: 'ITA',
            name: 'İtalya',
            adjective: 'İtalyan',
            color: '#2E7D32',
            textColor: '#FFFFFF',
            flag: '🇮🇹',
            leader: 'Regio Esercito Karargahı',
            capital: 'italy_rome',
            trait: 'Akdeniz Hakimiyeti: Kıyı bölgelerinde savunma bonusu',
            tanks: {
                light: { name: 'L6/40 Hafif Tank', folder: 'M13' },
                medium: { name: 'M13/40 Zırhlı Tank', folder: 'M13' },
                heavy: { name: 'P26/40 Ağır Zırhlı', folder: 'M13' }
            },
            weapons: {
                rifle: { name: 'Carcano M91 Tüfek', file: 'GER_Kar98.png' },
                smg: { name: 'Beretta M38', file: 'GER_MP40.png' },
                antitank: { name: 'Panzerschreck Destek', file: 'GER_Panzerschreck.png' },
                heavy: { name: 'Breda 30', file: 'GER_MG42.png' }
            },
            planes: {
                fighter: { name: 'Macchi C.202 Folgore', file: 'GER_bf109.png' },
                bomber: { name: 'Savoia-Marchetti SM.79', file: 'GER_Ju87.png' }
            }
        },
        FRA: {
            id: 'FRA',
            name: 'Fransa',
            adjective: 'Fransız',
            color: '#0288D1',
            textColor: '#FFFFFF',
            flag: '🇫🇷',
            leader: 'Özgür Fransa / Direniş',
            capital: 'france_north',
            trait: 'Maginot Savunması: Şehir tahkimatları düşman saldırısını %30 kırar',
            tanks: {
                light: { name: 'Renault R35', folder: 'Stuart' },
                medium: { name: 'Somua S35', folder: 'Crusader' },
                heavy: { name: 'Char B1 bis', folder: 'Churchill' }
            },
            weapons: {
                rifle: { name: 'MAS-36 Piyade Tüfeği', file: 'FRA_MAS36.png' },
                smg: { name: 'MAS-38 Hafif Makineli', file: 'UK_Sten.png' },
                antitank: { name: 'Boys Tanksavar Tüfeği', file: 'UK_BoysAT.png' },
                heavy: { name: 'Chauchat Makineli', file: 'FRA_Chauchat.png' }
            },
            planes: {
                fighter: { name: 'Dewoitine D.520', file: 'UK_Spitfire.png' },
                bomber: { name: 'Amiot 143 Bombardıman', file: 'UK_Blenheim.png' }
            }
        }
    },

    // Get weapon image url
    getWeaponUrl(filename) {
        return `game_assets/weapons/${filename}`;
    },

    // Get plane image url
    getPlaneUrl(filename) {
        return `game_assets/planes/${filename}`;
    },

    // Get tank hull and turret urls
    getTankUrls(folder) {
        return {
            hull: `game_assets/tanks/${folder}/hull.png`,
            turret: `game_assets/tanks/${folder}/turret.png`
        };
    },

    // Helper to get unit sprite data for any nation & unit type
    getUnitAsset(nationId, unitType, unitTier = 'medium') {
        const nation = this.nations[nationId] || this.nations['GER'];
        
        if (unitType === 'infantry') {
            const wInfo = nation.weapons[unitTier] || nation.weapons.rifle;
            return {
                type: 'infantry',
                name: wInfo.name,
                url: this.getWeaponUrl(wInfo.file),
                isTank: false,
                isPlane: false
            };
        } else if (unitType === 'tank') {
            const tInfo = nation.tanks[unitTier] || nation.tanks.medium;
            const urls = this.getTankUrls(tInfo.folder);
            return {
                type: 'tank',
                name: tInfo.name,
                hullUrl: urls.hull,
                turretUrl: urls.turret,
                isTank: true,
                isPlane: false
            };
        } else if (unitType === 'plane') {
            const pInfo = nation.planes[unitTier] || nation.planes.fighter;
            return {
                type: 'plane',
                name: pInfo.name,
                url: this.getPlaneUrl(pInfo.file),
                isTank: false,
                isPlane: true
            };
        }
        return null;
    }
};

window.AssetManager = AssetManager;

