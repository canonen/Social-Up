const process_friend_request = async (op,target)=>{
    const target_id = target.toString().split("/")[0]
    const notif_id = target.toString().split("/")[1]

    await fetch("/process-friend-request", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({target_id:target_id,op:op,notif_id:notif_id})
    })
    .then(response => response.json())
    .then(data => {
        console.log('POST İşlemi Başarılı:', data);
    })
    .catch(error => {
        console.error('POST İşlemi Hatası:', error);
    });

}



const process = () =>{
    try{
        const accept = document.getElementsByClassName("accept")
        const reject = document.getElementsByClassName("reject")
    
        for(let i = 0;i<accept.length;i++){
            const el_accept = accept[i]
            const el_reject = reject[i]

    
            el_accept.addEventListener("click",(el)=>{
                console.log(el.target.getAttribute("data-postid"))
                
                process_friend_request("accepted",el.target.getAttribute("data-postid"))
            })
            el_reject.addEventListener("click",(el)=>{
                process_friend_request("rejected",el.target.getAttribute("data-postid"))
            })
        }
    }catch(er){
        console.log(er)
    }
}



const get_notif = async()=>{
    await fetch("/get-notifications").then(async(response)=>{
        const notifications = await response.json()
        document.getElementById("notification_count").innerHTML = notifications.length
        notifications.forEach(element => {
            if(element.content.toString() === "friendRequest" && element.status.toString() === "unread"){
                document.getElementById("notif-div").innerHTML += `<a class="dropdown-item" href="/profile?userId=${element.sender._id}"><strong>${element.sender.name} ${element.sender.surname}</strong> sent you a friend request.</a>`
                document.getElementById("notif-div").innerHTML += `<div style ="width:100%; display:flex; flex-direction:row; justify-content:space-around"><button class = "accept" data-postid = "${element.sender._id}/${element._id}">Kabul et</button> <button class = "reject" data-postid = "${element.sender._id}/${element._id}"> Reddet </button></div>`
                document.getElementById("notif-div").innerHTML += `<div style ="width:100%; margin-top:15px; height:5px; display:flex; flex-direction:row; align-items:center;" > <hr width="90%"></div>`

            }
            
        });
        process()
    })
    
}



get_notif()




