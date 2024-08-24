export interface Unit {
    GetAbilityByName(name: string): Ability

    IsInvisible(): boolean

    IsAlive(): boolean

    IsHero(): boolean

    IsMagicImmune(): boolean

    HasModifier(name: string): boolean

    GetNearbyCreeps(range: number, enemy: boolean): undefined[]

    GetNearbyHeroes(
            range: number,
            includeEnemies: boolean,
            mode: undefined
    ): Unit[]

    Action_UseAbilityOnEntity(ability: Ability, target: Unit): void

    Action_UseAbility(ability: Ability): void

    GetAttackTarget(): Unit

    GetTeam(): number

    GetLastAttackTime(): number
}

export interface Ability {
    IsFullyCastable(): boolean

    GetCastRange(): number
}

export interface Talent {
}
