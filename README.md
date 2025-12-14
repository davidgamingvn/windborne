# Windborne

A 3D interactive globe visualization of stratospheric balloon positions in real-time. Built with Next.js and Three.js.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **3D Globe View**: Interactive Three.js globe showing balloon positions with altitude-based coloring
- **Real-Time Data**: Fetches balloon positions from Windborne's API at different time offsets
- **Geolocation**: Automatically displays the country where the balloon is flying over
- **Light/Dark Mode**: Themed visualization with dynamic globe coloring
- **Filters & Controls**: Altitude range filtering, time offset selection

## Public APIs Used

| API                          | Purpose                                        |
| ---------------------------- | ---------------------------------------------- |
| **Windborne Treasure API**   | Real balloon position and altitude data        |
| **GeoJSON World Boundaries** | Country border lines on the globe              |
| **Turf.js**                  | Geospatial calculations and fallback geocoding |

## How It Works

### 1. **Windborne API**

- The app queries: `https://a.windbornesystems.com/treasure/?offset=0` (where offset is hours ago)
- Returns: Array of balloons with `lat`, `lon`, and `alt` (altitude in km)
- A Next.js API route (`/api/balloon/[offset]`) proxies this to avoid CORS issues
- Data is stored in a Zustand store and cleaned on arrival

### 2. **Geolocation Implementation**

When you hover over a balloon, the app:

1. Takes the balloon's coordinates
2. Gets the geolocation
3. Falls back to **Turf.js** (local processing) if API is slow
4. Displays the result

**To modify geolocation behavior**, edit `lib/utils/geocoding.ts`:

- Add/remove country flags: `COUNTRY_FLAGS` object
- Adjust fallback logic in `getGeolocationData()` function

### 3. **Displaying on the 3D Globe**

- **Balloons appear as colored spheres** positioned at their lat/lon coordinates
- **Color depends on altitude**:
  - Gold: Stratosphere (>25 km)
  - Dark Gold: Upper Troposphere (10-25 km)
  - Brown: Lower Troposphere (<10 km)
- **Map lines** show country borders in contrasting colors
- The entire globe rotates automatically; drag to manually rotate

**To customize globe appearance**, edit `components/Globe/GlobeCanvas.tsx`:

- Change balloon colors: Modify `BALLOON_COLORS` in `lib/constants.ts`
- Change sphere size: Adjust `0.15` in geometry creation
- Change atmosphere glow: Modify opacity and color in `atmosphereMaterial`

## Build & Deploy

```bash
npm run build
npm start
```
