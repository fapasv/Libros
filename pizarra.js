class Pizarra extends HTMLElement {

    connectedCallback() {

        this.url = "https://localhost:44338/";

        this.accion = "<i class='fas fa-keyboard'></i>&nbsp;Digitar";
        this.innerHTML = `<div class="pizarra">
        <div class="pizarra--header">
        <h1 class="pizarra-titulo"></h1>
        </div>
            <div class="pizarra--body">
                <canvas data-id="0" class="border border-secondary" width="`+ this.getAttribute("width") + `" height="` + this.getAttribute("height") + `"></canvas>
                <textarea class="form-control" id="tbArea" rows="3" style="width:`+ this.getAttribute("width") + `px; display:none"></textarea>
            </div>            
        
            <div class="pizarra--footer">
                <div class="pizarra--actions">
                    <div class="btn-toolbar mb-3" role="toolbar">
                        <div class="btn-group me-2" role="group">
                            
                            <button type="button" class="btn  btn-sm btn-outline-primary" data-action="change-color"><i class="fas fa-palette"></i>&nbsp;Cambiar color</button>
                            <button type="button" class="btn  btn-sm btn-outline-secondary" title="Deshacer" data-toggle="tooltip" data-action="undo"><i class="fas fa-undo"></i></button>
                            <button type="button" class="btn  btn-sm btn-outline-danger" title="Limpiar" data-toggle="tooltip" data-action="clear"><i class="fas fa-broom"></i></button>
                            
                        </div>
                        <div class="btn-group me-3" role="group">
                            <button type="button" class="btn btn-sm btn-outline-success" data-action="save-data"><i class="fas fa-save"></i>&nbsp;Guardar</button>
                            
                        </div>
                        <div class="btn-group me-4" role="group">
                            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="change">`+ this.accion + `</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        this.canvas = this.querySelector("canvas");

        this.clearButton = this.querySelector("[data-action=clear]");
        this.undoButton = this.querySelector("[data-action=undo]");
        this.changeColorButton = this.querySelector("[data-action=change-color]");
        this.saveButton = this.querySelector("[data-action=save-data]");

        this.pizarra = ""
        this.initCanvas();

        this.saveButton.addEventListener("click", this.guardarData.bind(this));

        this.clearButton.addEventListener("click", this.limpiarCanvas.bind(this));

        this.undoButton.addEventListener("click", this.deshacerTrazo.bind(this));

        this.changeColorButton.addEventListener("click", this.cambiaColor.bind(this));

        window.addEventListener('resize', this.reziseCanvas.bind(this));
    }

    guardarData() {

        var usuario = this.getAttribute("usuario");
        var ejercicio = this.getAttribute("ejercicio");

        var data = this.pizarra.toData();
        if (data) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", this.url + "api/Ejercicio/" + ejercicio);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    console.log(data);
                }
            };

            xhr.send();
        }
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
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.url + "api/Ejercicio/ejercicios_usuario?id=" + ejercicio + "&userId=" + usuario);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var json = JSON.parse(xhr.responseText);
                console.log(json);
                titulo.innerHTML = json.enunciado;

                if (json.respuestas.lenght > 0) {
                    let data = json.respuestas[0];
                    p.fromData(data.valor);
                    c.setAttribute('data-id', data.id);
                }
            }
        };

        xhr.send();


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

    cambiaColor() {
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        var color = "rgb(" + r + "," + g + "," + b + ")";

        this.pizarra.penColor = color;
    }

    deshacerTrazo() {
        var data = this.pizarra.toData();

        if (data) {
            data.pop(); // remove the last dot or line
            this.pizarra.fromData(data);
        }
    }
  }
  guardarCanvas() {
    var libro = this.getAttribute("libro");
    var usuario = this.getAttribute("usuario");
    var ejercicio = this.getAttribute("ejercicio");

    var data = this.signaturePad.toData();
    if (data) {
      alert(libro + " " + usuario + " " + ejercicio);
      alert(data);
    }
  }

  limpiarCanvas() {
    this.signaturePad.clear();
  }

  resizeCanvas() {
    alert("puto");
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.width = this.canvas.offsetWidth * ratio;
    this.canvas.height = this.canvas.offsetHeight * ratio;
    this.canvas.getContext("2d").scale(ratio, ratio);

    disconnectedCallback() {
        this.clearButton.removeEventListener("click", this);
        this.undoButton.removeEventListener("click", this);
        this.changeColorButton.removeEventListener("click", this);
        this.saveButton.removeEventListener("click", this);
    }
}
customElements.define('fa-pizarra', Pizarra);
