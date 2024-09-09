import {
    BotModeDesire,
    Unit,
    UnitType,
    Vector,
    BotMode,
    BotScriptEnums,
    Team,
} from "../ts_libs/dota";
import {
    HasItem,
    GetLocationToLocationDistance,
    GetOffsetLocationTowardsTargetLocation,
    IsModeTurbo,
} from "../FunLib/utils";

const visionRad = 2000; //--假眼查重范围
const trueSightRad = 1000; //--真眼查重范围

const RADIANT_RUNE_WARD = Vector(2606, -1547, 0);

const RADIANT_T3TOPFALL = Vector(-6600.0, -3072.0, 0.0); //--高地防御眼
const RADIANT_T3MIDFALL = Vector(-4314.0, -3887.0, 0.0);
const RADIANT_T3BOTFALL = Vector(-3586.0, -6131.0, 0.0);

const RADIANT_T2TOPFALL = Vector(-4345, -1018, 663); //--二塔野区高台
const RADIANT_T2MIDFALL = Vector(1283, -5109, 655); //--天辉下路野区高台
const RADIANT_T2BOTFALL = Vector(-514, -3321, 655); //--下路野区内高台

const RADIANT_T1TOPFALL = Vector(-4089, 1544, 535); //--天辉上路野区高台
const RADIANT_T1MIDFALL = Vector(2818, -3047, 655); //--下方河道野区高台
const RADIANT_T1BOTFALL = Vector(5253, -4844, 0); //--下路野区十字路口

const RADIANT_MANDATE1 = Vector(-1243, -200, 0); //---天辉中路河道眼
const RADIANT_MANDATE2 = RADIANT_RUNE_WARD; //---天辉看符眼

//---DIRE WARDING SPOT
const DIRE_RUNE_WARD = Vector(2606, -1547, 0);

const DIRE_T3TOPFALL = Vector(3087.0, 5690.0, 0.0);
const DIRE_T3MIDFALL = Vector(4024.0, 3445.0, 0.0);
const DIRE_T3BOTFALL = Vector(6354.0, 2606.0, 0.0);

const DIRE_T2TOPFALL = Vector(514, 4107, 655); //--夜魇上路野区高台
const DIRE_T2MIDFALL = Vector(2047, -769, 655); //--夜魇中路河道野区入口
const DIRE_T2BOTFALL = Vector(4620, 788, 655); //--夜魇下路高台

const DIRE_T1TOPFALL = Vector(-2815, 3565, 256); //--夜魇上路野区河道路口
const DIRE_T1MIDFALL = Vector(-760, 2053, 655); //--夜魇中路一塔野区入口高台
const DIRE_T1BOTFALL = Vector(5122, -1930, 527); //--夜魇下路一塔高台

const DIRE_MANDATE1 = DIRE_RUNE_WARD; //--夜魇看符眼
const DIRE_MANDATE2 = Vector(-463, 447, 0); //--夜魇中路河道眼

const RADIANT_AGGRESSIVETOP = DIRE_T2TOPFALL; //--夜魇上路野区高台
const RADIANT_AGGRESSIVEMID1 = DIRE_T1MIDFALL; //--夜魇中路一塔野区入口高台
const RADIANT_AGGRESSIVEMID2 = DIRE_T2MIDFALL; //--夜魇中路河道野区入口
const RADIANT_AGGRESSIVEBOT = DIRE_T2BOTFALL; //--夜魇下路高台

const DIRE_AGGRESSIVETOP = RADIANT_T1TOPFALL; //--天辉上路野区高台
const DIRE_AGGRESSIVEMID1 = RADIANT_T2TOPFALL; //--天辉二塔野区高台
const DIRE_AGGRESSIVEMID2 = RADIANT_T2MIDFALL; //--天辉下路野区高台
const DIRE_AGGRESSIVEBOT = RADIANT_T2BOTFALL; //--天辉下路野区内高台

const WardSpotTowerFallRadiant = [
    RADIANT_T1TOPFALL,
    RADIANT_T1MIDFALL,
    RADIANT_T1BOTFALL,
    RADIANT_T2TOPFALL,
    RADIANT_T2MIDFALL,
    RADIANT_T2BOTFALL,
    RADIANT_T3TOPFALL,
    RADIANT_T3MIDFALL,
    RADIANT_T3BOTFALL,
];

const WardSpotTowerFallDire = [
    DIRE_T1TOPFALL,
    DIRE_T1MIDFALL,
    DIRE_T1BOTFALL,
    DIRE_T2TOPFALL,
    DIRE_T2MIDFALL,
    DIRE_T2BOTFALL,
    DIRE_T3TOPFALL,
    DIRE_T3MIDFALL,
    DIRE_T3BOTFALL,
];

const CStackLoc = [
    Vector(1854, -4469, 0),
    Vector(1249, -2416, 0),
    Vector(3471, -5841, 0),
    Vector(5153, -3620, 0),
    Vector(-1846, -2996, 0),
    Vector(-4961, 559, 0),
    Vector(-3873, -833, 0),
    Vector(-3146, 702, 0),
    Vector(1141, -3111, 0),
    Vector(660, 2300, 0),
    Vector(3666, 1836, 0),
    Vector(482, 4723, 0),
    Vector(3173, -861, 0),
    Vector(-3443, 6098, 0),
    Vector(-4353, 4842, 0),
    Vector(-1083, 3385, 0),
    Vector(-922, 4299, 0),
    Vector(4136, -1753, 0),
];

let nWatchTower_1: Unit | null = null;
let nWatchTower_2: Unit | null = null;

const allUnitList = GetUnitList(UnitType.All);

for (const v of allUnitList) {
    if (
        v.GetUnitName() === "#DOTA_OutpostName_North" ||
        v.GetUnitName() === "#DOTA_OutpostName_South"
    ) {
        if (nWatchTower_1 === null) {
            nWatchTower_1 = v;
        } else {
            nWatchTower_2 = v;
        }
    }
}

export const nWatchTowerList = [nWatchTower_1, nWatchTower_2];

export const nTowerList = [
    BotScriptEnums.TOWER_TOP_1,
    BotScriptEnums.TOWER_MID_1,
    BotScriptEnums.TOWER_BOT_1,
    BotScriptEnums.TOWER_TOP_2,
    BotScriptEnums.TOWER_MID_2,
    BotScriptEnums.TOWER_BOT_2,
    BotScriptEnums.TOWER_TOP_3,
    BotScriptEnums.TOWER_MID_3,
    BotScriptEnums.TOWER_BOT_3,
    BotScriptEnums.TOWER_BASE_1,
    BotScriptEnums.TOWER_BASE_2,
];

export const nRuneList = [
    BotScriptEnums.RUNE_POWERUP_1, //--上
    BotScriptEnums.RUNE_POWERUP_2, //--下
    BotScriptEnums.RUNE_BOUNTY_1, //--天辉上  --天辉神秘符
    BotScriptEnums.RUNE_BOUNTY_2, //--夜魇下  --天辉优势路符
    // RUNE_BOUNTY_3, 	--天辉下 --夜魇神秘符
    // RUNE_BOUNTY_4, 	--夜魇上 --夜魇优势路符
];

export const nShopList = [
    BotScriptEnums.SHOP_HOME, //--家里商店
    BotScriptEnums.SHOP_SIDE, //--天辉下路商店
    BotScriptEnums.SHOP_SIDE2, //--夜魇上路商店
    BotScriptEnums.SHOP_SECRET, //--天辉上路神秘
    BotScriptEnums.SHOP_SECRET2, //--夜魇下路神秘
];

export const top_power_rune = Vector(-1767, 1233, 0);
export const bot_power_rune = Vector(2597, -2014, 0);

export const roshan = Vector(-2862, 2260, 0);

export const dire_ancient = Vector(5517, 4981, 0);
export const radiant_ancient = Vector(-5860, -5328, 0);

export const radiant_base = Vector(-7200, -6666, 0);
export const dire_base = Vector(7137, 6548, 0);

export const GetDistance = function (s: Vector, t: Vector): number {
    return GetLocationToLocationDistance(s, t);
};

export const GetXUnitsTowardsLocation = function (
    hUnit: Unit,
    vLocation: Vector,
    nDistance: number
): Vector {
    return GetOffsetLocationTowardsTargetLocation(
        hUnit.GetLocation(),
        vLocation,
        nDistance
    );
};

export const GetNearestWatchTower = function (bot: Unit): Unit | null {
    if (
        GetUnitToUnitDistance(bot, nWatchTower_1!) <
        GetUnitToUnitDistance(bot, nWatchTower_2!)
    ) {
        return nWatchTower_1;
    }
    return nWatchTower_2;
};

export const GetAllWatchTower = function (): Array<Unit | null> {
    return nWatchTowerList;
};

export const GetMandatorySpot = function (): Vector[] {
    const MandatorySpotRadiant = [RADIANT_MANDATE1, RADIANT_MANDATE2];
    const MandatorySpotDire = [DIRE_MANDATE1, DIRE_MANDATE2];

    // 2分钟前只插中路线眼
    if (DotaTime() < 2 * 60) {
        return GetTeam() == Team.Radiant ? [RADIANT_MANDATE1] : [DIRE_MANDATE2];
    }

    // 12分钟后加入一塔眼
    if (DotaTime() > 12 * 60) {
        return GetTeam() == Team.Radiant
            ? [
                  RADIANT_MANDATE1,
                  RADIANT_MANDATE2,
                  RADIANT_T1TOPFALL,
                  RADIANT_T1MIDFALL,
                  RADIANT_T1BOTFALL,
              ]
            : [
                  DIRE_MANDATE1,
                  DIRE_MANDATE2,
                  DIRE_T1TOPFALL,
                  DIRE_T1MIDFALL,
                  DIRE_T1BOTFALL,
              ];
    }

    return GetTeam() == Team.Radiant ? MandatorySpotRadiant : MandatorySpotDire;
};
export const GetWardSpotWhenTowerFall = function (): Vector[] {
    const wardSpot: Vector[] = [];
    for (let i = 0; i < nTowerList.length; i++) {
        const tower = GetTower(GetTeam(), nTowerList[i]);
        if (!tower) {
            wardSpot.push(
                GetTeam() == Team.Radiant
                    ? WardSpotTowerFallRadiant[i]
                    : WardSpotTowerFallDire[i]
            );
        }
    }
    return wardSpot;
};
export const GetAggressiveSpot = function (): Vector[] {
    const AggressiveDire = [
        DIRE_AGGRESSIVETOP,
        DIRE_AGGRESSIVEMID1,
        DIRE_AGGRESSIVEMID2,
        DIRE_AGGRESSIVEBOT,
    ];
    const AggressiveRadiant = [
        RADIANT_AGGRESSIVETOP,
        RADIANT_AGGRESSIVEMID1,
        RADIANT_AGGRESSIVEMID2,
        RADIANT_AGGRESSIVEBOT,
    ];

    return GetTeam() === Team.Radiant ? AggressiveRadiant : AggressiveDire;
};

export const GetItemWard = function (bot: Unit): any | null {
    for (let i = 0; i < 9; i++) {
        const item = bot.GetItemInSlot(i);
        if (
            item &&
            (item.GetName() === "item_ward_observer" ||
                item.GetName() === "item_ward_sentry" ||
                item.GetName() === "item_ward_dispenser")
        ) {
            return item;
        }
    }
    return null;
};

export const GetAvailableSpot = function (bot: Unit): Vector[] {
    const temp: Vector[] = [];

    // 先算必插眼位
    if (DotaTime() < 38 * 60) {
        GetMandatorySpot().forEach((s: any) => {
            if (!IsCloseToAvailableWard(s)) {
                temp.push(s);
            }
        });
    }

    // 再算丢塔后的防御眼位
    GetWardSpotWhenTowerFall().forEach((s: any) => {
        if (!IsCloseToAvailableWard(s)) {
            temp.push(s);
        }
    });

    // 10分钟后计算进攻眼位
    if (DotaTime() > 10 * 60) {
        GetAggressiveSpot().forEach((s: any) => {
            if (
                GetUnitToLocationDistance(bot, s) <= 1200 &&
                !IsCloseToAvailableWard(s)
            ) {
                temp.push(s);
            }
        });
    }

    return temp;
};

export const IsCloseToAvailableWard = function (wardLoc: Vector): boolean {
    const WardList = GetUnitList(UnitType.AlliedWards);
    for (const ward of WardList) {
        if (
            IsObserver(ward) &&
            GetUnitToLocationDistance(ward, wardLoc) <= visionRad
        ) {
            return true;
        }
    }
    return false;
};

export const IsLocationHaveTrueSight = function (vLocation: Vector): boolean {
    const WardList = GetUnitList(UnitType.AlliedWards);
    for (const ward of WardList) {
        if (
            IsSentry(ward) &&
            GetUnitToLocationDistance(ward, vLocation) <= trueSightRad
        ) {
            return true;
        }
    }

    const nearbyTowers = GetBot().GetNearbyTowers(1600, false);
    for (const tower of nearbyTowers) {
        if (GetUnitToLocationDistance(tower, vLocation) < trueSightRad) {
            return true;
        }
    }
    return false;
};

export const GetClosestSpot = function (
    bot: Unit,
    spotList: Vector[]
): LuaMultiReturn<[Vector | null, number]> {
    let closestSpot: Vector | null = null;
    let closestDist = 100000;

    for (const spot of spotList) {
        const dist = GetUnitToLocationDistance(bot, spot);
        if (dist < closestDist) {
            closestDist = dist;
            closestSpot = spot;
        }
    }

    return $multi(closestSpot, closestDist);
};
export const IsObserver = function (ward: Unit): boolean {
    return ward.GetUnitName() === "npc_dota_observer_wards";
};

export const IsSentry = function (ward: Unit): boolean {
    return ward.GetUnitName() === "npc_dota_sentry_wards";
};

export const GetCampMoveToStack = function (id: number): Vector {
    return CStackLoc[id];
};

export const GetCampStackTime = function (camp: any): number {
    if (camp.cattr.speed === "fast") {
        return 56;
    } else if (camp.cattr.speed === "slow") {
        return 55;
    }
    return 56;
};
export const IsEnemyCamp = function (camp: any): boolean {
    return camp.team !== GetTeam();
};

export const IsAncientCamp = function (camp: any): boolean {
    return camp.type === "ancient";
};

export const IsSmallCamp = function (camp: any): boolean {
    return camp.type === "small";
};

export const IsMediumCamp = function (camp: any): boolean {
    return camp.type === "medium";
};

export const IsLargeCamp = function (camp: any): boolean {
    return camp.type === "large";
};

export const RefreshCamp = function (
    bot: Unit
): LuaMultiReturn<[any[], number]> {
    const camps = GetNeutralSpawners();
    const allCampList: any[] = [];
    let totalSum = 0;
    let count = 0;

    for (const id of GetTeamPlayers(GetTeam())) {
        totalSum += GetHeroLevel(id);
        count += 1;
    }
    const averageLevel = totalSum / count;

    for (const aCamp of Object.values(camps)) {
        const camp = aCamp as any;
        if (
            (averageLevel <= 7 || bot.GetAttackDamage() <= 80) &&
            !IsEnemyCamp(camp) &&
            !IsLargeCamp(camp) &&
            !IsAncientCamp(camp)
        ) {
            allCampList.push({ idx: camp.idx, cattr: camp });
        } else if (
            averageLevel <= 11 &&
            !IsEnemyCamp(camp) &&
            !IsAncientCamp(camp)
        ) {
            allCampList.push({ idx: camp.idx, cattr: camp });
        } else if (averageLevel <= 14 && !IsEnemyCamp(camp)) {
            allCampList.push({ idx: camp.idx, cattr: camp });
        } else {
            allCampList.push({ idx: camp.idx, cattr: camp });
        }
    }

    return $multi(allCampList, allCampList.length);
};
export const GetPosition = function (bot: Unit): number {
    if (bot["assignedRole"]) {
        return bot["assignedRole"];
    }
    return 1;
};
export const IsSpecialFarmer = function (bot: Unit): boolean {
    return GetPosition(bot) === 1;
};
export const IsShouldFarmHero = function (bot: Unit): boolean {
    return GetPosition(bot) <= 1;
};
export const IsValidCreep = function (nUnit: Unit | undefined): boolean {
    return (
        nUnit !== undefined &&
        nUnit.IsAlive() &&
        nUnit.GetHealth() < 5000 &&
        (GetBot().GetLevel() > 9 || !nUnit.IsAncientCreep())
    );
};
export const HasArmorReduction = function (nUnit: Unit): boolean {
    return (
        nUnit.HasModifier("modifier_templar_assassin_meld_armor") ||
        nUnit.HasModifier(
            "modifier_item_medallion_of_courage_armor_reduction"
        ) ||
        nUnit.HasModifier("modifier_item_solar_crest_armor_reduction") ||
        nUnit.HasModifier("modifier_slardar_amplify_damage")
    );
};
export const GetClosestNeutralSpwan = function (
    bot: Unit,
    availableCampList: any[]
): any | null {
    let minDist = 15000;
    let closestCamp: any | null = null;

    for (const camp of availableCampList) {
        let dist = GetUnitToLocationDistance(bot, camp.cattr.location);
        if (IsEnemyCamp(camp)) dist *= 1.5;

        if (
            IsTheClosestOne(bot, camp.cattr.location) &&
            dist < minDist &&
            (bot.GetLevel() >= 10 || !IsAncientCamp(camp))
        ) {
            minDist = dist;
            closestCamp = camp;
        }
    }

    return closestCamp;
};

export const IsTheClosestOne = function (bot: Unit, loc: Vector): boolean {
    let minDist = GetUnitToLocationDistance(bot, loc);
    let closestMember = bot;

    for (const id of GetTeamPlayers(GetTeam())) {
        const member = GetTeamMember(id);
        if (
            member &&
            member.IsAlive() &&
            member.GetActiveMode() === BotMode.Farm
        ) {
            const memberDist = GetUnitToLocationDistance(member, loc);
            if (memberDist < minDist) {
                minDist = memberDist;
                closestMember = member;
            }
        }
    }

    return closestMember === bot;
};

export const GetNearestCreep = function (creepList: Unit[]): Unit | null {
    if (IsValidCreep(creepList[0])) {
        return creepList[0];
    }
    return null;
};

export const GetMaxHPCreep = function (creepList: Unit[]): Unit | null {
    let maxHP = 0;
    let targetCreep: Unit | null = null;

    for (const creep of creepList) {
        if (!creep.IsNull() && HasArmorReduction(creep)) {
            return creep;
        }

        if (IsValidCreep(creep) && creep.GetHealth() > maxHP) {
            maxHP = creep.GetHealth();
            targetCreep = creep;
        }
    }

    return targetCreep;
};

export const GetMinHPCreep = function (creepList: Unit[]): Unit | null {
    let minHP = 4000;
    let targetCreep: Unit | null = null;

    for (const creep of creepList) {
        if (!creep.IsNull() && HasArmorReduction(creep)) {
            return creep;
        }

        if (IsValidCreep(creep) && creep.GetHealth() < minHP) {
            minHP = creep.GetHealth();
            targetCreep = creep;
        }
    }

    return targetCreep;
};

export const FindFarmNeutralTarget = function (creepList: Unit[]): Unit | null {
    const bot = GetBot();
    const botName = bot.GetUnitName();
    let targetCreep: Unit | null = null;

    if (ConsiderFarmNeutralType[botName] !== undefined) {
        const farmType = ConsiderFarmNeutralType[botName]();
        if (farmType === "nearest") {
            targetCreep = GetNearestCreep(creepList);
        } else if (farmType === "maxHP") {
            targetCreep = GetMaxHPCreep(creepList);
        } else {
            targetCreep = GetMinHPCreep(creepList);
        }
    }

    if (
        HasItem(bot, "item_bfury") ||
        HasItem(bot, "item_maelstrom") ||
        HasItem(bot, "item_mjollnir") ||
        HasItem(bot, "item_radiance")
    ) {
        targetCreep = GetMaxHPCreep(creepList);
    }

    return targetCreep || GetMinHPCreep(creepList);
};

export const ConsiderFarmNeutralType = {
    npc_dota_hero_templar_assassin: () => "nearest",
    npc_dota_hero_sven: () => "nearest",
    npc_dota_hero_drow_ranger: () => "nearest",
    npc_dota_hero_phantom_lancer: () => "nearest",
    npc_dota_hero_naga_siren: () => "maxHP",
    npc_dota_hero_viper: () => "maxHP",
    npc_dota_hero_huskar: () => "maxHP",
    npc_dota_hero_phantom_assassin: () => {
        const bot = GetBot();
        return HasItem(bot, "item_bfury") ? "nearest" : "minHP";
    },
    npc_dota_hero_medusa: () => {
        const bot = GetBot();
        const farmAbility = bot.GetAbilityByName("medusa_split_shot");
        return farmAbility.IsTrained() ? "maxHP" : "minHP";
    },
    npc_dota_hero_luna: () => {
        const bot = GetBot();
        const farmAbility = bot.GetAbilityByName("luna_moon_glaive");
        return farmAbility.IsTrained() ? "maxHP" : "minHP";
    },
    npc_dota_hero_tidehunter: () => {
        const bot = GetBot();
        const farmAbility = bot.GetAbilityByName("tidehunter_anchor_smash");
        const ultimateAbility = bot.GetAbilityByName("tidehunter_ravage");

        if (
            farmAbility.IsTrained() &&
            ultimateAbility.IsTrained() &&
            bot.GetMana() > ultimateAbility.GetManaCost() + 200
        ) {
            return "maxHP";
        }

        return "minHP";
    },
    npc_dota_hero_nevermore: () => {
        const bot = GetBot();
        return bot.GetMana() > 200 && bot.GetLevel() >= 13 ? "maxHP" : "minHP";
    },
    npc_dota_hero_dragon_knight: () => {
        return GetBot().GetAttackRange() > 330 ? "maxHP" : "minHP";
    },
} as { [key: string]: () => string };

export const GetFarmLaneTarget = function (creepList: Unit[]): Unit | null {
    const bot = GetBot();
    const botName = bot.GetUnitName();
    let targetCreep: Unit | null = null;

    const nearbyAllies = bot.GetNearbyLaneCreeps(1000, false);

    if (botName !== "npc_dota_hero_medusa" && nearbyAllies.length > 0) {
        targetCreep = GetNearestCreep(creepList);
    }

    if (botName === "npc_dota_hero_medusa") {
        targetCreep = GetMinHPCreep(creepList);
    }

    return targetCreep || GetMaxHPCreep(creepList);
};

export const IsSuitableFarmMode = function (mode: number): boolean {
    return (
        mode !== BotMode.Rune &&
        mode !== BotMode.Attack &&
        mode !== BotMode.SecretShop &&
        mode !== BotMode.SideShop &&
        mode !== BotMode.DefendAlly &&
        mode !== BotMode.EvasiveManeuvers
    );
};
export const IsModeSuitableToFarm = function (bot: Unit): boolean {
    const mode = bot.GetActiveMode();
    const botLevel = bot.GetLevel();

    if (
        botLevel <= 8 &&
        (mode === BotMode.PushTowerTop ||
            mode === BotMode.PushTowerMid ||
            mode === BotMode.PushTowerBot ||
            mode === BotMode.Laning)
    ) {
        const enemyAncient = GetAncient(GetOpposingTeam());
        if (GetUnitToUnitDistance(bot, enemyAncient) > 6300) {
            return false;
        }
    }

    if (
        IsSpecialFarmer(bot) &&
        botLevel >= 8 &&
        botLevel <= 24 &&
        IsSuitableFarmMode(mode) &&
        mode != BotMode.Roshan &&
        mode != BotMode.TeamRoam &&
        mode != BotMode.Laning &&
        mode != BotMode.Ward
    ) {
        return true;
    }

    if (
        IsSuitableFarmMode(mode) &&
        mode !== BotMode.Ward && // BOT_MODE_WARD
        mode !== BotMode.Laning && // BOT_MODE_LANING
        mode !== BotMode.DefendTowerTop && // BOT_MODE_DEFEND_TOWER_TOP
        mode !== BotMode.DefendTowerMid && // BOT_MODE_DEFEND_TOWER_MID
        mode !== BotMode.DefendTowerBot && // BOT_MODE_DEFEND_TOWER_BOT
        mode !== BotMode.Assemble && // BOT_MODE_ASSEMBLE
        mode !== BotMode.TeamRoam && // BOT_MODE_TEAM_ROAM
        mode !== BotMode.Roshan && // BOT_MODE_ROSHAN
        botLevel >= 8
    ) {
        return true;
    }

    return false;
};

export const IsTimeToFarm = function (bot: Unit): boolean {
    if (DotaTime() < 5 * 60 || DotaTime() > 90 * 60) {
        return false;
    }

    const botName = bot.GetUnitName();

    if (
        bot.GetActiveMode() === BotMode.PushTowerTop ||
        bot.GetActiveMode() === BotMode.PushTowerMid ||
        bot.GetActiveMode() === BotMode.PushTowerBot
    ) {
        const enemyAncient = GetAncient(GetOpposingTeam());
        const allyList = bot.GetNearbyHeroes(1400, false, BotMode.None);
        const enemyAncientDistance = GetUnitToUnitDistance(bot, enemyAncient);
        if (
            enemyAncientDistance < 2800 &&
            enemyAncientDistance > 1400 &&
            bot.GetActiveModeDesire() < BotModeDesire.High &&
            allyList.length <= 1
        ) {
            return true;
        }

        if (IsShouldFarmHero(bot)) {
            if (
                bot.GetActiveModeDesire() < BotModeDesire.Moderate &&
                enemyAncientDistance > 1600 &&
                enemyAncientDistance < 5600 &&
                allyList.length <= 1
            ) {
                return true;
            }
        }
    }

    if (
        ConsiderIsTimeToFarm[botName] !== undefined &&
        ConsiderIsTimeToFarm[botName]()
    ) {
        return true;
    }

    return false;
};

// --根据地点来刷新阵营
export const UpdateAvailableCamp = function (
    bot: Unit,
    preferredCamp: any,
    availableCampList: any[]
): LuaMultiReturn<[any[], any | null]> {
    if (preferredCamp !== null) {
        for (let i = 0; i < availableCampList.length; i++) {
            if (
                availableCampList[i].cattr.location ===
                    preferredCamp.cattr.location ||
                GetUnitToLocationDistance(
                    bot,
                    availableCampList[i].cattr.location
                ) < 500
            ) {
                availableCampList.splice(i, 1);
                return $multi(availableCampList, null);
            }
        }
    }
    return $multi(availableCampList, null);
};

// --根据生物来刷新阵营
let lastCreep: Unit | null = null;
export const UpdateCommonCamp = function (
    creep: Unit,
    availableCampList: any[]
): any[] {
    if (lastCreep !== creep) {
        lastCreep = creep;
        for (let i = 0; i < availableCampList.length; i++) {
            if (
                GetUnitToLocationDistance(
                    creep,
                    availableCampList[i].cattr.location
                ) < 500
            ) {
                availableCampList.splice(i, 1);
                return availableCampList;
            }
        }
    }
    return availableCampList;
};

export const GetAroundAllyCount = function (
    bot: Unit,
    nRadius: number
): number {
    let nCount = 0;
    for (let i = 1; i <= 5; i++) {
        const member = GetTeamMember(i);
        if (
            member &&
            member.IsAlive() &&
            GetUnitToUnitDistance(bot, member) <= nRadius
        ) {
            nCount += 1;
        }
    }
    return nCount;
};

export const IsInLaningPhase = function (): boolean {
    return (IsModeTurbo() && DotaTime() < 8 * 60) || DotaTime() < 12 * 60;
};

// Hero-specific farm considerations
export const ConsiderIsTimeToFarm = {
    // ... (implementations for other heroes)
} as { [key: string]: () => boolean };

ConsiderIsTimeToFarm["npc_dota_hero_luna"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();
    const currentTime = DotaTime();

    if (currentTime > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 23000)) {
        return true;
    }

    if (!HasItem(bot, "item_black_king_bar") && botNetWorth < 18000) {
        return true;
    }

    if (!HasItem(bot, "item_satanic") && botNetWorth < 28000) {
        if (GetAroundAllyCount(bot, 1200) <= 2) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_luna"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();
    const currentTime = DotaTime();

    if (currentTime > 15 * 60 && (bot.GetLevel() < 25 || botNetWorth < 22000)) {
        return true;
    }

    if (
        HasItem(bot, "item_gloves") &&
        !HasItem(bot, "item_hand_of_midas") &&
        bot.GetGold() > 800
    ) {
        return true;
    }

    if (
        HasItem(bot, "item_yasha") &&
        !HasItem(bot, "item_manta") &&
        bot.GetGold() > 1000
    ) {
        return true;
    }

    if (
        HasItem(bot, "item_hand_of_midas") &&
        GetAroundAllyCount(bot, 1200) <= 3 &&
        botNetWorth <= 26000
    ) {
        return true;
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_axe"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 7 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_echo_sabre") && botNetWorth < 12000) {
        return true;
    }

    if (!HasItem(bot, "item_heart") && botNetWorth < 21000) {
        if (GetAroundAllyCount(bot, 1100) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_bloodseeker"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 22000)) {
        return true;
    }

    if (!HasItem(bot, "item_black_king_bar") && botNetWorth < 16000) {
        return true;
    }

    if (!HasItem(bot, "item_abyssal_blade") && botNetWorth < 26000) {
        if (GetAroundAllyCount(bot, 1200) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_bristleback"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    const botKills = GetHeroKills(bot.GetPlayerID());
    const botDeaths = GetHeroDeaths(bot.GetPlayerID());
    const allyCount = GetAroundAllyCount(bot, 1200);

    if (botKills >= botDeaths + 4 && botDeaths <= 3) {
        return false;
    }

    if (bot.GetLevel() >= 10 && allyCount <= 2 && botNetWorth < 15000) {
        return true;
    }

    if (bot.GetLevel() >= 20 && allyCount <= 1 && botNetWorth < 21000) {
        return true;
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_chaos_knight"] =
    ConsiderIsTimeToFarm["npc_dota_hero_bristleback"];

ConsiderIsTimeToFarm["npc_dota_hero_clinkz"] =
    ConsiderIsTimeToFarm["npc_dota_hero_templar_assassin"];

ConsiderIsTimeToFarm["npc_dota_hero_dragon_knight"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (!HasItem(bot, "item_assault") && botNetWorth < 22000) {
        const allyCount = GetAroundAllyCount(bot, 1200);
        if (bot.GetAttackRange() > 300 && allyCount <= 2) {
            return true;
        }

        if (
            bot.GetMana() > 450 &&
            bot.GetCurrentVisionRange() < 1000 &&
            allyCount < 2
        ) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_drow_ranger"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (bot.GetLevel() >= 6 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (HasItem(bot, "item_mask_of_madness") && botNetWorth < 9999) {
        return true;
    }

    if (
        HasItem(bot, "item_blade_of_alacrity") &&
        !HasItem(bot, "item_ultimate_scepter")
    ) {
        return true;
    }

    if (
        HasItem(bot, "item_shadow_amulet") &&
        !HasItem(bot, "item_invis_sword") &&
        bot.GetGold() > 400
    ) {
        return true;
    }

    if (
        HasItem(bot, "item_yasha") &&
        !HasItem(bot, "item_manta") &&
        bot.GetGold() > 1000
    ) {
        return true;
    }

    if (HasItem(bot, "item_ultimate_scepter") && botNetWorth < 23000) {
        if (GetAroundAllyCount(bot, 1100) <= 2) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_huskar"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_hurricane_pike") && botNetWorth < 18000) {
        return true;
    }

    if (!HasItem(bot, "item_black_king_bar") && botNetWorth < 26000) {
        if (GetAroundAllyCount(bot, 1100) < 2) {
            return true;
        }
    }

    if (bot.GetLevel() > 20 && botNetWorth < 23333) {
        if (GetAroundAllyCount(bot, 1100) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_juggernaut"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_black_king_bar") && botNetWorth < 20000) {
        if (GetAroundAllyCount(bot, 1100) <= 2) {
            return true;
        }
    }

    if (!HasItem(bot, "item_satanic") && botNetWorth < 24000) {
        if (GetAroundAllyCount(bot, 1000) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_kunkka"] =
    ConsiderIsTimeToFarm["npc_dota_hero_bristleback"];

ConsiderIsTimeToFarm["npc_dota_hero_luna"] =
    ConsiderIsTimeToFarm["npc_dota_hero_huskar"];

ConsiderIsTimeToFarm["npc_dota_hero_mirana"] =
    ConsiderIsTimeToFarm["npc_dota_hero_templar_assassin"];

ConsiderIsTimeToFarm["npc_dota_hero_medusa"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_black_king_bar") && botNetWorth < 16000) {
        return true;
    }

    if (!HasItem(bot, "item_satanic") && botNetWorth < 28000) {
        if (GetAroundAllyCount(bot, 1100) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_nevermore"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 22000)) {
        return true;
    }

    if (!HasItem(bot, "item_skadi") && botNetWorth < 16000) {
        return true;
    }

    if (!HasItem(bot, "item_sphere") && botNetWorth < 28000) {
        if (GetAroundAllyCount(bot, 1100) <= 2) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_omniknight"] =
    ConsiderIsTimeToFarm["npc_dota_hero_bristleback"];

ConsiderIsTimeToFarm["npc_dota_hero_ogre_magi"] =
    ConsiderIsTimeToFarm["npc_dota_hero_bristleback"];

ConsiderIsTimeToFarm["npc_dota_hero_phantom_assassin"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_desolator") && botNetWorth < 16000) {
        return true;
    }

    if (!HasItem(bot, "item_black_king_bar") && botNetWorth < 24000) {
        if (GetAroundAllyCount(bot, 1000) <= 2) {
            return true;
        }
    }

    if (!HasItem(bot, "item_satanic") && botNetWorth < 26000) {
        if (GetAroundAllyCount(bot, 1100) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_phantom_lancer"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 23000)) {
        return true;
    }

    if (!HasItem(bot, "item_skadi") && botNetWorth < 18000) {
        return true;
    }

    if (!HasItem(bot, "item_sphere") && botNetWorth < 22000) {
        if (GetAroundAllyCount(bot, 1300) <= 3) {
            return true;
        }
    }

    if (!HasItem(bot, "item_heart") && botNetWorth < 26000) {
        if (GetAroundAllyCount(bot, 1100) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_naga_siren"] =
    ConsiderIsTimeToFarm["npc_dota_hero_phantom_lancer"];

ConsiderIsTimeToFarm["npc_dota_hero_razor"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 7 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_black_king_bar") && botNetWorth < 15000) {
        return true;
    }

    if (!HasItem(bot, "item_satanic") && botNetWorth < 25000) {
        if (GetAroundAllyCount(bot, 1100) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_sand_king"] =
    ConsiderIsTimeToFarm["npc_dota_hero_bristleback"];

ConsiderIsTimeToFarm["npc_dota_hero_slardar"] =
    ConsiderIsTimeToFarm["npc_dota_hero_bristleback"];

ConsiderIsTimeToFarm["npc_dota_hero_legion_commander"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 7 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_echo_sabre") && botNetWorth < 12000) {
        return true;
    }

    if (!HasItem(bot, "item_heart") && botNetWorth < 21000) {
        if (GetAroundAllyCount(bot, 1100) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_slark"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_invis_sword") && botNetWorth < 18000) {
        return true;
    }

    if (!HasItem(bot, "item_silver_edge") && botNetWorth < 21000) {
        if (GetAroundAllyCount(bot, 1100) <= 2) {
            return true;
        }
    }

    if (!HasItem(bot, "item_abyssal_blade") && botNetWorth < 25000) {
        if (GetAroundAllyCount(bot, 1300) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_skeleton_king"] =
    ConsiderIsTimeToFarm["npc_dota_hero_bristleback"];

ConsiderIsTimeToFarm["npc_dota_hero_sven"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_black_king_bar")) {
        return true;
    }

    if (!HasItem(bot, "item_satanic") && botNetWorth < 22000) {
        if (GetAroundAllyCount(bot, 1000) <= 2) {
            return true;
        }
    }

    if (!HasItem(bot, "item_greater_crit") && botNetWorth < 26000) {
        if (GetAroundAllyCount(bot, 1100) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_sniper"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (
        bot.GetLevel() >= 10 &&
        !HasItem(bot, "item_monkey_king_bar") &&
        botNetWorth < 22000
    ) {
        const botKills = GetHeroKills(bot.GetPlayerID());
        const botDeaths = GetHeroDeaths(bot.GetPlayerID());
        if (
            botKills - 3 <= botDeaths &&
            botDeaths > 2 &&
            GetAroundAllyCount(bot, 1200) <= 2
        ) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_templar_assassin"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (DotaTime() > 9 * 60 && (bot.GetLevel() < 25 || botNetWorth < 20000)) {
        return true;
    }

    if (!HasItem(bot, "item_black_king_bar") && botNetWorth < 16000) {
        return true;
    }

    if (!HasItem(bot, "item_hurricane_pike") && botNetWorth < 20000) {
        if (GetAroundAllyCount(bot, 1300) <= 3) {
            return true;
        }
    }

    if (!HasItem(bot, "item_satanic") && botNetWorth < 26000) {
        if (GetAroundAllyCount(bot, 1100) <= 1) {
            return true;
        }
    }

    return false;
};

ConsiderIsTimeToFarm["npc_dota_hero_tidehunter"] =
    ConsiderIsTimeToFarm["npc_dota_hero_sven"];

ConsiderIsTimeToFarm["npc_dota_hero_viper"] = function () {
    const bot = GetBot();
    const botNetWorth = bot.GetNetWorth();

    if (
        bot.GetLevel() >= 10 &&
        !HasItem(bot, "item_mjollnir") &&
        botNetWorth < 20000
    ) {
        const botKills = GetHeroKills(bot.GetPlayerID());
        const botDeaths = GetHeroDeaths(bot.GetPlayerID());
        const allyCount = GetAroundAllyCount(bot, 1300);
        if (botKills - 4 <= botDeaths && botDeaths > 2 && allyCount < 3) {
            return true;
        }

        if (
            bot.GetMana() > 650 &&
            bot.GetCurrentVisionRange() < 1000 &&
            allyCount <= 1
        ) {
            return true;
        }
    }

    return false;
};
