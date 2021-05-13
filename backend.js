   // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCa2tCc63OHL-xYm170QaI3ucKIQ5-uUIw",
    authDomain: "cms-js-webpage.firebaseapp.com",
    projectId: "cms-js-webpage",
    storageBucket: "cms-js-webpage.appspot.com",
    messagingSenderId: "174987432849",
    appId: "1:174987432849:web:509bdfa8590f884bfbc030"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  function uploadData() {
   var database = firebase.database();
   var info = database.ref("creditInfo");
   var infoUser = {
     credit: 900,
     email: "sujoydas1234@gmail.com",
     name: "Sujoy Das",
     uid: 20,
  };
  info.push(infoUser);
}

//uploadData();
// Table Creation dynamically
var txStatus = 0;
var senderEmail, recEmail, amount;
var detailsGlobal, keyGlobal, ksGlobal;

const table = document.getElementById("tableBody");
var realData = firebase.database();
var ref = realData.ref("creditInfo");
ref.on("value", gotData, errData);
function gotData(data) {
  table.innerHTML = "";
  var details = data.val();
  detailsGlobal = details;
  var keys = Object.keys(details);
  keyGlobal = keys;
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var tr = document.createElement("tr");
    var id = document.createElement("td");
    var names = document.createElement("td");
    id.innerHTML = details[k].uid;
    names.innerHTML = details[k].name;
    names.id = details[k].uid;
    tr.appendChild(id);
    tr.appendChild(names);
    var transferButton = document.createElement("button");
    transferButton.className = "btn btn-danger";
    transferButton.innerHTML = "Check Info";
    transferButton.id = details[k].uid;
    tr.appendChild(transferButton);
    table.appendChild(tr);
  }
}

function errData(err) {
  console.log("Error!");
  console.log(err);
}

//
document.addEventListener("click", function (e) {
  var emailDiv = document.getElementById("email-row");
  var creditDiv = document.getElementById("credit-row");

  for (var i = 0; i < keyGlobal.length; i++) {
    var k = keyGlobal[i];
    if (e.target.id == detailsGlobal[k].uid) {
      var email = detailsGlobal[k].email;
      var credit = detailsGlobal[k].credit;
      emailDiv.innerHTML = "<p>Email :" + email + "</p>";
      creditDiv.innerHTML = "<p>Credit :" + credit + "</p>";
      senderEmail = email;
      amount = credit;
      $("#userModal").modal("show");
    }
  }
});
//
function transerInit() {
  var senderList = document.createElement("option");
  var sender = document.getElementById("sender");
  sender.innerHTML = "";
  senderList.innerHTML = senderEmail;
  sender.appendChild(senderList);
  var rec = document.getElementById("receiver");
  rec.innerHTML = "";
  for (var i = 0; i < keyGlobal.length; i++) {
    var ks = keyGlobal[i];
    var recList = document.createElement("option");
    if (senderEmail == detailsGlobal[ks].email) continue;
    recList.innerHTML = detailsGlobal[ks].email;
    rec.appendChild(recList);
  }

  $("#infoModal").modal("show");
}
//
function sendMoney() {
  var sender = document.getElementById("sender");
  var rec = document.getElementById("receiver");
  var money = document.getElementById("amount");
  var sk, rk;
  for (var i = 0; i < keyGlobal.length; i++) {
    var k = keyGlobal[i];
    if (detailsGlobal[k].email == sender.value) {
      sk = k;
      console.log(sk);
    }
  }
  for (var i = 0; i < keyGlobal.length; i++) {
    var k = keyGlobal[i];
    if (detailsGlobal[k].email == rec.value) {
      rk = k;
      console.log(rk);
    }
  }
  if (money.value <= 0) {
    window.alert("Please enter a valid amount to transfer!");
    window.location.href = "http://127.0.0.1:5500/";
  } else if (parseFloat(detailsGlobal[sk].credit) < parseFloat(money.value)) {
    console.log(parseFloat(detailsGlobal[sk].credit), money.value);
    window.alert("Insufficient Funds in account!");
    window.location.href = "http://127.0.0.1:5500/";
  } else if (
    parseFloat(money.value) > 0 &&
    parseFloat(detailsGlobal[sk].credit) >= money.value
  ) {
    console.log(detailsGlobal[sk].credit, money.value);
    transaction(sender.value, rec.value, money.value, sk, rk);
  }
}
//
// Transaction
function transaction(sender, rec, money, senderKey, recKey) {
  let userRef = firebase.database().ref("creditInfo");

  if (senderKey != null || recKey != null) {
    userRef.child(senderKey).update({
      credit: parseFloat(detailsGlobal[senderKey].credit) - parseFloat(money),
    });
    userRef.child(recKey).update({
      credit: parseFloat(detailsGlobal[recKey].credit) + parseFloat(money),
    });

    userRef = firebase.database().ref("TransactionDetails");
    var transData = {
      date: Date(),
      from: sender,
      to: rec,
      amount: money,
    };
    userRef.push(transData);
    window.alert("Transaction Successful!");
    window.location.href = "https://cbs29.000webhostapp.com/";
  }
}

function TxDetails() {
  var TxData = firebase.database();
  var Txref = TxData.ref("TransactionDetails");
  Txref.on("value", gotDataTx, errData);
  const transactionTable = document.getElementById("TranstableBody");
  function gotDataTx(data) {
    var details = data.val();
    var keys = Object.keys(details);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var tr = document.createElement("tr");
      var from = document.createElement("td");
      var to = document.createElement("td");
      var date = document.createElement("td");
      var amount = document.createElement("td");
      from.innerHTML = details[k].from;
      to.innerHTML = details[k].to;
      date.innerHTML = details[k].date.substring(0, 25);
      amount.innerHTML = details[k].amount;
      tr.appendChild(date);
      tr.appendChild(from);
      tr.appendChild(to);
      tr.appendChild(amount);
      if (tr != null) transactionTable.appendChild(tr);
    }
  }
}