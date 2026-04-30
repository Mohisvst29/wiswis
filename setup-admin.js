const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'app', 'admin');
const dashboardGrp = path.join(adminDir, '(dashboard)');
const loginDir = path.join(adminDir, 'login');

// Create dirs
fs.mkdirSync(dashboardGrp, { recursive: true });
fs.mkdirSync(loginDir, { recursive: true });
fs.mkdirSync(path.join(dashboardGrp, 'dashboard'), { recursive: true });
fs.mkdirSync(path.join(dashboardGrp, 'media'), { recursive: true });

// Move login page
if (fs.existsSync(path.join(adminDir, 'page.tsx'))) {
  fs.renameSync(path.join(adminDir, 'page.tsx'), path.join(loginDir, 'page.tsx'));
}

// Move old dashboard stuff if exists
const oldDash = path.join(adminDir, 'dashboard');
if (fs.existsSync(oldDash)) {
  const items = fs.readdirSync(oldDash);
  for (const item of items) {
    if (item === 'page.tsx') {
      fs.renameSync(path.join(oldDash, item), path.join(dashboardGrp, 'dashboard', 'page.tsx'));
    } else if (item === 'layout.tsx') {
      fs.renameSync(path.join(oldDash, item), path.join(dashboardGrp, 'layout.tsx'));
    } else {
      fs.renameSync(path.join(oldDash, item), path.join(dashboardGrp, item));
    }
  }
  fs.rmSync(oldDash, { recursive: true, force: true });
}

// Write the redirect page at /admin
const redirectCode = `import { redirect } from 'next/navigation';\nexport default function AdminIndex() {\n  redirect('/admin/dashboard');\n}\n`;
fs.writeFileSync(path.join(adminDir, 'page.tsx'), redirectCode);
