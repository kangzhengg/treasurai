"""
FX Simulation Engine
Simulates foreign exchange strategies for currency management
Outputs: convert now, wait, hedge scenarios with cost/savings/risk analysis
"""

import math
from datetime import datetime


class FXSimulator:
    def __init__(self):
        """Initialize FX simulator with market rates and volatility data"""
        # Current market rates (MYR per foreign currency)
        self.rates = {
            'USD': 4.45,
            'EUR': 4.95,
            'GBP': 5.65,
            'SGD': 3.32,
            'CNY': 0.62,
        }

        # Historical volatility (std dev of daily changes)
        self.volatility = {
            'USD': 0.008,    # 0.8% daily volatility
            'EUR': 0.012,    # 1.2% daily volatility
            'GBP': 0.015,    # 1.5% daily volatility
            'SGD': 0.007,    # 0.7% daily volatility
            'CNY': 0.005,    # 0.5% daily volatility
        }

        # Trend direction (1 = strengthen foreign, -1 = weaken foreign)
        self.trends = {
            'USD': 1,        # USD expected to strengthen
            'EUR': -0.5,     # EUR expected to weaken slightly
            'GBP': 0.3,      # GBP expected to strengthen slightly
            'SGD': 0,        # SGD neutral
            'CNY': -0.2,     # CNY expected to weaken
        }

    def simulate_convert_now(self, currency, amount, days_horizon=30):
        """
        Simulate CONVERT NOW strategy
        Execute currency conversion immediately at current rates
        """
        current_rate = self.rates[currency]
        amount_in_rm = amount * current_rate
        fx_fee = amount_in_rm * 0.0015  # 0.15% FX fee

        # Best case: currency actually strengthens (we benefit)
        best_case_rate = current_rate * (1 - self.volatility[currency] * 2)
        best_case_value = (amount * current_rate) + (amount * (current_rate - best_case_rate))

        # Worst case: currency weakens further (we're protected)
        worst_case_rate = current_rate * (1 + self.volatility[currency] * 2)
        worst_case_value = amount_in_rm

        return {
            'strategy': 'CONVERT_NOW',
            'currency': currency,
            'amount': amount,
            'current_rate': round(current_rate, 4),
            'execution_cost': round(amount_in_rm, 2),
            'fx_fee': round(fx_fee, 2),
            'net_cost': round(amount_in_rm + fx_fee, 2),
            'savings': 0,  # No savings on day 0
            'risk_level': 'LOW',
            'confidence': 0.92,
            'best_case': round(best_case_value, 2),
            'worst_case': round(worst_case_value, 2),
            'reasoning': f'Convert {amount} {currency} immediately at {current_rate:.4f} MYR/{currency}. Locks in rate but incurs {fx_fee:.0f} RM fee.',
            'timeline': 'Immediate (1-2 business days)',
        }

    def simulate_wait(self, currency, amount, days_horizon=30):
        """
        Simulate WAIT strategy
        Delay currency conversion hoping for rate improvement
        """
        current_rate = self.rates[currency]
        trend = self.trends[currency]
        volatility = self.volatility[currency]

        # Project rate after days_horizon
        trend_component = trend * volatility * (days_horizon / 30) * 0.5
        projected_rate = current_rate * (1 + trend_component)

        # Cost comparison
        cost_if_convert_today = amount * current_rate
        cost_if_wait = amount * projected_rate
        savings = cost_if_convert_today - cost_if_wait

        # Downside risk: rate moves against us
        down_risk_rate = current_rate * (1 + volatility * math.sqrt(days_horizon / 30) * 1.5)
        down_risk_cost = amount * down_risk_rate
        down_risk_loss = down_risk_cost - cost_if_convert_today

        return {
            'strategy': 'WAIT',
            'currency': currency,
            'amount': amount,
            'current_rate': round(current_rate, 4),
            'projected_rate': round(projected_rate, 4),
            'days_horizon': days_horizon,
            'cost_if_convert_today': round(cost_if_convert_today, 0),
            'projected_cost': round(cost_if_wait, 0),
            'expected_savings': round(max(0, savings), 0),
            'down_risk_loss': round(max(0, down_risk_loss), 0),
            'risk_level': 'MEDIUM' if trend < 0 else 'HIGH',
            'confidence': 0.65,
            'success_probability': 0.68 if trend < 0 else 0.42,
            'reasoning': f'Wait {days_horizon} days for rate improvement. Projected savings: {max(0, savings):.0f} RM if {currency + " weakens" if trend < 0 else "rate improves"}. Risk: Rate could worsen by {max(0, down_risk_loss):.0f} RM.',
            'timeline': f'{days_horizon} days',
        }

    def simulate_hedge(self, currency, amount, days_horizon=30):
        """
        Simulate HEDGE strategy
        Use financial instruments (forwards/options) to limit downside
        """
        current_rate = self.rates[currency]
        volatility = self.volatility[currency]

        # Forward contract rate (typically includes spread)
        forward_spread = 0.002  # 0.2% spread
        forward_rate = current_rate * (1 + forward_spread)
        cost_if_hedge = amount * forward_rate

        # Hedge cost (option premium)
        option_premium = amount * current_rate * volatility * math.sqrt(days_horizon / 365) * 0.4

        # Scenarios
        cost_if_convert_today = amount * current_rate
        best_case_rate = current_rate * (1 - volatility * 2)
        best_case_cost = amount * best_case_rate
        worst_case_rate = current_rate * (1 + volatility * 3)
        worst_case_cost = amount * worst_case_rate

        # Protected cost with hedge
        protected_cost = cost_if_hedge + option_premium

        return {
            'strategy': 'HEDGE',
            'currency': currency,
            'amount': amount,
            'current_rate': round(current_rate, 4),
            'forward_rate': round(forward_rate, 4),
            'option_premium': round(option_premium, 0),
            'forward_cost': round(cost_if_hedge, 0),
            'total_hedge_cost': round(protected_cost, 0),
            'max_exposure': round(cost_if_hedge, 0),
            'risk_level': 'LOW',
            'confidence': 0.88,
            'best_case_unhedged': round(best_case_cost, 0),
            'worst_case_unhedged': round(worst_case_cost, 0),
            'best_case_hedged': round(cost_if_hedge, 0),
            'worst_case_hedged': round(cost_if_hedge, 0),
            'reasoning': f'Lock rate at {forward_rate:.4f} MYR/{currency} via forward contract. Costs {option_premium:.0f} RM premium but caps maximum exposure. Protects against extreme volatility.',
            'timeline': f'{days_horizon} days (locked contract)',
        }

    def compare_strategies(self, currency, amount, days_horizon=30, market_scenario='NORMAL'):
        """
        Compare all three strategies and rank by effectiveness
        """
        convert_now = self.simulate_convert_now(currency, amount, days_horizon)
        wait = self.simulate_wait(currency, amount, days_horizon)
        hedge = self.simulate_hedge(currency, amount, days_horizon)

        # Scoring logic based on market scenario
        scores = self._score_strategies(convert_now, wait, hedge, market_scenario)

        return {
            'strategies': [convert_now, wait, hedge],
            'scores': scores,
            'recommendation': self._rank_strategies(scores),
            'market_scenario': market_scenario,
            'analysis_date': datetime.now().isoformat(),
        }

    def _score_strategies(self, convert_now, wait, hedge, scenario):
        """Score strategies based on market scenario"""
        scores = {}

        if scenario == 'CRISIS':
            # In crisis: hedge is safest
            scores['CONVERT_NOW'] = 0.6
            scores['WAIT'] = 0.4
            scores['HEDGE'] = 0.95
        elif scenario == 'OPPORTUNISTIC':
            # In opportunity: wait for gains
            scores['CONVERT_NOW'] = 0.7
            scores['WAIT'] = 0.85
            scores['HEDGE'] = 0.5
        else:
            # Normal market: balanced
            scores['CONVERT_NOW'] = 0.75
            scores['WAIT'] = 0.68
            scores['HEDGE'] = 0.80

        return scores

    def _rank_strategies(self, scores):
        """Rank strategies by score"""
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return [{'strategy': s[0], 'score': s[1]} for s in ranked]

    def get_current_rates(self):
        """Get current market rates"""
        return self.rates

    def compare_forex_strategies(self, currency, amount, days=30, scenario='NORMAL'):
        """Wrapper for compatibility"""
        return self.compare_strategies(currency, amount, days, scenario)
