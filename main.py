import csv

from flask import Flask, render_template, request, redirect, url_for, session

from flask_login import UserMixin #Estudar

import logged
from validUser import userObject
from random_pizzas import random_pizza


app = Flask(__name__)
app.config['SECRET_KEY'] = '123'


@app.route('/', methods=['GET', 'POST'])
def login():
    session.pop('id', None)
    username = str(request.form.get('username'))
    password = str(request.form.get('password'))

    try:
        type = ''
        with open('banco/users.csv', 'r') as f:
            reader = csv.reader(f)
            reader.__next__()
            for row in reader:
                if row[1] == username and row[2] == password:
                    userObject(row)
                    session['id'] = row[0]
                    type = row[3]
                    return redirect(url_for('home'))

            return render_template('login.html')

    except FileNotFoundError:
        print('User not found')
        return render_template('login.html')


@app.route('/home')
def home():
    if 'id' in session:
        type = logged.User(session['id'])
        file = '/banco/produtoPizzas.csv'
        num_products = 7
        products = random_pizza(file, num_products)
        return render_template('main.html', id=session['id'], type=type.type, products=products)
    else:
        return redirect(url_for('login'))


@app.route('/cardapio', methods=['GET', 'POST'])
def cardapio():
    if 'id' in session:
        user_id = session['id']
        type = logged.User(user_id)
        if request.method == 'POST':
            product_id = request.form['product_id']
            item = request.form['item']
            amount = request.form['quantity']
            observation = request.form['observation']
            specification = request.form['size']
            status = False
            print(request.form)
            with open('banco/Pedidos.csv', 'a', newline='', encoding='utf-8') as pedidos_file:
                writer = csv.writer(pedidos_file)
                writer.writerow([user_id, product_id, item, amount, observation, specification, status])

            return redirect(url_for('carrinho'))

        products = []
        with open('banco/produtoPizzas.csv', 'r', encoding='utf-8') as pizzasFile:
            pizza = csv.DictReader(pizzasFile)
            for row in pizza:
                products.append(row)

        return render_template('cardapio.html', type=type.type, products=products)
    else:
        return redirect(url_for('login'))


@app.route('/carrinho', methods=['GET', 'POST'])
def carrinho():
    if 'id' in session:
        type = logged.User(session['id'])

        return render_template('carrinho.html', type=type.type)
    else:
        return redirect(url_for('login'))


@app.route('/reservar', methods=['GET', 'POST'])
def reservation():
    if 'id' in session:
        type = logged.User(session['id'])
        return render_template('reservar.html', type=type.type)
    else:
        return redirect(url_for('login'))


@app.route('/administrativo/produtos', methods=['GET', 'POST'])
def admin_pro():
    if 'id' in session and session['id'] == '1':
        type = logged.User(session['id'])
        return render_template('admin_produtos.html')
    else:
        return redirect(url_for('login'))


@app.route('/administrativo/usuarios', methods=['GET', 'POST'])
def admin_us():
    if 'id' in session and session['id'] == '1':
        type = logged.User(session['id'])
        return render_template('admin_users.html')
    else:
        return redirect(url_for('login'))


@app.route('/logout')
def logout():
    session.pop('id', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
