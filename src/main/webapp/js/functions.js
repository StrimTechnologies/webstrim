/*
 * @author raduuu2k7
 */
document.getElementById("defaultOpen").click();
document.getElementById('usernameupdate').value = sessionStorage.getItem("name");
document.getElementById('walletupdate').value = sessionStorage.getItem("wallet");
searchTable();
loadStrim();

function strimDetailPage(camera) {
    //sessionStorage.removeItem("strimDetailPage");
    //sessionStorage.setItem("strimDetailPage", camera);
    strimDetailPageVar = camera;
    if (sessionStorage.getItem('fullscreentoggle') == 'true') {
        $('.toggle').click();
    }
    loadStrimDetails();
}

function searchTable() {
    $('#refreshlist').show();

    var trHTML = null;
    trHTML = '<thead><tr><th>User</th><th>Strim name</th><th>Strim place</th><th>Price(STR)</th></tr></thead><tbody>';
    filtru = document.getElementById("filterTable-input").value;
    strimuri = JSON.search(WebService("GET", "devices/secured/all"), '//*[roomInfo][contains(strimMetadata,"' + filtru + '")]');
    $.each(strimuri, function (i) {
        if (strimuri[i].strimStatus == 1) {
            status = '#A5EFA4';
        } else {
            status = '#EFA4A4';
        }
        trHTML += '<tr style="background:' + status + '; border: 1px solid #ccc;border-style: dashed;cursor: pointer;"><td style="padding:10px;"><a href="' + strimuri[i].deviceId + '"></a>' + strimuri[i].userId.username + '</td><td>' + strimuri[i].strimName + '</td><td>' + strimuri[i].strimLocation + '</td><td>' + strimuri[i].price + '</td></tr>';
    });
    trHTML += '</tbody>';
    $('#liveStrims').empty();
    $('#liveStrims').append(trHTML);

    $(document).ready(function () {
        $('#liveStrims tr').click(function () {
            var href = $(this).find("a").attr("href");
            if (href) {
                strimDetailPage(href);
            }
        });
    });
    $('#refreshlist').hide();
}

function CallButton() {
    var html = 'Connected';
    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;
    roomURLsDiv.style.display = 'block';
    document.getElementById('room-urls').innerHtml = "";
    document.getElementById("open-or-join").click();
    document.getElementById('open-or-join').disabled = true;
}

function loadStrim() {

    room = WebService("GET", "devices/secured/" + sessionStorage.getItem("deviceid"));
// Get the element with id="defaultOpen" and click on it
//alert("roominfo: " + room.strimInfo);
    if (joinroomid == null && room.strimInfo == null) {
        // document.getElementById("defaultOpen").click();    
        $('#liveCamera').on('click', function (event) {
            openTabs(event, 'CreateStrim');
        });
    } else {
        $('#liveCamera').on('click', function (event) {
            openTabs(event, 'LiveStrim');
        });
        document.getElementById("liveCamera").click();

        var html = 'Starting P2P Strim, please wait...';
        var roomURLsDiv = document.getElementById('room-urls');
        roomURLsDiv.innerHTML = html;
        roomURLsDiv.style.display = 'block';

        setTimeout("CallButton()", 2500);
    }
// alert ("" + joinroomid);      
}

function loadStrimDetails() {
    strimDetails = WebService("GET", "devices/secured/" + strimDetailPageVar);
    document.getElementById("userstreamingDetailsTab").innerHTML = "User streaming: " + strimDetails.userId.username;
    document.getElementById("strimnameDetailsTab").innerHTML = "Strim name: " + strimDetails.strimName;
    document.getElementById("strimdetailsDetailsTab").innerHTML = "Strim details: " + strimDetails.strimInfo;
    document.getElementById("strimlocationDetailsTab").innerHTML = "Strim location: " + strimDetails.strimLocation;
    document.getElementById("strimpriceDetailsTab").innerHTML = "PRICE: " + strimDetails.price + " STR";
    document.getElementById("strimHostWallet").innerHTML = "Hoster Wallet: " + strimDetails.userId.walletAddress;

    sessionStorage.setItem("hosterName", strimDetails.userId.username);
    //sessionStorage.setItem("hosterWallet", strimDetails.userId.walletAddress);
    //sessionStorage.setItem("hosterPrice", strimDetails.price);
    hosterWallet = strimDetails.userId.walletAddress;
    hosterPrice = strimDetails.price;
    
    hosterSenzID = WebService("GET", "senzors/secured/bydevice/" + strimDetails.deviceId);    
    hosterSenzValues = WebService("GET", "senzorvalues/secured/senzorid/" + hosterSenzID[0].senzorId);   
    hosterLat = hosterSenzValues.latitude;
    hosterLong = hosterSenzValues.longitude;
       

    if (strimDetails.strimStatus == 1) {
        document.getElementById("strimstatusDetailsTab").innerHTML = ('<font color="green">Strim status: Open to join</font>');
        document.getElementById('connecttostrim').disabled = false;
        document.getElementById("StrimDetailsPage").click();
    } else
    {
        document.getElementById("strimstatusDetailsTab").innerHTML = ('<font color="red">Strim status: Not started / Room full</font>');
    }

    if (strimDetails.strimName == null) {
        alert("The Stream was just stopped !");
        //window.location.href = "main.html";
        //document.getElementById("defaultOpen").click(); 
        searchTable();
        $('#RefreshLiveMap').click();
    }
}

function ConnectToStrim() {
    if (sessionStorage.getItem("enableTransactions") == "true" && hosterPrice != 0) {
        strimDetails = WebService("GET", "devices/secured/" + strimDetailPageVar);
        if (strimDetails.strimName == null || strimDetails.strimStatus != 1) {
            alert("The Stream is not available anymore.");
            document.getElementById("defaultOpen").click();
            searchTable();
            $('#RefreshLiveMap').click();
            $('.toggle').click();
        } else {
            if (web3.version.network != 1) {
                if (tokenBalance >= hosterPrice) {                   
                    //STR DAO transfer
                    var STR_DAO = web3.eth.contract(STR_DAO_ABI).at(STR_DAO_Address);
                    STR_DAO.transfer.sendTransaction(hosterWallet, web3.toWei(parseFloat(hosterPrice), "ether"), {from: sessionStorage.getItem("wallet")}, function (err, transactionHash) {
                        if (!err) {
                            sessionStorage.setItem("txHash" , transactionHash);
                            alert("Payment was succesfull ! Transaction may take up to 45 seconds to process. Use the Transaction Hash to check status. \nHash: " + transactionHash);                                                                                    
                            //sessionStorage.setItem("joinroomid", strimDetails.roomInfo)
                            joinroomid = strimDetails.roomInfo;
                            sessionStorage.setItem("hoster", strimDetailPageVar);
                            //window.location.reload();        
                            loadStrim();
                        } else {
                            alert("There was an error with the payment ! \n");
                        }
                    });
                } else
                    alert("Insufficient STR tokens.");
            } else
                alert("Please switch to Rinkeby Test Network in order to test transactions and try again.");
        }
    } else {
        strimDetails = WebService("GET", "devices/secured/" + strimDetailPageVar);
        if (strimDetails.strimName == null || strimDetails.strimStatus != 1) {
            alert("The Stream is not available anymore.");
            document.getElementById("defaultOpen").click();
            searchTable();
            $('#RefreshLiveMap').click();
            $('.toggle').click();
        } else {
            //sessionStorage.setItem("joinroomid", strimDetails.roomInfo)
            joinroomid = strimDetails.roomInfo;
            sessionStorage.setItem("hoster", strimDetailPageVar);
            //window.location.reload();        
            loadStrim();
        }
    }
}


