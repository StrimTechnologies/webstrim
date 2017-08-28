/*
 * @author raduuu2k7
 */

var verified;
var grecap;

var xhr = new XMLHttpRequest();
xhr.open('GET', 'includes/menu.html', true);
xhr.onreadystatechange = function () {
    if (this.readyState !== 4)
        return;
    if (this.status !== 200)
        return;
    // $('#menuplace').html(this.responseText);
};
xhr.send();

$('#enableTrans').on('click', function (event) {   
    if (sessionStorage.getItem("enableTransactions") !== "true") {
        sessionStorage.setItem("enableTransactions", "true");
        //sessionStorage.setItem("transactionCurrency", "ether");       
        $("#helpPage").show();
    } else
    {
        sessionStorage.removeItem("enableTransactions");
        //sessionStorage.removeItem("transactionCurrency");
        $("#helpPage").hide();           
    }
});

$('.footer').on('click', function (event) {
    $("body").css("overflow", "hidden");
    $('.toggle').show();
    $('#createuserForm').show();
    $('#form_meniu').show();
    $('.container').stop().addClass('active');
});

$('.close').on('click', function (event) {
    $("body").css("overflow", "visible");
    $('#form_meniu').hide();
    $('#createuserForm').hide();
    $('.container').stop().removeClass('active');
    $('.toggle').hide();

});

$('#logout').on('click', function (event) {
    window.sessionStorage.clear();
    window.location.href = "index.html";
});

$('#exit').on('click', function (event) {
    $('#stop').click();
    window.sessionStorage.clear();
    window.location.href = "index.html";
});

$('#usernameupdate').on('blur', function checkusername() {
    if ($('#usernameupdate').val() != sessionStorage.getItem('name')) {
        var username = removeDiacritics($(this).val());
        if (username != "") {
            checkUserExist = WebService("GET", 'users/check/username/' + username);
            if (checkUserExist == true) {
                $(this).val('');
                alert("Username already exists !");
                usercreate = document.getElementById('usernameupdate');
                setTimeout("usercreate.focus()", 50);
            }
        }
    }
});

$('#walletupdate').on('blur', function checkwallet() {
    if ($('#walletupdate').val() != sessionStorage.getItem('wallet')) {
        var wallet = removeDiacritics($(this).val());
        if (wallet != "") {
            checkWalletExist = WebService("GET", 'users/check/wallet/' + wallet);
            if (checkWalletExist == true) {
                $(this).val('');
                alert("Wallet already exists !");
                walletcreate = document.getElementById('walletupdate');
                setTimeout("walletcreate.focus()", 50);
            }
        }
    }
});

$('#passwordupdate2').on('blur', function checkpassword() {
    if (removeDiacritics($(this).val()) != removeDiacritics($('#passwordupdate').val())) {
        alert("Passwords do not match");
        $('#passwordupdate').val('');
        $(this).val('');
        passwordcreate = document.getElementById('passwordupdate');
        setTimeout("passwordcreate.focus()", 50);
    }
});

$("form#updateuserForm").on('submit', (function () {

    var username = removeDiacritics($('#usernameupdate').val());
    var password = SHA256($('#passwordupdate').val());
    var password2 = SHA256($('#passwordupdate2').val());
    var currentpassword = SHA256($('#currentpassword').val());
    var wallet = removeDiacritics($('#walletupdate').val());

    // originalcode = window.sessionStorage.getItem("code");
    // window.sessionStorage.setItem("code", btoa(window.sessionStorage.getItem("name") + ":" + currentpassword));
    passwordcheck = WebService("GET", "users/secured/username/" + window.sessionStorage.getItem("name"));

    if (passwordcheck != "error") {
        if (password != password2) {
            alert("Passwords do not match");
        } else {
            //update user     
            if (password != "NotRealPassword" && password != "" && password != " " && password != null && password != "cbc439ccf43d2ba149ca36b70f0ccc1709d6028f253173f5274b518867c66215") {
                userinf = JSON.stringify({
                    "userId": sessionStorage.getItem("id"),
                    "username": username,
                    "passwd": password,
                    "walletAddress": wallet
                });
            } else {
                userinf = JSON.stringify({
                    "userId": sessionStorage.getItem("id"),
                    "username": username,
                    "passwd": currentpassword,
                    "walletAddress": wallet
                });
            }
            updateuser = WebService("PUT", "users/secured/update", userinf);

            if (updateuser != "error") {
                alert("Profile setings updated, please login again");
                sessionStorage.clear();
                window.location.reload();
            } else {
                alert("Could not update user. Please make sure the old password is correct");
            }
        }
    } else
    {
        alert("Re-check current password !");
        //window.sessionStorage.setItem("code", originalcode);
    }
}));

$("form#startStream").on('submit', (function () {
    var strimname = removeDiacritics($('#strimname').val());
    var strimdetails = removeDiacritics($('#strimdetails').val());
    var strimlocation = removeDiacritics($('#strimlocation').val());
    var strimprice = parseFloat($('#strimprice').val());

    var meta = sessionStorage.getItem("name") + ' ' + removeDiacritics(strimname) + ' ' + removeDiacritics(strimdetails) + ' ' + removeDiacritics(strimlocation);

    strimdata = JSON.stringify({
        "deviceId": sessionStorage.getItem("deviceid"),
        "price": strimprice,
        "roomInfo": Math.random().toString(16).substring(2),
        "strimInfo": removeDiacritics(strimdetails),
        "strimLocation": removeDiacritics(strimlocation),
        "strimName": removeDiacritics(strimname),
        "strimMetadata": meta,
        "strimStatus": 0,
        "userId": {
            "userId": sessionStorage.getItem("id")},
        "deviceName": sessionStorage.getItem("deviceName"),
        "modelId": sessionStorage.getItem("modelId")
    });

    writestrim = WebService("PUT", "devices/secured/update", strimdata);
    if (writestrim != "error") {
        // alert("Strim created !");
        // startVideo();
    } else {
        alert("Could not create strim");
    }
}));

$("form#loginForm").on('submit', (function () {
    $('#statuslogin').html("Signing in, please wait ...");
    var username = removeDiacritics($('#username').val());
    var password = SHA256($('#password').val());

    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ":" + password));
    }

    if (username && password) {
        $.ajax({
            type: "GET",
            url: (WSurl + "users/secured/username/" + username),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            //global: false,
            error: function (XMLHttpRequest) {
                alert("" + JSON.parse(XMLHttpRequest.responseText).errorMessage);
                $('#statuslogin').html("Could not sign in. Check credentials.");
            },
            success: function (data) {
                /*  if (data.error) {
                 alert("data.error: " + data.error);
                 } else { // login was successful      */
                // window.sessionStorage.clear();
                window.sessionStorage.setItem("name", username);
                window.sessionStorage.setItem("id", data.userId);
                window.sessionStorage.setItem("mail", data.mail);
                window.sessionStorage.setItem("wallet", data.walletAddress.toLowerCase());
                window.sessionStorage.setItem("code", btoa(username + ":" + password));

                getdevice = "device1";

                devices = JSON.search(WebService("GET", "devices/secured/username/" + username), '//*[modelId="' + getdevice + '"]');
                window.sessionStorage.setItem("deviceid", devices[0].deviceId);
                window.sessionStorage.setItem("modelId", devices[0].modelId);
                window.sessionStorage.setItem("deviceName", devices[0].deviceName);

                senzoru = JSON.search(WebService("GET", "senzors/secured/bydevice/" + devices[0].deviceId), '//*[deviceId="' + devices[0].deviceId + '"]/../senzorId');
                window.sessionStorage.setItem("senzorid", senzoru);

                senzorvalues = WebService("GET", "senzorvalues/secured/senzorid/" + senzoru);

                if (senzorvalues != null) {
                    //window.sessionStorage.setItem("latitude",senzorvalues.latitude);
                    //window.sessionStorage.setItem("longitude",senzorvalues.longitude);
                    window.sessionStorage.setItem("senzorvalueId", senzorvalues.valueId);
                }

                sessionStorage.setItem('fullscreentoggle', 'true');

                window.location.href = "main.html";
                //}
            },
            beforeSend: setHeader
        });
    } else {
    }
    return false;
}));

$('#usernamecreate').on('blur', function checkusername() {
    var username = removeDiacritics($(this).val());
    if (username != "") {
        checkUserExist = WebService("GET", 'users/check/username/' + username);
        if (checkUserExist == true) {
            $(this).val('');
            alert("Username already exists !");
            usercreate = document.getElementById('usernamecreate');
            setTimeout("usercreate.focus()", 50);
        }
    }
});

$('#wallet').on('blur', function checkwallet() {
    var wallet = removeDiacritics($(this).val());
    if (wallet != "") {
        checkWalletExist = WebService("GET", 'users/check/wallet/' + wallet);
        if (checkWalletExist == true) {
            $(this).val('');
            alert("Wallet already exists !");
            walletcreate = document.getElementById('wallet');
            setTimeout("walletcreate.focus()", 50);
        }
    }
});

$('#passwordcreate2').on('blur', function checkpassword() {
    if ($(this).val() != $('#passwordcreate').val()) {
        alert("Passwords do not match");
        $('#passwordcreate').val('');
        $(this).val('');
        passwordcreate = document.getElementById('passwordcreate');
        setTimeout("passwordcreate.focus()", 50);
    }
});

var verifyCallback = function (response) {
    console.log('g-recaptcha-response: ' + response);
    if (response != null) {
        verified = true;
        grecap = response;
        document.getElementById('createuser').disabled = false;
    } else {
        verified = false
    }
    console.log('g-recaptcha-verified: ' + verified);
};

var expCallback = function () {
    verified = false;
    document.getElementById('createuser').disabled = true;
    console.log('token expired');
    console.log('g-recaptcha-verified: ' + verified);
    grecaptcha.reset();
}

$("#createuser").on('click', function (e) {
    e.preventDefault()
    $('#creatinguserstatus').html("Please wait...");
    $('#createuser').slideUp('fast', function () {
        $('#createuserForm').submit();
    });
});

$("form#createuserForm").on('submit', (function () {
    if (verified == true) {
        var username = removeDiacritics($('#usernamecreate').val());
        var password = SHA256($('#passwordcreate').val());
        var password2 = SHA256($('#passwordcreate2').val());
        var wallet = removeDiacritics($('#wallet').val());
        window.sessionStorage.clear();

        checkUserExist = WebService("GET", 'users/check/username/' + username);
        checkWalletExist = WebService("GET", 'users/check/wallet/' + wallet);
        if (checkUserExist == true && checkWalletExist == true)
        {
            alert('Your username/wallet was just registered by someone else');
        } else {
            window.sessionStorage.setItem("code", btoa(username + ":" + password));

            //create new user and get the new userid
            userinf = JSON.stringify({
                "passwd": password,
                "username": username,
                "walletAddress": wallet
            });

            writeuser = WebService("POST", "users/add", userinf);
            newuserid = WebService("GET", "users/secured/username/" + username);

            //create new device and get new deviceId
            newdevice = JSON.stringify({
                "deviceName": "device",
                "modelId": "device1",
                "userId": {
                    "userId": newuserid.userId}
            });

            writedevice = WebService("POST", "devices/secured/add", newdevice);
            newdeviceid = WebService("GET", "devices/secured/username/" + username);

            //create new senzor 
            newsenzor = JSON.stringify({
                "deviceId": {
                    "deviceId": newdeviceid[0].deviceId,
                    "userId": {
                        "userId": newuserid.userId
                    }
                },
                "isMinable": true
            });

            writesenzor = WebService("POST", "senzors/secured/add", newsenzor);
            newsenzorid = WebService("GET", "senzors/secured/bydevice/" + newdeviceid[0].deviceId);

            //create new senzorvalue placeholder    
            newsenzolvaluesholder = JSON.stringify({
                "senzorId": {
                    "deviceId": {
                        "deviceId": newdeviceid[0].deviceId,
                        "userId": {
                            "userId": newuserid.userId
                        }
                    },
                    "isMinable": true,
                    "senzorId": newsenzorid[0].senzorId
                }
            });

            writesenzorvaluesholder = WebService("POST", "senzorvalues/secured/add", newsenzolvaluesholder);

            if (writeuser != "error" && writedevice != "error" && writesenzor != "error" && writesenzorvaluesholder != "error") {
                alert("User has been created, please log in");
                window.location.href = "index.html";
            } else {
                alert("Could not create user !");
                window.location.href = "index.html";
            }
        }
    }
}));

$('#usernametag').html(sessionStorage.getItem("name"));
$('#usernametag2').html(sessionStorage.getItem("name"));
$('#devicetag').html(sessionStorage.getItem("wallet"));

function loadScriptSync(src) {
    var s = document.createElement('script');
    s.src = src;
    s.type = "text/javascript";
    s.async = false;
    //  document.getElementsByTagName('head')[0].appendChild(s);
    $("#temp").append(s);
}

          