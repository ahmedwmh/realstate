import PropertyDetailPage from "@/screens/property-detail";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PropertyDetail({ searchParams }: any) {
  let projectId: number | null = null;

  // Try to get ID from searchParams.item (legacy support) or direct id param
  if (searchParams.item) {
    try {
  const item = JSON.parse(searchParams.item);
      projectId = item.id;
    } catch (e) {
      // Invalid JSON, try direct id
      projectId = parseInt(searchParams.id) || null;
    }
  } else if (searchParams.id) {
    projectId = parseInt(searchParams.id);
  }

  if (!projectId || isNaN(projectId)) {
    notFound();
  }

  // Fetch project from database
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    notFound();
  }

  return <PropertyDetailPage project={project} />;
}
