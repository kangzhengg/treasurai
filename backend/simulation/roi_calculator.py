"""
ROI Calculator Engine
Calculates financial returns on treasury decisions
Produces monthly/yearly projections with measurable KPIs
"""


class ROICalculator:
    def __init__(self):
        self.days_per_year = 365
        self.days_per_month = 30.44  # Average days per month

    def calculate_fx_strategy_roi(self, strategy, baseline_amount, execution_cost, savings, timeframe_months=1):
        """Calculate ROI for FX strategy decision"""
        timeframe_years = timeframe_months / 12
        savings_per_month = savings / timeframe_months
        savings_per_year = savings / timeframe_years

        # Calculate ROI percentage
        roi = (savings / execution_cost) * 100
        roi_annualized = roi / timeframe_years

        # Payback period in days
        payback_days = (execution_cost / (savings / (timeframe_months * self.days_per_month)))

        return {
            'strategy': strategy,
            'timeframe': f'{timeframe_months} month{"s" if timeframe_months > 1 else ""}',
            'baseline': round(baseline_amount, 0),
            'execution_cost': round(execution_cost, 0),
            'gross_savings': round(savings, 0),
            'net_savings': round(savings - execution_cost, 0),
            'roi': {
                'percentage': f'{roi:.2f}%',
                'annualized': f'{roi_annualized:.2f}%',
                'payback_days': f'{payback_days:.1f} days',
            },
            'projections': {
                'weekly': round(savings_per_month / 4.3, 0),
                'monthly': round(savings_per_month, 0),
                'quarterly': round(savings_per_month * 3, 0),
                'semi_annual': round(savings_per_month * 6, 0),
                'annual': round(savings_per_year, 0),
            },
            'scorecard': {
                'efficiency': '⭐⭐⭐⭐⭐' if roi > 50 else '⭐⭐⭐⭐' if roi > 20 else '⭐⭐⭐' if roi > 5 else '⭐⭐',
                'time_to_value': 'Immediate' if payback_days < 7 else 'Quick (< 30 days)' if payback_days < 30 else 'Medium-term',
                'recommendation': 'HIGHLY RECOMMENDED' if roi > 50 else 'RECOMMENDED' if roi > 20 else 'CONSIDER',
            },
        }

    def calculate_supplier_negotiation_roi(
        self,
        supplier_name,
        current_price,
        negotiated_price,
        quantity,
        negotiation_effort='BALANCED',
        monthly_recurrence=True
    ):
        """Calculate ROI for supplier negotiation"""
        savings_per_transaction = current_price - negotiated_price
        transactions_per_year = 12 if monthly_recurrence else 1
        annual_savings = savings_per_transaction * quantity * transactions_per_year

        # Negotiation effort cost (internal resources)
        effort_costs = {
            'AGGRESSIVE': 5000,
            'BALANCED': 2500,
            'COLLABORATIVE': 1500,
        }
        effort_cost = effort_costs.get(negotiation_effort, 2500)

        # First transaction benefit
        first_transaction_savings = savings_per_transaction * quantity

        # Payback period
        payback_transactions = effort_cost / (savings_per_transaction * quantity) if monthly_recurrence else 1
        payback_months = payback_transactions * (1 if monthly_recurrence else 12)

        roi = ((annual_savings - effort_cost) / effort_cost) * 100

        return {
            'supplier': supplier_name,
            'current_price': f'{current_price:.2f}',
            'negotiated_price': f'{negotiated_price:.2f}',
            'discount_amount': f'{savings_per_transaction:.2f}',
            'discount_percent': f'{(savings_per_transaction / current_price) * 100:.2f}%',
            'quantity': quantity,
            'roi': {
                'first_transaction': round(first_transaction_savings, 0),
                'annual': round(annual_savings, 0),
                'net_annual': round(annual_savings - effort_cost, 0),
                'percentage': f'{roi:.2f}%',
            },
            'effort': {
                'estimated_hours': self._effort_to_hours(negotiation_effort),
                'internal_cost': round(effort_cost, 0),
                'time_to_payback': f'{payback_months:.1f} months',
            },
            'projections': {
                'monthly': round(annual_savings / 12, 0),
                'quarterly': round(annual_savings / 4, 0),
                'semi_annual': round(annual_savings / 2, 0),
                'annual': round(annual_savings, 0),
                'three_year': round(annual_savings * 3, 0),
                'five_year': round(annual_savings * 5, 0),
            },
            'scorecard': {
                'impact': '⭐⭐⭐⭐⭐' if annual_savings > 100000 else '⭐⭐⭐⭐' if annual_savings > 50000 else '⭐⭐⭐',
                'payback_speed': 'Immediate' if payback_months < 1 else 'Very Quick' if payback_months < 3 else 'Quick' if payback_months < 6 else 'Medium-term',
                'recommendation': 'PRIORITY' if roi > 100 else 'STRONGLY RECOMMENDED' if roi > 50 else 'RECOMMENDED' if roi > 20 else 'OPTIONAL',
                'recurring_benefit': 'YES (repeats monthly)' if monthly_recurrence else 'ONE-TIME',
            },
        }

    def calculate_comprehensive_roi(self, decisions):
        """Calculate comprehensive ROI across multiple decisions"""
        total_savings = 0
        total_costs = 0
        breakdown_by_type = {}

        for decision in decisions:
            savings = decision.get('savings') or decision.get('annual_savings') or 0
            cost = decision.get('cost') or decision.get('effort_cost') or 0

            total_savings += savings
            total_costs += cost

            decision_type = decision.get('type')
            if decision_type not in breakdown_by_type:
                breakdown_by_type[decision_type] = {'savings': 0, 'cost': 0, 'count': 0}
            breakdown_by_type[decision_type]['savings'] += savings
            breakdown_by_type[decision_type]['cost'] += cost
            breakdown_by_type[decision_type]['count'] += 1

        net_benefit = total_savings - total_costs
        roi = (net_benefit / total_costs) * 100 if total_costs > 0 else 0
        roi_annualized = roi

        return {
            'overview': {
                'total_decisions': len(decisions),
                'total_savings': round(total_savings, 0),
                'total_costs': round(total_costs, 0),
                'net_benefit': round(net_benefit, 0),
                'roi': f'{roi:.2f}%',
                'roi_annualized': f'{roi_annualized:.2f}%',
            },
            'breakdown': [
                {
                    'type': decision_type,
                    'decisions': data['count'],
                    'savings_per_decision': round(data['savings'] / data['count'], 0),
                    'total_savings': round(data['savings'], 0),
                    'total_cost': round(data['cost'], 0),
                    'net_benefit': round(data['savings'] - data['cost'], 0),
                    'roi': f'{((data["savings"] - data["cost"]) / data["cost"] * 100):.2f}%',
                }
                for decision_type, data in breakdown_by_type.items()
            ],
            'projections': {
                'monthly': round(total_savings / 12, 0),
                'quarterly': round(total_savings / 4, 0),
                'annual': round(total_savings, 0),
                'three_year': round(total_savings * 3, 0),
                'five_year': round(total_savings * 5, 0),
            },
            'performance': {
                'best_decision': self._identify_best_decision(decisions),
                'quickest_payback': self._quickest_payback(decisions),
                'highest_impact': self._highest_impact(decisions),
            },
            'scorecard': {
                'overall_evaluation': '⭐⭐⭐⭐⭐ EXCEPTIONAL' if roi > 100 else '⭐⭐⭐⭐ EXCELLENT' if roi > 50 else '⭐⭐⭐ GOOD' if roi > 20 else '⭐⭐ MODEST',
                'implementation_recommendation': 'IMPLEMENT ALL' if net_benefit > 50000 else 'IMPLEMENT TOP PRIORITY',
            },
        }

    def _effort_to_hours(self, effort_level):
        """Convert effort level to estimated hours"""
        effort_map = {
            'AGGRESSIVE': 40,
            'BALANCED': 20,
            'COLLABORATIVE': 10,
        }
        return effort_map.get(effort_level, 20)

    def _identify_best_decision(self, decisions):
        """Identify best decision by ROI"""
        if not decisions:
            return None
        return max(decisions, key=lambda d: d.get('savings', 0))

    def _quickest_payback(self, decisions):
        """Identify decision with quickest payback"""
        if not decisions:
            return None
        return min(decisions, key=lambda d: d.get('cost', float('inf')))

    def _highest_impact(self, decisions):
        """Identify decision with highest impact"""
        if not decisions:
            return None
        return max(decisions, key=lambda d: d.get('savings', 0))
