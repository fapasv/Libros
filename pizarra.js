class Pizarra extends HTMLElement {

    connectedCallback() {
        this.xhr = new XMLHttpRequest();
        this.url = "https://localhost:44338/";


        this.innerHTML = `<div class="pizarra">
        <div class="pizarra--header">
            <h1 class="pizarra-titulo"></h1>
        </div>
        <div class="pizarra--body">
            <canvas data-idusuario="" data-idejercicio="" class="border border-secondary" width="`+ this.getAttribute("width") + `" height="` + this.getAttribute(" height") + `"></canvas>
        </div>
        <div class="pizarra--footer">
            <div class="pizarra--actions">
                <div class="btn-toolbar mb-3" role="toolbar">
                    <div class="btn-group me-2" role="group">
                        <input type="color" class="form-control form-control-sm form-control-color"
                            data-action="change-color" id="ColorInput" value="#000000" title="Cambiar color">
                    </div>

                    <div class="btn-group me-2" role="group">
                        <button type="button" class="btn  btn-sm btn-outline-secondary" title="Deshacer"
                            data-toggle="tooltip" data-action="undo"><i class="fas fa-undo"></i></button>
                        <button type="button" class="btn  btn-sm btn-outline-danger" title="Limpiar"
                            data-toggle="tooltip" data-action="clear"><i class="fas fa-broom"></i></button>

                    </div>

                    <div class="btn-group me-2" role="group">
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon1"><i class='fas fa-keyboard'></i></span>
                            <input type="text" class="form-control" placeholder="Escriba acá" aria-label="anotacion" 
                            aria-describedby="basic-addon1" data-action="write">
                        </div> 
                    </div>

                    <div class="btn-group me-2" role="group">
                        <button type="button" class="btn btn-sm btn-outline-success" data-action="save-data">
                            <i class="fas fa-save"></i>&nbsp;Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

        this.canvas = this.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');

        this.clearButton = this.querySelector("[data-action=clear]");
        this.undoButton = this.querySelector("[data-action=undo]");
        this.changeColorButton = this.querySelector("[data-action=change-color]");
        this.textField = this.querySelector("[data-action=write]");
        this.saveButton = this.querySelector("[data-action=save-data]");

        this.pizarra = ""
        this.initCanvas();

        this.saveButton.addEventListener("click", this.guardarData.bind(this));

        this.clearButton.addEventListener("click", this.limpiarCanvas.bind(this));

        this.undoButton.addEventListener("click", this.deshacerTrazo.bind(this));

        this.changeColorButton.addEventListener("input", this.cambiaColor.bind(this));

        this.textField.addEventListener('keyup', this.agregarTexto.bind(this));

        window.addEventListener('resize', this.reziseCanvas.bind(this));
    }

    guardarData() {

        var usuario = this.getAttribute("usuario");
        var ejercicio = this.getAttribute("ejercicio");
        var base = this;
        var data = this.pizarra.toDataURL();

        if (data) {
            this.xhr.open("GET", this.url + "api/Respuesta/ejercicio_usuario?idEjercicio=" + ejercicio + "&idUsuario=" + usuario);
            this.xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    var json = JSON.parse(this.responseText);
                    console.log(json);
                    if (Array.isArray(json) && json.length > 0) {
                        base.editarData(ejercicio, usuario, data);
                    } else {
                        console.log("nueva");
                        base.nuevaData(ejercicio, usuario, data);
                    }
                }
            };
            this.xhr.send();
        }
    }

    nuevaData(idej, idusr, data) {
        this.xhr.open("POST", this.url + "api/Respuesta");
        this.xhr.setRequestHeader("Content-Type", "application/json");
        this.xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                //console.log(this.status);
                //console.log(this.responseText);
                alert("Guardado");
            }
        };

        console.log(data);


        var req = '{"idEjercicio": ' + idej + ', "idUsuario": ' + idusr + ', "valor":"' + data + '"}'
        this.xhr.send(req);
    }

    editarData(idej, idusr, data) {
        this.xhr.open("PUT", this.url + "api/Respuesta?idEjercicio=" + idej + "&idUsuario=" + idusr);
        this.xhr.setRequestHeader("Content-Type", "application/json");
        this.xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                console.log(this.status);
                console.log(this.responseText);
                alert("Actualizado");
            }
        };


        var req = '{"idEjercicio": ' + idej + ', "idUsuario": ' + idusr + ', "valor":"' + data + '"}'
        this.xhr.send(req);
    }

    limpiarCanvas() {
        this.pizarra.clear();
    }

    initCanvas() {
        var usuario = this.getAttribute("usuario");
        var ejercicio = this.getAttribute("ejercicio");
        var titulo = this.querySelector(".pizarra-titulo");
        this.pizarra = new SignaturePad(this.canvas);
        this.reziseCanvas();
        var c = this.canvas;
        var p = this.pizarra;

        this.xhr.open("GET", this.url + "api/Ejercicio/ejercicios_usuario?id=" + ejercicio + "&userId=" + usuario);

        this.xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                var json = JSON.parse(this.responseText);
                titulo.innerHTML = json.enunciado;

                if (Array.isArray(json.respuestas) && json.respuestas.length > 0) {

                    let data = json.respuestas[0];
                    p.fromDataURL(data.valor);
                    c.setAttribute('data-idusuario', data.idUsuario);
                }
            }
        };

        this.xhr.send();
    }

    reziseCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio = Math.max(window.devicePixelRatio || 1, 1);

        // This part causes the canvas to be cleared
        this.canvas.width = this.canvas.offsetWidth * ratio;
        this.canvas.height = this.canvas.offsetHeight * ratio;
        this.canvas.getContext("2d").scale(ratio, ratio);

        // This library does not listen for canvas changes, so after the canvas is automatically
        // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
        // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
        // that the state of this library is consistent with visual state of the canvas, you
        // have to clear it manually.
        this.pizarra.clear();
    }

    cambiaColor(event) {
        var color = event.target.value;
        this.pizarra.penColor = color;
    }

    deshacerTrazo() {
        var data = this.pizarra.toData();

        if (data) {
            data.pop(); // remove the last dot or line
            this.pizarra.fromData(data);
        }
    }

    agregarTexto() {
        //this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


        this.ctx.fillStyle = this.changeColorButton.value;
        this.ctx.font = '16px sans-serif';


        this.wrapText(10, 30);
    }


    wrapText(x, y) {


        var context = this.ctx;
        var text = this.textField.value;

        var words = text.split(' ');

        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > this.getAttribute("width") && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += 25;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);

    }



    disconnectedCallback() {
        this.clearButton.removeEventListener("click", this);
        this.undoButton.removeEventListener("click", this);
        this.changeColorButton.removeEventListener("click", this);
        this.saveButton.removeEventListener("click", this);
    }
}
customElements.define('fa-pizarra', Pizarra);