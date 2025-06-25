from flask import Flask
from app.utils import register_filters
from .routes import task_bp

app = Flask(__name__)
app.register_blueprint(task_bp)

register_filters(app)


if __name__ == '__main__':
    app.run(debug=True)











