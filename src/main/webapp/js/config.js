/*
 * @author raduuu2k7
 * Config file
 */

var RTCurl      = 'https://signal.strim.me:9001/';       //rtc signal server URL ex. 'https://signal.strim.me:9001/'
var WSurl       = '/webstrim/webresources/';      //WebService URL   ex http://a.b.com/webstrim/webresources/

var STR_DAO_Address = '0x12352Eab2e3AF43E0006129573443135653d6aDD'; // STRIM RINKEBY TESTNET CONTRACT

//STR ABI:
var STR_DAO_ABI   = [{"constant": false, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}], "name": "transfer", "outputs": [], "payable": false, "type": "function"}, {"constant": true, "inputs": [{"name": "_owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}], "payable": false, "type": "function"}];

//vars
var etherBalance = 0;
var tokenBalance = 0;
var hosterWallet;
var hosterPrice;
var strimDetailPageVar;
var joinroomid = null;
