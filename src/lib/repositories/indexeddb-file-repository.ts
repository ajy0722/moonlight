import { FILES_STORE, openDb } from "@/lib/db/indexeddb";
import type { FileRepository } from "@/lib/repositories/file-repository";
import type { SubjectFile } from "@/types/subject-file";

interface StoredFile extends SubjectFile {
  blob: Blob;
}

function stripBlob(stored: StoredFile): SubjectFile {
  return {
    id: stored.id,
    subjectSlug: stored.subjectSlug,
    name: stored.name,
    type: stored.type,
    size: stored.size,
    createdAt: stored.createdAt,
  };
}

/** IndexedDB 기반 구현. localStorage와 달리 PDF 같은 바이너리 파일을 브라우저에 보관한다. */
export class IndexedDbFileRepository implements FileRepository {
  async listBySubject(subjectSlug: string): Promise<SubjectFile[]> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILES_STORE, "readonly");
      const index = tx.objectStore(FILES_STORE).index("subjectSlug");
      const request = index.getAll(subjectSlug);
      request.onsuccess = () => resolve((request.result as StoredFile[]).map(stripBlob));
      request.onerror = () => reject(request.error);
    });
  }

  async upload(subjectSlug: string, file: File): Promise<SubjectFile> {
    const db = await openDb();
    const stored: StoredFile = {
      id: crypto.randomUUID(),
      subjectSlug,
      name: file.name,
      type: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
      blob: file,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILES_STORE, "readwrite");
      tx.objectStore(FILES_STORE).add(stored);
      tx.oncomplete = () => resolve(stripBlob(stored));
      tx.onerror = () => reject(tx.error);
    });
  }

  async getBlob(id: string): Promise<Blob | undefined> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILES_STORE, "readonly");
      const request = tx.objectStore(FILES_STORE).get(id);
      request.onsuccess = () => resolve((request.result as StoredFile | undefined)?.blob);
      request.onerror = () => reject(request.error);
    });
  }

  async remove(id: string): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILES_STORE, "readwrite");
      tx.objectStore(FILES_STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}
