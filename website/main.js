const base_url = "BASE_URL"; // the server replaces this for us

const file_list = document.getElementById("file_list");
async function retrieveFileList() {
  try {
    const response = await fetch(base_url + "getFiles", {method: "GET"});
    const result = await response.json();
    result.forEach(name => {
      const element = document.createElement("li");
      element.innerText = name;

      const download_button = document.createElement("a");
      download_button.className = "download_button";
      download_button.innerText = "download";
      download_button.href = base_url + "getFile/" + name;
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
    const response = await fetch(base_url + "uploadFile", {
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
  const files_length = files.length;

  if (files_length < 1) {
    error.innerHTML = "no files being uploaded. add some to the input above";
    return;
  }
  for (let i = 0; i < files_length; i++) {
    error.innerHTML = "sending...";
    const formData = new FormData();
    formData.append("file", files[i]);
    upload(formData);
  }
});
