# Multimedia Content Support Guide

## Overview
The lesson system now supports rich multimedia content including images, videos, and embedded media through markdown rendering.

---

## 🖼️ Supported Media Types

### 1. **Images**
- Static images (JPG, PNG, GIF, WebP)
- External URLs (Unsplash, Imgur, CDN)
- Inline images in lesson content

### 2. **Videos**
- YouTube embeds (iframe)
- Vimeo embeds (iframe)
- Direct video files (HTML5 video tag)

### 3. **Interactive Content**
- Code snippets with syntax highlighting
- Tables and structured data
- Blockquotes and callouts

---

## 📝 Markdown Syntax

### Images

#### Basic Image:
```markdown
![Alt text](https://images.unsplash.com/photo-example?w=800)
```

#### Image with Caption:
```markdown
![Programming Concept](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800)
*Figure 1: Programming fundamentals visualization*
```

**Renders as:**
- Full-width image (max 2xl)
- Centered alignment
- Rounded corners
- Shadow effect

---

### Videos

#### YouTube Embed:
```markdown
<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/VIDEO_ID" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

#### Vimeo Embed:
```markdown
<iframe src="https://player.vimeo.com/video/VIDEO_ID" 
  width="640" 
  height="360" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

#### HTML5 Video:
```markdown
<video controls width="100%">
  <source src="https://example.com/video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

**Renders as:**
- Responsive aspect ratio (16:9)
- Full width (max 2xl)
- Centered
- Playback controls

---

### Code Blocks

#### Inline Code:
```markdown
Use the `print()` function to output text.
```

#### Code Block with Syntax Highlighting:
```markdown
```python
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))
```  (remove space before backticks)
```

**Renders as:**
- Black background
- White text
- Monospace font
- Syntax highlighting

---

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

**Renders as:**
- Full width table
- Gray borders
- Header highlighting
- Responsive layout

---

## 🎨 CSS Styling

### Image Styles:
```css
.markdown-content img {
  @apply w-full max-w-2xl mx-auto rounded-lg shadow-md mb-6;
}
```

### Video Styles:
```css
.markdown-content video {
  @apply w-full max-w-2xl mx-auto rounded-lg shadow-md mb-6;
}
```

### Iframe Styles:
```css
.markdown-content iframe {
  @apply w-full max-w-2xl mx-auto rounded-lg shadow-md mb-6 aspect-video;
}
```

### Code Styles:
```css
.markdown-content code {
  @apply bg-gray-100 text-black px-1.5 py-0.5 rounded text-sm font-mono;
}

.markdown-content pre {
  @apply bg-black text-white p-4 rounded-lg mb-6 overflow-x-auto;
}
```

---

## 📚 Example Lesson Content

### Complete Example with All Media Types:

```markdown
# Welcome to Web Development

![Web Development](https://images.unsplash.com/photo-1547658719-da2b51169166?w=800)

## Introduction

Web development is the process of creating websites and web applications.

### Watch This Tutorial

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/example" 
  frameborder="0" 
  allowfullscreen>
</iframe>

## HTML Basics

Here's a simple HTML structure:

```html
<!DOCTYPE html>
<html>
<body>
    <h1>Hello World</h1>
    <p>Welcome to my website!</p>
</body>
</html>
```

## Comparison Table

| Technology | Purpose | Difficulty |
|------------|---------|------------|
| HTML | Structure | Easy |
| CSS | Styling | Medium |
| JavaScript | Interactivity | Hard |

> **Pro Tip:** Start with HTML before moving to CSS!

### Key Points

1. Learn HTML first
2. Practice CSS layouts
3. Master JavaScript fundamentals

![Workflow](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800)
*Figure 2: Development workflow*
```

---

## 🎯 Best Practices

### Images:
1. **Use High Quality**: Minimum 800px width
2. **Optimize File Size**: Use compressed images
3. **Add Alt Text**: For accessibility
4. **Use CDNs**: Unsplash, Imgur for reliability
5. **Consistent Sizing**: Keep similar aspect ratios

### Videos:
1. **Use Embeds**: YouTube/Vimeo preferred over direct files
2. **Keep Short**: 5-15 minutes max
3. **Add Context**: Explain what video covers
4. **Provide Alternatives**: Text summary for accessibility
5. **Test Playback**: Ensure videos load correctly

### Code:
1. **Syntax Highlighting**: Specify language
2. **Keep Concise**: Show relevant parts only
3. **Add Comments**: Explain complex logic
4. **Format Properly**: Use consistent indentation
5. **Test Code**: Ensure examples work

### General:
1. **Break Up Content**: Use media to separate text
2. **Relevant Media**: Only include if it adds value
3. **Load Time**: Don't overload with too many large files
4. **Mobile Friendly**: Test on different screen sizes
5. **Accessibility**: Provide text alternatives

---

## 🚀 Implementation Details

### Frontend Rendering:

The lesson pages use `react-markdown` with plugins:

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

<ReactMarkdown 
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw]}
>
  {lesson.content}
</ReactMarkdown>
```

### Plugins Used:
- **`remarkGfm`**: GitHub Flavored Markdown (tables, strikethrough, etc.)
- **`rehypeRaw`**: Allows raw HTML (for iframes and video tags)

---

## 📋 Sample Exam with Media

```markdown
# Final Exam - Web Development

![Exam Header](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Instructions
- Duration: 90 minutes
- Total Points: 100
- Open book allowed

## Question 1 (20 points)

Watch the video below and answer the questions:

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/tutorial-example" 
  frameborder="0" 
  allowfullscreen>
</iframe>

### Part A (10 points)
Explain the main concept demonstrated in the video.

### Part B (10 points)
Write code that implements this concept.

```javascript
// Your answer here
function example() {
    // Implementation
}
```

## Question 2 (30 points)

Analyze the image below:

![Code Screenshot](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800)

1. Identify three errors (10 points)
2. Explain why they are errors (10 points)
3. Provide corrected version (10 points)

## Grading Rubric

| Score | Grade | Description |
|-------|-------|-------------|
| 90-100 | A | Excellent |
| 80-89 | B | Very Good |
| 70-79 | C | Good |
| 60-69 | D | Pass |
| 0-59 | F | Fail |

---

**Good luck!** 🍀
```

---

## 🔧 Troubleshooting

### Images Not Loading:
- ✅ Check URL is accessible
- ✅ Use HTTPS URLs
- ✅ Verify image exists
- ✅ Check for CORS issues

### Videos Not Playing:
- ✅ Use embed URLs (not watch URLs)
- ✅ Check video privacy settings
- ✅ Ensure iframe allowed
- ✅ Test in different browsers

### Code Not Highlighting:
- ✅ Specify language after backticks
- ✅ Use supported language names
- ✅ Check markdown formatting
- ✅ Verify syntax highlighter loaded

---

## 📊 Media Usage Statistics (Seed Data)

### Images:
- Programming concepts
- Data structures
- Web development
- Database diagrams
- Code screenshots

### Videos:
- YouTube tutorials embedded
- Concept explanations
- Code walkthroughs
- Live demonstrations

### Total Multimedia Elements:
- **Images**: ~10 per module
- **Videos**: ~5 per module
- **Code blocks**: ~15 per module
- **Tables**: ~3 per module

---

## 🎓 Teacher Guidelines

### Creating Rich Lessons:

1. **Start with Image**: Capture attention
2. **Introduce Topic**: Brief text explanation
3. **Embed Video**: Deep dive into concept
4. **Code Examples**: Practical implementation
5. **Tables/Charts**: Summarize key points
6. **End with Image**: Visual summary

### Exam Creation:

1. **Header Image**: Professional exam banner
2. **Instructions**: Clear formatting
3. **Questions**: Mix of text, code, and media
4. **Visual Problems**: Include diagrams/screenshots
5. **Rubric Table**: Clear grading criteria

---

## ✅ Quality Checklist

Before publishing a lesson:

- [ ] All images load correctly
- [ ] Videos are accessible
- [ ] Code blocks are formatted
- [ ] Tables render properly
- [ ] Content flows logically
- [ ] Media enhances understanding
- [ ] File sizes are reasonable
- [ ] Mobile responsive
- [ ] Accessibility considered
- [ ] No broken links

---

**Implementation Date:** 2025-10-22  
**Status:** ✅ Complete  
**Multimedia Support:** Full
