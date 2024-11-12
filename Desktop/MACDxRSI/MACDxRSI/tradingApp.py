from flask import Flask, render_template_string, request, jsonify
import pandas as pd
import ta
import matplotlib.pyplot as plt
import base64
from io import BytesIO

app = Flask(__name__)

# Load and prepare data
data = pd.read_csv('apple/linear_predictions.csv')
data['Date'] = pd.to_datetime(data['Date'])

# Calculate price difference
data['Price Diff'] = data['Predicted'].diff().fillna(0)

starting_capital = 10000  # Adjust this value if necessary
initial_cash_capital = starting_capital
initial_stock_capital = 0
initial_shares_owned = 0
initial_total_return = 0
initial_avg_cost_price = 0

cash_capital = starting_capital
stock_capital = 0
shares_owned = 0
total_return = 0
avg_cost_price = 0
transaction_message = ""

# Function to calculate indicators
def calculate_indicators():
    # Calculate MACD
    macd = ta.trend.MACD(data['Actual'])
    data['MACD'] = macd.macd()
    data['Signal'] = macd.macd_signal()

    # Calculate RSI
    data['RSI'] = ta.momentum.RSIIndicator(data['Actual']).rsi()

# Simple strategy for Buy/Sell signals
def simple_apply_strategy(row):
    macd_cross_up = (row['MACD'] > row['Signal'])
    macd_cross_down = (row['MACD'] < row['Signal'])
    rsi_not_overbought = (row['RSI'] < 70)
    rsi_not_oversold = (row['RSI'] > 30)

    if macd_cross_up and rsi_not_overbought:
        return 'Buy'
    elif macd_cross_down and rsi_not_oversold:
        return 'Sell'
    else:
        return 'Hold'

# Update signals with the simple strategy
def update_signals():
    data['Trade Signal'] = data.apply(simple_apply_strategy, axis=1)

# Function to find strong signals
def find_strong_signals():
    data['Strong Signal'] = 'Hold'
    buy_signal_indices = []
    sell_signal_indices = []

    for i in range(len(data)):
        if data.loc[i, 'Trade Signal'] == 'Buy':
            buy_signal_indices.append(i)
        elif data.loc[i, 'Trade Signal'] == 'Sell':
            sell_signal_indices.append(i)

    # Process buy signals
    if buy_signal_indices:
        grouped_buy_indices = group_consecutive_indices(buy_signal_indices)
        for group in grouped_buy_indices:
            min_index = min(group, key=lambda x: data.loc[x, 'Predicted'])
            data.loc[min_index, 'Strong Signal'] = 'Strong Buy'

    # Process sell signals
    if sell_signal_indices:
        grouped_sell_indices = group_consecutive_indices(sell_signal_indices)
        for group in grouped_sell_indices:
            max_index = max(group, key=lambda x: data.loc[x, 'Predicted'])
            data.loc[max_index, 'Strong Signal'] = 'Strong Sell'


# Helper function to group consecutive indices
def group_consecutive_indices(indices):
    groups = []
    group = [indices[0]]

    for i in range(1, len(indices)):
        if indices[i] == indices[i-1] + 1:
            group.append(indices[i])
        else:
            groups.append(group)
            group = [indices[i]]

    groups.append(group)
    return groups

# Plot graphs
def plot_graphs():
    plt.figure(figsize=(14, 8))

    plt.subplot(3, 1, 1)
    plt.plot(data['Date'], data['Actual'], label='Actual Price', color='blue')
    plt.plot(data['Date'], data['Predicted'], label='Predicted Price', color='orange', linestyle='--')

    # Mark Strong Buy signals
    strong_buy_signals = data[data['Strong Signal'] == 'Strong Buy']
    plt.scatter(strong_buy_signals['Date'], strong_buy_signals['Predicted'], label='Strong Buy Signal', color='darkgreen', marker='^', s=150)

    # Mark Strong Sell signals
    strong_sell_signals = data[data['Strong Signal'] == 'Strong Sell']
    plt.scatter(strong_sell_signals['Date'], strong_sell_signals['Predicted'], label='Strong Sell Signal', color='darkred', marker='v', s=150)

    # Mark normal Buy signals
    # buy_signals = data[data['Trade Signal'] == 'Buy']
    # plt.scatter(buy_signals['Date'], buy_signals['Predicted'], label='Buy Signal', color='lightgreen', marker='^', s=100)

    # Mark normal Sell signals
    # sell_signals = data[data['Trade Signal'] == 'Sell']
    # plt.scatter(sell_signals['Date'], sell_signals['Predicted'], label='Sell Signal', color='lightcoral', marker='v', s=100)

    plt.title('Actual and Predicted Prices with Trade Signals')
    plt.legend()

    plt.subplot(3, 1, 2)
    plt.plot(data['Date'], data['MACD'], label='MACD', color='purple')
    plt.plot(data['Date'], data['Signal'], label='Signal Line', color='red')
    plt.title('MACD & Signal Line')
    plt.legend()

    plt.subplot(3, 1, 3)
    plt.plot(data['Date'], data['RSI'], label='RSI', color='green')
    plt.axhline(70, color='red', linestyle='--')
    plt.axhline(30, color='red', linestyle='--')
    plt.title('RSI')
    plt.legend()

    plt.tight_layout()

    buf = BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    graph_url = base64.b64encode(buf.getvalue()).decode('utf8')
    plt.close()
    return f'data:image/png;base64,{graph_url}'

@app.route('/', methods=['GET', 'POST'])
def trading_app():
    global cash_capital, stock_capital, shares_owned, total_return, avg_cost_price, transaction_message

    available_dates = data['Date'].dt.strftime('%Y-%m-%d').tolist()

    # Initialize and calculate indicators
    calculate_indicators()
    update_signals()
    find_strong_signals()

    # Default selected signal
    selected_signal = 'all'  # Default to 'all' if no signal is selected

    if request.method == 'POST':
        # Check if the reset button was clicked
        if 'reset' in request.form:
            # Reset all values to initial states
            cash_capital = initial_cash_capital
            stock_capital = initial_stock_capital
            shares_owned = initial_shares_owned
            total_return = initial_total_return
            avg_cost_price = initial_avg_cost_price
            transaction_message = "Trading data has been reset."
            selected_signal = 'all'  # Reset selected signal to 'all'
            filtered_dates = available_dates  # Reset to all dates
        else:
            # Handle other POST actions, like signal filtering and buy/sell logic
            selected_signal = request.form.get('signal', 'all')  # Default to 'all' if not selected

    # Filtered dates for the selected signal
    if selected_signal == 'Strong Buy':
        filtered_dates = data[data['Strong Signal'] == 'Strong Buy']['Date'].dt.strftime('%Y-%m-%d').tolist()
    elif selected_signal == 'Strong Sell':
        filtered_dates = data[data['Strong Signal'] == 'Strong Sell']['Date'].dt.strftime('%Y-%m-%d').tolist()
    else:
        filtered_dates = available_dates  # Show all dates if 'all' is selected

    if request.method == 'POST':
        action = request.form.get('action')
        date_selected = request.form.get('date')

        # Get quota, ensure it is a valid integer (default to 0 if empty or invalid)
        quota_str = request.form.get('quota', '')
        quota = 0  # Default value
        if quota_str.isdigit():  # Check if quota is a valid number
            quota = int(quota_str)

        transaction_message = ""

        # Use the selected date as the "current date"
        current_date = pd.to_datetime(date_selected)

        # Get price for the selected date
        price_selected = data.loc[data['Date'] == current_date, 'Actual'].values[0] if not data.loc[
            data['Date'] == current_date].empty else 0

        if action == 'buy' and price_selected > 0 and quota > 0:
            total_cost = price_selected * quota
            if total_cost <= cash_capital:
                shares_owned += quota
                cash_capital -= total_cost
                stock_capital += total_cost
                avg_cost_price = (avg_cost_price * (shares_owned - quota) + total_cost) / shares_owned
                transaction_message = f"Bought {quota} shares at ${price_selected} each. Total cost: ${total_cost}."
            else:
                transaction_message = "Insufficient funds for this purchase."

        elif action == 'sell' and shares_owned >= quota:
            total_revenue = price_selected * quota
            profit_or_loss = (price_selected - avg_cost_price) * quota
            total_return += profit_or_loss
            shares_owned -= quota
            cash_capital += total_revenue
            stock_capital -= total_revenue

            # Ensure stock capital does not go negative
            if shares_owned == 0:
                stock_capital = 0

            transaction_message = f"Sold {quota} shares at ${price_selected} each. Revenue: ${total_revenue}, Profit/Loss: ${profit_or_loss}."
        else:
            transaction_message = "Insufficient shares to sell or invalid buy request."

    yearly_return = calculate_yearly_return()
    graph_url = plot_graphs()

    # Complete HTML Template
    return render_template_string('''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trading App</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            tr.buy-signal td.trade-signal { background-color: #d4edda; }  /* Light Green for Buy */
            tr.sell-signal td.trade-signal { background-color: #f8d7da; } /* Light Red for Sell */
            tr.strong-buy-signal { background-color: #a3e4d7; }  /* Different Color for Strong Buy */
            tr.strong-sell-signal { background-color: #f5b7b1; } /* Different Color for Strong Sell */
        </style>
    </head>
    <body>
        <h1>Trading Results</h1>
        <form method="post">
            <label for="signal">Signal:</label>
            <select id="signal" name="signal" onchange="this.form.submit()">
                <option value="all" {% if selected_signal == 'all' %}selected{% endif %}>All</option>
                <option value="Strong Buy" {% if selected_signal == 'Strong Buy' %}selected{% endif %}>Strong Buy</option>
                <option value="Strong Sell" {% if selected_signal == 'Strong Sell' %}selected{% endif %}>Strong Sell</option>
            </select>

            <label for="date">Date:</label>
            <select id="date" name="date" onchange="updatePrice()">
                {% for date in filtered_dates %}
                    <option value="{{ date }}">{{ date }}</option>
                {% endfor %}
            </select>

            <label for="price">Price:</label>
            <input type="text" id="price" name="price" value="{{ selected_price }}" readonly>

            <label for="quota">Quantity:</label>
            <input type="number" id="quota" name="quota" required>

            <label for="action">Action:</label>
            <select name="action">
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
            </select>

            <button type="submit">Submit</button>
        </form>

        <p>{{ transaction_message }}</p>

        <p><strong>Starting Capital:</strong> ${{ starting_capital }}</p>
        <p><strong>Cash Capital:</strong> ${{ cash_capital }}</p>
        <p><strong>Stock Capital:</strong> ${{ stock_capital }}</p>
        <p><strong>Shares Owned:</strong> {{ shares_owned }}</p>
        <p><strong>Total Return:</strong> ${{ total_return }}</p>
        <p><strong>Average Cost Price:</strong> ${{ avg_cost_price }}</p>
        <p><strong>Yearly Return:</strong> {{ yearly_return }}%</p>

        <form method="post">
            <button type="submit" name="reset" value="reset">Reset</button>
        </form>
        
        <h2>Price Chart</h2>
        <img src="{{ graph_url }}" alt="Trading Graph">

        <table>
            <tr>
                <th>Date</th>
                <th>Actual Price</th>
                <th>Predicted Price</th>
                <th>Price Diff</th>
                <th>MACD</th>
                <th>Signal Line</th>
                <th>RSI</th>
                <th>Trade Signal</th>
                <th>Strong Signal</th>
            </tr>
            {% for index, row in data.iterrows() %}
                <tr class="{% if row['Strong Signal'] == 'Strong Buy' %}strong-buy-signal{% elif row['Strong Signal'] == 'Strong Sell' %}strong-sell-signal{% elif row['Trade Signal'] == 'Buy' %}buy-signal{% elif row['Trade Signal'] == 'Sell' %}sell-signal{% endif %}">
                    <td>{{ row['Date'].strftime('%Y-%m-%d') }}</td>
                    <td>{{ row['Actual'] }}</td>
                    <td>{{ row['Predicted'] }}</td>
                    <td>{{ row['Price Diff'] }}</td>
                    <td>{{ row['MACD'] }}</td>
                    <td>{{ row['Signal'] }}</td>
                    <td>{{ row['RSI'] }}</td>
                    <td>{{ row['Trade Signal'] }}</td>
                    <td>{{ row['Strong Signal'] }}</td>
                </tr>
            {% endfor %}
        </table>

        <script>
            async function updatePrice() {
                const date = document.getElementById('date').value;
                const response = await fetch(`/get_price?date=${date}`);
                const data = await response.json();
                document.getElementById('price').value = data.price;
            }
        </script>
    </body>
    </html>
    ''', data=data, available_dates=available_dates,
                                  cash_capital=cash_capital, stock_capital=stock_capital,
                                  shares_owned=shares_owned, total_return=total_return, avg_cost_price=avg_cost_price,
                                  transaction_message=transaction_message, yearly_return=yearly_return,
                                  graph_url=graph_url, starting_capital=starting_capital,
                                  selected_signal=selected_signal,
                                  filtered_dates=filtered_dates)

@app.route('/get_price')
def get_price():
    date = request.args.get('date')
    price_selected = data.loc[data['Date'] == pd.to_datetime(date), 'Actual'].values[0] if not data.loc[data['Date'] == pd.to_datetime(date)].empty else 0
    return jsonify({'price': price_selected})

@app.route('/', methods=['GET', 'POST'])
def index():
    calculate_indicators()
    find_strong_signals()

    # Default filter value
    selected_signal = 'all'
    filtered_dates = data['Date'].dt.strftime('%Y-%m-%d').tolist()

    if request.method == 'POST':
        selected_signal = request.form.get('signal')

        # Filter dates based on the selected signal
        if selected_signal == 'Strong Buy':
            filtered_dates = data[data['Strong Signal'] == 'Strong Buy']['Date'].dt.strftime('%Y-%m-%d').tolist()
        elif selected_signal == 'Strong Sell':
            filtered_dates = data[data['Strong Signal'] == 'Strong Sell']['Date'].dt.strftime('%Y-%m-%d').tolist()


def calculate_yearly_return():
    return (total_return / starting_capital) * 100 if starting_capital > 0 else 0

if __name__ == '__main__':
    app.run(debug=True)