const fs = require('fs');
const path = require('path');

const IGNORES = ['.bundle', '_site', '.jekyll-cache', 'node_modules', 'vendor', '.git', 'scripts'];
const ROOT = process.cwd();

// Walk the site tree and inspect HTML-like files for missing accessible names.
function walk(dir, filelist = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full);
    if (IGNORES.some((ignore) => rel.split(path.sep).includes(ignore))) continue;

    if (entry.isDirectory()) {
      walk(full, filelist);
    } else if (/\.(html|md|xml|liquid|js|scss|css)$/.test(entry.name)) {
      filelist.push(full);
    }
  }
  return filelist;
}

// Check anchor tags for visible text or an accessible name and report issues.
function hasAccessibleNameForAnchor(content) {
  const anchorRegex = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  const issues = [];
  let m;
  while ((m = anchorRegex.exec(content)) !== null) {
    const anchorHtml = m[0];
    const inner = m[1].replace(/<!--.*?-->/gs, '').trim();
    const hasAriaLabel = /aria-label=\"([^\"]+)\"/.test(anchorHtml) || /aria-labelledby=\"([^\"]+)\"/.test(anchorHtml) || /title=\"([^\"]+)\"/.test(anchorHtml);
    if (hasAriaLabel) continue;
    if (inner.length === 0) {
      issues.push({ anchor: anchorHtml, reason: 'empty content, no aria-label/title' });
      continue;
    }
    const innerNoSpace = inner.replace(/\s+/g, '');
    if (/^<img\b[^>]*>$/i.test(innerNoSpace)) {
      const img = innerNoSpace;
      if (!/alt=\"[^\"]+\"/i.test(img)) {
        issues.push({ anchor: anchorHtml, reason: 'image without alt' });
      }
      continue;
    }
    if (/^<svg\b[^>]*>/.test(inner.trim())) {
      issues.push({ anchor: anchorHtml, reason: 'svg-only anchor without aria-label' });
      continue;
    }

    const visibleText = inner.replace(/<[^>]+>/g, '').trim();
    if (!visibleText) {
      issues.push({ anchor: anchorHtml, reason: 'no visible text and no aria-label' });
    }
  }
  return issues;
}

// Inspect a single file for accessibility issues in links and images.
function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const issues = [];
  issues.push(...hasAccessibleNameForAnchor(content));

  const imgRegex = /<img\b([^>]*)>/gi;
  let im;
  while ((im = imgRegex.exec(content)) !== null) {
    const attrs = im[1];
    if (!/alt=\"/i.test(attrs)) {
      issues.push({ image: im[0], reason: 'img missing alt attribute' });
    }
  }
  return issues;
}

function main() {
  const files = walk(ROOT);
  const report = {};
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    try {
      const issues = checkFile(file);
      if (issues.length) report[rel] = issues;
    } catch (e) {
      // Some files may be malformed or use syntax outside the simple checks above.
    }
  }

  const keys = Object.keys(report);
  if (!keys.length) {
    console.log('No link/name/alt issues found.');
    process.exit(0);
  }

  console.log('Accessibility issues (anchors/images):');
  keys.forEach(k => {
    console.log('\n== ' + k + ' ==');
    report[k].forEach((it, i) => {
      console.log((i+1)+') ' + it.reason + '\n   ' + (it.anchor || it.image).slice(0,200).replace(/\n/g,' '));
    });
  });
  process.exit(1);
}

main();
