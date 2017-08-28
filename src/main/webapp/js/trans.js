if (sessionStorage.getItem("enableTransactions") == "true") {
    $('#accountBalance').show();
    $('#txStatus').show();

    function updateTxHistory() {
        if (sessionStorage.getItem("txHash") != null) {
            $('#txStatus').html("<a href='https://rinkeby.etherscan.io/tx/" + sessionStorage.getItem("txHash") + "' target='_blank'>[ Check last transaction status ]</a>");
        }
    }

    updateTxHistory();


    ///      WEB3        ///

    var eth = void 0;
    var accounts = [];
    var web3Found = false;
    //var Eth = require('ethjs');
    function displayMessage(message)
    {
        $('#container').hide();
        $('#msg').hide();
        $('#help').show();
        $('#help').html(message);
    }
    window.addEventListener('load', function () {

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            web3Found = true;
            eth = new Eth(web3.currentProvider);
        } else {
            displayMessage("Web3 not found. Please install Metamask following the steps mentioned in the STRIM Help site:<br><br><a href='help.html' style='color:#ed2553;'> > STR SETUP HELP < </a> <br><br>NOTE: Transactions are not supported on mobile devices during alpha");
            // Fall back to Infura:            
            web3Found = false;
            eth = new Eth(new Eth.HttpProvider('https://mainnet.infura.io'));
        }

        window.eth = eth;
        store.dispatch({type: 'ETH_LOADED', value: eth});
        store.dispatch({type: 'WEB3_FOUND', value: web3Found});

        startApp();
    });

    //GET ACCOUNTS
    $(document).ready(function () {
        web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                displayMessage("There was an error fetching your accounts. Make sure your Ethereum client is configured correctly and refresh this page.<br> For more details, visit the STRIM Help page:<br><br><a href='help.html' style='color:#ed2553;'> > STR SETUP HELP < </a><br><br>");
                return;
            }

            if (accs.length == 0) {
                displayMessage("Could not get any accounts! <br> Make sure your Ethereum client is configured correctly and you have signed in / unlocked and refresh this page.<br><br> For more details, visit the STRIM Help page:<br><br><a href='help.html' style='color:#ed2553;'> > STR SETUP HELP < </a><br><br>");
                return;
            }

            accounts = accs;
            if (accounts != sessionStorage.getItem("wallet"))
            {
                displayMessage("Strim wallet address does not match the Eth client selected address. <br> Please select the correct Ether wallet and refresh the page ! <br><br> Strim wallet:" + sessionStorage.getItem("wallet") + "<br> Ether client wallet:" + accounts + "<br><br> For more details, visit the STRIM Help page:<br><br><a href='help.html' style='color:#ed2553;'> > STR SETUP HELP < </a><br><br>");
                return;
            }
        });

        // GET BALANCE (ETH/STR)
        var STR_DAO = web3.eth.contract(STR_DAO_ABI).at(STR_DAO_Address);
        web3.eth.getBalance(sessionStorage.getItem("wallet"), function (error, result) {
            if (!error)
                etherBalance = web3.fromWei(result);
            else
                console.error(error);

            STR_DAO.balanceOf(sessionStorage.getItem("wallet"), function (errorT, resusltT) {
                if (!errorT)
                    tokenBalance = web3.fromWei(resusltT);
                else
                    console.log(errorT);

                $('#accountBalance').html("Balance: <a href ='https://rinkeby.etherscan.io/address/" + sessionStorage.getItem("wallet") + "' target='_blank'>[ " + etherBalance + " ETH ]</a> / <a href='https://rinkeby.etherscan.io/token/" + STR_DAO_Address + "?a=" + sessionStorage.getItem("wallet") + "' target='_blank'>[ " + tokenBalance + " STR ]</a><br><br><div style='color:#ed2553;cursor: pointer;width:115px;' title='this option is only available in alpha version and will not be ported into beta' id='buystr'>[ buy alpha str ]</div>");

                $("#buystr").on("click", function (event) {
                    //ETH transfer                 
                    transactionObject = {
                        from: sessionStorage.getItem("wallet"),
                        to: STR_DAO_Address,
                        value: web3.toWei(0.1, "ether")//,
                                //gas: "66160"
                    };

                    web3.eth.sendTransaction(transactionObject, function (err, transactionHash) {
                        if (!err) {
                            sessionStorage.setItem("txHash", transactionHash);
                            alert("Payment was succesfull ! Note that it could take up to 45 seconds for the transaction to be processed. \nTrans Hash: " + transactionHash);
                            updateTxHistory();
                        } else
                            alert("There was an error with the payment ! \n");
                    });
                    return true;
                    getConfirmation();
                });
            });

        });
    });
}

///////////////////////////