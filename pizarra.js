class Pizarra extends HTMLElement {
    
    connectedCallback() {
        this.accion ="<i class='fas fa-keyboard'></i>&nbsp;Digitar";
        this.innerHTML = `<div class="signature-pad">
            <div class="signature-pad--body">
                <canvas class="border border-secondary" width="`+this.getAttribute("width")+`" height="`+this.getAttribute("height")+`"></canvas>
                <textarea class="form-control" id="tbArea" rows="3" style="width:`+this.getAttribute("width")+`px; display:none"></textarea>
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
                            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="change">`+this.accion+`</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        var libro =this.getAttribute("libro");
        var usuario =this.getAttribute("usuario");
        var ejercicio =this.getAttribute("ejercicio");
        
        this.clearButton = this.querySelector("[data-action=clear]");
        this.undoButton = this.querySelector("[data-action=undo]");
        this.changeColorButton = this.querySelector("[data-action=change-color]");
        this.saveButton = this.querySelector("[data-action=save-data]");

        var canvas = this.querySelector("canvas");
        var signaturePad = new SignaturePad(canvas);

        this.saveButton.addEventListener("click", function (event) {
            var data = signaturePad.toData();

            if (data) {
                alert(libro+" "+usuario+" "+ejercicio);
                alert(data);
            }
        });

        this.clearButton.addEventListener("click", function (event) {
            signaturePad.clear();
        });

        this.undoButton.addEventListener("click", function (event) {
            var data = signaturePad.toData();

            if (data) {
                data.pop(); // remove the last dot or line
                signaturePad.fromData(data);
            }
        });

        this.changeColorButton.addEventListener("click", function (event) {
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var color = "rgb(" + r + "," + g + "," + b + ")";

            signaturePad.penColor = color;
        });
    }

    disconnectedCallback() {
        this.clearButton.removeEventListener("click", this);
        this.undoButton.removeEventListener("click", this);
        this.changeColorButton.removeEventListener("click", this);
        this.saveButton.removeEventListener("click", this);
      }

   
   
}
customElements.define('fa-pizarra',Pizarra);