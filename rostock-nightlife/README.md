# 🌃 Rostock Nightlife

A modern, responsive web application that displays all clubs in Rostock as interactive cards and map markers. Find the best nightlife events and plan your perfect night out in Rostock.

## ✨ Features

### Core Features
- **Interactive Club Cards**: Each club displayed as a clickable card with name, logo, and description
- **2-Week Event Schedules**: Detailed event information including dates, times, prices, and themes
- **Event Comparison**: Compare upcoming events across all clubs to decide where to party
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Nightlife-inspired dark theme as default

### Bonus Features
- **Genre Filtering**: Filter clubs by music genre (Techno, Hip-Hop, Charts, etc.)
- **Trending Events**: Highlights the most popular events happening soon
- **Map View**: Interactive map showing club locations in Rostock
- **Mobile Optimized**: Touch-friendly interface for mobile users

## 🛠️ Technologies

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: TailwindCSS with custom nightlife-themed colors
- **Maps**: Leaflet.js for interactive map functionality
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting and manipulation

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd rostock-nightlife
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Use

### Browse Clubs
- **Grid View**: Browse all clubs as interactive cards
- **Map View**: See club locations on an interactive map of Rostock
- **Club Details**: Click any club to see its full 2-week event schedule

### Filter and Search
- **Genre Filters**: Use filter buttons to show only clubs playing specific music genres
- **Active Filters**: See which filters are applied and easily remove them
- **Clear All**: Reset all filters to browse all clubs

### View Events
- **Event Schedules**: Each club shows a detailed 2-week calendar
- **Event Details**: See event names, dates, times, prices, DJs, and dress codes
- **Trending Events**: Featured events happening in the next few days

### Map Features
- **Club Markers**: Custom markers showing club locations
- **Interactive Popups**: Click markers to see club information
- **Dark Theme**: Map tiles match the nightlife aesthetic

## 🏢 Featured Clubs

The application includes data for 6 major Rostock nightlife venues:

1. **MAU CLUB** - Premier electronic music destination
2. **Musik Bar** - Intimate venue with eclectic music
3. **Studentenkeller** - Popular student hangout
4. **FLAX** - Trendy multi-floor club
5. **Warehouse** - Industrial-style underground venue
6. **Kulturkantine** - Cultural center with diverse programming

## 🎵 Music Genres

- **Electronic**: Techno, House, Drum & Bass, Industrial
- **Popular**: Charts, Pop, Hip-Hop
- **Alternative**: Indie, Rock, Alternative
- **Diverse**: Jazz, World Music, Experimental, Latin

## 📱 Mobile Experience

- **Touch-Friendly**: Large touch targets and smooth interactions
- **Responsive Layout**: Adapts to all screen sizes
- **Fast Loading**: Optimized images and efficient code splitting
- **Mobile Navigation**: Easy-to-use navigation on small screens

## 🎨 Design Features

### Dark Theme
- **Nightlife Colors**: Purple, pink, and blue neon accents
- **Dark Backgrounds**: Easy on the eyes in low-light conditions
- **Gradient Effects**: Modern gradient overlays and borders
- **Custom Fonts**: Orbitron font for club names

### Visual Elements
- **Neon Text Effects**: Glowing text animations
- **Hover Animations**: Smooth transitions and effects
- **Card Shadows**: Depth and visual hierarchy
- **Color-Coded Genres**: Visual distinction between music types

## 🔧 Customization

### Adding New Clubs
Edit `src/data/clubs.ts` to add new venues:

```typescript
{
  id: 'new-club',
  name: 'New Club Name',
  logo: '🎪',
  description: 'Club description...',
  address: 'Street Address, Rostock',
  coordinates: [54.0887, 12.1281],
  genres: ['Techno', 'House'],
  events: generateEvents('new-club', [...])
}
```

### Styling Changes
Modify `tailwind.config.js` to customize colors and themes:

```javascript
colors: {
  'neon-purple': '#9945FF',
  'neon-pink': '#FF0080',
  'neon-blue': '#00D2FF',
}
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Enjoy exploring Rostock's nightlife! 🍻🎵**
