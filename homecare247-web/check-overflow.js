async function check() {
  const res = await fetch('http://localhost:3005');
  const html = await res.text();
  
  // Find all elements and their classes
  const regex = /<([a-z0-9]+)[^>]*class="([^"]*)"/gi;
  let match;
  const elements = [];
  while ((match = regex.exec(html)) !== null) {
    const tag = match[1];
    const classes = match[2];
    elements.push({ tag, classes });
  }

  console.log('Total elements with classes:', elements.length);

  // Look for classes that can cause horizontal overflow on mobile (< 400px):
  // 1. Fixed widths >= 300px without max-w-full
  // 2. grid with cols without sm: prefix
  // 3. flex with shrink-0 and whitespace-nowrap in parent that doesn't wrap or scroll
  const suspicious = elements.filter(el => {
    const c = el.classes;
    if (c.includes('grid-cols-7') || c.includes('grid-cols-4') || c.includes('grid-cols-3')) {
      if (!c.includes('sm:grid-cols') && !c.includes('md:grid-cols')) return true;
    }
    if (c.includes('w-72') || c.includes('w-96') || c.includes('min-w-[')) {
      return true;
    }
    if (c.includes('whitespace-nowrap') && c.includes('shrink-0') && (c.includes('gap-4') || c.includes('gap-6'))) {
      return true;
    }
    return false;
  });

  console.log('Suspicious classes count:', suspicious.length);
  suspicious.forEach(s => console.log(s.tag, '-->', s.classes));
}

check().catch(console.error);
