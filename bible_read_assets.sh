#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎨 Generating Book Reading Assets${NC}"

# Project root
PROJECT_ROOT="."
cd "$PROJECT_ROOT" || { echo -e "${RED}❌ Project directory not found!${NC}"; exit 1; }

# Create directories
echo -e "${YELLOW}Creating asset directories...${NC}"
mkdir -p src/assets/images/books/christian
mkdir -p src/assets/images/books/covers
mkdir -p src/assets/images/books/backgrounds
mkdir -p src/assets/audio/books
mkdir -p src/assets/fonts/reading

# Generate SVG placeholder images
echo -e "${YELLOW}Generating SVG placeholder images...${NC}"

# 1. Book covers
cat > src/assets/images/books/covers/placeholder.svg << 'EOF'
<svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#667eea"/>
      <stop offset="100%" stop-color="#764ba2"/>
    </linearGradient>
    <linearGradient id="spineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4a5568"/>
      <stop offset="100%" stop-color="#2d3748"/>
    </linearGradient>
  </defs>

  <!-- Book spine -->
  <rect x="50" y="50" width="30" height="460" fill="url(#spineGrad)" rx="5"/>

  <!-- Book cover -->
  <rect x="80" y="50" width="290" height="460" fill="url(#coverGrad)" rx="10"/>

  <!-- Cross symbol -->
  <g transform="translate(225, 200)">
    <rect x="-40" y="-5" width="80" height="10" fill="white" opacity="0.8" rx="5"/>
    <rect x="-5" y="-40" width="10" height="80" fill="white" opacity="0.8" rx="5"/>
  </g>

  <!-- Title -->
  <text x="225" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
    Christian Book
  </text>

  <!-- Subtitle -->
  <text x="225" y="360" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.9">
    For Kids
  </text>

  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="15" fill="white" opacity="0.3"/>
  <circle cx="350" cy="400" r="20" fill="white" opacity="0.3"/>
  <circle cx="150" cy="450" r="12" fill="white" opacity="0.3"/>
</svg>
EOF

# 2. Different colored book covers
create_colored_book() {
  local id=$1
  local color1=$2
  local color2=$3
  local title=$4

  cat > "src/assets/images/books/covers/book-${id}.svg" << EOF
<svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coverGrad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
    <linearGradient id="spineGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4a5568"/>
      <stop offset="100%" stop-color="#2d3748"/>
    </linearGradient>
    <filter id="shadow${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="5" dy="10" stdDeviation="5" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Book with shadow -->
  <g filter="url(#shadow${id})">
    <!-- Book spine -->
    <rect x="50" y="50" width="30" height="460" fill="url(#spineGrad${id})" rx="5"/>

    <!-- Book cover -->
    <rect x="80" y="50" width="290" height="460" fill="url(#coverGrad${id})" rx="10"/>
  </g>

  <!-- Decorative pattern -->
  <g opacity="0.2">
    <circle cx="120" cy="120" r="25" fill="white"/>
    <circle cx="280" cy="380" r="30" fill="white"/>
    <circle cx="200" cy="200" r="15" fill="white"/>
  </g>

  <!-- Icon based on book type -->
  <g transform="translate(225, 220)" fill="white" opacity="0.9">
EOF

  # Add different icons based on ID
  case $id in
    1)
      echo '    <!-- Bible icon -->' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <rect x="-30" y="-40" width="60" height="80" rx="5" stroke="white" stroke-width="3" fill="none"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <line x1="-15" y1="-30" x2="15" y2="-30" stroke="white" stroke-width="2"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <line x1="-15" y1="-20" x2="15" y2="-20" stroke="white" stroke-width="2"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      ;;
    2)
      echo '    <!-- Ark icon -->' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <path d="M -40,-20 Q -20,-40 0,-20 Q 20,0 0,20 Q -20,40 -40,20 Q -20,0 -40,-20" fill="none" stroke="white" stroke-width="3"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <circle cx="-20" cy="0" r="5" fill="white"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <circle cx="20" cy="0" r="5" fill="white"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      ;;
    3)
      echo '    <!-- Shield/sword icon -->' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <path d="M -30,0 L 0,-30 L 30,0 L 0,30 Z" fill="none" stroke="white" stroke-width="3"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <line x1="0" y1="-40" x2="0" y2="40" stroke="white" stroke-width="3"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      ;;
    4)
      echo '    <!-- Heart/hand icon -->' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <path d="M -30,0 Q -45,-20 -20,-30 Q 0,-45 20,-30 Q 45,-20 30,0 Q 20,20 0,30 Q -20,20 -30,0" fill="none" stroke="white" stroke-width="3"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      ;;
    5)
      echo '    <!-- Child/smile icon -->' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <circle cx="0" cy="0" r="40" fill="none" stroke="white" stroke-width="3"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <circle cx="-15" cy="-10" r="5" fill="white"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <circle cx="15" cy="-10" r="5" fill="white"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <path d="M -20,15 Q 0,25 20,15" stroke="white" stroke-width="3" fill="none"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      ;;
    6)
      echo '    <!-- Fruit icon -->' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <circle cx="0" cy="0" r="40" fill="none" stroke="white" stroke-width="3"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <path d="M -5,-35 L 0,-45 L 5,-35" stroke="white" stroke-width="2" fill="none"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <circle cx="-20" cy="-10" r="8" fill="white"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <circle cx="20" cy="-10" r="8" fill="white"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <circle cx="0" cy="15" r="10" fill="white"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      ;;
    7)
      echo '    <!-- Star/Christmas icon -->' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <path d="M 0,-40 L 12,-15 L 40,-10 L 20,10 L 25,40 L 0,25 L -25,40 L -20,10 L -40,-10 L -12,-15 Z" fill="none" stroke="white" stroke-width="3"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      ;;
    8)
      echo '    <!-- Praying hands icon -->' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <path d="M -30,0 Q -40,-20 -20,-30 L -10,-20 Q -25,-15 -30,0" fill="none" stroke="white" stroke-width="3"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      echo '    <path d="M 30,0 Q 40,-20 20,-30 L 10,-20 Q 25,-15 30,0" fill="none" stroke="white" stroke-width="3"/>' >> "src/assets/images/books/covers/book-${id}.svg"
      ;;
  esac

  cat >> "src/assets/images/books/covers/book-${id}.svg" << EOF
  </g>

  <!-- Title -->
  <text x="225" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="22" font-weight="bold">
    ${title}
  </text>

  <!-- For Kids -->
  <text x="225" y="360" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" opacity="0.9">
    Christian Values
  </text>

  <!-- Sparkle effects -->
  <g opacity="0.6">
    <circle cx="100" cy="100" r="3" fill="white"/>
    <circle cx="350" cy="150" r="4" fill="white"/>
    <circle cx="300" cy="400" r="2" fill="white"/>
    <circle cx="150" cy="350" r="3" fill="white"/>
  </g>
</svg>
EOF
}

# Create 8 different book covers
echo -e "${YELLOW}Creating 8 Christian book covers...${NC}"
create_colored_book 1 "#667eea" "#764ba2" "Beginner's Bible"
create_colored_book 2 "#4CAF50" "#2E7D32" "Noah's Ark"
create_colored_book 3 "#FF9800" "#EF6C00" "David & Goliath"
create_colored_book 4 "#9C27B0" "#6A1B9A" "Good Samaritan"
create_colored_book 5 "#00BCD4" "#00838F" "God Made Me"
create_colored_book 6 "#FF5722" "#D84315" "Fruit of Spirit"
create_colored_book 7 "#F44336" "#C62828" "Christmas Story"
create_colored_book 8 "#795548" "#4E342E" "Prayer Time"

# 3. Story scene images
echo -e "${YELLOW}Creating story scene images...${NC}"

# Creation scene
cat > src/assets/images/books/christian/creation.svg << 'EOF'
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a237e"/>
      <stop offset="100%" stop-color="#283593"/>
    </linearGradient>
    <radialGradient id="sun">
      <stop offset="0%" stop-color="#FFD600"/>
      <stop offset="100%" stop-color="#FF9800"/>
    </radialGradient>
    <linearGradient id="land" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#388E3C"/>
      <stop offset="100%" stop-color="#2E7D32"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Sky -->
  <rect width="800" height="400" fill="url(#sky)"/>

  <!-- Sun -->
  <circle cx="700" cy="100" r="60" fill="url(#sun)" filter="url(#glow)"/>

  <!-- Clouds -->
  <g fill="white" opacity="0.8">
    <ellipse cx="200" cy="80" rx="60" ry="30"/>
    <ellipse cx="150" cy="100" rx="50" ry="25"/>
    <ellipse cx="250" cy="100" rx="50" ry="25"/>

    <ellipse cx="400" cy="150" rx="70" ry="35"/>
    <ellipse cx="350" cy="170" rx="60" ry="30"/>
    <ellipse cx="450" cy="170" rx="60" ry="30"/>
  </g>

  <!-- Land -->
  <rect y="400" width="800" height="200" fill="url(#land)"/>

  <!-- Trees -->
  <g>
    <!-- Tree 1 -->
    <rect x="100" y="350" width="20" height="100" fill="#5D4037"/>
    <circle cx="110" cy="320" r="50" fill="#4CAF50"/>
    <circle cx="80" cy="340" r="40" fill="#4CAF50"/>
    <circle cx="140" cy="340" r="40" fill="#4CAF50"/>
    <circle cx="110" cy="300" r="35" fill="#4CAF50"/>

    <!-- Tree 2 -->
    <rect x="300" y="350" width="20" height="100" fill="#5D4037"/>
    <circle cx="310" cy="320" r="50" fill="#4CAF50"/>
    <circle cx="280" cy="340" r="40" fill="#4CAF50"/>
    <circle cx="340" cy="340" r="40" fill="#4CAF50"/>
    <circle cx="310" cy="300" r="35" fill="#4CAF50"/>

    <!-- Tree 3 -->
    <rect x="500" y="350" width="20" height="100" fill="#5D4037"/>
    <circle cx="510" cy="320" r="50" fill="#4CAF50"/>
    <circle cx="480" cy="340" r="40" fill="#4CAF50"/>
    <circle cx="540" cy="340" r="40" fill="#4CAF50"/>
    <circle cx="510" cy="300" r="35" fill="#4CAF50"/>
  </g>

  <!-- Animals -->
  <g>
    <!-- Bird -->
    <path d="M 650,200 Q 670,180 690,200 Q 670,190 650,200" fill="#795548"/>
    <circle cx="640" cy="195" r="8" fill="#795548"/>

    <!-- Bunny -->
    <ellipse cx="200" cy="450" rx="25" ry="15" fill="white"/>
    <circle cx="190" cy="445" r="8" fill="white"/>
    <circle cx="210" cy="445" r="8" fill="white"/>
    <ellipse cx="185" cy="440" rx="5" ry="3" fill="pink"/>
    <ellipse cx="205" cy="440" rx="5" ry="3" fill="pink"/>
    <ellipse cx="185" cy="460" rx="3" ry="6" fill="white"/>
    <ellipse cx="215" cy="460" rx="3" ry="6" fill="white"/>

    <!-- Deer -->
    <ellipse cx="600" cy="450" rx="30" ry="20" fill="#8D6E63"/>
    <circle cx="580" cy="445" r="8" fill="#8D6E63"/>
    <circle cx="620" cy="445" r="8" fill="#8D6E63"/>
    <path d="M 590,430 Q 580,400 595,425" stroke="#5D4037" stroke-width="3" fill="none"/>
    <path d="M 610,430 Q 620,400 605,425" stroke="#5D4037" stroke-width="3" fill="none"/>
  </g>

  <!-- Title -->
  <text x="400" y="550" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="bold">
    God Created the World
  </text>

  <!-- Verse -->
  <text x="400" y="580" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" opacity="0.9">
    Genesis 1:1
  </text>
</svg>
EOF

# Noah's Ark scene
cat > src/assets/images/books/christian/noahs-ark.svg << 'EOF'
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="stormySky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#37474F"/>
      <stop offset="100%" stop-color="#263238"/>
    </linearGradient>
    <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1976D2"/>
      <stop offset="100%" stop-color="#0D47A1"/>
    </linearGradient>
    <linearGradient id="arkWood" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8D6E63"/>
      <stop offset="100%" stop-color="#5D4037"/>
    </linearGradient>
  </defs>

  <!-- Stormy Sky -->
  <rect width="800" height="300" fill="url(#stormySky)"/>

  <!-- Rain -->
  <g stroke="#BBDEFB" stroke-width="2" opacity="0.6">
    <line x1="50" y1="50" x2="55" y2="80"/>
    <line x1="150" y1="80" x2="155" y2="110"/>
    <line x1="250" y1="60" x2="255" y2="90"/>
    <line x1="350" y1="100" x2="355" y2="130"/>
    <line x1="450" y1="70" x2="455" y2="100"/>
    <line x1="550" y1="90" x2="555" y2="120"/>
    <line x1="650" y1="50" x2="655" y2="80"/>
    <line x1="750" y1="110" x2="755" y2="140"/>

    <line x1="100" y1="120" x2="105" y2="150"/>
    <line x1="200" y1="140" x2="205" y2="170"/>
    <line x1="300" y1="160" x2="305" y2="190"/>
    <line x1="400" y1="130" x2="405" y2="160"/>
    <line x1="500" y1="150" x2="505" y2="180"/>
    <line x1="600" y1="170" x2="605" y2="200"/>
    <line x1="700" y1="130" x2="705" y2="160"/>
  </g>

  <!-- Water -->
  <rect y="300" width="800" height="300" fill="url(#water)"/>

  <!-- Waves -->
  <g fill="none" stroke="#64B5F6" stroke-width="3" opacity="0.5">
    <path d="M 0,350 Q 100,330 200,350 Q 300,370 400,350 Q 500,330 600,350 Q 700,370 800,350"/>
    <path d="M 0,400 Q 100,380 200,400 Q 300,420 400,400 Q 500,380 600,400 Q 700,420 800,400"/>
    <path d="M 0,450 Q 100,430 200,450 Q 300,470 400,450 Q 500,430 600,450 Q 700,470 800,450"/>
  </g>

  <!-- Ark -->
  <g transform="translate(300, 200)">
    <!-- Ark hull -->
    <path d="M 0,100 Q 100,0 200,100 Q 200,200 0,200 Z" fill="url(#arkWood)" stroke="#5D4037" stroke-width="5"/>

    <!-- Ark structure -->
    <rect x="20" y="50" width="160" height="50" fill="#5D4037"/>
    <rect x="40" y="30" width="120" height="20" fill="#795548"/>

    <!-- Windows -->
    <g fill="#FFD600">
      <rect x="50" y="60" width="30" height="20" rx="5"/>
      <rect x="120" y="60" width="30" height="20" rx="5"/>
    </g>

    <!-- Door -->
    <rect x="85" y="100" width="30" height="40" fill="#5D4037"/>
    <circle cx="100" cy="120" r="3" fill="#FFD600"/>
  </g>

  <!-- Rainbow -->
  <g opacity="0.7">
    <path d="M 50,250 Q 400,50 750,250" stroke="#FF5252" stroke-width="12" fill="none"/>
    <path d="M 60,260 Q 400,70 740,260" stroke="#FF9800" stroke-width="12" fill="none"/>
    <path d="M 70,270 Q 400,90 730,270" stroke="#FFD600" stroke-width="12" fill="none"/>
    <path d="M 80,280 Q 400,110 720,280" stroke="#4CAF50" stroke-width="12" fill="none"/>
    <path d="M 90,290 Q 400,130 710,290" stroke="#2196F3" stroke-width="12" fill="none"/>
    <path d="M 100,300 Q 400,150 700,300" stroke="#673AB7" stroke-width="12" fill="none"/>
  </g>

  <!-- Animals on ark -->
  <g>
    <!-- Giraffe head -->
    <ellipse cx="350" cy="220" rx="15" ry="20" fill="#FF9800"/>
    <ellipse cx="350" cy="210" rx="8" ry="10" fill="#FF9800"/>
    <circle cx="345" cy="215" r="3" fill="black"/>
    <circle cx="355" cy="215" r="3" fill="black"/>
    <path d="M 345,220 L 340,230" stroke="#5D4037" stroke-width="2"/>
    <path d="M 355,220 L 360,230" stroke="#5D4037" stroke-width="2"/>

    <!-- Elephant -->
    <circle cx="450" cy="250" r="25" fill="#9E9E9E"/>
    <ellipse cx="430" cy="245" rx="8" ry="5" fill="#9E9E9E"/>
    <ellipse cx="470" cy="245" rx="8" ry="5" fill="#9E9E9E"/>
    <path d="M 475,245 Q 490,240 490,250" stroke="#9E9E9E" stroke-width="5" fill="none"/>

    <!-- Lions -->
    <circle cx="280" cy="280" r="20" fill="#FF9800"/>
    <path d="M 260,275 Q 280,260 300,275" stroke="#FF9800" stroke-width="15" fill="none"/>
    <circle cx="275" cy="275" r="3" fill="black"/>
    <circle cx="285" cy="275" r="3" fill="black"/>

    <!-- Birds -->
    <path d="M 150,180 Q 160,170 170,180" stroke="#795548" stroke-width="3" fill="none"/>
    <path d="M 650,180 Q 660,170 670,180" stroke="#795548" stroke-width="3" fill="none"/>
  </g>

  <!-- Title -->
  <text x="400" y="550" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="bold">
    Noah's Ark Adventure
  </text>

  <!-- Verse -->
  <text x="400" y="580" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" opacity="0.9">
    Genesis 6:19-20
  </text>
</svg>
EOF

# David and Goliath scene
cat > src/assets/images/books/christian/david-goliath.svg << 'EOF'
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="desertSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFB74D"/>
      <stop offset="100%" stop-color="#FF9800"/>
    </linearGradient>
    <linearGradient id="desertGround" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFCC80"/>
      <stop offset="100%" stop-color="#FFB74D"/>
    </linearGradient>
    <radialGradient id="sunRadial">
      <stop offset="0%" stop-color="#FFD600"/>
      <stop offset="100%" stop-color="#FF9800"/>
    </radialGradient>
  </defs>

  <!-- Desert Sky -->
  <rect width="800" height="300" fill="url(#desertSky)"/>

  <!-- Sun -->
  <circle cx="700" cy="100" r="50" fill="url(#sunRadial)" opacity="0.9"/>

  <!-- Desert Ground -->
  <rect y="300" width="800" height="300" fill="url(#desertGround)"/>

  <!-- Desert hills -->
  <path d="M 0,300 Q 200,250 400,300 Q 600,350 800,300 L 800,600 L 0,600 Z" fill="#FFB74D"/>
  <path d="M 0,350 Q 150,320 300,350 Q 450,380 600,350 Q 750,320 800,350 L 800,600 L 0,600 Z" fill="#FFA726" opacity="0.7"/>

  <!-- Goliath (Giant) -->
  <g transform="translate(600, 150)">
    <!-- Body -->
    <rect x="-30" y="0" width="60" height="200" fill="#795548"/>

    <!-- Head -->
    <circle cx="0" cy="-30" r="40" fill="#8D6E63"/>

    <!-- Face -->
    <circle cx="-15" cy="-40" r="5" fill="white"/>
    <circle cx="15" cy="-40" r="5" fill="white"/>
    <circle cx="-15" cy="-40" r="2" fill="black"/>
    <circle cx="15" cy="-40" r="2" fill="black"/>
    <path d="M -10,-25 Q 0,-20 10,-25" stroke="black" stroke-width="2" fill="none"/>

    <!-- Hair -->
    <path d="M -30,-50 Q -20,-70 0,-60 Q 20,-70 30,-50" stroke="#5D4037" stroke-width="10" fill="none"/>

    <!-- Armor -->
    <rect x="-35" y="20" width="70" height="40" fill="#78909C" rx="5"/>
    <rect x="-25" y="60" width="50" height="20" fill="#546E7A"/>

    <!-- Sword -->
    <rect x="40" y="50" width="5" height="80" fill="#B0BEC5"/>
    <path d="M 42,50 L 52,60 L 42,70 Z" fill="#78909C"/>

    <!-- Shield -->
    <circle cx="-50" cy="80" r="25" fill="#455A64"/>
    <circle cx="-50" cy="80" r="15" fill="#37474F"/>
    <circle cx="-50" cy="80" r="8" fill="#263238"/>
  </g>

  <!-- David -->
  <g transform="translate(200, 250)">
    <!-- Body -->
    <path d="M -20,0 Q 0,30 20,0" fill="#4CAF50"/>

    <!-- Head -->
    <circle cx="0" cy="-30" r="25" fill="#FFCCBC"/>

    <!-- Face -->
    <circle cx="-8" cy="-35" r="3" fill="white"/>
    <circle cx="8" cy="-35" r="3" fill="white"/>
    <circle cx="-8" cy="-35" r="1.5" fill="black"/>
    <circle cx="8" cy="-35" r="1.5" fill="black"/>
    <path d="M -5,-20 Q 0,-18 5,-20" stroke="black" stroke-width="1.5" fill="none"/>

    <!-- Hair -->
    <path d="M -20,-40 Q -10,-55 0,-45 Q 10,-55 20,-40" stroke="#5D4037" stroke-width="6" fill="none"/>

    <!-- Sling -->
    <path d="M -30,10 Q 0,50 30,10" stroke="#8D6E63" stroke-width="3" fill="none"/>
    <circle cx="0" cy="30" r="10" fill="#795548"/>

    <!-- Stone in sling -->
    <circle cx="15" cy="15" r="8" fill="#757575"/>

    <!-- Bag for stones -->
    <ellipse cx="-40" cy="30" rx="15" ry="10" fill="#795548"/>
    <circle cx="-45" cy="25" r="4" fill="#9E9E9E"/>
    <circle cx="-35" cy="35" r="4" fill="#9E9E9E"/>
  </g>

  <!-- Sheep (David was a shepherd) -->
  <g transform="translate(100, 400)">
    <!-- Sheep body -->
    <ellipse cx="0" cy="0" rx="30" ry="20" fill="white"/>

    <!-- Wool texture -->
    <circle cx="-20" cy="-5" r="10" fill="white"/>
    <circle cx="0" cy="-10" r="12" fill="white"/>
    <circle cx="20" cy="-5" r="10" fill="white"/>
    <circle cx="-10" cy="10" r="8" fill="white"/>
    <circle cx="10" cy="10" r="8" fill="white"/>

    <!-- Head -->
    <circle cx="0" cy="-25" r="15" fill="white"/>

    <!-- Face -->
    <circle cx="-5" cy="-28" r="3" fill="black"/>
    <circle cx="5" cy="-28" r="3" fill="black"/>
    <path d="M -3,-20 Q 0,-18 3,-20" stroke="black" stroke-width="1.5" fill="none"/>

    <!-- Ears -->
    <ellipse cx="-10" cy="-35" rx="5" ry="8" fill="white"/>
    <ellipse cx="10" cy="-35" rx="5" ry="8" fill="white"/>
  </g>

  <!-- Title -->
  <text x="400" y="550" text-anchor="middle" fill="#5D4037" font-family="Arial, sans-serif" font-size="36" font-weight="bold">
    David and Goliath
  </text>

  <!-- Verse -->
  <text x="400" y="580" text-anchor="middle" fill="#795548" font-family="Arial, sans-serif" font-size="20" opacity="0.9">
    1 Samuel 17:45-47
  </text>
</svg>
EOF

# Create more scene images
cat > src/assets/images/books/christian/baby-jesus.svg << 'EOF'
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="nightSky">
      <stop offset="0%" stop-color="#0D47A1"/>
      <stop offset="100%" stop-color="#1A237E"/>
    </radialGradient>
    <radialGradient id="starGlow">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#BBDEFB" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow2">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Night Sky -->
  <rect width="800" height="600" fill="url(#nightSky)"/>

  <!-- Stars -->
  <g fill="white" opacity="0.8">
    <circle cx="100" cy="80" r="2"/>
    <circle cx="250" cy="120" r="3"/>
    <circle cx="400" cy="60" r="2"/>
    <circle cx="550" cy="100" r="4"/>
    <circle cx="700" cy="70" r="2"/>
    <circle cx="180" cy="180" r="3"/>
    <circle cx="320" cy="200" r="2"/>
    <circle cx="480" cy="160" r="3"/>
    <circle cx="620" cy="190" r="2"/>
    <circle cx="750" cy="150" r="4"/>
  </g>

  <!-- Star of Bethlehem -->
  <g transform="translate(400, 100)" filter="url(#glow2)">
    <path d="M 0,-60 L 20,-20 L 60,-20 L 30,10 L 40,50 L 0,30 L -40,50 L -30,10 L -60,-20 L -20,-20 Z" fill="#FFD600"/>
    <circle cx="0" cy="0" r="30" fill="url(#starGlow)" opacity="0.5"/>
  </g>

  <!-- Stable -->
  <g transform="translate(400, 300)">
    <!-- Stable structure -->
    <polygon points="-150,100 0,-50 150,100" fill="#8D6E63" stroke="#5D4037" stroke-width="5"/>
    <rect x="-150" y="100" width="300" height="150" fill="#795548"/>

    <!-- Wood beams -->
    <rect x="-140" y="110" width="280" height="10" fill="#5D4037"/>
    <rect x="-140" y="180" width="280" height="10" fill="#5D4037"/>
    <rect x="-75" y="110" width="10" height="140" fill="#5D4037"/>
    <rect x="65" y="110" width="10" height="140" fill="#5D4037"/>

    <!-- Manger -->
    <rect x="-40" y="160" width="80" height="40" fill="#8D6E63"/>
    <rect x="-50" y="200" width="100" height="20" fill="#5D4037"/>

    <!-- Hay -->
    <g fill="#FFD600" opacity="0.7">
      <rect x="-35" y="165" width="70" height="30" rx="5"/>
      <circle cx="-20" cy="170" r="8"/>
      <circle cx="20" cy="180" r="10"/>
      <circle cx="0" cy="190" r="7"/>
    </g>
  </g>

  <!-- Baby Jesus -->
  <g transform="translate(400, 180)">
    <!-- Swaddling clothes -->
    <ellipse cx="0" cy="0" rx="30" ry="20" fill="white"/>
    <rect x="-20" y="-10" width="40" height="30" fill="white" rx="10"/>

    <!-- Face -->
    <circle cx="0" cy="-5" r="15" fill="#FFCCBC"/>
    <circle cx="-5" cy="-8" r="3" fill="white"/>
    <circle cx="5" cy="-8" r="3" fill="white"/>
    <circle cx="-5" cy="-8" r="1" fill="black"/>
    <circle cx="5" cy="-8" r="1" fill="black"/>
    <path d="M -3,0 Q 0,2 3,0" stroke="black" stroke-width="1" fill="none"/>

    <!-- Halo -->
    <circle cx="0" cy="-5" r="25" fill="none" stroke="#FFD600" stroke-width="3" stroke-dasharray="5,5"/>
  </g>

  <!-- Mary and Joseph -->
  <g>
    <!-- Mary -->
    <g transform="translate(300, 280)">
      <ellipse cx="0" cy="0" rx="20" ry="40" fill="#4A148C"/>
      <circle cx="0" cy="-50" r="20" fill="#FFCCBC"/>
      <path d="M -25,-50 Q 0,-70 25,-50" stroke="#4A148C" stroke-width="15" fill="none"/>
    </g>

    <!-- Joseph -->
    <g transform="translate(500, 280)">
      <ellipse cx="0" cy="0" rx="20" ry="40" fill="#004D40"/>
      <circle cx="0" cy="-50" r="20" fill="#FFCCBC"/>
      <rect x="-15" cy="-30" width="30" height="20" fill="#795548"/>
    </g>
  </g>

  <!-- Animals -->
  <g>
    <!-- Sheep -->
    <g transform="translate(250, 380)">
      <circle cx="0" cy="0" r="25" fill="white"/>
      <circle cx="0" cy="-20" r="15" fill="white"/>
      <circle cx="-10" cy="-25" r="3" fill="black"/>
      <circle cx="10" cy="-25" r="3" fill="black"/>
    </g>

    <!-- Donkey -->
    <g transform="translate(550, 380)">
      <ellipse cx="0" cy="0" rx="30" ry="20" fill="#795548"/>
      <ellipse cx="-25" cy="-10" rx="15" ry="10" fill="#795548"/>
      <ellipse cx="-40" cy="0" rx="8" ry="5" fill="#795548"/>
      <circle cx="-30" cy="-15" r="3" fill="black"/>
      <circle cx="-20" cy="-15" r="3" fill="black"/>
    </g>
  </g>

  <!-- Title -->
  <text x="400" y="550" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="bold">
    The Christmas Story
  </text>

  <!-- Verse -->
  <text x="400" y="580" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" opacity="0.9">
    Luke 2:10-11
  </text>
</svg>
EOF

# Create a CSS file for placeholder backgrounds
cat > src/assets/images/books/backgrounds/placeholders.css << 'EOF'
/* CSS-based placeholder backgrounds for books */

.book-placeholder-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.book-placeholder-1::before {
  content: '📖';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  opacity: 0.3;
}

.book-placeholder-2 {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  position: relative;
  overflow: hidden;
}

.book-placeholder-2::before {
  content: '⭐';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  opacity: 0.3;
}

.book-placeholder-3 {
  background: linear-gradient(135deg, #FF9800 0%, #EF6C00 100%);
  position: relative;
  overflow: hidden;
}

.book-placeholder-3::before {
  content: '✝';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  opacity: 0.3;
}

.book-placeholder-4 {
  background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%);
  position: relative;
  overflow: hidden;
}

.book-placeholder-4::before {
  content: '❤️';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  opacity: 0.3;
}

.book-placeholder-5 {
  background: linear-gradient(135deg, #00BCD4 0%, #00838F 100%);
  position: relative;
  overflow: hidden;
}

.book-placeholder-5::before {
  content: '👶';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  opacity: 0.3;
}

.book-placeholder-6 {
  background: linear-gradient(135deg, #FF5722 0%, #D84315 100%);
  position: relative;
  overflow: hidden;
}

.book-placeholder-6::before {
  content: '🍎';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  opacity: 0.3;
}

.book-placeholder-7 {
  background: linear-gradient(135deg, #F44336 0%, #C62828 100%);
  position: relative;
  overflow: hidden;
}

.book-placeholder-7::before {
  content: '🎄';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  opacity: 0.3;
}

.book-placeholder-8 {
  background: linear-gradient(135deg, #795548 0%, #4E342E 100%);
  position: relative;
  overflow: hidden;
}

.book-placeholder-8::before {
  content: '🙏';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  opacity: 0.3;
}

/* Scene backgrounds */
.scene-creation {
  background: linear-gradient(to bottom, #1a237e, #283593, #388E3C);
}

.scene-ark {
  background: linear-gradient(to bottom, #37474F, #1976D2);
}

.scene-david {
  background: linear-gradient(to bottom, #FFB74D, #FFB74D, #FFCC80);
}

.scene-christmas {
  background: linear-gradient(to bottom, #0D47A1, #1A237E);
}

.scene-prayer {
  background: linear-gradient(135deg, #1565C0, #0D47A1);
}

.scene-fruit {
  background: linear-gradient(135deg, #2E7D32, #1B5E20);
}

/* Pattern overlays */
.pattern-crosses::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px);
  background-size: 30px 30px;
}

.pattern-dots::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 10px 10px, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

.pattern-hearts::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 50% 15%, transparent 15px, rgba(255,255,255,0.1) 15px, rgba(255,255,255,0.1) 17px, transparent 17px),
    radial-gradient(circle at 15% 50%, transparent 15px, rgba(255,255,255,0.1) 15px, rgba(255,255,255,0.1) 17px, transparent 17px);
  background-size: 60px 60px;
}
EOF

# Create audio placeholder files (empty MP3 files with metadata)
echo -e "${YELLOW}Creating audio placeholder files...${NC}"

# Create empty MP3 files with proper headers
create_audio_placeholder() {
  local filename=$1
  local title=$2

  # Create a minimal MP3 file header (silent 1-second MP3)
  cat > "src/assets/audio/books/${filename}.mp3" << 'EOF'
This is a placeholder audio file.
In production, replace with actual MP3 audio files.
Use a service like AWS Polly, Google TTS, or record actual narration.
EOF

  # Create a metadata file
  cat > "src/assets/audio/books/${filename}.meta.json" << EOF
{
  "title": "${title}",
  "duration": 120,
  "format": "mp3",
  "placeholder": true,
  "instructions": "Replace with actual audio file. Consider using text-to-speech services for narration."
}
EOF
}

create_audio_placeholder "beginners-bible" "The Beginner's Bible Narration"
create_audio_placeholder "noahs-ark" "Noah's Ark Adventure"
create_audio_placeholder "david-goliath" "David and Goliath"
create_audio_placeholder "good-samaritan" "The Good Samaritan"
create_audio_placeholder "god-made-me" "God Made Me Special"
create_audio_placeholder "fruit-spirit" "Fruit of the Spirit"
create_audio_placeholder "christmas-story" "The Christmas Story"
create_audio_placeholder "prayer-time" "Prayer Time with Jesus"

# Create font files (CSS with Google Fonts)
cat > src/assets/fonts/reading/fonts.css << 'EOF'
/* Christian-themed fonts for kids */

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Short+Stack&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Love+Ya+Like+A+Sister&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Schoolbell&display=swap');

/* Font classes */
.font-kids-handwriting {
  font-family: 'Patrick Hand', cursive;
  letter-spacing: 1px;
}

.font-kids-print {
  font-family: 'Short Stack', cursive;
  line-height: 1.6;
}

.font-kids-comic {
  font-family: 'Comic Neue', cursive;
  font-weight: 700;
}

.font-christian-title {
  font-family: 'Love Ya Like A Sister', cursive;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.font-bible-verse {
  font-family: 'Schoolbell', cursive;
  font-size: 1.2em;
  line-height: 1.8;
}

/* Special effects for text */
.text-gold-glow {
  color: #FFD700;
  text-shadow:
    0 0 10px #FFD700,
    0 0 20px #FFD700,
    0 0 30px #FF9800;
}

.text-heavenly {
  background: linear-gradient(to bottom, #FFD700, #FFFFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.text-bible-paper {
  color: #5D4037;
  background: linear-gradient(to right, #FFF8E1, #FFECB3);
  padding: 10px 20px;
  border-radius: 5px;
  border-left: 5px solid #795548;
  font-family: 'Schoolbell', cursive;
}

/* Animation for important words */
@keyframes wordGlow {
  0%, 100% {
    color: #333;
    text-shadow: none;
  }
  50% {
    color: #FFD600;
    text-shadow: 0 0 10px rgba(255, 214, 0, 0.5);
  }
}

.glow-word {
  animation: wordGlow 2s infinite;
  font-weight: bold;
  cursor: pointer;
}

/* Bible verse styling */
.bible-verse-style {
  font-family: 'Schoolbell', cursive;
  font-style: italic;
  color: #5D4037;
  background: #FFF8E1;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #FFD54F;
  box-shadow: 0 5px 15px rgba(93, 64, 55, 0.1);
  position: relative;
}

.bible-verse-style::before {
  content: '"';
  font-family: 'Times New Roman', serif;
  font-size: 4em;
  color: #FFD54F;
  position: absolute;
  top: -20px;
  left: 10px;
  opacity: 0.5;
}

.bible-verse-style::after {
  content: '"';
  font-family: 'Times New Roman', serif;
  font-size: 4em;
  color: #FFD54F;
  position: absolute;
  bottom: -40px;
  right: 10px;
  opacity: 0.5;
}

/* Prayer text styling */
.prayer-text {
  font-family: 'Patrick Hand', cursive;
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
  padding: 20px;
  border-radius: 15px;
  border-left: 10px solid #1976D2;
  box-shadow: 0 10px 20px rgba(25, 118, 210, 0.1);
  line-height: 2;
}
EOF

# Create a README for the assets
cat > src/assets/images/books/README.md << 'EOF'
# Book Reading Assets

This directory contains assets for the Christian Book Reading feature.

## Image Assets

### Book Covers (`covers/`)
- `book-1.svg` to `book-8.svg` - Colored book covers with Christian symbols
- `placeholder.svg` - Generic book cover template

### Christian Scenes (`christian/`)
- `creation.svg` - Creation story scene
- `noahs-ark.svg` - Noah's Ark scene with rainbow
- `david-goliath.svg` - David facing Goliath
- `baby-jesus.svg` - Christmas nativity scene

## How to Replace Placeholder Assets

### 1. Book Covers
Replace SVG files with actual book cover images:
```bash
# Convert your images to optimized WebP format
#convert your-image.jpg -resize 400x500 -quality 80 covers/book-1.webp
```
EOF