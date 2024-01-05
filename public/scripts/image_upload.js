document.getElementById("editProfile").addEventListener("click", function() {
    handleImageEdit("profileImage");
  });

document.getElementById("editBackground").addEventListener("click", function() {
    handleImageEdit("backgroundImage");
});

function handleImageEdit(imageId) {
    const fileInput = document.getElementById("fileInput");

    fileInput.addEventListener("change", function(event) {
      const file = event.target.files[0];

      if (file) {
        const formData = new FormData();
        formData.append("image",file)

        const xhttp = new XMLHttpRequest()
        xhttp.open("POST","/avatar-upload")
        xhttp.onreadystatechange= ()=>{xhttp.readyState===4 && xhttp.status===200;location.reload()}

        xhttp.send(formData)
      }
    });

    fileInput.click();
}