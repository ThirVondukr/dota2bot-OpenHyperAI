import * as jmz from "../FunLib/jmz_func";
import { BotBehavior, BotRole, ItemBuilds } from "../ts_libs/bots";
import {
    BotActionDesire,
    BotMode,
    Location,
    Talent,
    Unit,
} from "../ts_libs/dota";
import { hero_is_healing } from "../FunLib/aba_buff";
import { HasAnyEffect } from "../FunLib/utils";

const bot = GetBot();
// @ts-ignore
const Minion = dofile("bots/FunLib/aba_minion");

const talentList: Talent[] = jmz.Skill.GetTalentList(bot);
const AbilityList: string[] = jmz.Skill.GetAbilityList(bot);

const talentTreeList = {
    t25: [10, 0],
    t20: [10, 0],
    t15: [0, 10],
    t10: [0, 10],
} satisfies jmz.TalentTreeBuild;
const AllAbilityBuilds = [
    [1, 3, 1, 3, 1, 6, 1, 3, 3, 2, 6, 2, 2, 2, 6], // Pos 5 Build
];

const abilityBuild = jmz.Skill.GetRandomBuild(AllAbilityBuilds);

const talentBuildList = jmz.Skill.GetTalentBuild(talentTreeList);

const skillBuildList = jmz.Skill.GetSkillList(
    AbilityList,
    abilityBuild,
    talentList,
    talentBuildList
);

const role: BotRole = jmz.Item.GetRoleItemsBuyList(bot);

const abilityTether = bot.GetAbilityByName(AbilityList[0]);
const abilitySpirits = bot.GetAbilityByName(AbilityList[1]);
const abilityOvercharge = bot.GetAbilityByName(AbilityList[2]);
const abilityRelocate = bot.GetAbilityByName(AbilityList[5]);
const abilityBreakTether = bot.GetAbilityByName("wisp_tether_break");

const sellList = ["item_black_king_bar", "item_quelling_blade"];
const defaultBuild = [
    "item_tango",
    "item_faerie_fire",
    "item_gauntlets",
    "item_gauntlets",
    "item_gauntlets",
    //
    "item_boots",
    "item_armlet",
    "item_black_king_bar",
    "item_sange",
    "item_ultimate_scepter",
    "item_heavens_halberd",
    "item_travel_boots",
    "item_satanic",
    "item_aghanims_shard",
    "item_assault",
    "item_travel_boots_2",
    "item_ultimate_scepter_2",
    "item_moon_shard",
];
const roleItemBuyList: { [key in BotRole]: string[] } = {
    pos_1: defaultBuild,
    pos_2: defaultBuild,
    pos_3: defaultBuild,
    pos_4: [
        "item_priest_outfit",
        "item_mekansm",
        "item_glimmer_cape",
        "item_guardian_greaves",
        "item_spirit_vessel",
        "item_shivas_guard",
        "item_sheepstick",
        "item_moon_shard",
        "item_ultimate_scepter_2",
    ],
    pos_5: [
        "item_blood_grenade",
        "item_mage_outfit",
        "item_ancient_janggo",
        "item_glimmer_cape",
        "item_boots_of_bearing",
        "item_pipe",
        "item_shivas_guard",
        "item_cyclone",
        "item_sheepstick",
        "item_wind_waker",
        "item_moon_shard",
        "item_ultimate_scepter_2",
    ],
} satisfies ItemBuilds;

function HasHealingEffect(hero: Unit) {
    return HasAnyEffect(hero, "modifier_tango_heal", ...hero_is_healing);
}

let stateTetheredHero: Unit | null = null;

function ShouldUseOvercharge(ally: Unit) {
    const isAttacking = GameTime() - ally.GetLastAttackTime() < 0.33;
    const attackTarget = ally.GetAttackTarget();
    return (
        jmz.IsGoingOnSomeone(ally) ||
        (attackTarget &&
            attackTarget.GetTeam() === GetOpposingTeam() &&
            isAttacking) ||
        ally.GetNearbyCreeps(200, true).length > 2
    );
}

function considerTether(): LuaMultiReturn<[number, Unit | null]> {
    if (!abilityTether.IsFullyCastable() || !abilityBreakTether.IsHidden()) {
        return $multi(BotActionDesire.None, null);
    }
    const castRange = abilityTether.GetCastRange();
    const allies = bot.GetNearbyHeroes(castRange, false, BotMode.None);

    for (const ally of allies) {
        const canTargetAlly =
            ally != bot && ally.IsAlive() && !ally.IsMagicImmune();
        if (!canTargetAlly) {
            continue;
        }
        if (jmz.IsRetreating(bot) || jmz.GetHP(bot) < 0.25) {
            if (jmz.IsRetreating(ally)) {
                return $multi(BotActionDesire.High, ally);
            }
            continue;
        }
        if (
            jmz.GetHP(ally) < 0.75 ||
            jmz.GetMP(bot) > 0.8 ||
            HasHealingEffect(bot) ||
            ShouldUseOvercharge(ally)
        ) {
            return $multi(BotActionDesire.High, ally);
        }
    }

    return $multi(BotActionDesire.None, null);
}

function considerOvercharge(): number {
    if (!abilityOvercharge.IsFullyCastable()) {
        return BotActionDesire.None;
    }
    if (
        bot.HasModifier("modifier_wisp_tether") &&
        stateTetheredHero !== null &&
        ShouldUseOvercharge(stateTetheredHero)
    ) {
        return BotActionDesire.High;
    }
    return BotActionDesire.None;
}

function considerSpirits(): number {
    if (!abilitySpirits.IsFullyCastable()) {
        return BotActionDesire.None;
    }
    const nearbyEnemies = bot.GetNearbyHeroes(800, true, BotMode.None);
    if (nearbyEnemies.length >= 1) {
        return BotActionDesire.High;
    }
    return BotActionDesire.None;
}

function considerRelocate(): LuaMultiReturn<[number, Location | null]> {
    return $multi(BotActionDesire.None, null);
}

export = {
    SkillsComplement() {
        if (jmz.CanNotUseAbility(bot) || bot.IsInvisible()) {
            return;
        }
        const [tetherDesire, tetherLocation] = considerTether();
        if (tetherDesire > 0 && tetherLocation) {
            bot.Action_UseAbilityOnEntity(abilityTether, tetherLocation);
            stateTetheredHero = tetherLocation;
            return;
        }

        const overchargeDesire = considerOvercharge();
        if (overchargeDesire > 0) {
            bot.Action_UseAbility(abilityOvercharge);
            return;
        }
        const spiritsDesire = considerSpirits();
        if (spiritsDesire > 0) {
            bot.Action_UseAbility(abilitySpirits);
            return;
        }
        const [relocateDesire, relocateTarget] = considerRelocate();
        if (relocateDesire && relocateTarget !== null) {
            bot.Action_UseAbilityOnLocation(abilityRelocate, relocateTarget);
        }
    },
    sSellList: sellList,
    sBuyList: roleItemBuyList[role],
    MinionThink(hMinionUnit: any, _: any) {
        if (Minion.IsValidUnit(hMinionUnit)) {
            Minion.IllusionThink(hMinionUnit);
        }
    },
    bDefaultAbility: false,
    bDefaultItem: false,
    sSkillList: skillBuildList,
} satisfies BotBehavior;
