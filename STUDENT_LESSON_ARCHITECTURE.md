# Student Lesson Page - Architecture Diagram

## Data Flow

```mermaid
graph TB
    A[Student Opens Lesson Page] --> B[LessonPage Component]
    B --> C{Extract URL Params}
    C --> D[module_id & lesson_id]
    D --> E[moduleService.getLessonDetail]
    E --> F[authFetch with JWT Token]
    F --> G[Backend: /api/modules/module_id/lessons/lesson_id]
    
    G --> H[Django View: lesson_detail]
    H --> I[Query Database]
    I --> J{Lesson Exists?}
    
    J -->|No| K[Return 404 Error]
    J -->|Yes| L[Get Lesson Data]
    L --> M[Get Module Info]
    M --> N[Get All Lessons for Sidebar]
    N --> O[Calculate Prev/Next]
    O --> P[Return JSON Response]
    
    P --> Q[Frontend Receives Data]
    Q --> R[Update State]
    R --> S[Render Components]
    
    S --> T[Main Content Area]
    S --> U[Sidebar]
    S --> V[Navigation Buttons]
    
    T --> W[ReactMarkdown Renderer]
    U --> X[Lesson List]
    U --> Y[Progress Bar]
    
    V --> Z{User Clicks Next/Prev}
    Z --> AA[Navigate to New Lesson]
    AA --> B
    
    X --> AB{User Clicks Lesson}
    AB --> AA
    
    K --> AC[Show Error State]
```

## Component Structure

```mermaid
graph TD
    A[DetailLayout] --> B[LessonPage]
    
    B --> C[Content Section]
    B --> D[Sidebar Section]
    
    C --> E[Header Metadata]
    C --> F[Markdown Content]
    C --> G[Navigation Buttons]
    
    E --> H[Module Title]
    E --> I[Duration]
    E --> J[Last Updated]
    E --> K[Exam Badge]
    
    F --> L[ReactMarkdown + remarkGfm]
    
    G --> M[Previous Button]
    G --> N[Next Button]
    
    D --> O[Toggle Button]
    D --> P[Progress Bar]
    D --> Q[Lessons List]
    
    Q --> R[Lesson Item 1]
    Q --> S[Lesson Item 2]
    Q --> T[Lesson Item N]
    
    R --> U[Number Badge]
    R --> V[Title]
    R --> W[Duration]
    R --> X[Active Indicator]
```

## State Management

```mermaid
graph LR
    A[Component Mount] --> B[useState Hooks]
    
    B --> C[sidebarStatus: boolean]
    B --> D[loading: boolean]
    B --> E[error: string | null]
    B --> F[lessonData: LessonDetailResponse | null]
    
    G[useEffect] --> H{URL Params Valid?}
    H -->|No| I[Set Error]
    H -->|Yes| J[Fetch Data]
    
    J --> K[Set Loading = true]
    K --> L[API Call]
    L --> M{Success?}
    
    M -->|Yes| N[Set lessonData]
    M -->|No| O[Set Error]
    
    N --> P[Set Loading = false]
    O --> P
    
    C --> Q[Toggle Sidebar]
    D --> R[Show Loading Spinner]
    E --> S[Show Error Message]
    F --> T[Render Content]
```

## API Response Structure

```mermaid
graph TD
    A[LessonDetailResponse] --> B[success: boolean]
    A --> C[lesson: Lesson]
    A --> D[module: ModuleInfo]
    A --> E[navigation: Navigation]
    A --> F[all_lessons: Lesson Array]
    
    C --> G[id, title, content]
    C --> H[lesson_type, order]
    C --> I[duration_minutes]
    C --> J[is_published]
    C --> K[dates]
    
    D --> L[id, title]
    D --> M[description]
    D --> N[cover_image]
    
    E --> O[prev: Lesson | null]
    E --> P[next: Lesson | null]
    
    F --> Q[Array of all lessons]
    Q --> R[For sidebar display]
```

## User Interaction Flow

```mermaid
graph TD
    A[Student Arrives at Lesson] --> B[Page Loads]
    B --> C[Loading Spinner Shows]
    C --> D[Data Fetches from Backend]
    D --> E{Data Loaded?}
    
    E -->|Error| F[Show Error State]
    F --> G[Display Error Message]
    G --> H[Show Back Button]
    
    E -->|Success| I[Render Lesson Content]
    
    I --> J[Display Markdown]
    I --> K[Show Sidebar]
    I --> L[Show Navigation]
    
    K --> M{Sidebar Open?}
    M -->|Yes| N[Show Lessons List]
    M -->|No| O[Show Toggle Button]
    
    N --> P{Student Clicks Lesson}
    P --> Q[Navigate to Lesson]
    Q --> B
    
    O --> R{Student Clicks Toggle}
    R --> S[Open Sidebar]
    S --> N
    
    L --> T{Student Clicks Next}
    T --> U{Has Next Lesson?}
    U -->|Yes| Q
    U -->|No| V[Button Disabled]
    
    L --> W{Student Clicks Prev}
    W --> X{Has Prev Lesson?}
    X -->|Yes| Q
    X -->|No| Y[Button Disabled]
    
    J --> Z[Student Reads]
    Z --> T
```

## Backend Query Flow

```mermaid
graph TD
    A[lesson_detail View] --> B[Extract module_id & lesson_id]
    
    B --> C[Query: Lesson.objects.select_related]
    C --> D{Lesson Found?}
    
    D -->|No| E[Raise DoesNotExist]
    E --> F[Return 404 Response]
    
    D -->|Yes| G[Get Lesson Object]
    
    G --> H[Query: All Published Lessons in Module]
    H --> I[Order by 'order' field]
    I --> J[Convert to List]
    
    J --> K[Find Current Lesson Index]
    K --> L{Has Previous?}
    L -->|Yes| M[Get Prev Lesson Data]
    L -->|No| N[Set Prev = null]
    
    K --> O{Has Next?}
    O -->|Yes| P[Get Next Lesson Data]
    O -->|No| Q[Set Next = null]
    
    G --> R[Serialize Lesson]
    G --> S[Get Module Data]
    H --> T[Serialize All Lessons]
    
    R --> U[Build Response Object]
    S --> U
    M --> U
    N --> U
    P --> U
    Q --> U
    T --> U
    
    U --> V[Return JSON Response]
```

## Progress Calculation

```mermaid
graph LR
    A[all_lessons Array] --> B[Find Current Lesson Index]
    B --> C[current_index + 1]
    C --> D[Divide by total_lessons]
    D --> E[Multiply by 100]
    E --> F[Round to Integer]
    F --> G[Display as Progress %]
    
    G --> H[Update Progress Bar Width]
    G --> I[Show Percentage Text]
```

## Sidebar Lesson Item States

```mermaid
graph TD
    A[Lesson Item] --> B{Is Current Lesson?}
    
    B -->|Yes| C[Blue Background]
    B -->|Yes| D[Blue Border Left]
    B -->|Yes| E[Play Icon]
    B -->|Yes| F[Blue Text]
    
    B -->|No| G[White Background]
    B -->|No| H[Transparent Border]
    B -->|No| I[No Icon]
    B -->|No| J[Gray Text]
    
    A --> K{On Hover?}
    K -->|Yes| L[Light Gray Background]
    K -->|No| M[Normal State]
    
    A --> N{Is Exam Type?}
    N -->|Yes| O[Show Exam Badge]
    N -->|No| P[No Badge]
    
    A --> Q[Show Lesson Number]
    A --> R[Show Title]
    A --> S[Show Duration]
```

These diagrams illustrate the complete architecture and flow of the student lesson page implementation.
