from flask import Flask, request, Response;
from werkzeug.datastructures import Headers;
from pydub import AudioSegment;
from pathlib import Path;
import os, json;

with open("config.json") as configfile:
    config = json.loads(configfile.read());
    configfile.close();

    host = config.get("host");
    port = config.get("port");
    base_url = f"http://{host}:{port}/";

def fileExists(path):
    return Path(path).exists();

app = Flask("music_hosting");

with open("website/index.html") as f:
    indexhtml = f.read();
    f.close();

@app.route("/")
def route_():
    return indexhtml;

@app.route("/website/<filename>")
def route_website(filename):
    try:
        with open(f"website/{filename}") as f:
            contents = f.read();
            f.close();
            return contents.replace("BASE_URL", base_url);
    except Exception as e:
        return "error: " + str(e);

@app.route("/getFile/<filename>")
def route_getFile(filename):
    try:
        headers = Headers();
        headers.add("Content-Type", "text/plain");
        headers.add("Content-Disposition", "attachment", filename=filename);
        response = Response(headers = headers);
        with open(f"storage/{filename}", "rb") as f:
            contents = f.read();
            f.close();
            response.data = contents;
        return response;

    except Exception as e:
        return '{"success: false, "error": "' + str(e) + '"}';
    return '{"success": true}';

@app.route("/getFiles")
def route_getFiles():
    return str(os.listdir("storage")).replace("'", '"');

def removeExtensionFromFileName(filename):
    return filename.split(".")[0];

@app.route("/uploadFile", methods = ["POST"])
def route_uploadFile():
    files = request.files;
    if len(files) < 1:
        return '{"success": false, "error": "no files retrieved"}';

    for key in files:
        file = files.get(key);
        output_path = f"storage/{file.filename}";
        if fileExists(output_path):
            return '{"success": false, "error": "file already exists"}';

        with open(output_path, "wb") as output:
            output.write(file.read());
            output.close();
        AudioSegment.from_file(output_path).export(removeExtensionFromFileName(output_path) + ".mp3", format="mp3");
    return '{"success": true}';

app.run(host, port);
