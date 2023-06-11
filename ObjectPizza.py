import csv


class pizza():
    def __init__(self, id):

        with open('banco/produtoPizzas.csv', 'r') as file:
            reader = csv.reader(file)
            for row in reader:
                if id == row[0]:
                    self.id = row[0]
                    self.name = row[1]
                    self.price = row[2]
                    self.description = row[3]
                    self.image = row[4]
                    self.item = row[5]
