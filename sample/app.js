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
