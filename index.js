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
 * @param  {String} WebSocketServer
 * @param  {Int}    WebSocketServerPort
 * @param  {Object} WakeUpLists
 * @param  {Array}  allowIPLists
 * @param  {String} allowKeyword
 * @param  {Int}    timeout
 * @return {Object} WebSocket Object
 
 * 引数はwebに公開される場所には置かないように注意しましょう
 * Argument is let's be careful not place such as in a location that can be published to the web

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
    
 */

var conn = function( WebSocketServer, 
                    WebSocketServerPort,
                    WakeUpLists,
                    allowIPLists,
                    allowKeyword,
                    timeout
                    ){

  /*=========================================================
   * WebSocket
   */


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
      //msg is JSON e.g. JSON.stringify({"ip":"192.168.1.4", "keyword": "myhoge"})
      var dataErr = false;
      try{
        _msg = JSON.parse(  msg );
        var ip = _msg.ip;
        var keyword = _msg.keyword;
        console.log(_msg, typeof _msg, "ip: ",_msg.ip, "keyword: ",_msg.keyword)
        
        if(socket.readyState===1){
          //ここでIP正規チェックもした方が良いかも
          //キーワードチェック
          if(!allowKeywordChk(keyword)){ return }

          //WakeUp
          if(WakeUpLists[ip]!==undefined){
            wakeUp (socket, ip);//e.g.'192.168.1.4'
            
            //送信データフォーマット e.g. {ip: ip, msg: ip+ 'を起動しています。'}
            socket.send(JSON.stringify({ip: ip, msg: ip+ 'を起動しています。'}));
            console.log(ip, 'を起動しています');
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
  function wakeUp (socket, ip){
    var mac = WakeUpLists[ip];
    if(!mac){
      console.log(ip + ' はリストにありません');
      return;
    }
    console.log('処理中: ' + ip );

    wol.wake(mac, function(error) {
      if (error) {
        console.log(error);
      } else {
        //送信データフォーマット e.g. {ip: ip, msg: ip+ 'へ起動命令を送りました。'}
        socket.send(JSON.stringify({ip:ip, msg: ip + 'へ起動命令を送りました。'}));
        //  socket.close();//接続終了
        //console.log('処理終了: ' + ip + ': ' + mac);
        
        if(!timeout)timeout=60000;//60sec
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
