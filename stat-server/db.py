from core import db
from sqlalchemy import Column, Integer, String, ForeignKey, JSON, BigInteger
from sqlalchemy.orm import relationship


class Request(db.Model):
    __tablename__ = "request"
    id = Column(BigInteger, primary_key=True)
    ip = Column(String, nullable=False)
    tcd_address = Column(String, nullable=False)
    key = Column(String, nullable=False)
    status = Column(String)
    value = Column(String)
    timestamp = Column(Integer)
    requested_at = Column(Integer, index=True)
    responsed_at = Column(Integer)
    tx_hash = Column(String)

    reports = relationship("ProviderReport", lazy="joined")
    agreements = relationship("ProviderAggregation", lazy="joined")


class Provider(db.Model):
    __tablename__ = "provider"
    address = Column(String, primary_key=True)
    endpoint = Column(String)
    name = Column(String)

    reports = relationship("ProviderReport")
    agreements = relationship("ProviderAggregation")


class ProviderReport(db.Model):
    __tablename__ = "provider_report"
    request_id = Column(BigInteger, ForeignKey("request.id"), primary_key=True)
    provider_address = Column(String, ForeignKey("provider.address"), primary_key=True)
    output_type = Column(String, nullable=False)
    value = Column(String)
    timestamp = Column(Integer)
    signature = Column(JSON)
    created_at = Column(Integer)

    provider = relationship("Provider", back_populates="reports")


class ProviderAggregation(db.Model):
    __tablename__ = "provider_aggregation"
    request_id = Column(BigInteger, ForeignKey("request.id"), primary_key=True)
    provider_address = Column(String, ForeignKey("provider.address"), primary_key=True)
    status = Column(String, nullable=False)
    value = Column(String)
    timestamp = Column(Integer)
    signature = Column(JSON)
    created_at = Column(Integer)

    provider = relationship("Provider", back_populates="agreements")
