# remote-ws-wol
To start the PC, for example, smartphone. Remote switch to Wake on LAN to a PC via WebSocket.

<hr>
<h3>License</h3>

<code><pre>$ cd ./YourDir
$ npm i remote-ws-wol
</pre></code>


<code><pre>
var rww = require('remote-ws-wol');


    //Argument samples for rww. rwwの引数設定サンプル

    //WebSocketサーバーの設定
    var WebSocketServer = '192.168.1.22';
    var WebSocketServerPort = 8503;

    //起こしたいマシンのIPとMacアドレスを調べて下記を書き換えてください
    var WakeUpLists = {
       '192.168.1.4': 'xx:xx:xx:xx:xx:xx'
      ,'192.168.1.5': 'xx:xx:xx:xx:xx:xx'
    };

    //※必要ならIPやキーワードやSSL接続などで安全を確保すること

    //接続を許可するIPアドレス
    var allowIPLists = [
       '*' //'*'は全部許可
    ];

    //命令実行を許可するキーワード
    var allowKeyword = "*";//'*'は全部許可
    
    //WakeUpしたら最大1分で接続を切る
    var timeout = 1000*60;
    
    
var ws = rww.conn( WebSocketServer, 
                    WebSocketServerPort,
                    WakeUpLists,
                    allowIPLists,
                    allowKeyword,
                    timeout
                    );
</pre></code>


<hr>
<h3>License</h3>
MIT
