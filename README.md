# remote-ws-wol
To start the PC, for example, smartphone. Remote switch to Wake on LAN to a PC via WebSocket.

@see 
スマホでPC起動するリモコンをWebSocket+WOLで作ってみた
http://ngw.jp/~tato/wp/?p=3826


<hr>
<h3>Install</h3><code><pre>$ cd ./YourDir
$ npm i remote-ws-wol
</pre></code>

remote-ws-wol directory has been generated in node_modules.
インストールするとYourDirより上の階層のnode_modulesにremote-ws-wolができています。
<code><pre>node_modules/
    remote-ws-wol/
        node_modules/
        sample/
            app.js
            public_html/
                wol.htm
        README.md
        index.js
        package.json
</pre></code>

sampleディレクトリ内のファイルを使いたい場所において内容を下記のように自分用に書き換えます。
app.jsはWebからアクセスできない場所に置き、wol.htmはWebからアクセスできる場所に置きます。

<h3>Server Setting</h3>app.js<code><pre>
var rww = require('remote-ws-wol');

var option = {
  
    //WebSocketサーバー
    url: '192.168.1.22'
    ,port: 8503

    //起動したいマシンのMacアドレスを調べて下記を書き換えてください
    //名前はリモートから呼び出すための仮称でIPである必要はありません
    ,lists: {
       '192.168.1.4': 'xx:xx:xx:xx:xx:xx'
      ,'subPC'      : 'xx:xx:xx:xx:xx:xx'
      ,'WiFi2'      : 'xx:xx:xx:xx:xx:xx'
    } 
  
    //※必要ならIPやキーワードやSSL接続などで安全を確保すること
  
    //接続を許可するクライアントIPアドレス
    ,allowIP: ['*'] //'*'は全部許可
  
    //命令実行を許可するキーワード
    ,keyword: '*' //'*'は全部許可
    
    //WakeUpしたら最大1分で接続を切る
    ,timeout: 1000*60
    
};
  
//実行    
var ws = rww.conn( option );
</pre></code>

<h3>Client</h3>wol.htm<code><pre>
&lt;html>
&lt;meta charset=utf-8>
&lt;meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
&lt;title>
remote-ws-wol
&lt;/title>
&lt;style>
body{
  background-color: #fff;
  color: #000;
  font-family:'Lucida Grande','Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3',Meiryo, メイリオ, sans-serif;
}
.swt{
  margin: 1%;
  padding:48px 88px;
  font-size:40px;
  display: none;
  color: #000;
  background-color: #eee;
  width: 98%;
  
}
button{
  border-radius: 2px;        /* CSS3草案 */  
  -webkit-border-radius: 2px;    /* Safari,Google Chrome用 */  
  -moz-border-radius: 2px;   /* Firefox用 */  
}
#info{
  margin: 12px;
  font-size:48px;
}
&lt;/style>
&lt;body>

&lt;button id=on1 class="swt"> 192.168.1.4 &lt;/button>
&lt;button id=on2 class="swt"> subPC &lt;/button>

&lt;div id=info>status&lt;/div>
&lt;script>

  //接続します
  var ws = new WebSocket('ws://192.168.1.22:8503');
  
  //接続時の処理
  ws.onopen = function () {
    info.innerHTML='接続しました'
    on1.style.display='block'
    on2.style.display='block'
  };
  //エラー時の処理
  ws.onerror = function (error) {
    info.innerHTML='Error: '+ error
  };
  //クローズ時の処理
  ws.onclose = function (error) {
    info.innerHTML='切断しました';
  };
  //サーバーからメッセージ着信時の処理
  ws.onmessage = function (e) {
  
    var data = JSON.parse(e.data);
    info.innerHTML=data.msg;
    
    if(data.name==="192.168.1.4"){
      on1.style.color = 'orange';
    } else if(data.name==="subPC"){
      on2.style.color = 'orange';
    }
    
    setTimeout(function(){
      on1.style.color =
      on2.style.color = '#000';
      
    },2000)
  };
  
  //クリック時の処理
  on1.onclick=function(){
    ws.send(JSON.stringify({"name":"192.168.1.4"}));
  }
  on2.onclick=function(){
    ws.send(JSON.stringify({"name":"subPC"}));
  }

&lt;/script>
&lt;/body>
&lt;/html>
</pre></code>
<hr>
<h3>License</h3>
MIT
