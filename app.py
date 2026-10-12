"""
LoanIQ – Flask Application Backend
"""

import os
import uuid
import json
import datetime
from pathlib import Path

from flask import (
    Flask, render_template, request, redirect, url_for,
    jsonify, send_file, abort, flash, session
)

from config import config

# ── App factory ────────────────────────────────────────────────────────────────

def create_app(config_name: str = 'default') -> Flask:
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    app.config.setdefault('SESSION_COOKIE_SAMESITE', 'Lax')

    # Ensure required directories exist
    Path(app.config['MODELS_DIR']).mkdir(parents=True, exist_ok=True)
    Path(app.config['EXPORT_DIR']).mkdir(parents=True, exist_ok=True)

    # ── Context processors ─────────────────────────────────────────────────────
    @app.context_processor
    def inject_globals():
        return {
            'app_name':     app.config['APP_NAME'],
            'app_subtitle': app.config['APP_SUBTITLE'],
        }

    # ── API Routes for Prediction & Data ───────────────────────────────────────

    @app.route('/api/health')
    def api_health():
        return jsonify({
            'status': 'healthy',
            'app': app.config['APP_NAME'],
            'version': '1.0.0',
        })

    @app.route('/api/predict', methods=['POST'])
    def api_predict():
        data = request.get_json() or request.form
        # Returns prediction response
        return jsonify({
            'status': 'success',
            'message': 'Prediction endpoint ready',
        })

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
