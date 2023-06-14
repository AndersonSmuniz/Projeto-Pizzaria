import csv
import json

from flask import Flask, render_template, request, redirect, url_for, session, jsonify

import ObjectPizza, logged
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
        with open('banco/users.csv', 'r') as file:
            reader = csv.reader(file)
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


@app.route('/cadastro', methods=['GET', 'POST'])
def register():
    print('registration')
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        address = data.get('address')
        print(username, password, address)

        if logged.User.check_user_exists(username):
            return 'Usuário já existe. Por favor, escolha um nome de usuário diferente.'

        logged.User.add_user(username, password, address)
        return 'Usuário cadastrado com sucesso!'

    return render_template("login.html")

@app.route('/home')
def home():
    if 'id' in session:
        type = logged.User(session['id'])
        file = '/banco/produtoPizzas.csv'
        num_products = 10
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
            id = 0
            product_id = request.form['product_id']
            item = request.form['item']
            amount = request.form['quantity']
            observation = request.form['observation']
            specification = request.form['size']
            status = False

            with open('banco/pedidos.csv', 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                for row in reader:
                    id += 1

            with open('banco/Pedidos.csv', 'a', newline='', encoding='utf-8') as pedidos_file:
                writer = csv.writer(pedidos_file)

                writer.writerow([id, user_id, product_id, item, amount, observation, specification, status])

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
        user_id = session['id']
        type = logged.User(user_id)
        user_orders = []

        with open('banco/Pedidos.csv', 'r', encoding='utf-8') as file:

            pedidos_file = csv.DictReader(file)
            for row in pedidos_file:

                if row['user_id'] == user_id and row['status'] == 'False':
                    product_id = row['product_id']
                    pizza = ObjectPizza.pizza(product_id)

                    row['name'] = pizza.name
                    row['description'] = pizza.description
                    row['prices'] = json.loads(pizza.price)
                    row['subtotal'] = int(json.loads(pizza.price)[0][row['specification']]) * int(row['amount'])
                    row['image'] = pizza.image
                    user_orders.append(row)

        return render_template('carrinho.html', type=type.type, user_orders=user_orders)
    else:
        return redirect(url_for('login'))


@app.route('/deletar_pedido', methods=['POST'])
def deletar_pedido():
    pedido_id = request.form.get('pedido_id')

    pedidos = []
    with open('banco/Pedidos.csv', 'r', encoding='utf-8') as file:
        pedidos_file = csv.DictReader(file)
        for row in pedidos_file:
            if row['id'] != pedido_id:
                pedidos.append(row)

    with open('banco/Pedidos.csv', 'w', encoding='utf-8', newline='') as file:
        fieldnames = ['id', 'user_id', 'product_id', 'item', 'amount', 'observation', 'specification', 'status']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(pedidos)

    session['pedido_deletado'] = True
    return redirect(url_for('carrinho'))


@app.route('/finalizar_compra', methods=['POST'])
def finalizar_compra():
    user_id = session['id']
    tipo_pagamento = request.form.get('tipo_pagamento')
    troco = request.form.get('troco')

    pedidos_modificados = []

    with open('banco/Pedidos.csv', 'r', encoding='utf-8') as file:
        pedidos_file = csv.DictReader(file)
        pedidos = list(pedidos_file)
        for i, row in enumerate(pedidos):
            if row['user_id'] == user_id and row['status'] == 'False':
                # Atualiza o status do pedido para 'True'
                pedidos[i]['status'] = 'True'
                pedidos_modificados.append(pedidos[i])

    # Atualiza o arquivo
    with open('banco/Pedidos.csv', 'w', encoding='utf-8', newline='') as file:
        fieldnames = ['id', 'user_id', 'product_id', 'item', 'amount', 'observation', 'specification', 'status']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(pedidos)

    # Salva os pedidos modificados
    with open('banco/relatorio.csv', 'a', encoding='utf-8', newline='') as file:
        writer = csv.writer(file)
        for pedido in pedidos_modificados:
            pedido['tipo_pagamento'] = tipo_pagamento
            if str(troco) == "NaN":
                pedido['troco'] = 0
            else:
                pedido['troco'] = troco
            writer.writerow(pedido.values())

    return jsonify({'success': True, 'message': 'Pedido finalizado com sucesso.'})


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

        products = []

        with open('banco/produtoPizzas.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                pizza = ObjectPizza.pizza(row['id'])

                row['name'] = pizza.name
                row['description'] = pizza.description
                row['price'] = json.loads(pizza.price)
                row['image'] = pizza.image
                products.append(row)
        return render_template('admin_produtos.html', type=type.type, products=products)
    else:
        return redirect(url_for('login'))


@app.route('/adm/produtos/atualizar-adicionar', methods=['POST'])
def update_add_product():
    data = request.get_json()
    id = data['id']
    name = data['name']
    description = data['description']
    price_p = data['price_p']
    price_m = data['price_m']
    price_g = data['price_g']
    image = data['image']
    print(data)
    with open('banco/produtoPizzas.csv', 'r+', encoding='utf-8', newline='') as file:
        reader = csv.DictReader(file)
        products = list(reader)

        product_found = False
        for product in products:
            if product['id'] == id:
                product['name'] = name
                product['price'] = '[{"P": ' + price_p + ',"M": ' + price_m + ', "G": ' + price_g + '}]'
                product['description'] = description
                product['image'] = image
                product['item'] = 'pizza'
                product_found = True
                break

        if not product_found:
            new_id = len(products) + 1
            new_product = {'id': new_id, 'name': name,
                           'price': '[{"P": ' + price_p + ',"M": ' + price_m + ', "G": ' + price_g + '}]',
                           'description': description, 'image': image, 'item': 'pizza'}
            products.append(new_product)

        file.seek(0)
        writer = csv.DictWriter(file, fieldnames=reader.fieldnames)
        writer.writeheader()

        # Filtra as linhas vazias antes de escrever
        non_empty_products = [product for product in products if any(product.values())]
        writer.writerows(non_empty_products)

    return jsonify({'success': True})


@app.route('/api/produtos/excluir', methods=['POST'])
def delete_product():
    produto_id = int(request.form.get('id'))
    print('produto_id', produto_id)

    productsList = []
    with open('banco/produtoPizzas.csv', 'r', encoding='utf-8') as file:
        productsfile = csv.DictReader(file)
        for row in productsfile:
            if int(row['id']) != produto_id:
                productsList.append(row)

    with open('banco/produtoPizzas.csv', 'w', encoding='utf-8', newline='') as file:
        fieldnames = ['id','name','price','description','image','item']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(productsList)

    return jsonify({'success': True})


@app.route('/relatorio-vendas')
def adm_relatorio():
    if 'id' in session and session['id'] == '1':
        type = logged.User(session['id'])
        relatorio_data = []

        with open('banco/relatorio.csv', 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                relatorio_data.append(row)

        return render_template('relatorio.html', type=type.type, relatorio_data=relatorio_data)
    else:
        return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('id', None)
    return redirect(url_for('login'))


@app.route('/perfil', methods=['GET', 'POST'])
def perfil():
    if 'id' in session:
        info = logged.User(session['id'])
        if request.method == 'POST':

            username = request.form['username']
            password = request.form['password']
            address = request.form['address']

            with open('banco/users.csv', 'r', encoding='utf-8') as file:
                reader = csv.reader(file)
                users = list(reader)
                attUsers = []
                for user in users:
                    if user[0] != session['id']:
                        attUsers.append(user)
                    else:
                        user[1] = username
                        user[2] = password
                        user[4] = address
                        attUsers.append(user)
            with open('banco/users.csv', 'w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerows(users)

            return redirect(url_for('perfil'))

        return render_template('profile.html', type=info.type, info=info)
    else:
        return redirect(url_for('login'))


@app.errorhandler(404)
def error(e):
    return render_template('main.html'), 404


if __name__ == '__main__':
    app.run(debug=True)
