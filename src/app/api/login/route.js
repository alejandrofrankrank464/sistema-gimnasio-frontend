import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { identifier, password } = body || {};

    if (!identifier || !password) {
      return NextResponse.json({ message: "Faltan credenciales" }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    const res = await fetch(`${base}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ message: data?.error?.message || "Credenciales inválidas" }, { status: 401 });
    }

    return NextResponse.json({ jwt: data.jwt, user: data.user }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Error en el login" }, { status: 500 });
  }
}
