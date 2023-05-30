import { NextRequest, NextResponse } from 'next/server';
import admin from '../utils/firebaseAdmin';

export async function middleware(req: NextRequest) {
  const { cookies } = req;
  if (cookies.__session) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(cookies.__session);
      req.locals.user = decodedToken;
    } catch (error) {
      console.error('Error verifying token ', error);
    }
  }
  return NextResponse.next();
}
