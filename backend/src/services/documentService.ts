import { JsonStorage } from '../storage/jsonStorage';
import { DocumentItem, UserSanitized, ActivityItem } from '../types';

const documentStorage = new JsonStorage<DocumentItem>('documents');
const activityStorage = new JsonStorage<ActivityItem>('activity');

export class DocumentService {
  /**
   * Upload / Add Document Metadata
   */
  static addDocument(
    user: UserSanitized,
    projectId: string,
    data: {
      name: string;
      description: string;
      fileUrl: string;
      fileType: string;
      fileSize?: number;
      isArchitectureDiagram?: boolean;
    }
  ): DocumentItem {
    const doc: DocumentItem = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      name: data.name.trim(),
      description: data.description.trim(),
      fileUrl: data.fileUrl,
      fileType: data.fileType || 'pdf',
      fileSize: data.fileSize || 0,
      isArchitectureDiagram: Boolean(data.isArchitectureDiagram),
      uploadedBy: user.id,
      uploadedByName: user.fullName,
      uploadedAt: new Date().toISOString(),
    };

    documentStorage.insert(doc);

    // Log Activity Timeline Item
    activityStorage.insert({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      userId: user.id,
      userName: user.fullName,
      action: data.isArchitectureDiagram 
        ? `uploaded architecture diagram: "${data.name.trim()}"`
        : `uploaded document: "${data.name.trim()}"`,
      details: data.description,
      createdAt: new Date().toISOString(),
    });

    return doc;
  }

  /**
   * Get project documents separated by standard docs vs architecture diagrams
   */
  static getProjectDocuments(projectId: string) {
    const docs = documentStorage.filter((d) => d.projectId === projectId);
    docs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    const architectureDiagrams = docs.filter((d) => d.isArchitectureDiagram);
    const standardDocuments = docs.filter((d) => !d.isArchitectureDiagram);

    return { architectureDiagrams, standardDocuments, total: docs.length };
  }

  /**
   * Delete document
   */
  static deleteDocument(documentId: string): boolean {
    return documentStorage.delete(documentId);
  }
}
