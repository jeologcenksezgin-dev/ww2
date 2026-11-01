// ===== DATA.JS — Game Data =====

const FACTIONS = {
  GER: {
    name: "Almanya", flag: "🇩🇪", color: "#6b6b6b",
    borderColor: "#888", secondaryColor: "#444",
    startProvinces: ["germany","austria","poland","france","netherlands","belgium","denmark","norway","czechoslovakia"],
    resources: 80, army: 200,
    description: "Blitzkrieg Gücü",
    leader: "Hitler",
    bonus: "Saldırı +15%",
    tanks: ["Panzer IV","Tiger","StuG III"],
    planes: ["GER_bf109","GER_Ju87","GER_He111"],
    weapons: ["GER_MP40","GER_Kar98","GER_StG44","GER_MG42"]
  },
  USSR: {
    name: "SSCB", flag: "🇷🇺", color: "#8b2222",
    borderColor: "#cc3333", secondaryColor: "#5a1111",
    startProvinces: ["ussr","ukraine","belorussia","estonia","latvia","lithuania","finland_south"],
    resources: 70, army: 250,
    description: "Kızıl Ordu",
    leader: "Stalin",
    bonus: "Savunma +20%",
    tanks: ["T-34","T-26","KV-1"],
    planes: ["USSR_Il2","USSR_La5","USSR_Lagg3"],
    weapons: ["USSR_PPSh41","USSR_Mosin","USSR_SVT40"]
  },
  USA: {
    name: "ABD", flag: "🇺🇸", color: "#1a3a8a",
    borderColor: "#2255cc", secondaryColor: "#0d2055",
    startProvinces: ["usa_east","usa_west","usa_south","canada","alaska"],
    resources: 100, army: 150,
    description: "Demokrasi Cephesi",
    leader: "Roosevelt",
    bonus: "Kaynak +25%",
    tanks: ["Sherman","Stuart","M10"],
    planes: ["US_p51","US_b17","US_p47"],
    weapons: ["US_Thompson","US_Garand","US_BAR"]
  },
  UK: {
    name: "İngiltere", flag: "🇬🇧", color: "#2b4a8a",
    borderColor: "#3355aa", secondaryColor: "#1a3055",
    startProvinces: ["uk","ireland","scotland","egypt","india","australia"],
    resources: 75, army: 160,
    description: "Britanya İmparatorluğu",
    leader: "Churchill",
    bonus: "Deniz Gücü +30%",
    tanks: ["Churchill","Matilda","Cromwell"],
    planes: ["UK_Spitfire","UK_Lancaster","UK_Beaufighter"],
    weapons: ["UK_Lee-Enfield","UK_Sten","UK_Bren"]
  },
  JAP: {
    name: "Japonya", flag: "🇯🇵", color: "#8b1a1a",
    borderColor: "#cc2222", secondaryColor: "#550d0d",
    startProvinces: ["japan","korea","manchuria","china_north","taiwan","indochina"],
    resources: 60, army: 180,
    description: "Japon İmparatorluğu",
    leader: "Hirohito",
    bonus: "Ada Savunması +35%",
    tanks: ["type 95","Chi-Ha"],
    planes: ["JAP_a6m","JAP_Ki21","JAP_Ki61"],
    weapons: ["JAP_Arisaka","JAP_Type100","JAP_Type97"]
  },
  ITA: {
    name: "İtalya", flag: "🇮🇹", color: "#2a7a2a",
    borderColor: "#3a9a3a", secondaryColor: "#1a4a1a",
    startProvinces: ["italy","libya","ethiopia","albania"],
    resources: 50, army: 120,
    description: "Roma İmparatorluğu",
    leader: "Mussolini",
    bonus: "Akdeniz Gücü +20%",
    tanks: ["Carro Armato","L3/35"],
    planes: ["Macchi C.202","Savoia-Marchetti"],
    weapons: ["Carcano","Beretta M38","Breda 30"]
  }
};

// Unit stats for battles
const TANK_STATS = {
  "Panzer IV": { attack:72, defense:60, speed:55, img:"assets/Panzer IV" },
  "Tiger":     { attack:92, defense:88, speed:35, img:"assets/Tiger" },
  "StuG III":  { attack:68, defense:75, speed:45, img:"assets/StuG III" },
  "T-34":      { attack:78, defense:70, speed:65, img:"assets/T-34" },
  "T-26":      { attack:55, defense:48, speed:60, img:"assets/T-26" },
  "KV-1":      { attack:70, defense:90, speed:30, img:"assets/KV-1" },
  "Sherman":   { attack:70, defense:65, speed:62, img:"assets/Sherman" },
  "Stuart":    { attack:52, defense:45, speed:80, img:"assets/Stuart" },
  "M10":       { attack:75, defense:50, speed:60, img:"assets/M10" },
  "Churchill": { attack:65, defense:88, speed:28, img:"assets/Churchill" },
  "Matilda":   { attack:58, defense:82, speed:30, img:"assets/Matilda" },
  "Cromwell":  { attack:70, defense:62, speed:75, img:"assets/Cromwell" },
  "type 95":   { attack:45, defense:40, speed:70, img:"assets/type 95" },
  "Chi-Ha":    { attack:55, defense:52, speed:55, img:"assets/Chi-Ha" },
  "Carro Armato": { attack:50, defense:45, speed:50, img:"assets/Carro Armato" },
  "L3/35":     { attack:35, defense:30, speed:65, img:"assets/L3/35" }
};

const PLANE_STATS = {
  "GER_bf109": { attack:80, range:70, speed:95, role:"Fighter" },
  "GER_Ju87":  { attack:88, range:60, speed:50, role:"Dive Bomber" },
  "GER_He111": { attack:72, range:85, speed:55, role:"Bomber" },
  "GER_FW190": { attack:85, range:72, speed:92, role:"Fighter" },
  "USSR_Il2":  { attack:82, range:65, speed:60, role:"Attack" },
  "USSR_La5":  { attack:78, range:68, speed:88, role:"Fighter" },
  "US_p51":    { attack:82, range:95, speed:90, role:"Fighter" },
  "US_b17":    { attack:90, range:100, speed:50, role:"Strategic Bomber" },
  "UK_Spitfire":{ attack:80, range:72, speed:92, role:"Fighter" },
  "UK_Lancaster":{ attack:88, range:95, speed:52, role:"Bomber" },
  "JAP_a6m":   { attack:75, range:90, speed:88, role:"Fighter" },
  "JAP_Ki21":  { attack:70, range:80, speed:60, role:"Bomber" },
};

const WEAPON_STATS = {
  "GER_MP40": { damage:38, accuracy:55, range:20, type:"SMG" },
  "GER_Kar98":{ damage:55, accuracy:75, range:60, type:"Rifle" },
  "GER_StG44":{ damage:45, accuracy:65, range:35, type:"Assault Rifle" },
  "GER_MG42": { damage:70, accuracy:60, range:40, type:"Machine Gun" },
  "US_Thompson":{ damage:42, accuracy:58, range:18, type:"SMG" },
  "US_Garand":{ damage:52, accuracy:72, range:55, type:"Rifle" },
  "UK_Lee-Enfield":{ damage:54, accuracy:74, range:58, type:"Rifle" },
  "UK_Sten":  { damage:36, accuracy:50, range:16, type:"SMG" },
  "USSR_PPSh41":{ damage:40, accuracy:52, range:22, type:"SMG" },
  "USSR_Mosin":{ damage:56, accuracy:70, range:60, type:"Rifle" },
  "JAP_Arisaka":{ damage:53, accuracy:68, range:55, type:"Rifle" },
  "JAP_Type100":{ damage:37, accuracy:54, range:18, type:"SMG" },
};

// Find tank image
function getTankImage(tankName, factionKey) {
  // Try to find the tank hull image from assets
  const tankMap = {
    "Tiger": "assets/ww2_top_view_hull13.png",
    "Panzer IV": "assets/ww2_top_view_hull4.png",
    "StuG III": "assets/ww2_top_view_hull6.png",
    "T-34": "assets/ww2_top_view_hull1.png",
    "T-26": "assets/ww2_top_view_hull12.png",
    "Sherman": "assets/ww2_top_view_hull2.png",
    "Stuart": "assets/ww2_top_view_hull10.png",
    "Churchill": "assets/ww2_top_view_hull3.png",
    "Matilda": "assets/ww2_top_view_hull5.png",
    "type 95": "assets/ww2_top_view_hull14.png",
  };
  return tankMap[tankName] || null;
}

function getPlaneImage(planeName) {
  return `assets/${planeName}.png`;
}

function getWeaponImage(weaponName) {
  return `assets/${weaponName}.png`;
}

