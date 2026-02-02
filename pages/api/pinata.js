/**
 * Proxy for Pinata pinFileToIPFS to avoid CORS when calling from the browser.
 * POST with JSON body: { file: base64String, filename: string }
 */

const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || process.env.PINATA_API_KEY;
  const apiSecret =
    process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY || process.env.PINATA_SECRET_KEY;

  if (!apiKey || !apiSecret) {
    res.status(500).json({
      error: "Pinata not configured. Set PINATA_API_KEY and PINATA_SECRET_KEY (or NEXT_PUBLIC_*).",
    });
    return;
  }

  try {
    const { file: base64, filename: name } = req.body || {};
    if (!base64) {
      res.status(400).json({ error: "Missing 'file' (base64) in body" });
      return;
    }
    const buffer = Buffer.from(base64, "base64");
    const filename = name || "file";

    const formData = new FormData();
    formData.append("file", new Blob([buffer]), filename);

    const pinataRes = await fetch(PINATA_URL, {
      method: "POST",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
      body: formData,
    });

    if (!pinataRes.ok) {
      const errText = await pinataRes.text();
      res.status(pinataRes.status).json({
        error: `Pinata upload failed: ${pinataRes.status} ${errText}`,
      });
      return;
    }

    const data = await pinataRes.json();
    const hash = data.IpfsHash;
    if (!hash) {
      res.status(500).json({ error: "Pinata response missing IpfsHash" });
      return;
    }

    const gateway =
      process.env.NEXT_PUBLIC_PINATA_HASH_URL || "https://gateway.pinata.cloud/ipfs/";
    res.status(200).json({ IpfsHash: hash, url: `${gateway}${hash}` });
  } catch (err) {
    console.error("Pinata proxy error:", err);
    res.status(500).json({
      error: err?.message || "Failed to upload to Pinata",
    });
  }
}
