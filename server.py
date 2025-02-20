from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

games_store = []  # Store for game data

@app.route('/game', methods=['GET', 'POST'])
def game():
    if request.method == 'POST':
        try:
            game_res = request.get_json()
            if not game_res:
                return jsonify({"error": "No data provided"}), 400
            games_store.append(game_res)
            return jsonify({"message": "Game saved", "game": game_res}), 200
        except Exception as exp:
            return jsonify({"error": "Internal server error"}), 500
    elif request.method == 'GET':
        if games_store:
            return jsonify({"lastGame": games_store[-1]}), 200
        else:
            return jsonify({"message": "No game found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
