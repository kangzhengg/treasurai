"""Real-time financial news fetcher via RSS.

Dependencies:
  pip install -r requirements.txt

This module exposes NewsFetcher.fetch_live_market_data() which returns:
  [{"headline": str, "source": str, "published_at": str}, ...]

"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

try:
    import feedparser
    HAS_FEEDPARSER = True
except ImportError:
    HAS_FEEDPARSER = False


@dataclass
class NewsFetcher:
    feeds: list[str] | None = None
    user_agent: str = "TREASURAi/1.0 (+https://example.invalid)"

    def __post_init__(self) -> None:
        if not self.feeds:
            # Note: some publishers (e.g. Reuters) may require auth or block generic RSS clients.
            # These are generally accessible RSS endpoints for demo use.
            self.feeds = [
                "https://feeds.reuters.com/reuters/businessNews",
                "https://finance.yahoo.com/rss/topstories",
                "https://www.cnbc.com/id/10000664/device/rss/rss.html",  # CNBC Finance
                "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",  # WSJ Markets (may vary by region)
            ]

        # feedparser reads this global when fetching URLs
        if HAS_FEEDPARSER:
            feedparser.USER_AGENT = self.user_agent

    def _to_iso_timestamp(self, entry: Any) -> str | None:
        # Prefer parsed structs if available
        if getattr(entry, "published_parsed", None):
            dt = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
            return dt.isoformat(timespec="seconds")
        if getattr(entry, "updated_parsed", None):
            dt = datetime(*entry.updated_parsed[:6], tzinfo=timezone.utc)
            return dt.isoformat(timespec="seconds")

        # Fallback to a raw string (still better than dropping the field)
        if getattr(entry, "published", None):
            return str(entry.published)
        if getattr(entry, "updated", None):
            return str(entry.updated)
        return None

    def fetch_live_market_data(self, *, max_items: int = 30) -> list[dict[str, str]]:
        """Fetch headlines from configured RSS feeds.

        Gracefully handles network/parse errors or empty feeds by returning an empty list.
        """
        if not HAS_FEEDPARSER:
            # Fallback to mock data if feedparser is missing (Member 4 requirement)
            return [
                {"headline": "US Federal Reserve hints at interest rate stability", "source": "Mock Finance News", "published_at": datetime.now(timezone.utc).isoformat()},
                {"headline": "MYR strengthens against USD amid regional trade growth", "source": "Mock Finance News", "published_at": datetime.now(timezone.utc).isoformat()},
                {"headline": "Global supply chain disruptions easing in Q2 2026", "source": "Mock Finance News", "published_at": datetime.now(timezone.utc).isoformat()}
            ]

        items: list[dict[str, str]] = []

        for url in (self.feeds or []):
            try:
                parsed = feedparser.parse(url)
            except Exception:
                # Connection error or unexpected parser failure
                continue

            if getattr(parsed, "bozo", False) and not getattr(parsed, "entries", None):
                # bozo indicates malformed feed; if there are no entries, treat as empty
                continue

            source = str(getattr(parsed.feed, "title", "Unknown Source") or "Unknown Source")
            entries = list(getattr(parsed, "entries", []) or [])
            if not entries:
                continue

            for entry in entries:
                headline = str(getattr(entry, "title", "") or "").strip()
                if not headline:
                    continue

                published_at = self._to_iso_timestamp(entry) or ""
                items.append(
                    {
                        "headline": headline,
                        "source": source,
                        "published_at": published_at,
                    }
                )

                if len(items) >= max_items:
                    return items

        return items
