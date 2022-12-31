Function to escape strings used with systemd.

# Example
```js
import {spawn} from "child_process";
import escape from "systemd-escape";

const instance = getInstanceNameSomehow();
const unit = `foo@${escape(instance)}`;
const child = spawn("systemctl", ["status", unit]);

child.stdout.pipe(process.stdout);
```

