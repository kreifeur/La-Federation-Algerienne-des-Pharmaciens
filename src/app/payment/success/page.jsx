"use client";
import { useEffect, useState, Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function RegisterSuccessContent() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mdOrder, setMdOrder] = useState(null);

  const [userEmail, setUserEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const nowDate = new Date();
  const now = nowDate.toLocaleDateString("en-GB").replace(/\//g, "-");
  const fullDate = nowDate.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (!id) {
      setError("Aucun identifiant de transaction trouvé");
      setLoading(false);
      return;
    }
    setMdOrder(id);
    confirmPayment(id);
  }, [searchParams]);

  const confirmPayment = async (id) => {
    try {
      const res = await fetch(`/api/confirmation?mdOrder=${id}`);
      const data = await res.json();

      if (data.ErrorCode === "0") {
        setStatus(data);
      } else {
        setError(data.ErrorMessage || "Paiement échoué");
      }
    } catch (e) {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceData = () => ({
    invoiceNumber: `INV-${mdOrder}-${now}`,
    mdOrder,
    approvalCode: status?.approvalCode || "N/A",
    orderNumber: status?.OrderNumber || "N/A",
    amount: status?.depositAmount || "0",
    fullDate,
    now,
  });

  // ✅ SINGLE HTML SOURCE
  const generateInvoiceHTML = () => {
    const d = getInvoiceData();

    return `
    <html>
    <body style="font-family:Arial;padding:40px">
      <h2>Facture ${d.invoiceNumber}</h2>
      <p>Date: ${d.fullDate}</p>
      <p>Transaction: ${d.mdOrder}</p>
      <p>Autorisation: ${d.approvalCode}</p>
      <p>Commande: ${d.orderNumber}</p>
      <h3>Total: ${d.amount} DZD</h3>
    </body>
    </html>`;
  };

  // ✅ SHARED PIPELINE
  const createInvoiceCanvas = async () => {
    const temp = document.createElement("div");
    temp.style.position = "absolute";
    temp.style.left = "-9999px";
    temp.innerHTML = generateInvoiceHTML();
    document.body.appendChild(temp);

    const el = temp.querySelector("body");

    await new Promise((r) => setTimeout(r, 100));

    const canvas = await html2canvas(el, {
      scale: window.devicePixelRatio > 1 ? 2 : 1.5,
      backgroundColor: "#fff",
    });

    document.body.removeChild(temp);
    return canvas;
  };

  const createPDF = async () => {
    const canvas = await createInvoiceCanvas();
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 10, 10, 190, 0);
    return pdf;
  };

  // 🖨 PRINT
  const handlePrint = () => {
    const w = window.open("");
    w.document.write(generateInvoiceHTML());
    w.print();
  };

  // 📥 DOWNLOAD
  const handleDownload = async () => {
    setGeneratingPDF(true);
    const pdf = await createPDF();
    pdf.save(`facture-${mdOrder}.pdf`);
    setGeneratingPDF(false);
  };

  // 📧 EMAIL
  const sendEmail = async () => {
    if (!userEmail) return alert("Email requis");

    setEmailSending(true);

    const pdf = await createPDF();
    const blob = pdf.output("blob");

    const base64 = await new Promise((res) => {
      const r = new FileReader();
      r.onloadend = () => res(r.result.split(",")[1]);
      r.readAsDataURL(blob);
    });

    await fetch("/api/send-invoice", {
      method: "POST",
      body: JSON.stringify({
        email: userEmail,
        pdf: base64,
      }),
    });

    setEmailSending(false);
    setShowEmailModal(false);
    alert("Envoyé !");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-10">
      <Head>
        <title>Succès</title>
      </Head>

      <h1>Paiement confirmé</h1>
      <p>Référence: {mdOrder}</p>

      <div className="flex gap-4 mt-6">
        <button onClick={handlePrint}>🖨 Print</button>

        <button onClick={handleDownload} disabled={generatingPDF}>
          {generatingPDF ? "..." : "📥 PDF"}
        </button>

        <button onClick={() => setShowEmailModal(true)}>
          📧 Email
        </button>
      </div>

      {showEmailModal && (
        <div className="mt-4">
          <input
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="email"
          />
          <button onClick={sendEmail} disabled={emailSending}>
            envoyer
          </button>
        </div>
      )}

      <Link href="/">Accueil</Link>
    </div>
  );
}

export default function RegisterSuccess() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <RegisterSuccessContent />
    </Suspense>
  );
}