"""Generate a realistic ERP export JSON for a Malaysian export-import company.

Output: erp_data.json (SAP/Oracle-like extract)
Base currency: MYR

Usage:
  python generate_erp_data.py
  python generate_erp_data.py --output erp_data.json --seed 42
"""

from __future__ import annotations

import argparse
import json
import random
from dataclasses import asdict, dataclass
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class CashAccount:
    account_id: str
    bank_name: str
    account_nickname: str
    currency: str
    available_balance: float
    ledger_balance: float
    as_of_date: str  # YYYY-MM-DD


def _iso(d: date) -> str:
    return d.strftime("%Y-%m-%d")


def _now_utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _money(value: float) -> float:
    # Round like typical ERP exports
    return float(f"{value:.2f}")


def generate_erp_export(*, seed: int | None = None) -> dict[str, Any]:
    rng = random.Random(seed)
    today = date.today()

    company = {
        "company_code": "MY01",
        "company_name": "Selat Straits Export-Import Sdn Bhd",
        "country": "MY",
        "base_currency": "MYR",
        "industry": "Export-Import / Trading",
        "tax_id": "C-2026-EXIM-0199",
    }

    cash_accounts = [
        CashAccount(
            account_id="BA-10023001",
            bank_name="Maybank Berhad",
            account_nickname="Operating MYR",
            currency="MYR",
            available_balance=_money(rng.uniform(2_000_000, 4_500_000)),
            ledger_balance=_money(rng.uniform(2_100_000, 4_700_000)),
            as_of_date=_iso(today),
        ),
        CashAccount(
            account_id="BA-20011002",
            bank_name="CIMB Bank",
            account_nickname="Collections USD",
            currency="USD",
            available_balance=_money(rng.uniform(250_000, 900_000)),
            ledger_balance=_money(rng.uniform(260_000, 920_000)),
            as_of_date=_iso(today),
        ),
        CashAccount(
            account_id="BA-30004519",
            bank_name="HSBC Malaysia",
            account_nickname="Trade EUR",
            currency="EUR",
            available_balance=_money(rng.uniform(90_000, 300_000)),
            ledger_balance=_money(rng.uniform(95_000, 320_000)),
            as_of_date=_iso(today),
        ),
    ]

    # Suppliers typical for a MY exporter/importer
    suppliers = [
        {
            "supplier_id": "SUP-00041",
            "supplier_name": "Port Klang Logistics Sdn Bhd",
            "category": "Logistics & Freight",
            "average_lead_time_days": 7,
            "country": "MY",
            "payment_terms": "NET30",
        },
        {
            "supplier_id": "SUP-00077",
            "supplier_name": "Nippon Packaging Co., Ltd.",
            "category": "Packaging Materials",
            "average_lead_time_days": 21,
            "country": "JP",
            "payment_terms": "NET45",
        },
        {
            "supplier_id": "SUP-00112",
            "supplier_name": "Johor Cold Chain Services",
            "category": "Warehousing",
            "average_lead_time_days": 3,
            "country": "MY",
            "payment_terms": "NET30",
        },
        {
            "supplier_id": "SUP-00155",
            "supplier_name": "Sunda Chemicals Pte Ltd",
            "category": "Raw Materials",
            "average_lead_time_days": 14,
            "country": "SG",
            "payment_terms": "NET30",
        },
        {
            "supplier_id": "SUP-00201",
            "supplier_name": "EuroTech Spare Parts GmbH",
            "category": "Maintenance & Spares",
            "average_lead_time_days": 28,
            "country": "DE",
            "payment_terms": "NET60",
        },
        {
            "supplier_id": "SUP-00238",
            "supplier_name": "Borneo Pallet & Crate Industries",
            "category": "Packaging Materials",
            "average_lead_time_days": 10,
            "country": "MY",
            "payment_terms": "NET30",
        },
    ]

    supplier_by_id = {s["supplier_id"]: s for s in suppliers}

    # Payables: 5-10 upcoming invoices
    priorities = ["High", "Medium", "Low"]
    payable_templates = [
        ("SUP-00041", "INV-AP-2026-04-", "MYR", (120_000, 260_000)),
        ("SUP-00077", "INV-AP-2026-04-", "USD", (45_000, 120_000)),
        ("SUP-00112", "INV-AP-2026-04-", "MYR", (40_000, 90_000)),
        ("SUP-00155", "INV-AP-2026-04-", "USD", (30_000, 85_000)),
        ("SUP-00201", "INV-AP-2026-04-", "EUR", (18_000, 55_000)),
        ("SUP-00238", "INV-AP-2026-04-", "MYR", (25_000, 60_000)),
    ]

    n_payables = rng.randint(7, 9)
    payables = []
    for i in range(n_payables):
        supplier_id, inv_prefix, currency, (lo, hi) = rng.choice(payable_templates)
        supplier = supplier_by_id[supplier_id]
        due_in_days = rng.randint(3, 45)
        amount = _money(rng.uniform(lo, hi))

        due_date = _iso(today + timedelta(days=due_in_days))
        priority = rng.choices(priorities, weights=[0.35, 0.5, 0.15], k=1)[0]

        payables.append(
            {
                "invoice_id": f"{inv_prefix}{rng.randint(1000, 9999)}",
                "supplier_id": supplier_id,
                "supplier_name": supplier["supplier_name"],
                "amount": amount,
                "currency": currency,
                "due_date": due_date,
                "priority": priority,
                "invoice_date": _iso(today - timedelta(days=rng.randint(1, 25))),
                "po_reference": f"PO-{today.year}-{rng.randint(10000, 99999)}",
                "status": "Open",
                "payment_terms": supplier["payment_terms"],
                "cost_center": rng.choice(["FIN", "OPS", "LOG", "PROC"]),
                # Human-readable fields (as requested)
                "Supplier Name": supplier["supplier_name"],
                "Amount": amount,
                "Currency": currency,
                "Due Date": due_date,
                "Priority": priority,
            }
        )

    # Receivables: 3 incoming payments from international clients
    clients = [
        {"client_id": "CUST-10018", "client_name": "Pacific Hardware Trading LLC", "country": "AE"},
        {"client_id": "CUST-10044", "client_name": "Nordic Components AB", "country": "SE"},
        {"client_id": "CUST-10063", "client_name": "Golden Coast Retail Pty Ltd", "country": "AU"},
    ]
    receivable_currencies = ["USD", "EUR", "MYR"]

    receivables = []
    for idx, client in enumerate(clients, start=1):
        currency = receivable_currencies[idx % len(receivable_currencies)]
        expected_in_days = rng.randint(2, 30)
        amount_range = {
            "USD": (80_000, 250_000),
            "EUR": (55_000, 180_000),
            "MYR": (180_000, 520_000),
        }[currency]

        receivables.append(
            {
                "ar_document_id": f"AR-2026-04-{rng.randint(10000, 99999)}",
                "client_id": client["client_id"],
                "client_name": client["client_name"],
                "amount": _money(rng.uniform(*amount_range)),
                "currency": currency,
                "expected_settlement_date": _iso(today + timedelta(days=expected_in_days)),
                "invoice_reference": f"INV-AR-2026-04-{rng.randint(1000, 9999)}",
                "status": "Open",
                "payment_method": rng.choice(["TT", "LC", "Open Account"]),
                "country": client["country"],
            }
        )

    # Summaries (typical ERP export convenience fields)
    cash_balances_summary = {
        "base_currency": "MYR",
        "accounts": [asdict(a) for a in cash_accounts],
        "balances_by_currency": {
            "MYR": _money(sum(a.available_balance for a in cash_accounts if a.currency == "MYR")),
            "USD": _money(sum(a.available_balance for a in cash_accounts if a.currency == "USD")),
            "EUR": _money(sum(a.available_balance for a in cash_accounts if a.currency == "EUR")),
        },
        "as_of": _iso(today),
    }

    export = {
        "extract_metadata": {
            "source_system": "SAP S/4HANA",
            "extract_id": f"EXTR-{today.strftime('%Y%m%d')}-{rng.randint(1000, 9999)}",
            "extracted_at_utc": _now_utc_iso(),
            "schema_version": "1.0",
            "environment": "PRD",
        },
        "company": company,
        "cash_balances": cash_balances_summary,
        "payables": payables,
        "receivables": receivables,
        "supplier_registry": [
            {
                **s,
                "Category": s.get("category"),
                "Average Lead Time": s.get("average_lead_time_days"),
            }
            for s in suppliers
        ],
    }

    return export


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate ERP export JSON for TREASURAi")
    parser.add_argument("--output", default="erp_data.json", help="Output JSON filename")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducible output")
    args = parser.parse_args()

    payload = generate_erp_export(seed=args.seed)
    out_path = Path(args.output)
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {out_path.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
