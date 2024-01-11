comment_list = document.getElementsByClassName("deleteComment")

for(let i=0;i<comment_list.length;i++){
    const element = comment_list[i]
    element.addEventListener("click",(el)=>{
        const commentId = el.target.getAttribute("data-postid")

        var xhttp = new XMLHttpRequest()
        xhttp.open("DELETE","/delete-comment")
        xhttp.onreadystatechange= ()=>{xhttp.readyState===4 && xhttp.status===200;location.reload()}
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({commentId:commentId}))
    })
}