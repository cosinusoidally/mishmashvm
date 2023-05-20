load("../lib/xpc.js");
msgbox("Note on win32 firefox in xpcshell mode will not\n\
write to standard out/error. This can make it hard to\n\
debug bootstrapping failures");
