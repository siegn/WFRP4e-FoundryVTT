import RollWFRP from "./roll-wfrp4e.js"

export default class TraitRoll extends RollWFRP {

  constructor(data, actor) {
    super(data, actor)
    this.preData.extra.champion = data.champion || false;
    this.preData.options.characteristicToUse = data.characteristicToUse
    this.computeTargetNumber();
  }

  computeTargetNumber() {

    // Use skill total if characteristics match, otherwise add the total up manually
    if (this.preData.options.characteristicToUse && this.preData.options.characteristicToUse != this.item.rollable.rollCharacteristic)
      this.preData.target = this.actor.characteristics[this.preData.options.characteristicToUse].value
    else 
      this.preData.target = this.actor.characteristics[this.item.rollable.rollCharacteristic].value

    if (this.item.skillToUse)
      this.preData.target += this.item.skillToUse.advances.value
      
    super.computeTargetNumber();
  }

  async roll() {

    await super.roll()
    await this._rollTraitTest();
  }

  async _rollTraitTest() {

    try {
      // If the specification of a trait is a number, it's probably damage. (Animosity (Elves) - not a number specification: no damage)
      if (this.item.rollable.damage)
      {
        this.result.additionalDamage = this.preData.additionalDamage || 0
        this.result.damage = Number(this.item.specification.value) || 0

        if (this.item.rollable.SL)
          this.result.damage += Number(this.result.SL)


        if (this.item.rollable.bonusCharacteristic) // Add the bonus characteristic (probably strength)
          this.result.damage += Number(trait.bonus) || 0;
        

        if (this.item.rollable.dice && !this.result.additionalDamage)
        {
          let roll = new Roll(this.item.rollable.dice).roll()
          this.result.diceDamage = {value : roll.total, formula : roll.formula};
          this.result.additionalDamage += roll.total;
        }
      }
    }
    catch (error) {
      ui.notifications.error(game.i18n.localize("CHAT.DamageError") + " " + error)
    } // If something went wrong calculating damage, do nothing and still render the card

  }

}