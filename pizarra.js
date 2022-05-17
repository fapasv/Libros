class Pizarra extends HTMLElement {
  constructor() {
    super();

    this.accion = "<i class='fas fa-keyboard'></i>&nbsp;Digitar";
    this.innerHTML =
      `<div class="signature-pad">
            <div class="signature-pad--body">
                <canvas class="border border-secondary"></canvas>
                <textarea class="form-control" id="tbArea" rows="3" style="width:` +
      this.getAttribute("width") +
      `px; display:none"></textarea>
            </div>            
        
            <div class="signature-pad--footer">
                <div class="signature-pad--actions">
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
                            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="change">` +
      this.accion +
      `</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    //
  }
  connectedCallback() {
    this.canvas = this.querySelector("canvas");
    this.signaturePad = new SignaturePad(this.canvas);

    

    this.clearButton = this.querySelector("[data-action=clear]");
    this.undoButton = this.querySelector("[data-action=undo]");
    this.changeColorButton = this.querySelector("[data-action=change-color]");
    this.saveButton = this.querySelector("[data-action=save-data]");

    this.saveButton.addEventListener("click", this.guardarCanvas.bind(this));

    this.clearButton.addEventListener("click", this.limpiarCanvas.bind(this));

    this.undoButton.addEventListener("click", this.deshacerEnCanvas.bind(this));

    this.changeColorButton.addEventListener(
      "click",
      this.colorearCanvas.bind(this)
    );

    window.addEventListener("resize", this.resizeCanvas.bind(this));
  }

  colorearCanvas() {
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    var color = "rgb(" + r + "," + g + "," + b + ")";

    this.signaturePad.penColor = color;
  }
  deshacerEnCanvas() {
    var data = this.signaturePad.toData();

    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
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

    this.signaturePad.clear();
  }

  disconnectedCallback() {
    this.clearButton.removeEventListener("click", this.limpiarCanvas);
    this.undoButton.removeEventListener("click", this.deshacerEnCanvas);
    this.changeColorButton.removeEventListener("click", this.colorearCanvas);
    this.saveButton.removeEventListener("click", this.guardarCanvas);
    signaturePad.off();
  }
}
customElements.define("fa-pizarra", Pizarra);
