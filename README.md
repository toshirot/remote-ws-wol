# remote-ws-wol
To start the PC, for example, smartphone. Remote switch to Wake on LAN to a PC via WebSocket.

@see 
スマホでPC起動するリモコンをWebSocket+WOLで作ってみた
http://ngw.jp/~tato/wp/?p=3826


<hr>
<h3>Install</h3><code><pre>$ cd ./YourDir
$ npm i remote-ws-wol
</pre></code>

<h3>Server Setting</h3><code><pre>
var rww = require('remote-ws-wol');

    //Argument samples for rww. rwwの引数設定サンプル
    //   引数はwebに公開される場所には置かないように注意しましょう
    //   Argument is let's be careful not place such as in a location that can be published to the web

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
    
//実行    
var ws = rww.conn( 
    WebSocketServer, 
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
