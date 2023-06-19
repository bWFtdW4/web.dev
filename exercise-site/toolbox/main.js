window.addEventListener("DOMContentLoaded", function() {
    const bitInput = document.getElementById("bit-input");
    const byteInput = document.getElementById("byte-input");
    const kilobitInput = this.document.getElementById("kilobit-input");
    const kilobyteInput = this.document.getElementById("kilobyte-input");
    
  
    bitInput.addEventListener("input", convertBit);
    byteInput.addEventListener("input", convertByte);
    kilobitInput.addEventListener("input", convertKilobit);
    kilobyteInput.addEventListener("input", convertKilobyte);
    
  
    function convertBit() {
        const bits = parseFloat(bitInput.value);
        const bytes = bits / 8;
        if (!isNaN(bytes)) {
            byteInput.value = bytes;
        } else {
            byteInput.value = "";
        }
    }
  
    function convertByte() {
        const bytes = parseFloat(byteInput.value);
        const bits = bytes * 8;
        if (!isNaN(bits)) {
            bitInput.value = bits;
        } else {
            bitInput.value = "";
        }
    }
    function convertKilobit() {
        const kilobits = parseFloat(kilobitInput.value);
        const kilobytes = kilobits / 8;
        if (!isNaN(kilobytes)) {
            kilobyteInput.value = kilobytes;
        } else {
            kilobyteInput.value = "";
        }
    }
  
    function convertKilobyte() {
        const kilobytes = parseFloat(kilobyteInput.value);
        const kilobits = kilobytes * 8;
        if (!isNaN(kilobits)) {
            kilobitInput.value = kilobits;
        } else {
            kilobitInput.value = "";
        }
    }

    

    		
  });
  
/*
console.log(window);
window.addEventListener("load", event => {
    const menuButtons = document.querySelectorAll("body > header > nav > button");
    menuButtons[0].templateAndSectionStyleClass = "preferences";
    menuButtons[1].templateAndSectionStyleClass = "recipe";

    for (const menuButton of menuButtons)
        menuButton.addEventListener("click", event => eventHandler(event.target));
    menuButtons[0].click();

    function eventHandler (clickedButton) {
        const centerArticle = document.querySelector("main > article.center");
        while(centerArticle.lastElementChild)
            centerArticle.lastElementChild.remove();

        const template = document.querySelector("template." + clickedButton.templateAndSectionStyleClass);
        const section = template.content.firstElementChild.cloneNode(true);
        centerArticle.append(section);
    }
});


window.addEventListener("DOMContentLoaded", function() {
  const bitInput = document.getElementById("bit-input");
  const byteInput = document.getElementById("byte-input");

  bitInput.addEventListener("input", convertBitToByte);
  byteInput.addEventListener("input", convertByteToBit);


});




*/