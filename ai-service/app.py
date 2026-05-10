from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import bleach
import time

app = Flask(__name__)

CORS(app)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["30 per minute"]
)

start_time = time.time()

# SANITIZE INPUT
def sanitize_input(text):

    cleaned = bleach.clean(text)

    blocked = [
        "<script>",
        "DROP TABLE",
        "SELECT *",
        "--",
        "INSERT INTO",
    ]

    for item in blocked:

        if item.lower() in cleaned.lower():

            return None

    return cleaned

# HEALTH
@app.route("/health", methods=["GET"])
def health():

    uptime = round(
        time.time() - start_time,
        2
    )

    return jsonify({
        "status": "healthy",
        "service": "AI Security Backend",
        "uptime_seconds": uptime,
        "rate_limit": "30 req/min"
    })

# TIMELINE
@app.route("/generate-timeline", methods=["POST"])
@limiter.limit("30 per minute")
def generate_timeline():

    data = request.get_json()

    logs = data.get("logs", "")

    logs = sanitize_input(logs)

    if logs is None:

        return jsonify({
            "error":
            "Potential malicious input detected"
        }), 400

    lines = logs.split("\n")

    timeline = []

    for line in lines:

        if "-" not in line:
            continue

        parts = line.split("-", 1)

        time_part = parts[0].strip()

        event_part = parts[1].strip()

        severity = "Low"

        event_lower = event_part.lower()

        if (
            "failed" in event_lower or
            "warning" in event_lower or
            "suspicious" in event_lower
        ):

            severity = "Medium"

        if (
            "crash" in event_lower or
            "unauthorized" in event_lower or
            "attack" in event_lower or
            "malware" in event_lower or
            "breach" in event_lower
        ):

            severity = "High"

        timeline.append({
            "time": time_part,
            "event": event_part,
            "severity": severity
        })

    return jsonify(timeline)

# AI DESCRIBE
@app.route("/describe", methods=["POST"])
@limiter.limit("30 per minute")
def describe():

    data = request.get_json()

    text = data.get("text", "")

    text = sanitize_input(text)

    if text is None:

        return jsonify({
            "error":
            "Potential malicious input detected"
        }), 400

    return jsonify({

        "generated_at": time.strftime("%H:%M:%S"),

        "description":
        "AI analysis detected suspicious security activity including failed authentication attempts and possible unauthorized access."

    })

# AI RECOMMEND
@app.route("/recommend", methods=["POST"])
@limiter.limit("30 per minute")
def recommend():

    data = request.get_json()

    text = data.get("text", "")

    text = sanitize_input(text)

    if text is None:

        return jsonify({
            "error":
            "Potential malicious input detected"
        }), 400

    recommendations = [

        {
            "priority": "HIGH",
            "action_type": "Security",

            "description":
            "Enable multi-factor authentication immediately."
        },

        {
            "priority": "MEDIUM",
            "action_type": "Monitoring",

            "description":
            "Monitor suspicious login attempts."
        },

        {
            "priority": "HIGH",
            "action_type": "Network",

            "description":
            "Block malicious IP addresses."
        }

    ]

    return jsonify(recommendations)

# AI REPORT
@app.route("/generate-report", methods=["POST"])
@limiter.limit("30 per minute")
def generate_report():

    data = request.get_json()

    text = data.get("text", "")

    text = sanitize_input(text)

    if text is None:

        return jsonify({
            "error":
            "Potential malicious input detected"
        }), 400

    report = {

        "title":
        "Incident Security Analysis Report",

        "summary":
        "Multiple suspicious activities were detected including unauthorized access attempts, malware indicators, and failed authentication events.",

        "risk_level":
        "HIGH",

        "recommendations": [

            "Enable MFA for all accounts",

            "Block malicious IP addresses",

            "Perform immediate malware scan",

            "Review firewall configurations",

            "Monitor suspicious login activity"
        ]
    }

    return jsonify(report)

# HOME
@app.route("/")
def home():

    return "Incident Timeline Visualizer Backend Running"

# RUN
if __name__ == "__main__":

    app.run(debug=True)