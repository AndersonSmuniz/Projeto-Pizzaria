import csv

class userObject():
    def __init__(self, user):
        self.id = user[0]
        self.name = user[1]
        self.password = user[2]
        self.tipe = user[3]
        self.address = user[4]
        print(self.name)
