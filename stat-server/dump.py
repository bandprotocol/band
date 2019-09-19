import os
import sys
import time
from pathlib import Path

from datetime import datetime

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    ForeignKey,
    JSON,
    BigInteger,
)
from sqlalchemy.orm import sessionmaker

from config import DATABASE_URI

engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()


class Request(Base):
    __tablename__ = "request"
    id = Column(BigInteger, primary_key=True)
    ip = Column(String, nullable=False)
    tcd_address = Column(String, nullable=False)
    key = Column(String, nullable=False)
    status = Column(String)
    value = Column(String)
    timestamp = Column(Integer)
    requested_at = Column(Integer)
    responsed_at = Column(Integer)
    tx_hash = Column(String)


class Provider(Base):
    __tablename__ = "provider"
    address = Column(String, primary_key=True)
    endpoint = Column(String)
    name = Column(String)


class ProviderReport(Base):
    __tablename__ = "provider_report"
    request_id = Column(BigInteger, ForeignKey("request.id"), primary_key=True)
    provider_address = Column(String, ForeignKey("provider.address"), primary_key=True)
    output_type = Column(String, nullable=False)
    value = Column(String)
    timestamp = Column(Integer)
    signature = Column(JSON)
    created_at = Column(Integer)


class ProviderAggregation(Base):
    __tablename__ = "provider_aggregation"
    request_id = Column(BigInteger, ForeignKey("request.id"), primary_key=True)
    provider_address = Column(String, ForeignKey("provider.address"), primary_key=True)
    status = Column(String, nullable=False)
    value = Column(String)
    timestamp = Column(Integer)
    signature = Column(JSON)
    created_at = Column(Integer)


Base.metadata.create_all(engine)


def check_provider(address):
    if session.query(Provider).get(address) is None:
        session.add(Provider(address=address))
        session.commit()


def get_signature_json(v, r, s):
    return {"v": v, "r": r, "s": s}


def process_log(log):
    try:
        [id, ts, event, *args] = log.strip().split(",")
        ts = int(ts) / 1000
        if event == "Request":
            if session.query(Request).get(id) is None:
                [tcd_address, key, ip, broadcast] = args
                session.add(
                    Request(
                        id=id, ip=ip, tcd_address=tcd_address, key=key, requested_at=ts
                    )
                )
        elif event == "Report":
            if session.query(Request).get(id) is not None:
                [address, answer, value, timestamp, v, r, s] = args
                check_provider(address)
                session.add(
                    ProviderReport(
                        request_id=id,
                        provider_address=address,
                        output_type=answer,
                        value=value,
                        timestamp=timestamp,
                        signature=get_signature_json(v, r, s),
                        created_at=ts,
                    )
                )
        elif event == "Aggregate":
            if session.query(Request).get(id) is not None:
                [address, status, value, timestamp, v, r, s] = args
                check_provider(address)
                session.add(
                    ProviderAggregation(
                        request_id=id,
                        provider_address=address,
                        status=status,
                        value=value,
                        timestamp=timestamp,
                        signature=get_signature_json(v, r, s),
                        created_at=ts,
                    )
                )
        elif event == "Result":
            request = session.query(Request).get(id)
            if request is not None:
                [value, status, timestamp] = args
                request.status = status
                request.value = value
                request.timestamp = timestamp
                request.responsed_at = ts
        elif event == "Broadcast":
            request = session.query(Request).get(id)
            if request is not None:
                request.tx_hash = args[0]
        session.commit()
    except Exception as e:
        session.rollback()
        print(e)


if __name__ == "__main__":
    today = datetime.utcnow().strftime("%Y-%m-%d")
    directory = str(Path.home()) + "/band-log/"
    current = open(directory + today + ".log", "r")
    curino = os.fstat(current.fileno()).st_ino
    while True:
        while True:
            buf = current.readline()
            if buf == "":
                break
            process_log(buf)
        try:
            current_day = datetime.utcnow().strftime("%Y-%m-%d")
            if today != current_day or os.stat(current.fileno()).st_ino != curino:
                today = current_day
                new = open(directory + today + ".log", "r")
                current.close()
                current = new
                curino = os.fstat(current.fileno()).st_ino
                continue
        except IOError:
            pass
        time.sleep(1)
