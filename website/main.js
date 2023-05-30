const file_list = document.getElementById("file_list");
async function retrieveFileList() {
  try {
    const response = await fetch("http://192.168.2.38:4112/getFiles", {method: "GET"});
    const result = await response.json();
    result.forEach(name => {
      const element = document.createElement("li");
      element.innerText = name;

      const download_button = document.createElement("a");
      download_button.className = "download_button";
      download_button.innerText = "download";
      download_button.href = "http://192.168.2.38:4112/getFile/" + name;
      element.appendChild(download_button);

      file_list.appendChild(element);

    });
  } catch (error) {
    console.error("Failed to retrieve file list: " + error.toString());
  }
}
retrieveFileList();

const error = document.getElementById("error");

async function upload(formData) {
  try {
    const response = await fetch("http://192.168.2.38:4112/uploadFile", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result["success"] == true) {
      error.innerHTML = "success!";
    } else {
      error.innerHTML = "error: " + result["error"];
    }
  } catch (error) {
    error.innerHTML = "error: " + error.toString();
  }
}

const upload_input = document.getElementById("upload_input");
const upload_button = document.getElementById("upload");

upload_button.addEventListener("click", () => {
  const files = document.getElementById("upload_input").files;
  for (let i = 0; i < files.length; i++) {
    error.innerHTML = "sending...";
    const formData = new FormData();
    formData.append("file", files[i]);
    upload(formData);
  }
});
