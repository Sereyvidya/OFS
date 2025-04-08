import folium
import requests

# Your Mapbox token
MAPBOX_TOKEN = "pk.eyJ1IjoiaGFzYW4wNDA3IiwiYSI6ImNtOTkwbnU5bTAxczAyanB0N293aXE2NnYifQ.9rtMo9TOdyn1x4CTrwM5gg"

# Coordinates in (longitude, latitude)
coordinates = [
    [-121.8863, 37.3382],  # 🟢 SJSU — Starting point
    [-121.8914, 37.3318],
    [-121.8946, 37.3352],
    [-121.9017, 37.3335],
    [-121.8890, 37.3269],
    [-121.9053, 37.3402],
    [-121.8771, 37.3502],
    [-121.8995, 37.3242],
    [-121.9154, 37.3370],
    [-121.8750, 37.3369]
]

# Format coordinates for Mapbox API
coords_formatted = ";".join([f"{lng},{lat}" for lng, lat in coordinates])

# Only lock the starting point using `source=first`
url = (
    f"https://api.mapbox.com/optimized-trips/v1/mapbox/driving/{coords_formatted}"
    f"?geometries=geojson&source=first&access_token={MAPBOX_TOKEN}"
)

# Request optimized trip
response = requests.get(url)
data = response.json()

# Extract the optimized route
route = data['trips'][0]['geometry']['coordinates']

# Sort coordinates based on Mapbox's waypoint index (optimized order)
waypoints = data['waypoints']
ordered_coords = [None] * len(waypoints)
for wp in waypoints:
    index = wp['waypoint_index']
    ordered_coords[index] = wp['location']  # [lng, lat]

# Create map centered on the start location (SJSU)
m = folium.Map(location=[ordered_coords[0][1], ordered_coords[0][0]], zoom_start=13, tiles="CartoDB positron")

# Draw the optimized route as a red line
folium.PolyLine(locations=[(lat, lng) for lng, lat in route], color='purple', weight=5).add_to(m)

# Mark the starting point in green
folium.Marker(
    location=[ordered_coords[0][1], ordered_coords[0][0]],
    popup="Start (SJSU)",
    icon=folium.Icon(color='green')
).add_to(m)

# Mark the final stop in red
folium.Marker(
    location=[ordered_coords[-1][1], ordered_coords[-1][0]],
    popup="Final Stop",
    icon=folium.Icon(color='red')
).add_to(m)

# Mark and label each stop in travel order
for i, (lng, lat) in enumerate(ordered_coords):
    if i == 0:
      continue
    elif i == len(ordered_coords) - 1:
      continue
    else:
      folium.Marker(
          location=[lat, lng],
          popup=f"Stop {i+1}",
          icon=folium.Icon(color='blue')
      ).add_to(m)

# Save to file and show inline (in Jupyter)
m.save("optimized_route.html")
m
