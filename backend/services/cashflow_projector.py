
from datetime import datetime, timedelta
from typing import Dict, List, Any

def project_cash_flow(payload: Dict[str, Any], decisions: List[Dict[str, Any]], days: int = 30):
    """
    Calculates 30-day cash flow projection (Original vs Optimized)
    Member 4: Advanced Orchestration
    """
    base_date_str = payload["market_context"]["fetched_at_utc"].split("T")[0]
    base_date = datetime.strptime(base_date_str, "%Y-%m-%d")
    
    # Initial balances
    initial_balances = payload["company_data"]["cash_balances"]["balances_by_currency"]
    base_currency = payload["market_context"]["base_currency"]
    
    # Mock exchange rates (for simplicity in projection)
    rates = {"USD": 4.7, "EUR": 5.0, "MYR": 1.0}
    
    def to_base(amount, curr):
        return amount * rates.get(curr, 1.0)

    # 1. Prepare Daily Slots
    projection = []
    for i in range(days + 1):
        date = base_date + timedelta(days=i)
        projection.append({
            "date": date.strftime("%Y-%m-%d"),
            "original": 0.0,
            "optimized": 0.0,
            "inflow": 0.0,
            "outflow": 0.0,
            "optimizations": []
        })

    # 2. Map Original Inflows (Receivables)
    for rec in payload["company_data"].get("receivables", []):
        if "due_date" not in rec or not rec["due_date"]:
            continue
        try:
            due_date = datetime.strptime(rec["due_date"], "%Y-%m-%d")
            day_diff = (due_date - base_date).days
            if 0 <= day_diff <= days:
                projection[day_diff]["inflow"] += to_base(rec.get("amount", 0), rec.get("currency", "MYR"))
        except (ValueError, TypeError):
            continue

    # 3. Map Original Outflows (Payables)
    for pay in payload["company_data"].get("payables", []):
        if "due_date" not in pay or not pay["due_date"]:
            continue
        try:
            due_date = datetime.strptime(pay["due_date"], "%Y-%m-%d")
            day_diff = (due_date - base_date).days
            if 0 <= day_diff <= days:
                projection[day_diff]["outflow"] += to_base(pay.get("amount", 0), pay.get("currency", "MYR"))
        except (ValueError, TypeError):
            continue

    # 4. Apply Optimized Changes (Decisions)
    optimized_outflows = [0.0] * (days + 1)
    for pay in payload["company_data"].get("payables", []):
        if "due_date" not in pay or not pay["due_date"]:
            continue
        try:
            due_date = datetime.strptime(pay["due_date"], "%Y-%m-%d")
            day_diff = (due_date - base_date).days
            
            # Check if any decision applies to this payable (simplified match by amount/currency for demo)
            applied = False
            for d in decisions:
                if d.get("action") == "DELAY_PAYMENT" and abs(d.get("amount", 0) - pay.get("amount", 0)) < 1:
                    # Move outflow by 14 days (or as per decision)
                    new_day = min(max(0, day_diff + 14), days)
                    if 0 <= new_day <= days:
                        optimized_outflows[new_day] += to_base(pay.get("amount", 0), pay.get("currency", "MYR"))
                        projection[new_day]["optimizations"].append(f"Delayed {pay.get('invoice_id', 'Invoice')}")
                    applied = True
                    break
            
            if not applied and 0 <= day_diff <= days:
                optimized_outflows[day_diff] += to_base(pay.get("amount", 0), pay.get("currency", "MYR"))
        except (ValueError, TypeError):
            continue

    # 5. Calculate Cumulative Balances
    current_bal_orig = sum(to_base(amt, curr) for curr, amt in initial_balances.items())
    current_bal_opt = current_bal_orig
    
    for i in range(days + 1):
        # Original
        current_bal_orig += projection[i]["inflow"] - projection[i]["outflow"]
        projection[i]["original"] = current_bal_orig
        
        # Optimized
        # (Simplified: conversions usually happen day 0 or 1 in this mock)
        conversion_gain = 0
        for d in decisions:
            if d.get("action") == "CONVERT_CURRENCY" and i == 1:
                conversion_gain += d.get("estimated_savings", 0)
        
        current_bal_opt += projection[i]["inflow"] - optimized_outflows[i] + conversion_gain
        projection[i]["optimized"] = current_bal_opt

    return projection
