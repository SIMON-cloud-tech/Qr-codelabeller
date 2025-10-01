document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("labelForm");
  const preview = document.getElementById("labelPreview");
  const logoToggle = document.getElementById("logoToggle");
  const logoUploadSection = document.getElementById("logoUploadSection");
  const companyLogoInput = document.getElementById("companyLogo");
  const exportBtn = document.querySelector(".export-btn");

  let logoDataURL = "";

  logoToggle.addEventListener("change", () => {
    logoUploadSection.style.display = logoToggle.checked ? "block" : "none";
  });

  companyLogoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        logoDataURL = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("chemicalName").value;
    const hazard = document.getElementById("hazardClass").value;
    const concentration = document.getElementById("concentration").value;
    const barcode = document.getElementById("barcode").value || "AUTO123456";

    preview.innerHTML = `
      <div style="text-align:center;">
        ${logoDataURL ? `<img src="${logoDataURL}" style="width:100px;opacity:0.2;position:absolute;top:10px;right:10px;" />` : ""}
        <h2>${name}</h2>
        <p><strong>Hazard Class:</strong> ${hazard}</p>
        <p><strong>Concentration:</strong> ${concentration}%</p>
        <p><strong>Barcode:</strong> ${barcode}</p>
        <div style="margin-top:20px;">
          <svg id="barcodeSVG"></svg>
        </div>
      </div>
    `;

    generateBarcode(barcode);
  });

  exportBtn.addEventListener("click", () => {
    const opt = {
      margin: 0.5,
      filename: 'chemical-label.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(preview).save();
  });

  function generateBarcode(text) {
    const svg = document.getElementById("barcodeSVG");
    svg.innerHTML = "";

    // Simple barcode simulation
    for (let i = 0; i < text.length; i++) {
      const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bar.setAttribute("x", i * 4);
      bar.setAttribute("y", 0);
      bar.setAttribute("width", "2");
      bar.setAttribute("height", "40");
      bar.setAttribute("fill", i % 2 === 0 ? "#000" : "#ccc");
      svg.appendChild(bar);
    }
    svg.setAttribute("width", text.length * 4);
    svg.setAttribute("height", "40");
  }
});

//Then update your barcode generation function:
function generateBarcode(text) {
  const svg = document.getElementById("barcodeSVG");
  JsBarcode(svg, text, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 40,
    displayValue: true
  });
}
