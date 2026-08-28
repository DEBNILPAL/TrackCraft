import { Router, Response } from 'express';
import { DocumentService } from '../services/documentService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireProjectMembership } from '../middleware/projectAccessMiddleware';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router({ mergeParams: true });

// GET /api/projects/:projectId/documents
router.get('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const data = DocumentService.getProjectDocuments(projectId);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching documents' });
  }
});

// POST /api/projects/:projectId/documents/upload - Upload file physically
router.post(
  '/upload',
  authenticateToken,
  requireProjectMembership,
  uploadMiddleware.single('file'),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, message: 'No file attached to upload request' });
      }

      const fileUrl = `/uploads/${file.filename}`;
      return res.status(200).json({
        success: true,
        data: {
          fileUrl,
          fileType: file.mimetype,
          fileSize: file.size,
          originalName: file.originalname,
        },
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'File upload failed' });
    }
  }
);

// POST /api/projects/:projectId/documents - Save metadata record
router.post('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const projectId = req.params.projectId;
    const { name, description, fileUrl, fileType, fileSize, isArchitectureDiagram } = req.body;

    if (!name || !fileUrl) {
      return res.status(400).json({ success: false, message: 'Document Name and File URL are required' });
    }

    const doc = DocumentService.addDocument(user, projectId, {
      name,
      description: description || '',
      fileUrl,
      fileType: fileType || 'pdf',
      fileSize: fileSize || 0,
      isArchitectureDiagram: Boolean(isArchitectureDiagram),
    });

    return res.status(201).json({ success: true, data: doc });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to save document metadata' });
  }
});

// DELETE /api/projects/:projectId/documents/:documentId
router.delete('/:documentId', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const documentId = req.params.documentId;
    DocumentService.deleteDocument(documentId);
    return res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Delete failed' });
  }
});

export default router;
