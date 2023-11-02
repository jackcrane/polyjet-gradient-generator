const child_process = require("child_process");

const LOCAL_HAS_CHANGES =
  child_process.execSync("git diff --name-only").toString() !== "" ||
  child_process
    .execSync("git ls-files . --exclude-standard --others")
    .toString() !== "";

console.log("LOCAL_HAS_CHANGES", LOCAL_HAS_CHANGES);
