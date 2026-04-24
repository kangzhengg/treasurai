"""Data cleaning & normalization utilities for TREASURAi.

- Keyword filtering for treasury-relevant headlines
- Date normalization to ISO (YYYY-MM-DD)
- Currency amount parsing ("1,234.56" -> 1234.56)

Relevance scoring (concept):
  Rank by a weighted blend of:
    - Keyword weight (e.g. FX/MYR/USD > generic Economy)
    - Source credibility (e.g. Tier-1 outlets higher weight)
    - Recency decay (newer headlines matter more)
    - Specificity (mentions of central banks, rate decisions, FX pairs)
  Then sort descending to build a short "what to read first" list for treasury.
"""

from __future__ import annotations

import re
from datetime import date, datetime
from typing import Any, Iterable


DEFAULT_KEYWORDS = [
    "FX",
    "MYR",
    "USD",
    "EUR",
    "Interest Rate",
    "Central Bank",
    "Inflation",
    "Economy",
    # Common synonyms / terms you will see in headlines
    "Ringgit",
    "Forex",
    "Currency",
    "Exchange Rate",
    "Bank Negara",
    "BNM",
    "Federal Reserve",
    "Fed",
    "Treasury",
    "Bond",
    "Yields",
    "Rates",
]


DEFAULT_AMOUNT_FIELDS = {
    "amount",
    "available_balance",
    "ledger_balance",
    "fx_rate",
    "rate",
}


def filter_headlines_by_keywords(
    news_items: Iterable[dict[str, Any]],
    *,
    keywords: list[str] | None = None,
) -> list[dict[str, Any]]:
    """Remove news items whose headline doesn't contain relevant keywords."""

    keywords = keywords or DEFAULT_KEYWORDS
    # Build case-insensitive regex with word boundaries where reasonable
    escaped = [re.escape(k) for k in keywords]
    pattern = re.compile(r"(" + "|".join(escaped) + r")", re.IGNORECASE)

    kept: list[dict[str, Any]] = []
    for item in news_items:
        headline = str(item.get("headline", "") or "")
        if pattern.search(headline):
            kept.append(dict(item))
    return kept


def normalize_date_to_iso(value: Any) -> str | None:
    """Normalize a date-like value into ISO YYYY-MM-DD.

    Accepts:
      - date/datetime
      - ISO strings
      - common RSS date strings
    """

    if value is None:
        return None

    if isinstance(value, date) and not isinstance(value, datetime):
        return value.strftime("%Y-%m-%d")

    if isinstance(value, datetime):
        return value.date().strftime("%Y-%m-%d")

    text = str(value).strip()
    if not text:
        return None

    # Fast path: already ISO date
    try:
        dt = datetime.fromisoformat(text.replace("Z", "+00:00"))
        return dt.date().strftime("%Y-%m-%d")
    except Exception:
        pass

    # Try a few common RSS-ish formats
    formats = [
        "%a, %d %b %Y %H:%M:%S %Z",  # Tue, 12 Mar 2024 06:00:00 GMT
        "%a, %d %b %Y %H:%M:%S %z",  # Tue, 12 Mar 2024 06:00:00 +0000
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(text, fmt).date().strftime("%Y-%m-%d")
        except Exception:
            continue

    # Best-effort: find YYYY-MM-DD inside the string
    m = re.search(r"(\d{4}-\d{2}-\d{2})", text)
    if m:
        return m.group(1)

    return None


_CURRENCY_CLEAN_RE = re.compile(r"[^0-9.\-]", re.UNICODE)


def parse_currency_to_float(value: Any) -> float | None:
    """Convert currency-like strings into floats.

    Examples:
      "MYR 1,234.50" -> 1234.5
      "USD-2,000" -> -2000.0
      123 -> 123.0
    """

    if value is None:
        return None

    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).strip()
    if not text:
        return None

    cleaned = _CURRENCY_CLEAN_RE.sub("", text)
    if cleaned in {"", "-", "."}:
        return None

    try:
        return float(cleaned)
    except Exception:
        return None


def normalize_news_items(news_items: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
    """Normalize news item fields in-place (copying each dict)."""

    normalized: list[dict[str, Any]] = []
    for item in news_items:
        copied = dict(item)
        copied["published_at"] = normalize_date_to_iso(copied.get("published_at"))
        normalized.append(copied)
    return normalized


def normalize_currency_fields(
    obj: Any,
    *,
    amount_fields: set[str] | None = None,
) -> Any:
    """Deep-normalize known currency/amount fields into floats.

    This is intentionally conservative: it only converts values for keys
    that look like amount fields (e.g. "amount", "available_balance").
    """

    amount_fields = amount_fields or DEFAULT_AMOUNT_FIELDS

    if isinstance(obj, list):
        return [normalize_currency_fields(x, amount_fields=amount_fields) for x in obj]
    if isinstance(obj, dict):
        converted: dict[str, Any] = {}
        for k, v in obj.items():
            if isinstance(k, str) and k in amount_fields:
                converted[k] = parse_currency_to_float(v)
            else:
                converted[k] = normalize_currency_fields(v, amount_fields=amount_fields)
        return converted
    return obj


def score_news_item_for_treasury(
    item: dict[str, Any],
    *,
    keyword_weights: dict[str, float] | None = None,
) -> float:
    """Simple heuristic relevance score for treasury.

    Not required for ingestion; provided as a starting point.
    """

    headline = str(item.get("headline", "") or "")
    source = str(item.get("source", "") or "")

    keyword_weights = keyword_weights or {
        "FX": 3.0,
        "MYR": 3.0,
        "USD": 2.5,
        "EUR": 2.0,
        "Interest Rate": 3.0,
        "Central Bank": 2.8,
        "Inflation": 2.2,
        "Economy": 1.2,
    }

    score = 0.0
    for kw, w in keyword_weights.items():
        if re.search(re.escape(kw), headline, re.IGNORECASE):
            score += w

    # Source credibility (very rough starter weights)
    tier1_sources = {"Reuters", "Bloomberg", "CNBC", "Yahoo Finance", "WSJ", "Wall Street Journal"}
    if any(s.lower() in source.lower() for s in tier1_sources):
        score += 0.5

    return score
