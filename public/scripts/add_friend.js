add_friend = document.getElementById("add-friend")

add_friend.addEventListener("click",(el)=>{

    const sender = el.target.getAttribute("data-postid").toString().split("/")[0]
    const receiver = el.target.getAttribute("data-postid").toString().split("/")[1]
    console.log(receiver)
    const xhttp = new XMLHttpRequest()
    xhttp.open("POST","/add-friend")
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.onreadystatechange= ()=>{xhttp.readyState===4 && xhttp.status===200;location.reload()}

    xhttp.send(JSON.stringify({sender:sender,receiver:receiver}))
})