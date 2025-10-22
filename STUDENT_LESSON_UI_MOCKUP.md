# Student Lesson Page - UI Mockup

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ DetailLayout Header (Navigation Bar)                                                │
│ [Logo] [User Profile]                                                               │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────┬────────────────────────────────────────┐
│                                            │ ┌────────────────────────────────────┐ │
│  MAIN CONTENT AREA                         │ │  [◁] Sidebar Toggle                │ │
│                                            │ └────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │                                        │
│  │ 📚 Module Name • ⏱️ 15 min           │ │ ┌────────────────────────────────────┐ │
│  │ 📅 Updated 22 Oct 2025               │ │ │ ████░░░░░░░░░░░░░░░░  20%         │ │
│  └──────────────────────────────────────┘ │ │ 20% Selesai                        │ │
│                                            │ └────────────────────────────────────┘ │
│  ╔══════════════════════════════════════╗ │                                        │
│  ║                                      ║ │ DAFTAR PELAJARAN                       │
│  ║  # Lesson Title                      ║ │                                        │
│  ║                                      ║ │ ┌────────────────────────────────────┐ │
│  ║  This is the **markdown** content    ║ │ │ ① What is Programming?             │ │
│  ║  with full formatting support.       ║ │ │   15 menit                         │ │
│  ║                                      ║ │ └────────────────────────────────────┘ │
│  ║  ## Subheading                       ║ │                                        │
│  ║                                      ║ │ ┌────────────────────────────────────┐ │
│  ║  - Bullet point 1                    ║ │ │ ② Variables & Data Types      ▶    │ │
│  ║  - Bullet point 2                    ║ │ │   20 menit               (Active)  │ │
│  ║                                      ║ │ └────────────────────────────────────┘ │
│  ║  ```python                           ║ │                                        │
│  ║  def hello():                        ║ │ ┌────────────────────────────────────┐ │
│  ║      print("Hello!")                 ║ │ │ ③ Control Flow                     │ │
│  ║  ```                                 ║ │ │   25 menit                         │ │
│  ║                                      ║ │ └────────────────────────────────────┘ │
│  ║  More content...                     ║ │                                        │
│  ╚══════════════════════════════════════╝ │ ┌────────────────────────────────────┐ │
│                                            │ │ ④ Functions                        │ │
│  ┌──────────────────────────────────────┐ │ │   30 menit                         │ │
│  │ ────────────────────────────────────│ │ └────────────────────────────────────┘ │
│  │                                      │ │                                        │
│  │  ┌────────────────────────────────┐ │ │ ┌────────────────────────────────────┐ │
│  │  │ ◁ Sebelumnya                   │ │ │ │ ⑤ Final Exam          [UJIAN]      │ │
│  │  │   What is Programming?         │ │ │ │   60 menit                         │ │
│  │  └────────────────────────────────┘ │ │ └────────────────────────────────────┘ │
│  │                                      │ │                                        │
│  │  ┌────────────────────────────────┐ │ │                                        │
│  │  │             Control Flow    ▷  │ │ │                                        │
│  │  │             Selanjutnya        │ │ │                                        │
│  │  └────────────────────────────────┘ │ │                                        │
│  └──────────────────────────────────────┘ │                                        │
│                                            │                                        │
└────────────────────────────────────────────┴────────────────────────────────────────┘
```

## Collapsed Sidebar View

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ DetailLayout Header                                                 [Toggle ◁]  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  FULL WIDTH CONTENT AREA                                                       │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ 📚 Module Name • ⏱️ 15 min • 📅 Updated 22 Oct 2025                      │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  # Lesson Title                                                                │
│                                                                                 │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit...                    │
│                                                                                 │
│  ## Section                                                                    │
│                                                                                 │
│  More content with full formatting...                                          │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ ◁ Previous                                           Next ▷               │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Header Metadata Bar
```
┌─────────────────────────────────────────────────────────────────┐
│ 📚 Introduction to Programming • ⏱️ 15 min • 📅 Updated 22 Oct │
│ 2025 • [UJIAN Badge]                                            │
└─────────────────────────────────────────────────────────────────┘
```

**Elements**:
- Module icon + name
- Duration with clock icon
- Last updated date with calendar icon
- Exam badge (if lesson_type === 'exam')

**Colors**:
- Text: Gray 600
- Exam badge: Red background, white text
- Separators: • (bullet points)

---

### 2. Lesson Title
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              Variables and Data Types                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Styling**:
- Font: 4xl, bold
- Color: Gray 900
- Margin: Bottom 4

---

### 3. Markdown Content Area
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  # What is Programming?                                          │
│                                                                  │
│  Programming is the process of creating instructions...          │
│                                                                  │
│  ## Key Concepts                                                 │
│                                                                  │
│  - **Variables**: Store data                                     │
│  - **Functions**: Reusable code                                  │
│                                                                  │
│  ```python                                                       │
│  def hello():                                                    │
│      print("Hello!")                                             │
│  ```                                                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling**:
- Uses `.markdown-content` class
- Prose typography (prose-lg)
- Syntax highlighting for code
- Proper spacing and readability

---

### 4. Navigation Buttons (Bottom)
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌────────────────────┐                  ┌──────────────────┐  │
│  │ ◁ Sebelumnya       │                  │   Selanjutnya ▷  │  │
│  │   What is Prog...  │                  │   Control Flow   │  │
│  └────────────────────┘                  └──────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**States**:

**Active (clickable)**:
- Previous: Gray background (100), hover: 200
- Next: Blue background (600), white text, hover: 700
- Cursor: Pointer

**Disabled**:
- Background: Gray 50
- Text: Gray 400
- Cursor: Not-allowed
- No hover effect

---

### 5. Progress Bar (Sidebar)
```
┌──────────────────────────────────────┐
│ ████████░░░░░░░░░░░░░░░░░  40%      │
│ 40% Selesai                          │
└──────────────────────────────────────┘
```

**Elements**:
- Outer container: Gray 300, rounded full
- Inner bar: Green 500, dynamic width
- Text: Small, gray 700
- Border: Top and bottom

**Calculation**:
- `progress = (currentIndex + 1) / totalLessons * 100`

---

### 6. Lessons List (Sidebar)

**Inactive Lesson**:
```
┌──────────────────────────────────────┐
│  ① What is Programming?              │
│     15 menit                         │
└──────────────────────────────────────┘
```

**Active Lesson**:
```
┌──────────────────────────────────────┐
││ ② Variables & Data Types      ▶    ││  ← Blue left border
││    20 menit                         ││  ← Blue background
└──────────────────────────────────────┘
```

**Exam Lesson**:
```
┌──────────────────────────────────────┐
│  ⑤ Final Exam          [UJIAN]       │
│     60 menit                         │
└──────────────────────────────────────┘
```

**Elements per lesson**:
- Number badge: Circle with lesson order
- Title: Medium font
- Duration: Small text, gray
- Exam badge: Red with white text
- Play icon: For active lesson only

**Colors**:
- Active: Blue 50 bg, Blue 600 border & text
- Inactive: White bg, Gray text
- Hover: Gray 50 bg
- Number badge active: Blue 600 bg
- Number badge inactive: Gray 200 bg

---

### 7. Sidebar Toggle Button

**Collapsed State**:
```
  ┌──────┐
  │  ◁   │  ← Floating on right side
  └──────┘
```

**Expanded State (in sidebar)**:
```
┌──────────────────────────────────────┐
│  ┌──────┐                            │
│  │  ▷   │                            │
│  └──────┘                            │
└──────────────────────────────────────┘
```

**Styling**:
- Background: Black
- Hover: Gray 800
- Icon: White
- Shape: Rounded full
- Position: Fixed (when collapsed)

---

## Color Scheme

### Primary Colors
- **Blue 600**: Primary actions, active states
- **Blue 50**: Active backgrounds
- **Blue 700**: Hover states

### Neutral Colors
- **Gray 900**: Headings, important text
- **Gray 700**: Body text
- **Gray 600**: Metadata
- **Gray 400**: Disabled text
- **Gray 200**: Borders, inactive states
- **Gray 100**: Backgrounds
- **Gray 50**: Light backgrounds

### Accent Colors
- **Green 500**: Progress bar
- **Red 600**: Exam badges, danger
- **Red 100**: Exam badge backgrounds

---

## Typography

### Font Family
- Primary: Poppins (Google Fonts)
- Code: Monospace

### Font Sizes
- Page title: 4xl (2.25rem)
- Section headings: 3xl (1.875rem)
- Subsections: xl (1.25rem)
- Body: base (1rem)
- Small text: sm (0.875rem)
- Tiny text: xs (0.75rem)

### Font Weights
- Bold: 700
- Semibold: 600
- Medium: 500
- Regular: 400

---

## Spacing

### Padding
- Content area: px-20 py-8
- Sidebar: p-4
- Buttons: px-6 py-3
- Small items: px-2 py-1

### Margins
- Between sections: mb-8
- Between paragraphs: mb-6
- Between elements: mb-4, mb-2

### Gaps
- Horizontal: gap-x-2, gap-x-4
- Vertical: gap-y-2, gap-y-4

---

## Responsive Behavior

### Desktop (> 1024px)
- Sidebar: 300px fixed width
- Content: Remaining space
- Navigation: Full size buttons

### Tablet (768px - 1024px)
- Sidebar: 250px width
- Content: Adjusted padding
- Navigation: Slightly smaller

### Mobile (< 768px)
- Sidebar: Overlay or full width
- Content: Full width, reduced padding
- Navigation: Stacked or smaller

---

## Interactions

### Hover Effects
- **Buttons**: Background darkens
- **Lesson items**: Light gray background
- **Links**: Underline, color change

### Active States
- **Current lesson**: Blue highlight
- **Buttons**: Pressed effect

### Transitions
- Sidebar: `transition-all duration-300`
- Hover: Standard ease
- Progress bar: `transition-all duration-300`

### Focus States
- Outline for accessibility
- Tab navigation support

---

## Loading State

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        ⟳ Loading Loop                          │
│                     Loading lesson...                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Elements**:
- Centered vertically and horizontally
- Spinning icon (6xl)
- Loading text below
- Full height container

---

## Error State

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        ⚠️ Alert Circle                         │
│                     Lesson not found                            │
│                                                                 │
│                  ┌──────────────────┐                          │
│                  │  Back to Module  │                          │
│                  └──────────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Elements**:
- Error icon (6xl, red)
- Error message
- Action button (Back to Module)
- Centered layout

---

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close sidebar (future)

### Screen Readers
- Semantic HTML tags
- ARIA labels where needed
- Alt text for icons (via aria-label)

### Visual
- High contrast text
- Clear focus indicators
- Readable font sizes

---

## Animation Details

### Sidebar Toggle
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Properties**: width, opacity

### Progress Bar
- **Duration**: 300ms
- **Easing**: ease
- **Properties**: width

### Button Hover
- **Duration**: 150ms
- **Easing**: ease
- **Properties**: background-color

### Lesson Item Hover
- **Duration**: 150ms
- **Easing**: ease
- **Properties**: background-color

---

This mockup provides a complete visual reference for the Student Lesson Page implementation!
