def normalize_units(amount, unit):
    """
    Converts various units into a standard 'base unit' for calculation.
    """
    unit = unit.lower().strip()
    
    # Weight (Base: grams)
    if unit in ['lb', 'lbs', 'pound', 'pounds']:
        return amount * 453.592
    elif unit in ['oz', 'ounce', 'ounces']:
        return amount * 28.3495
    elif unit in ['kg', 'kilogram']:
        return amount * 1000
    elif unit in ['g', 'gram']:
        return amount
        
    # Length (Base: cm)
    elif unit in ['m', 'meter']:
        return amount * 100
    elif unit in ['in', 'inch', 'inches']:
        return amount * 2.54
    elif unit in ['ft', 'foot', 'feet']:
        return amount * 30.48
        
    # Default (Count/Each)
    return amount

def calculate_material_cost(purchase_price, purchase_amount, purchase_unit, recipe_amount, recipe_unit):
    """
    Calculates the cost of the material used in a single item.
    Example: Bought 5lbs for $20. Used 4oz. Cost = ?
    """
    try:
        # 1. Normalize both to the same base unit (e.g., grams)
        total_grams_bought = normalize_units(purchase_amount, purchase_unit)
        grams_used = normalize_units(recipe_amount, recipe_unit)
        
        # 2. Calculate Cost Per Gram
        cost_per_gram = purchase_price / total_grams_bought
        
        # 3. Calculate Cost for the Recipe amount
        final_cost = cost_per_gram * grams_used
        
        return round(final_cost, 2)
    except ZeroDivisionError:
        return 0.0