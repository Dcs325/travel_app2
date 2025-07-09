# US Travel Cost Estimator

This app estimates travel costs for trips between US states, including flights, hotels, food, local transport, and activities. It features:
- Modern, responsive React UI
- Flight data via Aviationstack API (proxied through a Node.js server)
- Hotel search via Mapbox Places API (US-only, filtered by state)
- Optional address geocoding
- Dynamic hotel and flight info display

## Setup

### 1. Clone the repository
```
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Install dependencies
```
npm install
```

### 3. Configure API Keys
- **Mapbox:** Get a public access token from [Mapbox](https://account.mapbox.com/).
- **Aviationstack:** Get a free API key from [Aviationstack](https://aviationstack.com/).
- Add your keys to the appropriate places in `src/App.jsx` and `proxy.mjs`.

### 4. Start the Node.js Proxy Server
```
node proxy.mjs
```
This will run the proxy for Aviationstack on `http://localhost:5001`.

### 5. Start the React App
```
npm start
```

## Usage
1. Fill in the trip form (origin, destination, dates, travelers, style).
2. Click **Calculate Estimated Cost**.
3. The app will:
   - Show a cost breakdown
   - Auto-select the first attraction (if none is selected)
   - Fetch and display hotels near the destination (US-only, filtered by state)
   - Fetch and display flight info (if "Fly" is selected)
4. You can view and select attractions, toggle travel mode, and see real-time hotel and flight info.

## Hotel Search Logic
- Uses Mapbox Places API with `proximity` set to the destination coordinates.
- Restricts results to the US using a bounding box.
- Filters results to only show hotels whose address includes the selected state.
- Only hotels, inns, motels, and resorts are shown.

## Flight Search Logic
- Uses Aviationstack API via a local Node.js proxy.
- Finds nearest airport to your location or lets you select one manually.
- Shows simulated and real-time flight info.

## Troubleshooting
- **No hotels found nearby:** Mapbox may not have hotel data for some rural or less-mapped areas. Try a major city or check the browser console for the actual coordinates/query.
- **Hotels in the wrong state:** The app now filters by state, but if you still see wrong results, check the coordinates being sent to Mapbox (see console logs).
- **Flight info missing:** Make sure the proxy server is running and your API key is valid.

## Customization
- You can add more attractions, activities, or states in the data files.
- To use a more comprehensive hotel API, see the comments in `src/App.jsx`.

---

Enjoy planning your US trip!
