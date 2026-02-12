import prisma from "../../lib/prisma";

class DocumentService {
  constructor() {}

  public async uploadDocument(
    data: {
      public_url: string;
      public_id: string;
      complaint_id: string;
    }[],
  ) {
    return await prisma.documents.createMany({
      data: data,
    });
  }

  public async getDocumentsByComplaintId(complaint_id: string) {
    return await prisma.documents.findMany({
      where: {
        complaint_id: complaint_id,
      },
    });
  }

  public async deleteDocumentsByComplaintId(complaint_id: string) {
    return await prisma.documents.deleteMany({
      where: {
        complaint_id: complaint_id,
      },
    });
  }
}

export default DocumentService;
