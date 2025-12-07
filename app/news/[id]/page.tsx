import NewsDetailPage from "@/screens/news/detail";

export default function NewsDetail({ params }: { params: { id: string } }) {
  return <NewsDetailPage id={params.id} />;
}

