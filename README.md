# Wardrobe Dashboard

A visual wardrobe management and outfit planning tool built for Life Concierge.

## Features

### 📦 My Wardrobe
- View all clothing items in a visual grid
- Filter by category, color, brand, and style
- Click any item for detailed view

### ✨ Outfit Builder
- Drag and drop items to create outfits
- Slots for outerwear, top, bottom, and footwear
- Random outfit generator
- Save outfits for later

### 📊 Analytics
- Category breakdown
- Color distribution
- Top brands
- Style analysis
- Wardrobe insights and recommendations

## Tech Stack

- Pure HTML/CSS/JS (no frameworks)
- Responsive design
- Dark theme
- LocalStorage for saved outfits

## Setup

1. Clone the repo
2. Ensure clothing images are in `../clothing-pics/`
3. Open `index.html` in a browser

## Data Format

The wardrobe data is stored in `data.js`:

```javascript
{
  "items": [
    {
      "id": 1,
      "image": "part1_image0.jpeg",
      "brand": "ROBERT BARAKETT",
      "category": "long-sleeve-shirt",
      "color": "white",
      "style": ["casual"]
    }
  ]
}
```

## Categories

**Tops:** t-shirt, polo, long-sleeve-shirt, sweater, hoodie, cardigan, quarter-zip, sweatshirt, henley, shirt

**Bottoms:** jeans, pants, chinos, joggers, sweatpants

**Outerwear:** jacket, coat, blazer, shacket

**Footwear:** sneakers, boots, loafers, oxford-shoes, sandals

## Future Enhancements

- [ ] Weather-based outfit suggestions
- [ ] Calendar integration (dress for the occasion)
- [ ] Outfit history tracking
- [ ] Packing list generator
- [ ] Photo upload for new items
- [ ] AI style recommendations
- [ ] Mobile app

## License

Proprietary - Life Concierge
