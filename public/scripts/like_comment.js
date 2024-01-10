comments_like = document.getElementsByClassName("comment_like")
const likedComments = new Set();

function likeComment(like_count,comment_id){
    if(like_count.style.color !== "red"){
        var xhttp = new XMLHttpRequest()
        xhttp.open("POST","/like-comment")
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({comment_id:comment_id}))

        like_count.innerHTML = parseInt(like_count.innerHTML)+1
        like_count.style.color = "red"
    }
    else{
        var xhttp = new XMLHttpRequest()
        xhttp.open("DELETE","/like-comment")
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({comment_id:comment_id}))

        like_count.innerHTML = parseInt(like_count.innerHTML)-1
        like_count.style.color = "black"

    }
}

for (let i = 0; i < comments_like.length; i++) {
    const element = comments_like[i];

    element.addEventListener("click", () => {
        
        const comment_id = element.getAttribute("data-postid");
        const parentDiv = element.closest("div");
        const like_count = parentDiv.querySelector("#comment_like_count");


        likeComment(like_count,comment_id)
    });
}