rem Fix: openssl config failed: error:02001003:system library:fopen:No such process 
rem https://github.com/npm/npm/issues/17261
SET OPENSSL_CONF=c:\dummy
SET OPENSSL_CONF=

SET CHROME_BIN=E:\Program Files (x86)\Google\Chrome Dev\Application\chrome.exe
SET NODE_PATH=%AppData%\npm\node_modules

cls

cmd /K "l:\Program Files (x86)\nodejs\nodevars.bat"
