import { Metadata, ResolvingMetadata } from 'next';
import PublicProfileClient from './PublicProfileClient';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
 
  try {
      const res = await fetch(`http://localhost:5000/api/v1/users/${id}`);
      const data = await res.json();
      
      if (data.success && data.data) {
          return {
              title: data.data.name,
              description: data.data.bio || `Check out ${data.data.name}'s profile on AddaHub`,
          }
      }
  } catch (error) {
      console.error("Failed to fetch user metadata", error);
  }

  return {
    title: 'User Profile',
  }
}

export default function PublicProfilePage() {
    return <PublicProfileClient />;
}
