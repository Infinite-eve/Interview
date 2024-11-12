import pandas as pd
import ta
import matplotlib.pyplot as plt
import os

# Load your data
data = pd.read_csv('apple/lstm_predictions.csv')

# Calculate MACD using predicted prices
macd = ta.trend.MACD(data['Predicted'])
data['MACD'] = macd.macd()
data['Signal'] = macd.macd_signal()

# Calculate RSI using predicted prices
data['RSI'] = ta.momentum.RSIIndicator(data['Predicted']).rsi()

# Calculate price difference
data['Price Diff'] = data['Predicted'].diff().fillna(0)

# Define the strategy
def apply_strategy(row):
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

# Apply the strategy
data['Trade Signal'] = data.apply(apply_strategy, axis=1)

# Create a figure with three subplots
fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(16, 12), sharex=True)

# Plot Actual and Predicted Price
ax1.plot(data.index, data['Actual'], label='Actual Price', color='blue', linewidth=1.5)
ax1.plot(data.index, data['Predicted'], label='Predicted Price', color='orange', linestyle='--', linewidth=1.5)
buy_signals = data[data['Trade Signal'] == 'Buy']
sell_signals = data[data['Trade Signal'] == 'Sell']
ax1.scatter(buy_signals.index, buy_signals['Predicted'], label='Buy Signal', marker='^', color='green', alpha=1)
ax1.scatter(sell_signals.index, sell_signals['Predicted'], label='Sell Signal', marker='v', color='red', alpha=1)
ax1.set_title('Stock Price with Buy/Sell Signals')
ax1.set_ylabel('Price')
ax1.legend(loc='best')
ax1.grid(True)

# Plot MACD
ax2.plot(data.index, data['MACD'], label='MACD', color='purple', linewidth=1.5)
ax2.plot(data.index, data['Signal'], label='Signal Line', color='orange', linestyle='--', linewidth=1.5)
ax2.set_title('MACD')
ax2.set_ylabel('MACD Value')
ax2.axhline(0, color='black', lw=0.5, ls='--')
ax2.legend(loc='best')
ax2.grid(True)

# Plot RSI
ax3.plot(data.index, data['RSI'], label='RSI', color='blue', linewidth=1.5)
ax3.axhline(70, color='red', lw=0.5, ls='--')  # Overbought line
ax3.axhline(30, color='green', lw=0.5, ls='--')  # Oversold line
ax3.set_title('RSI')
ax3.set_ylabel('RSI Value')
ax3.set_ylim(0, 100)
ax3.legend(loc='best')
ax3.grid(True)

# Adjust layout
plt.tight_layout()
plt.savefig('plot.png')  # Save the plot as an image
plt.close()

# Function to color table rows based on 'Trade Signal'
def color_row(row):
    # Color for Trade Signal
    if row['Trade Signal'] == 'Buy':
        trade_color = 'background-color: lightgreen;'
    elif row['Trade Signal'] == 'Sell':
        trade_color = 'background-color: lightcoral;'
    else:
        trade_color = ''

    return f'<tr><td>{row["Actual"]}</td><td>{row["Predicted"]}</td>' + \
           f'<td>{row["Price Diff"]}</td><td>{row["MACD"]}</td>' + \
           f'<td>{row["Signal"]}</td><td>{row["RSI"]}</td>' + \
           f'<td style="{trade_color}">{row["Trade Signal"]}</td></tr>'

# Create HTML table rows with inline styles
table_rows = ''.join(color_row(row) for _, row in data.iterrows())

# Full HTML structure
html_content = f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apple LSTM Trading Results</title>
    <style>
        body {{ font-family: Arial, sans-serif; }}
        table {{ border-collapse: collapse; width: 100%; margin-top: 20px; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: center; }}
        th {{ background-color: #f2f2f2; }}
        img {{ width: 100%; max-width: 900px; margin-top: 20px; }}
    </style>
</head>
<body>
    <h1>Apple LSTM Trading Results</h1>
    <img src="plot.png" alt="Stock Price with Buy/Sell Signals">
    <table>
        <thead>
            <tr><th>Actual</th><th>Predicted</th><th>Price Diff</th><th>MACD</th><th>Signal</th><th>RSI</th><th>Trade Signal</th></tr>
        </thead>
        <tbody>
            {table_rows}
        </tbody>
    </table>
</body>
</html>
'''

# Save the HTML content to a file
html_file_path = os.path.abspath('appleTradingResults_lstm.html')
with open(html_file_path, 'w') as file:
    file.write(html_content)

print(f"HTML file saved at: {html_file_path}")