class Pizarra extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <div class="signature-pad">
        <div class="signature-pad--body ">
                <canvas width="700"></canvas>
            </div>
        
            <div class="signature-pad--footer">

                <div class="signature-pad--actions">
                    <div>
                        <button type="button" class="btn clear" data-action="clear">Limpiar</button>
                        <button type="button" class="btn" data-action="change-color">Cambiar color</button>
                        <button type="button" class="btn" data-action="undo">Deshacer</button>
                    </div>
                    <div>
                        <button type="button" class="btn save" data-action="save-data">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
        `;

    }
    connectedCallback() {
        var clearButton = this.shadowRoot.querySelector("[data-action=clear]");
        var undoButton = this.shadowRoot.querySelector("[data-action=undo]");
        var changeColorButton = this.shadowRoot.querySelector("[data-action=change-color]");
        var saveButton = this.shadowRoot.querySelector("[data-action=save-data]");

        var canvas = this.shadowRoot.querySelector("canvas");
        var signaturePad = new SignaturePad(canvas);

        saveButton.addEventListener("click", function (event) {
            var data = signaturePad.toData();

            if (data) {
                alert(data);
            }
        });
        clearButton.addEventListener("click", function (event) {
            signaturePad.clear();
        });

        undoButton.addEventListener("click", function (event) {
            var data = signaturePad.toData();

            if (data) {
                data.pop(); // remove the last dot or line
                signaturePad.fromData(data);
            }
        });

        changeColorButton.addEventListener("click", function (event) {
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var color = "rgb(" + r + "," + g + "," + b + ")";

            signaturePad.penColor = color;
        });
    }

    disconnectedCallback() {
    this.shadowRoot.querySelector("[data-action=clear]").removeEventListener('click', this);
    this.shadowRoot.querySelector("[data-action=undo]").removeEventListener('click', this);
    this.shadowRoot.querySelector("[data-action=change-color]").removeEventListener('click', this);
    this.shadowRoot.querySelector("[data-action=save-data]").removeEventListener('click', this);
}
   
}
customElements.define('fa-pizarra',Pizarra);