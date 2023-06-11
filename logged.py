import csv
import os

from flask_login import UserMixin

class User():
    def __init__(self, id):

        with open('banco/users.csv', 'r') as users:
            reader = csv.reader(users)
            reader.__next__()
            for row in reader:
                if id == row[0]:
                    self.id = row[0]
                    self.username = row[1]
                    self.password = row[2]
                    self.type = row[3]
                    self.address = row[4]

    @staticmethod
    def check_user_exists(username):
        with open('banco/users.csv', 'r', newline='') as file:
            reader = csv.reader(file)
            for row in reader:
                if row[1] == username:
                    return True
        return False

    @staticmethod
    def add_user(username, password, address):
        with open('banco/users.csv', 'r', encoding='utf-8', newline='') as file:
            reader = csv.DictReader(file)
            userN = list(reader)
            new_id = len(userN) + 1

            # Adicionar o novo usuário ao arquivo CSV
            new_user = {'id': new_id, 'nome': username, 'password': password, 'type': 0, 'address': address}
            userN.append(new_user)
            print(userN)
            with open('banco/users.csv', 'w', encoding='utf-8', newline='') as file:
                writer = csv.DictWriter(file, userN[0].keys())
                writer.writeheader()
                writer.writerows(userN)
