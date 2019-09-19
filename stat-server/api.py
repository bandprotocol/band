from core import app
from db import db, Request

from flask import request, jsonify, abort


@app.route("/healthcheck")
def healthcheck():
    return "OK"


@app.route("/requests")
def get_requests():
    # Reqeust parameter
    limit = int(request.args.get("limit", "10"))
    page = int(request.args.get("page", "1")) - 1
    dataset = request.args.get("dataset")
    key = request.args.get("key")
    status = request.args.get("status")

    query = db.session.query(Request).order_by(Request.requested_at.desc())

    if key is not None:
        query = query.filter_by(key="0x"+str.encode(key).hex())
    if dataset is not None:
        query = query.filter_by(tcd_address=dataset)
    if status is not None:
        query = query.filter_by(status=status)
    results = []
    for req in query.offset(limit*page).limit(limit).all():
        req_obj = {
            "dataset": req.tcd_address,
            "key": bytes.fromhex(req.key[2:]).decode("utf-8"),
            "ts": req.timestamp,
            "value": req.value and str(int(req.value, 0)),
            "status": req.status or "NOT_FOUND"
            if len(req.reports) > 0
            else "IN_PROGRESS",
            "report": [
                {
                    "nodeName": report.provider.name,
                    "address": report.provider_address,
                    "answer": report.output_type,
                    "value": str(int(report.value, 0)),
                    "ts": report.timestamp,
                    "sig": report.signature,
                }
                for report in req.reports
            ],
            "agreement": [
                {
                    "nodeName": agreement.provider.name,
                    "address": agreement.provider_address,
                    "status": agreement.status,
                    "value": str(int(agreement.value, 0)),
                    "ts": agreement.timestamp,
                    "sig": agreement.signature,
                }
                for agreement in req.agreements
            ],
        }
        results.append(req_obj)
    return jsonify(results)


@app.route("/report-detail")
def get_report_detail():
    dataset = request.args.get("dataset") or abort(400, "Dataset missing")
    key = request.args.get("key") or abort(400, "Key missing")
    timestamp = request.args.get("timestamp") or abort(400, "Timestamp missing")
    status = request.args.get("status") or abort(400, "Status missing")
    value = request.args.get("value") or abort(400, "Status missing")

    if not key.startswith("0x"):
        key = "0x"+str.encode(key).hex()
    query = db.session.query(Request).filter_by(
        tcd_address=dataset, key=key, timestamp=timestamp, status=status
    )

    if value is not None:
        print('0x'+hex(int(value))[2:].rjust(64,'0'))
        query = query.filter_by(value='0x'+hex(int(value))[2:].rjust(64,'0'))

    req = query.first()
    if req is None:
        return jsonify({"report": [], "agreement": []})
    return jsonify(
        {
            "report": [
                {
                    "nodeName": report.provider.name,
                    "address": report.provider_address,
                    "answer": report.output_type,
                    "value": str(int(report.value, 0)),
                    "ts": report.timestamp,
                    "sig": report.signature,
                }
                for report in req.reports
            ],
            "agreement": [
                {
                    "nodeName": agreement.provider.name,
                    "address": agreement.provider_address,
                    "status": agreement.status,
                    "value": str(int(agreement.value, 0)),
                    "ts": agreement.timestamp,
                    "sig": agreement.signature,
                }
                for agreement in req.agreements
            ],
        }
    )
