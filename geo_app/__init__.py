from flask import Flask

app = Flask(__name__)

from geo_app import view
