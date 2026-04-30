import tls from "node:tls";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Cert = tls.PeerCertificate & { subjectaltname?: string };

function normalizeHost(value: string) {
  return value.replace(/^https?:\/\//, "").split("/")[0]?.trim() ?? "";
}

export async function GET(request: Request) {
  const host = normalizeHost(new URL(request.url).searchParams.get("host") ?? "");
  if (!host) return NextResponse.json({ error: "Host is required" }, { status: 400 });

  const result = await new Promise<{ certificate?: Cert; authorized: boolean; authorizationError?: string | null }>((resolve, reject) => {
    const socket = tls.connect({ host, port: 443, servername: host, timeout: 8000 }, () => {
      resolve({
        certificate: socket.getPeerCertificate(true) as Cert,
        authorized: socket.authorized,
        authorizationError: socket.authorizationError ? String(socket.authorizationError) : null,
      });
      socket.end();
    });
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("Connection timed out"));
    });
    socket.on("error", reject);
  }).catch((error) => ({ error: error instanceof Error ? error.message : "SSL check failed" }));

  if ("error" in result) return NextResponse.json(result, { status: 400 });

  const cert = result.certificate;
  const validToTime = cert?.valid_to ? new Date(cert.valid_to).getTime() : null;

  return NextResponse.json({
    host,
    authorized: result.authorized,
    authorizationError: result.authorizationError,
    subject: cert?.subject,
    issuer: cert?.issuer,
    validFrom: cert?.valid_from,
    validTo: cert?.valid_to,
    daysUntilExpiry: validToTime ? Math.ceil((validToTime - Date.now()) / 86400000) : null,
    altNames: cert?.subjectaltname,
  });
}
