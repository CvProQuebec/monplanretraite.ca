const fs = require("fs");
const path = "src/components/ui/SeniorsFriendlyIncomeTable.tsx";
let content = fs.readFileSync(path, "utf8");
const search = 'SelectContent className="bg-white" align="start"';
const replacement = 'SelectContent className="bg-white" align="start" position="popper" sideOffset={12} collisionPadding={16}';
while (content.includes(search)) {
  content = content.replace(search, replacement);
}
fs.writeFileSync(path, content, "utf8");
