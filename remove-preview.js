const fs = require('fs');
let code = fs.readFileSync('artifacts/figma-design/client/src/pages/dooh/v2/v2planner-sidebar.tsx', 'utf8');

// Remove previewOpen state
code = code.replace(/  const \[previewOpen, setPreviewOpen\] = useState\(false\);\n/g, '');

// Remove Dialog import
code = code.replace(/import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@\/components\/ui\/dialog";\n/g, '');

// Remove the Dialog JSX block
const dialogRegex = /      <Dialog open=\{previewOpen\} onOpenChange=\{setPreviewOpen\}>[\s\S]*?<\/Dialog>\n/g;
code = code.replace(dialogRegex, '');

fs.writeFileSync('artifacts/figma-design/client/src/pages/dooh/v2/v2planner-sidebar.tsx', code);
