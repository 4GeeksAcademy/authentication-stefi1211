import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_bcrypt import Bcrypt
from flask import Flask
from flask_cors import CORS



ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/api/*": {"origins": "https://potential-acorn-g4qwxg67q6473v9rj-3000.app.github.dev"}})
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this to a secure value
jwt = JWTManager(app)

bcrypt = Bcrypt(app)

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Add the admin
setup_admin(app)

# Add the admin
setup_commands(app)

# Add all endpoints from the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# User registration endpoint
@app.route('/signup', methods=['POST'])
def signup():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'Error, missing required fields'}), 400

    required_fields = ['email', 'password', 'username', 'name']
    missing_fields = [field for field in required_fields if field not in body]
    
    if missing_fields:
        return jsonify({'msg': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    existing_user = User.query.filter_by(email=body['email']).first()
    if existing_user:
        return jsonify({'msg': 'User with this email already exists'}), 400

    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')

    new_user = User(
        username=body["username"],
        name=body["name"],
        email=body["email"],
        password=pw_hash,
        is_active=True
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'msg': 'Registration successful'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error during registration: {str(e)}'}), 500
    finally:
        db.session.close()


def signup():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Origin", "https://potential-acorn-g4qwxg67q6473v9rj-3000.app.github.dev")
        return response

# User login endpoint
@app.route('/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'Error, missing required fields'}), 400

    required_fields = ['email', 'password']
    missing_fields = [field for field in required_fields if field not in body]

    if missing_fields:
        return jsonify({'msg': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    user = User.query.filter_by(email=body['email']).first()

    if user is None or not bcrypt.check_password_hash(user.password, body['password']):
        return jsonify({'msg': 'Incorrect credentials'}), 400

    access_token = create_access_token(identity=user.id)
    return jsonify({'msg': 'OK', 'token': access_token})

# Private endpoint protected by JWT
@app.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(logged_in_as=user.email), 200



# Serve any other file as a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  
    return response

# Run the app if `$ python src/main.py` is executed
if __name__ == '__main__':
    db.create_all()
    app.run(host='0.0.0.0', port=3001, debug=True)

