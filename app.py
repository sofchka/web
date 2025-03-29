
from flask import Flask, render_template, jsonify, request, send_from_directory
import json
import os

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Load data from JSON file
def load_portfolio_data():
    with open('static/data/data.json', 'r') as file:
        return json.load(file)

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/portfolio-data')
def get_portfolio_data():
    """API endpoint to fetch portfolio data"""
    try:
        data = load_portfolio_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        data = request.json
        # In a real app, you'd process this data (e.g., send email)
        # For now, just print it to console
        print(f"Contact form submission: {data}")
        return jsonify({"success": True, "message": "Message received!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# Adding cache control for better animation performance
@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store'
    return response

if __name__ == '__main__':
    # Create the data directory if it doesn't exist
    os.makedirs('static/data', exist_ok=True)
    
    # Ensure data.json exists
    if not os.path.exists('static/data/data.json'):
        # Copy from src/data/data.json if it exists
        if os.path.exists('src/data/data.json'):
            with open('src/data/data.json', 'r') as src, open('static/data/data.json', 'w') as dst:
                dst.write(src.read())
        else:
            # Create a minimal data.json if source doesn't exist
            with open('static/data/data.json', 'w') as file:
                json.dump({
                    "name": "Sofi Zakaryan",
                    "objective": "Computer Science student with a passion for programming and problem-solving.",
                    "contact": {
                        "email": "sofizaqar@gmail.com"
                    }
                }, file, indent=2)
    
    app.run(debug=True)
