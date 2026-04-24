"""
Supplier Negotiation Engine
Analyzes supplier pricing and generates negotiation strategies
Detects overpricing and calculates discount opportunities
"""


class SupplierNegotiationEngine:
    def __init__(self):
        """Initialize supplier negotiation engine"""
        # Market price benchmarks for common commodities/services
        self.market_benchmarks = {
            'Electronics': {'avg_price': 450, 'margin': 0.35, 'volatility': 0.12},
            'Raw Materials': {'avg_price': 320, 'margin': 0.25, 'volatility': 0.20},
            'Logistics': {'avg_price': 80, 'margin': 0.30, 'volatility': 0.08},
            'Software Licenses': {'avg_price': 1200, 'margin': 0.50, 'volatility': 0.05},
            'Consulting Services': {'avg_price': 150, 'margin': 0.55, 'volatility': 0.10},
            'Manufacturing': {'avg_price': 200, 'margin': 0.40, 'volatility': 0.15},
            'Maintenance': {'avg_price': 100, 'margin': 0.35, 'volatility': 0.07},
        }

        # Supplier profiles (relationship history, negotiation flexibility)
        self.supplier_profiles = {
            'NEW': {'negotiation_flexibility': 0.40, 'loyalty_discount': 0, 'risky_flag': True},
            'TRANSACTIONAL': {'negotiation_flexibility': 0.20, 'loyalty_discount': 0.02, 'risky_flag': False},
            'STRATEGIC': {'negotiation_flexibility': 0.35, 'loyalty_discount': 0.05, 'risky_flag': False},
            'PREFERRED': {'negotiation_flexibility': 0.50, 'loyalty_discount': 0.08, 'risky_flag': False},
        }

        # Seasonal discount windows (% probability of discount)
        self.seasonal_windows = {
            'Q1': 0.30,
            'Q2': 0.40,
            'Q3': 0.25,
            'Q4': 0.65,  # Year-end push
        }

    def analyze_supplier_price(self, category, supplier_price, quantity=1, supplier_relationship='TRANSACTIONAL'):
        """Analyze supplier price against market benchmark"""
        benchmark = self.market_benchmarks.get(category)
        if not benchmark:
            return {'error': f'Category "{category}" not found in benchmarks'}

        price_per_unit = supplier_price / quantity
        benchmark_price = benchmark['avg_price']
        overpricing = ((price_per_unit - benchmark_price) / benchmark_price) * 100
        is_deal = overpricing < -5
        is_overpriced = overpricing > 5

        # Calculate potential savings
        fair_price = benchmark_price * quantity
        potential_savings = supplier_price - fair_price

        return {
            'category': category,
            'supplier_price': f'{supplier_price:.2f}',
            'benchmark_price': f'{benchmark_price:.2f}',
            'price_per_unit': f'{price_per_unit:.2f}',
            'quantity': quantity,
            'overpricing': f'{overpricing:.2f}%',
            'is_deal': is_deal,
            'is_overpriced': is_overpriced,
            'potential_savings': f'{max(0, potential_savings):.2f}',
            'verdict': self._price_verdict(overpricing),
            'competitiveness_score': f'{100 - abs(overpricing):.0f}%',
        }

    def compare_suppliers(self, suppliers, category):
        """Compare against multiple suppliers"""
        benchmark = self.market_benchmarks.get(category)
        if not benchmark:
            return {'error': f'Category "{category}" not found in benchmarks'}

        analysis = []
        for supplier in suppliers:
            analysis_result = self.analyze_supplier_price(
                category, supplier['price'], supplier.get('quantity', 1), supplier.get('relationship', 'TRANSACTIONAL')
            )
            analysis.append({**supplier, **analysis_result})

        lowest_price = min(supplier['price'] for supplier in suppliers)

        return {
            'category': category,
            'suppliers': analysis,
            'lowest_cost': f'{lowest_price:.2f}',
            'benchmark_price': f'{benchmark["avg_price"]:.2f}',
            'recommended_supplier': self._select_best_supplier(analysis),
            'savings_opportunity': {
                'switch_to_lowest': round(sum(s['price'] for s in suppliers) - (lowest_price * len(suppliers)), 0),
                'switch_to_benchmark': round(sum(s['price'] for s in suppliers) - (benchmark['avg_price'] * len(suppliers)), 0),
            },
        }

    def generate_negotiation_plan(self, supplier_name, current_price, quantity, category, relationship='TRANSACTIONAL', season='Q1'):
        """Generate detailed negotiation plan"""
        price_analysis = self.analyze_supplier_price(category, current_price, quantity, relationship)
        if 'error' in price_analysis:
            return price_analysis

        benchmark = self.market_benchmarks[category]
        profile = self.supplier_profiles.get(relationship, self.supplier_profiles['TRANSACTIONAL'])
        seasonal_prob = self.seasonal_windows.get(season, 0.30)

        # Calculate target discount
        overpricing = float(price_analysis['overpricing'].replace('%', ''))
        target_discount_percent = min(overpricing * 0.6, profile['negotiation_flexibility'] * 100)
        target_price = current_price * (1 - target_discount_percent / 100)
        savings_if_successful = current_price - target_price

        # Success probability
        success_probability = self._calculate_success_probability(
            profile['negotiation_flexibility'],
            seasonal_prob,
            overpricing > 5
        )

        # Generate negotiation script
        script = self._generate_negotiation_script(
            supplier_name,
            current_price,
            target_price,
            category,
            benchmark,
            relationship,
            savings_if_successful
        )

        return {
            'supplier': supplier_name,
            'category': category,
            'relationship': relationship,
            'season': season,
            'current_price': f'{current_price:.2f}',
            'quantity': quantity,
            'benchmark_price': f'{benchmark["avg_price"]:.2f}',
            'overpricing': f'{overpricing:.2f}%',
            'negotiation_target': {
                'target_price': f'{target_price:.2f}',
                'target_discount': f'{target_discount_percent:.2f}%',
                'savings_if_successful': f'{savings_if_successful:.2f}',
                'monthly_recurring_benefit': f'{savings_if_successful:.2f}',
                'annual_benefit': f'{savings_if_successful * 12:.2f}',
            },
            'negotiation_strategy': {
                'approach': self._select_negotiation_approach(profile['negotiation_flexibility'], overpricing),
                'success_probability': f'{success_probability * 100:.0f}%',
                'fallback_discount': f'{target_discount_percent * 0.6:.2f}%',
                'fallback_price': f'{current_price * (1 - (target_discount_percent * 0.6 / 100)):.2f}',
                'risky_supplier': profile['risky_flag'],
            },
            'negotiation_script': script,
            'timing': {
                'seasonal_opportunity': seasonal_prob > 0.4,
                'seasonal_bonus': f'{seasonal_prob * 10:.0f}%',
                'recommended_timing': 'Immediate (year-end push)' if season == 'Q4' else f'Negotiate before {season} ends',
            },
            'risk_mitigation': {
                'alternative_suppliers': 2,
                'price_escalation_clause': 'Recommended (protect against future hikes)',
                'volume_commitment': f'Offer {"12-month" if quantity > 100 else "6-month"} commitment for {target_discount_percent:.1f}% discount',
            },
        }

    def analyze_cost_reduction_opportunity(self, supplier_catalog):
        """Batch analyze multiple suppliers for cost reduction opportunity"""
        opportunities = []
        for item in supplier_catalog:
            plan = self.generate_negotiation_plan(
                item['supplier'],
                item['price'],
                item['quantity'],
                item['category'],
                item.get('relationship', 'TRANSACTIONAL'),
                self._get_current_quarter()
            )
            if 'error' not in plan:
                plan['priority'] = self._calculate_opportunity_priority(plan)
                opportunities.append(plan)

        # Sort by priority (highest first)
        opportunities.sort(key=lambda x: self._priority_score(x.get('priority', 'LOW')), reverse=True)

        total_potential_savings = sum(
            float(opp['negotiation_target']['annual_benefit'].replace('RM', '').strip())
            for opp in opportunities
        )

        return {
            'total_opportunities': len(opportunities),
            'total_potential_annual_savings': round(total_potential_savings, 0),
            'opportunities': opportunities,
            'implementation_roadmap': self._create_roadmap(opportunities),
        }

    def _price_verdict(self, overpricing):
        """Determine price verdict based on overpricing percentage"""
        if overpricing < -10:
            return 'EXCELLENT DEAL'
        elif overpricing < -5:
            return 'GOOD DEAL'
        elif overpricing < 5:
            return 'FAIR PRICE'
        elif overpricing < 15:
            return 'OVERPRICED'
        else:
            return 'SIGNIFICANTLY OVERPRICED'

    def _select_best_supplier(self, analysis):
        """Select best supplier based on price and relationship"""
        if not analysis:
            return None
        return min(analysis, key=lambda x: float(x['supplier_price']))

    def _calculate_success_probability(self, negotiation_flexibility, seasonal_prob, is_overpriced):
        """Calculate negotiation success probability"""
        base_prob = negotiation_flexibility
        seasonal_boost = seasonal_prob * 0.2
        overpricing_boost = 0.15 if is_overpriced else 0
        return min(0.95, base_prob + seasonal_boost + overpricing_boost)

    def _select_negotiation_approach(self, flexibility, overpricing):
        """Select negotiation approach based on flexibility and overpricing"""
        if flexibility > 0.4 and overpricing > 10:
            return 'AGGRESSIVE (high discount target)'
        elif flexibility > 0.25:
            return 'BALANCED (fair discount target)'
        else:
            return 'COLLABORATIVE (relationship-focused)'

    def _generate_negotiation_script(self, supplier, current_price, target_price, category, benchmark, relationship, savings):
        """Generate negotiation script"""
        discount_percent = ((current_price - target_price) / current_price) * 100
        return {
            'opening': f'Hi {supplier}, we value our partnership and want to discuss how we can work together more effectively.',
            'value_prop': f'We\'ve been analyzing market benchmarks for {category}. We see competitive pricing in the {benchmark["avg_price"]:.0f} RM range.',
            'proposal': f'We\'d like to propose {discount_percent:.1f}% discount to {target_price:.2f} RM. This saves us {savings:.0f} RM annually.',
            'commitment': f'In exchange, we commit to a 12-month ongoing relationship with consistent volume.',
            'closing': 'Can we explore this together?',
        }

    def _calculate_opportunity_priority(self, plan):
        """Calculate opportunity priority"""
        annual_benefit = float(plan['negotiation_target']['annual_benefit'])
        success_prob = float(plan['negotiation_strategy']['success_probability'].replace('%', '')) / 100

        if annual_benefit > 100000 and success_prob > 0.7:
            return 'CRITICAL'
        elif annual_benefit > 50000 and success_prob > 0.6:
            return 'HIGH'
        elif annual_benefit > 20000 and success_prob > 0.5:
            return 'MEDIUM'
        else:
            return 'LOW'

    def _priority_score(self, priority):
        """Convert priority to score for sorting"""
        scores = {'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1}
        return scores.get(priority, 0)

    def _get_current_quarter(self):
        """Get current quarter"""
        from datetime import datetime
        month = datetime.now().month
        if month <= 3:
            return 'Q1'
        elif month <= 6:
            return 'Q2'
        elif month <= 9:
            return 'Q3'
        else:
            return 'Q4'

    def _create_roadmap(self, opportunities):
        """Create implementation roadmap"""
        if not opportunities:
            return []
        
        phases = {
            'CRITICAL': 'Phase 1 (Weeks 1-2)',
            'HIGH': 'Phase 2 (Weeks 2-4)',
            'MEDIUM': 'Phase 3 (Weeks 4-8)',
            'LOW': 'Phase 4 (Backlog)',
        }
        
        roadmap = []
        for opp in opportunities:
            priority = opp.get('priority', 'LOW')
            roadmap.append({
                'supplier': opp['supplier'],
                'phase': phases.get(priority, 'Backlog'),
                'estimated_savings': opp['negotiation_target']['annual_benefit'],
                'action': f'Contact {opp["supplier"]} and present negotiation proposal',
            })
        
        return roadmap
