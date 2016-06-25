#!/usr/bin/env node

/*=========================================================
 * Remote WakeUp PC
 *
 * 2016/6/22 @toshirot
 * http://cht.pw/chat.htm
 *---------------------------------------------------------
 */

var wol = require('wake_on_lan');
var WsServer = require('ws').Server;


/*=========================================================
 * rww 
 *
 * @param     {Object} option                 Options
 *   @property  {String} [op.url='localhost']   WebSocketServer
 *   @property  {Int}    [op.port=8503]         WebSocketServerPort
 *   @property  {Object} op.lists               WakeUpLists
 *   @property  {Array}  [op.allowIP=['*']]     allowIPLists
 *   @property  {String} [op.keyword='*']       allowKeyword
 *   @property  {Int}    [op.timeout=1000*60]   timeout
 * @return    {Object} WebSocket  Object
 
 * 引数はwebに公開される場所には置かないように注意しましょう
 * Argument is let's be careful not place such as in a location that can be published to the web

    //Argument samples for rww. rwwの引数設定サンプル

  var op = {
  
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
    ,keyword: '*'//'*'は全部許可
    
    //WakeUpしたら最大1分で接続を切る
    ,timeout: 1000*60
    
  };
 */

var conn = function( option ){

  /*=========================================================
   * WebSocket
   */

  var WebSocketServer = option.url||'localhost';
  var WebSocketServerPort = option.port||8503;
  var WakeUpLists = option.lists;
  var allowIPLists = option.allowIPs|| ['*'];
  var allowKeyword = option.keyword || '*';
  var timeout = option.timeout || 60000;//default 60sec
  
  if(!WakeUpLists)return;
    
  //WebSocket Server
  var ws = new WsServer({
        host: WebSocketServer,
        port: WebSocketServerPort
  });

  //on connection
  ws.on('connection', function(socket) {

    //IPチェック接続拒否
    if(!allowIPChk(socket, ws)){ return; }

    //受信時
    socket.on('message', function(msg) {
    
      var _msg ={};
      //msg is JSON e.g. JSON.stringify({"name":"192.168.1.4", "keyword": "myhoge"})
      var dataErr = false;
      try{
        _msg = JSON.parse(  msg );
        var name = _msg.name;
        var keyword = _msg.keyword;
        console.log(_msg, typeof _msg, "name: ",_msg.name, "keyword: ",_msg.keyword)
        
        if(socket.readyState===1){
          //ここでIP正規チェックもした方が良いかも
          //キーワードチェック
          if(!allowKeywordChk(keyword)){ return }

          //WakeUp
          if(WakeUpLists[name]!==undefined){
            wakeUp (socket, name);//e.g.'192.168.1.4'
            
            //送信データフォーマット e.g. {name: name, msg: name+ 'を起動しています。'}
            socket.send(JSON.stringify({name: name, msg: name+ 'を起動しています。'}));
            console.log(name, 'を起動しています');
          }
        }
      
      } catch(e){
        dataErr = true;
        console.log(JSON.stringify(e))
      }
      if(dataErr)return;

    });

  });
  ws.on('close', function() {
    console.log('closed')
  });



  /*=========================================================
   * Wake on LAN
   */

  //マジックパケット送信
  function wakeUp (socket, name){
    var mac = WakeUpLists[name];
    if(!mac){
      console.log(name + ' はリストにありません');
      return;
    }
    console.log('処理中: ' + name );

    wol.wake(mac, function(error) {
      if (error) {
        console.log(error);
      } else {
        //送信データフォーマット e.g. {name: name, msg: name+ 'へ起動命令を送りました。'}
        socket.send(JSON.stringify({name:name, msg: name + 'へ起動命令を送りました。'}));
        //  socket.close();//接続終了
        //console.log('処理終了: ' + name + ': ' + mac);

        setTimeout(function(){ socket.close();},timeout)
      }
    });
  }

  /*=========================================================
   * allow
   */

  function allowIPChk(socket, ws){
     if(!allowIPLists)return true;
     //接続してきたクライアントのIPアドレス
     var clientIP = socket.upgradeReq.socket.remoteAddress;
     console.log('connected: ', (new Date),'clientLen: ' + ws.clients.length, clientIP);
     //接続許可
     for(var i=0; i<allowIPLists.length;i++){
       if(allowIPLists[i] === "*"){return true}
       if(allowIPLists[i] === clientIP){
         return true;
       } else {
         continue;
       }
     }
     return false;
  }

  function allowKeywordChk(keyword){
    if(!allowKeyword)return true;
    //キーワードチェックのロジック追加してください
    if(allowKeyword === "*")return true;
    if(allowKeyword === keyword)return true;
    return false;
  }
  
  return ws;
}

/*=========================================================
 * モジュール化
 */

var rww = new function () {
  this.conn = conn;
}
module.exports = rww;
