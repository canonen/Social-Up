function makeComment(comment,post_id){
    var xhttp = new XMLHttpRequest()
    
    
    xhttp.open("POST","/post-comment")
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.onreadystatechange= ()=>{xhttp.readyState===4 && xhttp.status===200;location.reload()}
    xhttp.send(JSON.stringify({comment:comment,post_id:post_id}))
}

const comment_buttons = document.getElementsByClassName("comment_button");

// HTMLCollection üzerinde döngü ile elemanlara eriş
for (let i = 0; i < comment_buttons.length; i++) {
    const element = comment_buttons[i];

    element.addEventListener("click", () => {
        
        const post_id = element.getAttribute("data-postid");
        const parentDiv = element.closest("div");
        const comment = parentDiv.querySelector("#comment").value;

        makeComment(comment,post_id)
    });
}
