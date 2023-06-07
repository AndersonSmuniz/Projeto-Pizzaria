import csv

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
