/*
 * @author raduuu2k7
 */

function setHeader_session(xhr_session) {
    xhr_session.setRequestHeader('Authorization', 'Basic ' + window.sessionStorage.getItem("code"));
    xhr_session.setRequestHeader('captchaToken', grecap);
}

function WebService(tip, call, info) {
    var result = null;    
    $.ajax({
        type: tip,
        url: (WSurl + call),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: info,
        cache: false,
        async: false,
        //global: false,
        error: function (XMLHttpRequest) {
            alert("" + JSON.parse(XMLHttpRequest.responseText).errorMessage);
            if (JSON.parse(XMLHttpRequest.responseText).errorMessage != null) {
                result = "error";
            }
        },
        success: function (data) {
          /* if (data.error != null) {
                alert("data.error: " + data.error);
                result = "error";
            } else { */
                if (tip === "GET") {
                    result = data;
                }
            //}
        },
        beforeSend: setHeader_session
    });
    return result;
}




  