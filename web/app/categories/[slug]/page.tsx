import CategoryClient from './CategoryClient';

export function generateStaticParams() {
  return [
    { slug: 'web-browsers' },
    { slug: 'messaging' },
    { slug: 'media' },
    { slug: 'developer-tools' },
    { slug: 'runtimes' },
    { slug: 'adobe-creative-cloud' },
    { slug: 'imaging-and-design' },
    { slug: 'documents-and-notes' },
    { slug: 'download-managers' },
    { slug: 'audio-and-music' },
    { slug: 'operating-systems' },
    { slug: 'windows-utilities' },
    { slug: 'mac-essentials' },
    { slug: 'gaming' },
    { slug: 'security-and-passwords' },
    { slug: 'online-storage' },
    { slug: 'compression' },
    { slug: 'file-sharing' },
  ];
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}

