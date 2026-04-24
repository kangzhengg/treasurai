"""Unified data ingestion orchestrator for TREASURAi.

Responsibilities:
  - Load internal ERP export (erp_data.json)
  - Fetch live external market news via NewsFetcher
  - Clean/normalize external context via DataCleaner
  - Combine into glm_ready_payload with keys:
      - internal_financial_status
      - external_market_context
  - Refresh mechanism: rebuild payload every 60 seconds

Usage:
  python data_ingestion.py
  python data_ingestion.py --erp backend/erp_data.json --interval 60 --once
"""

from __future__ import annotations

import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from data_cleaner import filter_headlines_by_keywords, normalize_news_items
from news_fetcher import NewsFetcher


def load_erp_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def build_glm_ready_payload(*, erp_data: dict[str, Any], news_items: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "internal_financial_status": {
            "source": erp_data.get("extract_metadata", {}).get("source_system", "ERP"),
            "extracted_at_utc": erp_data.get("extract_metadata", {}).get("extracted_at_utc"),
            "base_currency": erp_data.get("company", {}).get("base_currency", "MYR"),
            "cash_balances": erp_data.get("cash_balances", {}),
            "payables": erp_data.get("payables", []),
            "receivables": erp_data.get("receivables", []),
            "supplier_registry": erp_data.get("supplier_registry", []),
        },
        "external_market_context": {
            "fetched_at_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "items": news_items,
        },
    }


def refresh_once(*, erp_path: Path, max_news: int = 30) -> dict[str, Any]:
    erp_data = load_erp_json(erp_path)

    fetcher = NewsFetcher()
    raw_news = fetcher.fetch_live_market_data(max_items=max_news)

    filtered = filter_headlines_by_keywords(raw_news)
    normalized = normalize_news_items(filtered)

    return build_glm_ready_payload(erp_data=erp_data, news_items=normalized)


def run_refresh_loop(*, erp_path: Path, interval_seconds: int = 60, max_news: int = 30) -> None:
    while True:
        payload = refresh_once(erp_path=erp_path, max_news=max_news)
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        print("\n--- refreshed ---\n")
        time.sleep(interval_seconds)


def main() -> int:
    parser = argparse.ArgumentParser(description="TREASURAi unified data ingestion")
    parser.add_argument("--erp", default="erp_data.json", help="Path to erp_data.json")
    parser.add_argument("--interval", type=int, default=60, help="Refresh interval in seconds")
    parser.add_argument("--max-news", type=int, default=30, help="Max number of RSS items")
    parser.add_argument("--once", action="store_true", help="Run once and exit")
    args = parser.parse_args()

    erp_path = Path(args.erp)
    if not erp_path.exists():
        raise FileNotFoundError(
            f"ERP file not found: {erp_path}. Generate it with: python generate_erp_data.py"
        )

    if args.once:
        payload = refresh_once(erp_path=erp_path, max_news=args.max_news)
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return 0

    run_refresh_loop(erp_path=erp_path, interval_seconds=args.interval, max_news=args.max_news)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
