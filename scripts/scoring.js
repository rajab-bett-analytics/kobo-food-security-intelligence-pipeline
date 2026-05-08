let score = 0;

const income = Number($json.income || 0);
if (income < 5000) score += 3;
else if (income < 10000) score += 2;
else if (income < 20000) score += 1;

const coping = ($json.coping_strategy || "").toLowerCase();

if (
  coping.includes("skip") ||
  coping.includes("reduce") ||
  coping.includes("whole")
) score += 3;
else if (coping.includes("borrow")) score += 2;
else if (coping.includes("sell")) score += 2;

const food = ($json.food_source || "").toLowerCase();
if (food.includes("aid")) score += 3;
else if (food.includes("market")) score += 1;

const meals = Number($json.meals_skipped || 0);
if (meals >= 5) score += 3;
else if (meals >= 3) score += 2;
else if (meals >= 1) score += 1;

const waterTime = Number($json.water_time || 0);
if (waterTime > 120) score += 2;
else if (waterTime > 60) score += 1;

if (score > 10) score = 10;

const classification =
  score <= 4 ? "Food Secure" :
  score <= 7 ? "Moderate Risk" :
  "Severe Insecurity";

return [
  {
    json: {
      ...$json,
      food_security_score: score,
      food_security_class: classification
    }
  }
];