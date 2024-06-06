
class Move {

    constructor({id, name, power, accuracy, pp, type, category, short_effect, effect, priority, target}) {

        this.id = id;
        this.name = name;
        this.power = power;
        this.accuracy = accuracy;
        this.pp = pp;
        this.type = type;
        this.category = category;
        this.short_effect = short_effect;
        this.effect = effect;
        this.priority = priority;
        this.target = target;
    }
}

export default Move;