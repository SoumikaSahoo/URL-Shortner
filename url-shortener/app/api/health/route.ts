export async function GET() {
  return Response.json({
    ok: true,
    service: "url-shortener",
    timestamp: new Date().toISOString(),
  });
}
