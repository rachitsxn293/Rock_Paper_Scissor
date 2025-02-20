from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

games_store = []  #store for data


@app.route('/save_game_route', methods=['POST'])
def save_game_route():
    try:
        game_res = request.get_json()
        if not game_res:
            return jsonify({"error": "No data"}), 400

        games_store.append(game_res) 
        return jsonify({"message": "Game saved", "game": game_res}), 200
    except Exception as exp:
        return jsonify({"error": "Internal server error"}), 500


@app.route('/last_game_route', methods=['GET'])
def last_game_route():
    if games_store:
        return jsonify({"lastGame": games_store[-1]}), 200
    else:
        return jsonify({"message": "No game found"}), 404

if __name__ == '__main__':
    app.run(debug=True)