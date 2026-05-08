const data = $json.body ?? $json;

// ----------------------
// SAFE HELPER
// ----------------------
const safe = (v) =>
  Array.isArray(v) ? v.join(" ") : (v ?? "");

// ----------------------
// GPS HANDLING
// ----------------------
let gpsRaw = safe(data["gps_location"] || data["_geolocation"]);

const gpsParts = gpsRaw ? gpsRaw.split(" ") : [];

// ----------------------
// COPING FIX (IMPORTANT FIX)
// ----------------------
const copingMap = {
  skip: "skip_days",
  skip_days: "skip_days",
  reduce_meals: "reduce_meals",
  borrow_food: "borrow_food",
  sell_asserts: "sell_assets",
  sell_assets: "sell_assets"
};

const copingRaw = safe(data["coping/coping_001"]).toLowerCase();
const coping_strategy = copingMap[copingRaw] || copingRaw;

// ----------------------
// OUTPUT CLEAN DATA
// ----------------------
return [
  {
    json: {
      // CORE
      name: safe(data["household_info/respondent_name"]),
      age: Number(data["demographics/age"] || 0),
      gender: safe(data["demographics/gender"]),
      income: Number(data["economic/monthly_income"] || 0),
      household_size: Number(data["household_info/household_size"] || 0),

      // FOOD
      meals_skipped: Number(data["food_security/meals_skipped"] || 0),
      food_source: safe(data["food_security/food_source"]),

      // COPING (FIXED)
      coping_strategy,

      // WATER
      water_source: safe(data["water/water_source"]),
      water_time: Number(data["water/water_time"] || 0),

      // FIELD
      enumerator_name: safe(data["enumerator_name"]),
      gps_location_raw: gpsRaw,
      latitude: Number(gpsParts[0] || 0),
      longitude: Number(gpsParts[1] || 0),
      altitude: Number(gpsParts[2] || 0),
      accuracy: Number(gpsParts[3] || 0),
      consent: safe(data["consent_section/consent"]),
      date: safe(data["date"]),

      // META (IMPORTANT FOR BACKFILL + DEDUP)
      kobo_id: data["_id"] || "",
      uuid: data["_uuid"] || "",
      instance_id: data["meta/instanceID"] || "",
      submitted_by: data["_submitted_by"] || "",
      submission_time: data["_submission_time"] || ""
    }
  }
];