// =====================================================
// QR CODE GENERATOR + SCANNER
// =====================================================


// ================= ELEMENTS =================

const qrType = document.getElementById("qrType");
const qrText = document.getElementById("qrText");
const inputLabel = document.getElementById("inputLabel");

const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

const qrcodeContainer = document.getElementById("qrcode");
const qrResult = document.getElementById("qrResult");

const logoUpload = document.getElementById("logoUpload");
const logoPreview = document.getElementById("logoPreview");
const previewImage = document.getElementById("previewImage");
const removeLogo = document.getElementById("removeLogo");
const qrLogo = document.getElementById("qrLogo");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const scanResult = document.getElementById("scanResult");
const resultText = document.getElementById("resultText");

const copyResult = document.getElementById("copyResult");
const openResult = document.getElementById("openResult");


// ================= VARIABLES =================

let uploadedLogo = "";
let scanner = null;
let scannerRunning = false;
let lastScannedText = "";


// =====================================================
// QR TYPE CHANGE
// =====================================================

qrType.addEventListener("change", function () {

    const type = this.value;

    if (type === "text") {

        inputLabel.textContent = "Enter Text";

        qrText.placeholder =
            "Enter any text...";

    }

    else if (type === "url") {

        inputLabel.textContent =
            "Enter Website URL";

        qrText.placeholder =
            "https://example.com";

    }
    else if (type === "Whatsapp") {

        inputLabel.textContent = "Enter Whatsapp Number"; 
        qrText.placeholder = "+8801712345678";

    }
    else if (type === "phone") {

        inputLabel.textContent =
            "Enter Phone Number";

        qrText.placeholder =
            "+8801712345678";

    }

    else if (type === "bkash") {

        inputLabel.textContent =
            "Enter bKash Number";

        qrText.placeholder =
            "01712345678";

    }

    else if (type === "nagad") {

        inputLabel.textContent =
            "Enter Nagad Number";

        qrText.placeholder =
            "01712345678";

    }

    else if (type === "rocket") {

        inputLabel.textContent =
            "Enter Rocket Number";

        qrText.placeholder =
            "01712345678";

    }

});


// =====================================================
// LOGO UPLOAD
// =====================================================

logoUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }


    // Check image
    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        logoUpload.value = "";

        return;
    }


    const reader = new FileReader();


    reader.onload = function (event) {

        uploadedLogo = event.target.result;

        // Preview
        previewImage.src = uploadedLogo;

        logoPreview.style.display = "block";

    };


    reader.readAsDataURL(file);

});


// =====================================================
// REMOVE LOGO
// =====================================================

removeLogo.addEventListener("click", function () {

    uploadedLogo = "";

    logoUpload.value = "";

    previewImage.src = "";

    qrLogo.src = "";

    qrLogo.style.display = "none";

    logoPreview.style.display = "none";

});


// =====================================================
// CREATE QR DATA
// =====================================================

function createQRData(type, value) {

    value = value.trim();
    if (!value) {
        return "";

    }


    // ================= TEXT =================

    if (type === "text") {

        return value;

    }


    // ================= URL =================

    if (type === "url") {

        if (
            !value.startsWith("http://") &&
            !value.startsWith("https://")
        ) {

            value = "https://" + value;

        }

        return value;

    }

    // ================= Whatsapp =============
   
    // ================= WHATSAPP =================

    if (type === "Whatsapp") {

        let cleanNumber = value.replace(/\D/g, "");

        // Convert Bangladesh local number
        if (cleanNumber.startsWith("0")) {
            cleanNumber = "88" + cleanNumber;
        }

        return "https://wa.me/" + cleanNumber;

    }

    // ================= PHONE =================

    if (type === "phone") {

        return "tel:" + value;

    }


    // ================= BKASH =================

    if (type === "bkash") {

        return "bKash Number: " + value;

    }


    // ================= NAGAD =================

    if (type === "nagad") {

        return "Nagad Number: " + value;

    }


    // ================= ROCKET =================

    if (type === "rocket") {

        return "Rocket Number: " + value;

    }


    return value;

}


// =====================================================
// GENERATE QR
// =====================================================

generateBtn.addEventListener("click", function () {

    const type = qrType.value;

    const value = qrText.value.trim();


    if (!value) {

        alert("Please enter a value.");

        qrText.focus();

        return;

    }


    // Validate URL
    if (type === "url") {

        let testURL = value;

        if (
            !testURL.startsWith("http://") &&
            !testURL.startsWith("https://")
        ) {

            testURL = "https://" + testURL;

        }


        try {

            new URL(testURL);

        }

        catch (error) {

            alert("Please enter a valid website URL.");

            return;

        }

    }




    // Validate mobile numbers
    if (
        type === "phone" ||
        type === "Whatsapp"||
        type === "bkash" ||
        type === "nagad" ||
        type === "rocket"
    ) {

        const cleanNumber =
            value.replace(/[\s-]/g, "");


        const numberPattern =
            /^(\+?880|0)1[3-9]\d{8}$/;


        if (!numberPattern.test(cleanNumber)) {

            alert(
                "Please enter a valid Bangladesh mobile number.\nExample: 01712345678"
            );

            return;

        }

    }


    const qrData =
        createQRData(type, value);


    // Clear previous QR
    qrcodeContainer.innerHTML = "";


    // Create QR
    new QRCode(qrcodeContainer, {

        text: qrData,

        width: 220,

        height: 220,

        colorDark: "#000000",

        colorLight: "#ffffff",

        correctLevel: QRCode.CorrectLevel.H

    });


    // Show result
    qrResult.style.display = "block";


    // Show logo
    if (uploadedLogo) {

        qrLogo.src = uploadedLogo;

        qrLogo.style.display = "block";

    }

    else {

        qrLogo.src = "";

        qrLogo.style.display = "none";

    }

});


// =====================================================
// DOWNLOAD QR WITH LOGO
// =====================================================

downloadBtn.addEventListener("click", function () {

    const qrCanvas =
        qrcodeContainer.querySelector("canvas");


    const qrImage =
        qrcodeContainer.querySelector("img");


    if (!qrCanvas && !qrImage) {

        alert("Please generate a QR code first.");

        return;

    }


    const size = 220;


    // Create final canvas
    const finalCanvas =
        document.createElement("canvas");

    finalCanvas.width = size;
    finalCanvas.height = size;


    const ctx =
        finalCanvas.getContext("2d");


    // White background
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        0,
        0,
        size,
        size
    );


    // Function to draw QR
    function drawQR(source) {

        ctx.drawImage(
            source,
            0,
            0,
            size,
            size
        );


        // Draw logo if exists
        if (uploadedLogo) {

            const logo =
                new Image();

            logo.onload = function () {

                drawLogo(logo);

            };

            logo.src = uploadedLogo;

        }

        else {

            downloadImage();

        }

    }


    // Draw logo
    function drawLogo(logo) {

        const logoSize = 52;

        const logoX =
            (size - logoSize) / 2;

        const logoY =
            (size - logoSize) / 2;


        // White logo background
        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            logoX - 6,
            logoY - 6,
            logoSize + 12,
            logoSize + 12
        );


        // Logo
        ctx.drawImage(
            logo,
            logoX,
            logoY,
            logoSize,
            logoSize
        );


        downloadImage();

    }


    // Download final image
    function downloadImage() {

        const link =
            document.createElement("a");

        link.download =
            "qr-code.png";

        link.href =
            finalCanvas.toDataURL("image/png");

        link.click();

    }


    // Draw QR
    if (qrCanvas) {

        drawQR(qrCanvas);

    }

    else if (qrImage) {

        const image =
            new Image();

        image.onload = function () {

            drawQR(image);

        };

        image.src = qrImage.src;

    }

});


// =====================================================
// TABS
// =====================================================

tabButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const target =
            this.getAttribute("data-tab");


        // Active button
        tabButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        this.classList.add("active");


        // Active content
        tabContents.forEach(function (content) {

            content.classList.remove("active");

        });


        document
            .getElementById(target)
            .classList.add("active");


        // Start scanner
        if (target === "scanner") {

            startScanner();

        }

        else {

            stopScanner();

        }

    });

});


// =====================================================
// START SCANNER
// =====================================================

function startScanner() {

    if (scannerRunning) {

        return;

    }


    scanner =
        new Html5Qrcode("reader");


    const config = {

        fps: 10,

        qrbox: {
            width: 250,
            height: 250
        }

    };


    scanner
        .start(

            {
                facingMode: "environment"
            },

            config,

            onScanSuccess,

            onScanError

        )

        .then(function () {

            scannerRunning = true;

        })

        .catch(function (error) {

            console.error(
                "Camera error:",
                error
            );

            alert(
                "Camera could not start. Please allow camera permission and use Live Server or localhost."
            );

        });

}


// =====================================================
// SCAN SUCCESS
// =====================================================

function onScanSuccess(decodedText) {

    if (!decodedText) {

        return;

    }


    // Avoid repeated results
    if (decodedText === lastScannedText) {

        return;

    }


    lastScannedText =
        decodedText;


    resultText.textContent =
        decodedText;


    scanResult.style.display =
        "block";


    // Open button
    if (isValidURL(decodedText)) {

        openResult.style.display =
            "block";

    }

    else {

        openResult.style.display =
            "none";

    }

}


// =====================================================
// SCAN ERROR
// =====================================================

function onScanError(errorMessage) {

    // Ignore continuous scanner errors
    // They happen when no QR is visible.

}


// =====================================================
// STOP SCANNER
// =====================================================

function stopScanner() {

    if (!scanner || !scannerRunning) {

        return;

    }


    scanner
        .stop()

        .then(function () {

            scanner.clear();

            scannerRunning = false;

        })

        .catch(function (error) {

            console.error(
                "Scanner stop error:",
                error
            );

            scannerRunning = false;

        });

}


// =====================================================
// CHECK URL
// =====================================================

function isValidURL(value) {

    try {

        const url =
            new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    }

    catch (error) {

        return false;

    }

}


// =====================================================
// COPY RESULT
// =====================================================

copyResult.addEventListener("click", function () {

    if (!lastScannedText) {

        return;

    }


    navigator.clipboard
        .writeText(lastScannedText)

        .then(function () {

            copyResult.textContent =
                "✅ Copied!";


            setTimeout(function () {

                copyResult.textContent =
                    "📋 Copy";

            }, 1500);

        })

        .catch(function () {

            alert(
                "Could not copy the result."
            );

        });

});


// =====================================================
// OPEN RESULT
// =====================================================

openResult.addEventListener("click", function () {

    if (!lastScannedText) {

        return;

    }


    if (isValidURL(lastScannedText)) {

        window.open(
            lastScannedText,
            "_blank"
        );

    }

});