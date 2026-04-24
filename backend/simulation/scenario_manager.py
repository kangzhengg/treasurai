"""
Scenario Simulation Engine
Simulates three market scenarios with realistic outcomes
Enables demo storytelling with measurable financial impact
"""

import json
import math


class ScenarioManager:
    def __init__(self):
        """Initialize scenario manager with base company data"""
        # Base ERP data for scenarios
        self.base_company_data = {
            'cash_balance': 4300000,
            'payables': [
                {'currency': 'USD', 'amount': 2500000, 'due_date': '2024-05-15'},
                {'currency': 'EUR', 'amount': 1200000, 'due_date': '2024-05-20'},
                {'currency': 'SGD', 'amount': 800000, 'due_date': '2024-05-10'},
            ],
            'receivables': [
                {'currency': 'USD', 'amount': 1800000, 'due_date': '2024-05-25'},
                {'currency': 'EUR', 'amount': 900000, 'due_date': '2024-06-01'},
            ],
            'suppliers': [
                {'name': 'TechSupply Co', 'category': 'Electronics', 'monthly_spend': 450000, 'relationship': 'STRATEGIC'},
                {'name': 'LogisticsPro', 'category': 'Logistics', 'monthly_spend': 320000, 'relationship': 'PREFERRED'},
                {'name': 'RawMatSupply', 'category': 'Raw Materials', 'monthly_spend': 280000, 'relationship': 'TRANSACTIONAL'},
            ],
        }

    def simulate_normal_market(self):
        """
        Scenario A: Normal Market Conditions
        - Stable FX rates, normal supplier terms, standard treasury decisions
        """
        company_data = json.loads(json.dumps(self.base_company_data))

        # Normal market assumptions
        fx_assumptions = {
            'USD': {'current_rate': 4.45, 'volatility': 0.008, 'trend': 'stable'},
            'EUR': {'current_rate': 4.95, 'volatility': 0.012, 'trend': 'stable'},
            'SGD': {'current_rate': 3.32, 'volatility': 0.007, 'trend': 'stable'},
        }

        # Treasury recommendations in normal market
        decisions = [
            {
                'id': 1,
                'decision': 'PARTIAL_USD_CONVERSION',
                'action': 'Convert 50% of USD payables (1.25M) now, delay 50%',
                'amount': 1250000,
                'currency': 'USD',
                'timing': 'Immediate',
                'strategy': 'BALANCED',
                'savings': self._calculate_savings(1250000, 4.45, 0.008, 30, 'normal'),
                'risk': 'LOW',
                'confidence': 0.88,
            },
            {
                'id': 2,
                'decision': 'EUR_WAIT',
                'action': 'Wait for ECB signals before EUR conversion',
                'amount': 1200000,
                'currency': 'EUR',
                'timing': '10-15 days',
                'strategy': 'WAIT',
                'savings': self._calculate_savings(1200000, 4.95, 0.012, 14, 'normal'),
                'risk': 'MEDIUM',
                'confidence': 0.72,
            },
            {
                'id': 3,
                'decision': 'SUPPLIER_NEGOTIATION',
                'action': 'Negotiate 8% discount with TechSupply Co (volume commitment)',
                'supplier': 'TechSupply Co',
                'amount': 450000,
                'timing': '30 days',
                'strategy': 'COLLABORATIVE',
                'savings': self._calculate_supplier_savings(450000, 0.08),
                'risk': 'LOW',
                'confidence': 0.85,
            },
        ]

        # Calculate total impact
        total_savings = sum(d['savings'] for d in decisions)
        monthly_projection = total_savings
        annual_projection = monthly_projection * 12

        return {
            'scenario': 'NORMAL_MARKET',
            'name': '📈 Normal Market Conditions',
            'description': 'Stable FX rates (±0.8%), normal volatility, typical supplier margins',
            'market_conditions': {
                'fx_volatility': 'Low',
                'fx_trend': 'Stable',
                'economic_outlook': 'Steady growth',
                'supplier_margin_pressure': 'Normal',
                'recommended_approach': 'BALANCED - Mix of immediate actions and wait-for-signal',
            },
            'decisions': decisions,
            'financial_impact': {
                'immediate_impact': {
                    'savings_this_month': round(total_savings, 0),
                    'risk_exposure': 125000,
                    'max_downside': round(total_savings * 0.15, 0),
                },
                'projections': {
                    'monthly': round(monthly_projection, 0),
                    'quarterly': round(monthly_projection * 3, 0),
                    'annual': round(annual_projection, 0),
                },
                'roi': {
                    'percentage': '145%',
                    'payback_days': '8 days',
                    'recommendation': 'IMPLEMENT',
                },
            },
            'timeline': {
                'phase1': 'Days 1-5: Execute USD conversion, initiate supplier negotiation',
                'phase2': 'Days 5-15: Monitor EUR rate, close supplier negotiation',
                'phase3': 'Days 15-30: Execute EUR conversion if target rate achieved',
            },
            'risks': [
                {'risk': 'USD strengthens unexpectedly', 'probability': 'LOW', 'impact': 'Reduces savings by ~5%', 'mitigation': 'Hedge 25% with forward'},
                {'risk': 'Supplier rejects negotiation', 'probability': 'LOW', 'impact': 'Lost 36,000 RM annual', 'mitigation': 'Have secondary supplier'},
            ],
        }

    def simulate_economic_crisis(self):
        """
        Scenario B: Economic Crisis
        - High FX volatility, currency flight, supplier defaults, cashflow squeeze
        """
        company_data = json.loads(json.dumps(self.base_company_data))

        # Crisis assumptions
        fx_assumptions = {
            'USD': {'current_rate': 4.45, 'volatility': 0.035, 'trend': 'strengthening'},
            'EUR': {'current_rate': 4.95, 'volatility': 0.042, 'trend': 'weakening'},
            'SGD': {'current_rate': 3.32, 'volatility': 0.025, 'trend': 'weakening'},
        }

        # Treasury recommendations in crisis
        decisions = [
            {
                'id': 1,
                'decision': 'HEDGE_USD_EXPOSURE',
                'action': 'HEDGE 100% USD payables with forward contracts (limit volatility)',
                'amount': 2500000,
                'currency': 'USD',
                'timing': 'IMMEDIATE',
                'strategy': 'HEDGE',
                'savings': self._calculate_crisis_savings(2500000, 0.035, 'hedged'),
                'hedge_cost': 44000,
                'net_savings': self._calculate_crisis_savings(2500000, 0.035, 'hedged') - 44000,
                'risk': 'LOW',
                'confidence': 0.94,
                'reasoning': 'Protects against USD spike; costs ~1.76% but eliminates catastrophic loss risk',
            },
            {
                'id': 2,
                'decision': 'EUR_ACCELERATED_CONVERSION',
                'action': 'CONVERT EUR now (before further deterioration)',
                'amount': 1200000,
                'currency': 'EUR',
                'timing': 'TODAY',
                'strategy': 'CONVERT_NOW',
                'savings': self._calculate_crisis_savings(1200000, 0.042, 'convert_now'),
                'risk': 'MEDIUM',
                'confidence': 0.82,
                'reasoning': 'EUR declining; immediate action prevents 3-5% further loss',
            },
            {
                'id': 3,
                'decision': 'CASHFLOW_PRESERVATION',
                'action': 'Negotiate payment deferrals (30-60 days extension)',
                'supplier': 'RawMatSupply',
                'amount': 280000,
                'timing': '5-10 days',
                'strategy': 'PAYMENT_DEFERRAL',
                'savings': self._calculate_crisis_supplier_savings(280000, 0.045),
                'risk': 'HIGH',
                'confidence': 0.68,
                'reasoning': 'Preserve cash for margin calls; expensive but essential',
            },
        ]

        # Calculate total impact
        total_savings = sum(d.get('net_savings', d['savings']) for d in decisions)

        return {
            'scenario': 'ECONOMIC_CRISIS',
            'name': '🔴 Economic Crisis (Flight-to-Safety)',
            'description': 'High FX volatility (3-4%), currency devaluation, supply chain stress, margin calls',
            'market_conditions': {
                'fx_volatility': 'CRITICAL (3-4% daily swings)',
                'fx_trend': 'USD strengthens, other currencies weaken',
                'economic_outlook': 'Recession / Flight-to-safety',
                'supplier_margin_pressure': 'HIGH (suppliers demand payment)',
                'recommended_approach': 'DEFENSIVE - Protect against downside, preserve cash, limit exposure',
            },
            'decisions': decisions,
            'financial_impact': {
                'crisis_mitigation': {
                    'cash_preserved': round(total_savings, 0),
                    'fx_loss_prevented': 156000,
                    'cash_buffer_weeks': 8,
                },
                'projections': {
                    'immediate': round(total_savings, 0),
                    'monthly': round(total_savings / 3, 0),
                },
                'roi': {
                    'percentage': '320% (protection vs. unhedged)',
                    'payback_days': '2 days',
                    'recommendation': 'CRITICAL - IMPLEMENT IMMEDIATELY',
                },
            },
            'timeline': {
                'immediate': 'Day 1: Hedge USD, Convert EUR, Negotiate deferrals',
                'week1': 'Monitor daily FX, confirm supplier deferrals',
                'week2': 'Lock hedge contracts, secure credit lines',
            },
            'risks': [
                {'risk': 'Hedging too early (costs fees)', 'probability': 'MEDIUM', 'impact': 'Extra 2-3% cost', 'mitigation': 'Monitor daily and adjust'},
                {'risk': 'Supplier default despite deferral', 'probability': 'MEDIUM', 'impact': 'Supply chain disruption', 'mitigation': 'Activate backup suppliers'},
                {'risk': 'More currencies weaken', 'probability': 'HIGH', 'impact': 'Additional exposure', 'mitigation': 'Hedge progressively'},
            ],
        }

    def simulate_opportunistic_market(self):
        """
        Scenario C: Opportunistic Market
        - Favorable FX movements, strong supplier relationships, aggressive negotiation wins
        """
        company_data = json.loads(json.dumps(self.base_company_data))

        # Opportunistic assumptions
        fx_assumptions = {
            'USD': {'current_rate': 4.45, 'volatility': 0.003, 'trend': 'weakening'},
            'EUR': {'current_rate': 4.95, 'volatility': 0.005, 'trend': 'strengthening'},
            'SGD': {'current_rate': 3.32, 'volatility': 0.002, 'trend': 'strengthening'},
        }

        # Treasury recommendations in opportunistic market
        decisions = [
            {
                'id': 1,
                'decision': 'USD_WAIT_LONGER',
                'action': 'WAIT 45-60 days for USD to weaken further (high confidence)',
                'amount': 2500000,
                'currency': 'USD',
                'timing': '45-60 days',
                'strategy': 'WAIT',
                'savings': self._calculate_savings(2500000, 4.45, 0.003, 60, 'opportunistic'),
                'risk': 'LOW',
                'confidence': 0.91,
                'reasoning': 'Strong data suggests USD weakening; delay = +120k savings',
            },
            {
                'id': 2,
                'decision': 'AGGRESSIVE_SUPPLIER_PUSH',
                'action': 'Aggressive negotiation with all 3 suppliers (market conditions support it)',
                'suppliers': ['TechSupply Co', 'LogisticsPro', 'RawMatSupply'],
                'timing': '14 days',
                'strategy': 'AGGRESSIVE',
                'savings': self._calculate_supplier_savings(1050000, 0.12),
                'risk': 'MEDIUM',
                'confidence': 0.78,
                'reasoning': 'Market conditions = high supplier flexibility; can push for 10-15% discounts',
            },
        ]

        # Calculate total impact
        total_savings = sum(d['savings'] for d in decisions)
        monthly_projection = total_savings
        annual_projection = monthly_projection * 12

        return {
            'scenario': 'OPPORTUNISTIC_MARKET',
            'name': '🚀 Opportunistic Market (Golden Window)',
            'description': 'Favorable FX trends, low volatility, suppliers eager to win, strong negotiation leverage',
            'market_conditions': {
                'fx_volatility': 'Very Low (0.2-0.5%)',
                'fx_trend': 'Favorable (MYR strengthens vs USD)',
                'economic_outlook': 'Growth accelerating, business confidence high',
                'supplier_margin_pressure': 'Low (suppliers competing)',
                'recommended_approach': 'AGGRESSIVE - Maximize gains, lock in long-term favorable terms',
            },
            'decisions': decisions,
            'financial_impact': {
                'upside_capture': {
                    'savings_this_quarter': round(total_savings * 3, 0),
                    'fx_opportunities': 356000,
                    'supplier_wins': 126000,
                },
                'projections': {
                    'monthly': round(monthly_projection, 0),
                    'quarterly': round(monthly_projection * 3, 0),
                    'annual': round(annual_projection, 0),
                    'three_year_locked_terms': round(annual_projection * 3, 0),
                },
                'roi': {
                    'percentage': '425%',
                    'payback_days': '4 days',
                    'recommendation': 'MAXIMIZE - Capture this window',
                },
            },
            'timeline': {
                'phase1': 'Days 1-3: Initiate multi-supplier negotiations',
                'phase2': 'Days 3-14: Finalize supplier contracts (lock 3-year terms)',
                'phase3': 'Days 15-60: Execute delayed USD conversions in tranches',
            },
            'risks': [
                {'risk': 'Market sentiment shifts (rates reverse)', 'probability': 'LOW', 'impact': 'Reduces FX gains by 50%', 'mitigation': 'Set stop-loss at 2% rate change'},
                {'risk': 'Suppliers break agreements', 'probability': 'LOW', 'impact': 'Lose contracted savings', 'mitigation': 'Lock contracts immediately'},
            ],
        }

    def compare_all_scenarios(self):
        """Compare all three scenarios side by side"""
        normal = self.simulate_normal_market()
        crisis = self.simulate_economic_crisis()
        opportunistic = self.simulate_opportunistic_market()

        return {
            'scenarios': [normal, crisis, opportunistic],
            'comparison': {
                'best_case': opportunistic['name'],
                'worst_case': crisis['name'],
                'balanced': normal['name'],
                'financial_range': {
                    'minimum': round(crisis['financial_impact']['crisis_mitigation']['cash_preserved'], 0),
                    'maximum': round(opportunistic['financial_impact']['upside_capture']['savings_this_quarter'], 0),
                    'balanced': round(normal['financial_impact']['immediate_impact']['savings_this_month'], 0),
                },
            },
        }

    # Helper methods
    def _calculate_savings(self, amount, rate, volatility, days, scenario):
        """Calculate FX savings based on scenario"""
        if scenario == 'normal':
            return amount * rate * volatility * (days / 30) * 0.4
        elif scenario == 'opportunistic':
            return amount * rate * volatility * (days / 30) * 0.8
        else:
            return amount * rate * volatility * (days / 30) * 0.2

    def _calculate_supplier_savings(self, amount, discount_percent):
        """Calculate supplier negotiation savings"""
        return amount * discount_percent

    def _calculate_crisis_savings(self, amount, volatility, strategy):
        """Calculate crisis scenario savings"""
        if strategy == 'hedged':
            return amount * volatility * 0.5
        else:
            return amount * volatility * 0.3

    def _calculate_crisis_supplier_savings(self, amount, deferral_benefit):
        """Calculate crisis supplier deferral savings (interest saved)"""
        return amount * deferral_benefit * 0.6
