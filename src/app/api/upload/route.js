import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'events');

// Assurer que le dossier existe
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Erreur création dossier:', error);
  }
}

export async function POST(request) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    await ensureUploadDir();

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Type de fichier non supporté' },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Fichier trop volumineux (max 5MB)' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Convertir et sauvegarder le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Retourner l'URL relative
    const imgUrl = `/events/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'Image uploadée avec succès',
      imgUrl: imgUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    );
  }
}