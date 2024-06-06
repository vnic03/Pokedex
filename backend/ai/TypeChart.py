import csv

class TypeChart:
    effectiveness = {}
    data_loaded = False

    @staticmethod
    def load():
        if not TypeChart.data_loaded:
            TypeChart.interaction("Normal", "Rock", 0.5)
            TypeChart.interaction("Normal", "Ghost", 0.0)
            TypeChart.interaction("Normal", "Steel", 0.5)

            TypeChart.interaction("Fire", "Grass", 2.0)
            TypeChart.interaction("Fire", "Ice", 2.0)
            TypeChart.interaction("Fire", "Bug", 2.0)
            TypeChart.interaction("Fire", "Steel", 2.0)
            TypeChart.interaction("Fire", "Water", 0.5)
            TypeChart.interaction("Fire", "Rock", 0.5)
            TypeChart.interaction("Fire", "Fire", 0.5)
            TypeChart.interaction("Fire", "Dragon", 0.5)

            TypeChart.interaction("Water", "Fire", 2.0)
            TypeChart.interaction("Water", "Ground", 2.0)
            TypeChart.interaction("Water", "Rock", 2.0)
            TypeChart.interaction("Water", "Water", 0.5)
            TypeChart.interaction("Water", "Grass", 0.5)
            TypeChart.interaction("Water", "Dragon", 0.5)

            TypeChart.interaction("Electric", "Water", 2.0)
            TypeChart.interaction("Electric", "Flying", 2.0)
            TypeChart.interaction("Electric", "Grass", 0.5)
            TypeChart.interaction("Electric", "Electric", 0.5)
            TypeChart.interaction("Electric", "Dragon", 0.5)
            TypeChart.interaction("Electric", "Ground", 0.0)

            TypeChart.interaction("Grass", "Water", 2.0)
            TypeChart.interaction("Grass", "Ground", 2.0)
            TypeChart.interaction("Grass", "Rock", 2.0)
            TypeChart.interaction("Grass", "Fire", 0.5)
            TypeChart.interaction("Grass", "Grass", 0.5)
            TypeChart.interaction("Grass", "Poison", 0.5)
            TypeChart.interaction("Grass", "Flying", 0.5)
            TypeChart.interaction("Grass", "Bug", 0.5)
            TypeChart.interaction("Grass", "Dragon", 0.5)
            TypeChart.interaction("Grass", "Steel", 0.5)

            TypeChart.interaction("Ice", "Grass", 2.0)
            TypeChart.interaction("Ice", "Ground", 2.0)
            TypeChart.interaction("Ice", "Flying", 2.0)
            TypeChart.interaction("Ice", "Dragon", 2.0)
            TypeChart.interaction("Ice", "Water", 0.5)
            TypeChart.interaction("Ice", "Ice", 0.5)
            TypeChart.interaction("Ice", "Fire", 0.5)
            TypeChart.interaction("Ice", "Steel", 0.5)

            TypeChart.interaction("Fighting", "Normal", 2.0)
            TypeChart.interaction("Fighting", "Ice", 2.0)
            TypeChart.interaction("Fighting", "Rock", 2.0)
            TypeChart.interaction("Fighting", "Dark", 2.0)
            TypeChart.interaction("Fighting", "Steel", 2.0)
            TypeChart.interaction("Fighting", "Ghost", 0.0)
            TypeChart.interaction("Fighting", "Poison", 0.5)
            TypeChart.interaction("Fighting", "Flying", 0.5)
            TypeChart.interaction("Fighting", "Psychic", 0.5)
            TypeChart.interaction("Fighting", "Bug", 0.5)
            TypeChart.interaction("Fighting", "Fairy", 0.5)

            TypeChart.interaction("Poison", "Grass", 2.0)
            TypeChart.interaction("Poison", "Fairy", 2.0)
            TypeChart.interaction("Poison", "Poison", 0.5)
            TypeChart.interaction("Poison", "Ground", 0.5)
            TypeChart.interaction("Poison", "Rock", 0.5)
            TypeChart.interaction("Poison", "Ghost", 0.5)
            TypeChart.interaction("Poison", "Steel", 0.0)

            TypeChart.interaction("Ground", "Fire", 2.0)
            TypeChart.interaction("Ground", "Electric", 2.0)
            TypeChart.interaction("Ground", "Poison", 2.0)
            TypeChart.interaction("Ground", "Rock", 2.0)
            TypeChart.interaction("Ground", "Steel", 2.0)
            TypeChart.interaction("Ground", "Grass", 0.5)
            TypeChart.interaction("Ground", "Bug", 0.5)
            TypeChart.interaction("Ground", "Flying", 0.0)

            TypeChart.interaction("Flying", "Grass", 2.0)
            TypeChart.interaction("Flying", "Fighting", 2.0)
            TypeChart.interaction("Flying", "Bug", 2.0)
            TypeChart.interaction("Flying", "Electric", 0.5)
            TypeChart.interaction("Flying", "Rock", 0.5)
            TypeChart.interaction("Flying", "Steel", 0.5)

            TypeChart.interaction("Psychic", "Fighting", 2.0)
            TypeChart.interaction("Psychic", "Poison", 2.0)
            TypeChart.interaction("Psychic", "Psychic", 0.5)
            TypeChart.interaction("Psychic", "Steel", 0.5)
            TypeChart.interaction("Psychic", "Dark", 0.0)

            TypeChart.interaction("Bug", "Grass", 2.0)
            TypeChart.interaction("Bug", "Psychic", 2.0)
            TypeChart.interaction("Bug", "Dark", 2.0)
            TypeChart.interaction("Bug", "Fighting", 0.5)
            TypeChart.interaction("Bug", "Flying", 0.5)
            TypeChart.interaction("Bug", "Poison", 0.5)
            TypeChart.interaction("Bug", "Ghost", 0.5)
            TypeChart.interaction("Bug", "Steel", 0.5)
            TypeChart.interaction("Bug", "Fire", 0.5)
            TypeChart.interaction("Bug", "Fairy", 0.5)

            TypeChart.interaction("Rock", "Fire", 2.0)
            TypeChart.interaction("Rock", "Ice", 2.0)
            TypeChart.interaction("Rock", "Flying", 2.0)
            TypeChart.interaction("Rock", "Bug", 2.0)
            TypeChart.interaction("Rock", "Fighting", 0.5)
            TypeChart.interaction("Rock", "Ground", 0.5)
            TypeChart.interaction("Rock", "Steel", 0.5)

            TypeChart.interaction("Ghost", "Psychic", 2.0)
            TypeChart.interaction("Ghost", "Ghost", 2.0)
            TypeChart.interaction("Ghost", "Dark", 0.5)
            TypeChart.interaction("Ghost", "Normal", 0.0)

            TypeChart.interaction("Dragon", "Dragon", 2.0)
            TypeChart.interaction("Dragon", "Steel", 0.5)
            TypeChart.interaction("Dragon", "Fairy", 0.0)

            TypeChart.interaction("Dark", "Psychic", 2.0)
            TypeChart.interaction("Dark", "Ghost", 2.0)
            TypeChart.interaction("Dark", "Fighting", 0.5)
            TypeChart.interaction("Dark", "Dark", 0.5)
            TypeChart.interaction("Dark", "Fairy", 0.5)

            TypeChart.interaction("Steel", "Ice", 2.0)
            TypeChart.interaction("Steel", "Rock", 2.0)
            TypeChart.interaction("Steel", "Fairy", 2.0)
            TypeChart.interaction("Steel", "Steel", 0.5)
            TypeChart.interaction("Steel", "Fire", 0.5)
            TypeChart.interaction("Steel", "Water", 0.5)
            TypeChart.interaction("Steel", "Electric", 0.5)

            TypeChart.interaction("Fairy", "Dragon", 2.0)
            TypeChart.interaction("Fairy", "Fighting", 2.0)
            TypeChart.interaction("Fairy", "Dark", 2.0)
            TypeChart.interaction("Fairy", "Poison", 0.5)
            TypeChart.interaction("Fairy", "Steel", 0.5)
            TypeChart.interaction("Fairy", "Fire", 0.5)

            TypeChart.data_loaded = True

    @staticmethod
    def interaction(attacker, defender, multiplier):
        TypeChart.effectiveness[(attacker, defender)] = multiplier

    @staticmethod
    def get_effectiveness(attacker, defender):
        TypeChart.load()
        return TypeChart.effectiveness.get((attacker, defender), 1.0)
    



def save_to_csv(filename):
    TypeChart.load()
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['attacker', 'defender', 'effectiveness']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for (attacker, defender), effectiveness in TypeChart.effectiveness.items():
            writer.writerow({'attacker': attacker, 'defender': defender, 'effectiveness': effectiveness})

save_to_csv('type_chart.csv')

