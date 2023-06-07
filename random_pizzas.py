import random
import csv


def random_pizza(file, num_products):
    with open('banco/produtoPizzas.csv', 'r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)
        products = list(reader)
        random.shuffle(products)
        return products[:num_products]
