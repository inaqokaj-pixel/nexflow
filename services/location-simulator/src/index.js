require('dotenv').config();

const GATEWAY_URL  = process.env.GATEWAY_URL  || 'http://api-gateway:8080';
const SIM_EMAIL    = process.env.SIM_EMAIL    || 'sim@nexflow.internal';
const SIM_PASSWORD = process.env.SIM_PASSWORD || 'sim_password_123';
const TICK_MS      = parseInt(process.env.TICK_MS || '15000');

// ============ CITY GRAPH ============
const CITIES = {
  // ALBANIA
  'Tirane':       { lat: 41.33, lng: 19.82, neighbours: ['Durres','Elbasan','Shkoder','Lushnje','Kavaje','Kruje'] },
  'Tirana':       { lat: 41.33, lng: 19.82, neighbours: ['Durres','Elbasan','Shkoder','Lushnje','Kavaje'] },
  'Durres':       { lat: 41.32, lng: 19.45, neighbours: ['Tirane','Kavaje','Lushnje','Vlore','Lezhe'] },
  'Vlore':        { lat: 40.47, lng: 19.49, neighbours: ['Fier','Sarande','Durres','Himare'] },
  'Sarande':      { lat: 39.88, lng: 20.00, neighbours: ['Vlore','Gjirokaster','Himare','Ioannina'] },
  'Shkoder':      { lat: 42.07, lng: 19.51, neighbours: ['Tirane','Lezhe','Kukes','Podgorica'] },
  'Fier':         { lat: 40.72, lng: 19.56, neighbours: ['Vlore','Lushnje','Berat','Permet'] },
  'Korce':        { lat: 40.62, lng: 20.78, neighbours: ['Pogradec','Elbasan','Bitola','Thessaloniki'] },
  'Berat':        { lat: 40.71, lng: 19.95, neighbours: ['Fier','Lushnje','Elbasan','Gjirokaster'] },
  'Lushnje':      { lat: 40.94, lng: 19.70, neighbours: ['Tirane','Fier','Berat','Durres'] },
  'Elbasan':      { lat: 41.11, lng: 20.08, neighbours: ['Tirane','Berat','Korce','Pogradec'] },
  'Kavaje':       { lat: 41.19, lng: 19.56, neighbours: ['Tirane','Durres','Lushnje'] },
  'Gjirokaster':  { lat: 40.07, lng: 20.14, neighbours: ['Sarande','Berat','Permet','Ioannina'] },
  'Pogradec':     { lat: 40.90, lng: 20.65, neighbours: ['Korce','Elbasan','Ohrid'] },
  'Lezhe':        { lat: 41.78, lng: 19.64, neighbours: ['Shkoder','Tirane','Durres'] },
  'Kukes':        { lat: 42.08, lng: 20.42, neighbours: ['Shkoder','Pristina','Peshkopi'] },
  'Permet':       { lat: 40.24, lng: 20.35, neighbours: ['Gjirokaster','Fier','Korce'] },
  'Himare':       { lat: 40.10, lng: 19.74, neighbours: ['Vlore','Sarande'] },
  'Peshkopi':     { lat: 41.69, lng: 20.43, neighbours: ['Kukes','Elbasan','Skopje'] },
  'Burrel':       { lat: 41.61, lng: 20.01, neighbours: ['Tirane','Peshkopi'] },

  // WESTERN BALKANS
  'Skopje':       { lat: 41.99, lng: 21.43, neighbours: ['Tirane','Pristina','Sofia','Thessaloniki','Bitola','Belgrade'] },
  'Bitola':       { lat: 41.03, lng: 21.33, neighbours: ['Skopje','Korce','Ohrid','Thessaloniki'] },
  'Ohrid':        { lat: 41.11, lng: 20.80, neighbours: ['Bitola','Pogradec','Skopje'] },
  'Pristina':     { lat: 42.67, lng: 21.17, neighbours: ['Skopje','Kukes','Sarajevo','Belgrade','Prizren'] },
  'Prizren':      { lat: 42.21, lng: 20.74, neighbours: ['Pristina','Skopje'] },
  'Sarajevo':     { lat: 43.85, lng: 18.39, neighbours: ['Zagreb','Pristina','Mostar','Banja Luka','Belgrade','Tirane'] },
  'Banja Luka':   { lat: 44.77, lng: 17.19, neighbours: ['Sarajevo','Zagreb','Belgrade'] },
  'Mostar':       { lat: 43.34, lng: 17.81, neighbours: ['Sarajevo','Dubrovnik','Split'] },
  'Belgrade':     { lat: 44.82, lng: 20.46, neighbours: ['Sarajevo','Budapest','Sofia','Zagreb','Nis','Novi Sad'] },
  'Novi Sad':     { lat: 45.26, lng: 19.83, neighbours: ['Belgrade','Budapest','Osijek'] },
  'Nis':          { lat: 43.32, lng: 21.90, neighbours: ['Belgrade','Sofia','Skopje'] },
  'Zagreb':       { lat: 45.81, lng: 15.98, neighbours: ['Vienna','Milan','Sarajevo','Budapest','Ljubljana','Split','Osijek'] },
  'Split':        { lat: 43.51, lng: 16.44, neighbours: ['Zagreb','Mostar','Zadar','Dubrovnik'] },
  'Dubrovnik':    { lat: 42.65, lng: 18.09, neighbours: ['Split','Mostar','Podgorica'] },
  'Zadar':        { lat: 44.12, lng: 15.23, neighbours: ['Split','Zagreb','Rijeka'] },
  'Rijeka':       { lat: 45.33, lng: 14.44, neighbours: ['Zagreb','Ljubljana','Trieste'] },
  'Osijek':       { lat: 45.55, lng: 18.70, neighbours: ['Zagreb','Novi Sad','Belgrade'] },
  'Ljubljana':    { lat: 46.05, lng: 14.51, neighbours: ['Zagreb','Vienna','Trieste','Graz'] },
  'Maribor':      { lat: 46.56, lng: 15.65, neighbours: ['Ljubljana','Graz','Vienna'] },
  'Podgorica':    { lat: 42.44, lng: 19.26, neighbours: ['Shkoder','Dubrovnik','Sarajevo'] },

  // GREECE
  'Athens':         { lat: 37.98, lng: 23.73, neighbours: ['Thessaloniki','Patras','Tirane','Sarande'] },
  'Thessaloniki':   { lat: 40.64, lng: 22.94, neighbours: ['Athens','Sofia','Skopje','Korce','Kavala','Ioannina'] },
  'Ioannina':       { lat: 39.67, lng: 20.85, neighbours: ['Thessaloniki','Gjirokaster','Sarande','Patras'] },
  'Patras':         { lat: 38.25, lng: 21.73, neighbours: ['Athens','Ioannina'] },
  'Kavala':         { lat: 40.94, lng: 24.40, neighbours: ['Thessaloniki','Alexandroupoli'] },
  'Alexandroupoli': { lat: 40.85, lng: 25.88, neighbours: ['Kavala','Istanbul'] },
  'Larissa':        { lat: 39.64, lng: 22.42, neighbours: ['Thessaloniki','Athens','Volos'] },
  'Volos':          { lat: 39.36, lng: 22.94, neighbours: ['Larissa','Athens'] },

  // BULGARIA
  'Sofia':       { lat: 42.70, lng: 23.32, neighbours: ['Skopje','Bucharest','Belgrade','Thessaloniki','Plovdiv','Nis'] },
  'Plovdiv':     { lat: 42.15, lng: 24.75, neighbours: ['Sofia','Athens','Burgas','Stara Zagora'] },
  'Varna':       { lat: 43.21, lng: 27.91, neighbours: ['Bucharest','Burgas','Constanta'] },
  'Burgas':      { lat: 42.51, lng: 27.47, neighbours: ['Plovdiv','Varna','Istanbul'] },
  'Stara Zagora':{ lat: 42.43, lng: 25.64, neighbours: ['Plovdiv','Burgas','Sofia'] },
  'Ruse':        { lat: 43.85, lng: 25.95, neighbours: ['Bucharest','Sofia','Varna'] },

  // ROMANIA
  'Bucharest':   { lat: 44.43, lng: 26.10, neighbours: ['Sofia','Budapest','Varna','Constanta','Ploiesti','Cluj','Iasi'] },
  'Cluj':        { lat: 46.77, lng: 23.60, neighbours: ['Bucharest','Budapest','Timisoara','Brasov'] },
  'Timisoara':   { lat: 45.75, lng: 21.23, neighbours: ['Cluj','Budapest','Belgrade'] },
  'Iasi':        { lat: 47.16, lng: 27.59, neighbours: ['Bucharest','Chisinau','Lviv'] },
  'Constanta':   { lat: 44.18, lng: 28.65, neighbours: ['Bucharest','Varna'] },
  'Brasov':      { lat: 45.65, lng: 25.61, neighbours: ['Bucharest','Cluj'] },
  'Ploiesti':    { lat: 44.95, lng: 26.02, neighbours: ['Bucharest'] },

  // HUNGARY
  'Budapest':    { lat: 47.50, lng: 19.04, neighbours: ['Bucharest','Vienna','Warsaw','Zagreb','Cluj','Bratislava','Novi Sad'] },
  'Debrecen':    { lat: 47.53, lng: 21.63, neighbours: ['Budapest','Cluj','Kosice'] },
  'Miskolc':     { lat: 48.10, lng: 20.78, neighbours: ['Budapest','Kosice','Krakow'] },
  'Szeged':      { lat: 46.25, lng: 20.15, neighbours: ['Budapest','Timisoara','Novi Sad'] },

  // AUSTRIA
  'Vienna':      { lat: 48.21, lng: 16.37, neighbours: ['Budapest','Prague','Zagreb','Salzburg','Bratislava','Linz','Graz'] },
  'Graz':        { lat: 47.07, lng: 15.44, neighbours: ['Vienna','Ljubljana','Maribor'] },
  'Salzburg':    { lat: 47.80, lng: 13.04, neighbours: ['Vienna','Munich','Innsbruck'] },
  'Innsbruck':   { lat: 47.27, lng: 11.40, neighbours: ['Salzburg','Munich','Milan'] },
  'Linz':        { lat: 48.31, lng: 14.29, neighbours: ['Vienna','Prague','Munich'] },

  // CZECH & SLOVAKIA
  'Prague':      { lat: 50.08, lng: 14.44, neighbours: ['Vienna','Berlin','Warsaw','Brno','Dresden','Nuremberg'] },
  'Brno':        { lat: 49.20, lng: 16.61, neighbours: ['Prague','Bratislava','Vienna'] },
  'Bratislava':  { lat: 48.15, lng: 17.11, neighbours: ['Vienna','Budapest','Brno','Kosice'] },
  'Kosice':      { lat: 48.72, lng: 21.26, neighbours: ['Bratislava','Budapest','Debrecen','Krakow','Miskolc'] },

  // POLAND
  'Warsaw':      { lat: 52.23, lng: 21.01, neighbours: ['Prague','Berlin','Bucharest','Krakow','Lodz','Gdansk','Vilnius'] },
  'Krakow':      { lat: 50.06, lng: 19.94, neighbours: ['Warsaw','Prague','Kosice','Wroclaw','Katowice'] },
  'Gdansk':      { lat: 54.37, lng: 18.64, neighbours: ['Warsaw','Berlin','Szczecin'] },
  'Wroclaw':     { lat: 51.11, lng: 17.04, neighbours: ['Warsaw','Prague','Berlin','Poznan','Krakow'] },
  'Poznan':      { lat: 52.41, lng: 16.93, neighbours: ['Warsaw','Berlin','Wroclaw'] },
  'Katowice':    { lat: 50.26, lng: 19.02, neighbours: ['Krakow','Wroclaw','Prague'] },

  // GERMANY
  'Berlin':      { lat: 52.52, lng: 13.40, neighbours: ['Prague','Warsaw','Amsterdam','Paris','Frankfurt','Hamburg','Dresden','Leipzig'] },
  'Hamburg':     { lat: 53.55, lng: 10.00, neighbours: ['Berlin','Amsterdam','Copenhagen','Hannover'] },
  'Munich':      { lat: 48.14, lng: 11.58, neighbours: ['Vienna','Milan','Frankfurt','Nuremberg','Innsbruck','Stuttgart','Zurich'] },
  'Frankfurt':   { lat: 50.11, lng: 8.68,  neighbours: ['Munich','Amsterdam','Paris','Berlin','Cologne','Stuttgart','Nuremberg'] },
  'Cologne':     { lat: 50.94, lng: 6.96,  neighbours: ['Frankfurt','Amsterdam','Brussels','Dusseldorf'] },
  'Stuttgart':   { lat: 48.78, lng: 9.18,  neighbours: ['Munich','Frankfurt','Zurich','Strasbourg'] },
  'Dresden':     { lat: 51.05, lng: 13.74, neighbours: ['Berlin','Prague','Leipzig'] },
  'Leipzig':     { lat: 51.34, lng: 12.37, neighbours: ['Berlin','Frankfurt','Dresden'] },
  'Nuremberg':   { lat: 49.45, lng: 11.08, neighbours: ['Munich','Frankfurt','Prague'] },
  'Hannover':    { lat: 52.37, lng: 9.74,  neighbours: ['Hamburg','Berlin','Frankfurt'] },
  'Dusseldorf':  { lat: 51.22, lng: 6.77,  neighbours: ['Cologne','Amsterdam','Brussels'] },

  // FRANCE
  'Paris':       { lat: 48.85, lng: 2.35,  neighbours: ['Amsterdam','Berlin','London','Madrid','Milan','Frankfurt','Lyon','Lille','Brussels'] },
  'Lyon':        { lat: 45.75, lng: 4.83,  neighbours: ['Paris','Milan','Geneva','Marseille','Grenoble'] },
  'Marseille':   { lat: 43.30, lng: 5.37,  neighbours: ['Lyon','Nice','Barcelona','Montpellier'] },
  'Bordeaux':    { lat: 44.84, lng: -0.58, neighbours: ['Paris','Madrid','Lyon','Nantes'] },
  'Toulouse':    { lat: 43.60, lng: 1.44,  neighbours: ['Bordeaux','Barcelona','Marseille'] },
  'Nice':        { lat: 43.71, lng: 7.26,  neighbours: ['Marseille','Genoa','Milan'] },
  'Strasbourg':  { lat: 48.57, lng: 7.75,  neighbours: ['Paris','Frankfurt','Basel','Stuttgart'] },
  'Lille':       { lat: 50.63, lng: 3.07,  neighbours: ['Paris','Brussels','London'] },
  'Montpellier': { lat: 43.61, lng: 3.88,  neighbours: ['Marseille','Barcelona'] },
  'Nantes':      { lat: 47.22, lng: -1.55, neighbours: ['Paris','Bordeaux'] },
  'Grenoble':    { lat: 45.19, lng: 5.72,  neighbours: ['Lyon','Nice','Turin'] },

  // SPAIN
  'Madrid':      { lat: 40.42, lng: -3.70, neighbours: ['Paris','Lisbon','Barcelona','Seville','Bilbao','Zaragoza'] },
  'Barcelona':   { lat: 41.39, lng: 2.15,  neighbours: ['Madrid','Lyon','Marseille','Toulouse','Zaragoza'] },
  'Seville':     { lat: 37.39, lng: -5.99, neighbours: ['Madrid','Lisbon','Malaga','Cordoba'] },
  'Valencia':    { lat: 39.47, lng: -0.38, neighbours: ['Madrid','Barcelona','Alicante'] },
  'Bilbao':      { lat: 43.26, lng: -2.93, neighbours: ['Madrid','Paris','Bordeaux'] },
  'Zaragoza':    { lat: 41.65, lng: -0.88, neighbours: ['Madrid','Barcelona','Bilbao'] },
  'Malaga':      { lat: 36.72, lng: -4.42, neighbours: ['Seville','Granada'] },

  // ITALY
  'Rome':        { lat: 41.90, lng: 12.50, neighbours: ['Milan','Naples','Florence','Bari','Ancona'] },
  'Milan':       { lat: 45.46, lng: 9.19,  neighbours: ['Paris','Vienna','Madrid','Rome','Zagreb','Munich','Lyon','Nice','Genoa','Turin'] },
  'Naples':      { lat: 40.85, lng: 14.27, neighbours: ['Rome','Bari','Palermo'] },
  'Turin':       { lat: 45.07, lng: 7.69,  neighbours: ['Milan','Genoa','Lyon','Grenoble'] },
  'Florence':    { lat: 43.77, lng: 11.25, neighbours: ['Rome','Milan','Bologna','Genoa'] },
  'Bologna':     { lat: 44.49, lng: 11.34, neighbours: ['Milan','Florence','Venice','Verona'] },
  'Venice':      { lat: 45.44, lng: 12.32, neighbours: ['Milan','Verona','Trieste','Ljubljana'] },
  'Genoa':       { lat: 44.41, lng: 8.93,  neighbours: ['Milan','Nice','Turin','Florence'] },
  'Verona':      { lat: 45.44, lng: 10.99, neighbours: ['Milan','Venice','Bologna'] },
  'Trieste':     { lat: 45.65, lng: 13.77, neighbours: ['Venice','Ljubljana','Rijeka'] },
  'Bari':        { lat: 41.13, lng: 16.87, neighbours: ['Rome','Naples','Ancona'] },
  'Ancona':      { lat: 43.62, lng: 13.51, neighbours: ['Rome','Bologna','Bari'] },

  // BENELUX
  'Amsterdam':   { lat: 52.37, lng: 4.90,  neighbours: ['Berlin','Paris','London','Hamburg','Frankfurt','Brussels','Rotterdam'] },
  'Rotterdam':   { lat: 51.92, lng: 4.48,  neighbours: ['Amsterdam','Brussels','London'] },
  'Brussels':    { lat: 50.85, lng: 4.35,  neighbours: ['Amsterdam','Paris','London','Cologne','Luxembourg','Lille'] },
  'Antwerp':     { lat: 51.22, lng: 4.40,  neighbours: ['Brussels','Amsterdam','Rotterdam'] },
  'Luxembourg':  { lat: 49.61, lng: 6.13,  neighbours: ['Brussels','Paris','Frankfurt','Strasbourg'] },

  // UK & IRELAND
  'London':      { lat: 51.51, lng: -0.13, neighbours: ['Paris','Amsterdam','Brussels','Birmingham','Manchester'] },
  'Birmingham':  { lat: 52.49, lng: -1.90, neighbours: ['London','Manchester','Leeds'] },
  'Manchester':  { lat: 53.48, lng: -2.24, neighbours: ['London','Birmingham','Liverpool','Leeds'] },
  'Glasgow':     { lat: 55.86, lng: -4.25, neighbours: ['Edinburgh','Manchester'] },
  'Edinburgh':   { lat: 55.95, lng: -3.19, neighbours: ['Glasgow','Newcastle'] },
  'Dublin':      { lat: 53.33, lng: -6.25, neighbours: ['London','Glasgow'] },

  // SWITZERLAND
  'Zurich':      { lat: 47.38, lng: 8.54,  neighbours: ['Munich','Milan','Geneva','Basel','Bern','Frankfurt'] },
  'Geneva':      { lat: 46.20, lng: 6.15,  neighbours: ['Lyon','Turin','Zurich','Bern'] },
  'Basel':       { lat: 47.56, lng: 7.59,  neighbours: ['Zurich','Strasbourg','Frankfurt'] },
  'Bern':        { lat: 46.95, lng: 7.45,  neighbours: ['Zurich','Geneva','Basel'] },

  // NORDIC
  'Stockholm':   { lat: 59.33, lng: 18.07, neighbours: ['Oslo','Gothenburg','Helsinki','Copenhagen'] },
  'Oslo':        { lat: 59.91, lng: 10.75, neighbours: ['Stockholm','Copenhagen','Bergen'] },
  'Copenhagen':  { lat: 55.68, lng: 12.57, neighbours: ['Oslo','Stockholm','Hamburg'] },
  'Helsinki':    { lat: 60.17, lng: 24.94, neighbours: ['Stockholm','Tallinn','Riga'] },
  'Gothenburg':  { lat: 57.71, lng: 11.97, neighbours: ['Stockholm','Oslo','Copenhagen'] },

  // BALTICS
  'Riga':        { lat: 56.95, lng: 24.11, neighbours: ['Tallinn','Vilnius','Helsinki','Warsaw'] },
  'Tallinn':     { lat: 59.44, lng: 24.75, neighbours: ['Riga','Helsinki'] },
  'Vilnius':     { lat: 54.69, lng: 25.28, neighbours: ['Riga','Warsaw','Minsk'] },

  // PORTUGAL
  'Lisbon':      { lat: 38.72, lng: -9.14, neighbours: ['Madrid','Porto','Seville'] },
  'Porto':       { lat: 41.16, lng: -8.63, neighbours: ['Lisbon','Madrid'] },

  // UKRAINE / MOLDOVA
  'Kyiv':        { lat: 50.45, lng: 30.52, neighbours: ['Warsaw','Lviv','Chisinau','Kharkiv'] },
  'Lviv':        { lat: 49.84, lng: 24.03, neighbours: ['Kyiv','Krakow','Warsaw','Chisinau'] },
  'Chisinau':    { lat: 47.01, lng: 28.86, neighbours: ['Bucharest','Iasi','Odessa'] },
  'Odessa':      { lat: 46.48, lng: 30.73, neighbours: ['Chisinau','Kyiv','Constanta'] },

  // TURKEY
  'Istanbul':    { lat: 41.01, lng: 28.95, neighbours: ['Thessaloniki','Alexandroupoli','Ankara','Burgas'] },
  'Ankara':      { lat: 39.92, lng: 32.85, neighbours: ['Istanbul','Izmir','Antalya'] },
  'Izmir':       { lat: 38.42, lng: 27.14, neighbours: ['Istanbul','Athens','Ankara'] },
};

// ALIASES — alternative spellings map to a canonical city key
const ALIASES = {
  'tiranë':      'Tirane',
  'tirana':      'Tirane',
  'shqipëri':    'Tirane',
  'durrës':      'Durres',
  'vlorë':       'Vlore',
  'shkodër':     'Shkoder',
  'korçë':       'Korce',
  'gjirokastër': 'Gjirokaster',
  'gjirokastra': 'Gjirokaster',
  'lëzhë':       'Lezhe',
  'lezhë':       'Lezhe',
  'krujë':       'Tirane',
  'kruje':       'Tirane',
  'tepelena':    'Tepelene',
  'corovode':    'Tirane',
  'shëngjin':    'Lezhe',
  'mamurras':    'Lezhe',
  'bajram curri':'Kukes',
  // common alternate spellings
  'kyiv':        'Kyiv',
  'kiev':        'Kyiv',
  'prague':      'Prague',
  'münchen':     'Munich',
  'münchen':     'Munich',
  'köln':        'Cologne',
  'zürich':      'Zurich',
  'wien':        'Vienna',
  'génova':      'Genoa',
  'roma':        'Rome',
  'venezia':     'Venice',
  'firenze':     'Florence',
  'torino':      'Turin',
  'napoli':      'Naples',
  'beograd':     'Belgrade',
  'beograd':     'Belgrade',
  'warszawa':    'Warsaw',
  'krakow':      'Krakow',
  'cracow':      'Krakow',
  'varşova':     'Warsaw',
  'athina':      'Athens',
  'athena':      'Athens',
  'istanbul':    'Istanbul',
  'the hague':   'Amsterdam',
  'den haag':    'Amsterdam',
  'antwerpen':   'Antwerp',
  'sevilla':     'Seville',
  'zaragoza':    'Zaragoza',
};

// ============ ROUTE FINDING ============
function findRoute(from, to) {
  if (!CITIES[from] || !CITIES[to]) return [from, to];
  if (from === to) return [from];

  const visited = new Set([from]);
  const queue = [[from, [from]]];

  while (queue.length) {
    const [current, path] = queue.shift();
    for (const neighbour of (CITIES[current].neighbours || [])) {
      if (neighbour === to) return [...path, neighbour];
      if (!visited.has(neighbour) && CITIES[neighbour]) {
        visited.add(neighbour);
        queue.push([neighbour, [...path, neighbour]]);
      }
    }
  }
  return [from, to];
}

// ============ CITY RESOLVER ============
function resolveCity(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
  const lower   = trimmed.toLowerCase();

  // 1. Exact match (case-insensitive)
  const exact = Object.keys(CITIES).find(c => c.toLowerCase() === lower);
  if (exact) return exact;

  // 2. Alias map
  if (ALIASES[lower]) return ALIASES[lower];

  // 3. Partial match
  const partial = Object.keys(CITIES).find(c =>
    lower.includes(c.toLowerCase()) || c.toLowerCase().includes(lower)
  );
  if (partial) return partial;

  console.log(`⚠️  Unknown city "${trimmed}" — add it to the city list if needed`);
  return null;
}

// ============ AUTH ============
let token = null;

async function login() {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SIM_EMAIL, password: SIM_PASSWORD }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    token = data.token;
    console.log('✅ Simulator authenticated');
  } catch (err) {
    console.error('❌ Login failed:', err.message);
    token = null;
  }
}

async function authedFetch(path, options = {}) {
  if (!token) await login();
  return fetch(`${GATEWAY_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

// ============ STATE ============
const progress = {}; // bookingId → { route, stepIndex }

// ============ TICK ============
async function tick() {
  try {
    const res = await authedFetch('/api/bookings');
    if (!res.ok) { token = null; return; }

    const { bookings = [] } = await res.json();
    const active = bookings.filter(b => b.status === 'in_transit');

    if (active.length === 0) {
      console.log('💤 No in-transit bookings');
      return;
    }

    for (const booking of active) {
      const fromCity = resolveCity(booking.pickup_location?.city);
      const toCity   = resolveCity(booking.delivery_location?.city);

      if (!fromCity || !toCity) {
        console.log(`⚠️  Skipping ${booking.id.slice(0,8)} — unresolved cities: "${booking.pickup_location?.city}" → "${booking.delivery_location?.city}"`);
        continue;
      }

      if (!progress[booking.id]) {
        progress[booking.id] = { route: findRoute(fromCity, toCity), stepIndex: 0 };
        console.log(`🗺️  Route ${booking.id.slice(0,8)}: ${progress[booking.id].route.join(' → ')}`);
      }

      const state  = progress[booking.id];
      if (state.stepIndex < state.route.length - 1) state.stepIndex++;

      const currentCity = state.route[state.stepIndex];
      const coords      = CITIES[currentCity];
      const isLast      = state.stepIndex === state.route.length - 1;

      const jitter = () => (Math.random() - 0.5) * 0.2;
      const msgs = [
        `Shipment passing through ${currentCity}`,
        `Truck checked in at ${currentCity}`,
        `On schedule — currently near ${currentCity}`,
        `All clear at ${currentCity}, route continues`,
      ];

      await authedFetch(`/api/tracking/${booking.id}/update`, {
        method: 'POST',
        body: JSON.stringify({
          city: currentCity,
          latitude:   coords.lat + jitter(),
          longitude:  coords.lng + jitter(),
          status:     'in_transit',
          message:    isLast ? `Approaching destination near ${currentCity}` : msgs[Math.floor(Math.random() * msgs.length)],
          updated_by: 'simulator',
        }),
      });

      console.log(`📍 ${booking.id.slice(0,8)} → ${currentCity} (step ${state.stepIndex}/${state.route.length - 1})`);

      // Push ETA to tracking service so frontend can display it
      const stepsRemaining = state.route.length - 1 - state.stepIndex;
      await authedFetch(`/api/tracking/${booking.id}/eta`, {
        method: 'POST',
        body: JSON.stringify({
          steps_total:     state.route.length - 1,
          steps_remaining: stepsRemaining,
          tick_ms:         TICK_MS,
          destination:     state.route[state.route.length - 1],
          route:           state.route.join(' → '),
        }),
      });

      if (isLast) {
        delete progress[booking.id];
        console.log(`🏁 ${booking.id.slice(0,8)} reached destination — marking delivered`);

        // Auto-mark the booking as delivered
        try {
          await authedFetch(`/api/bookings/${booking.id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'delivered', shipper_id: booking.shipper_id }),
          });
          console.log(`✅ ${booking.id.slice(0,8)} marked as delivered`);
        } catch (err) {
          console.error(`❌ Could not mark ${booking.id.slice(0,8)} as delivered:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error('❌ Tick error:', err.message);
    token = null;
  }
}

// ============ START ============
async function start() {
  console.log(`🚀 Location Simulator — ${Object.keys(CITIES).length} cities loaded (tick every ${TICK_MS / 1000}s)`);
  await new Promise(r => setTimeout(r, 10000)); // wait for gateway
  await login();
  await tick();
  setInterval(tick, TICK_MS);
}

start();
