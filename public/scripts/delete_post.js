post_list = document.getElementsByClassName("deletePost")

for(let i=0;i<post_list.length;i++){
    const element = post_list[i]
    element.addEventListener("click",(el)=>{
        const postId = el.target.getAttribute("data-postid")
        console.log(postId)
        var xhttp = new XMLHttpRequest()
        xhttp.open("DELETE","/delete-post")
        xhttp.onreadystatechange= ()=>{xhttp.readyState===4 && xhttp.status===200;location.reload()}
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({postId:postId}))
    })
}