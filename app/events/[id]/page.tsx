import { Metadata, ResolvingMetadata } from 'next';
import EventDetailsClient from './EventDetailsClient';

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
      const res = await fetch(`http://localhost:5000/api/v1/events/${id}`);
      const data = await res.json();
      
      if (data.success && data.data) {
          return {
              title: data.data.title,
              description: data.data.description?.substring(0, 160) || "Join this event on AddaHub",
              openGraph: {
                  title: data.data.title,
                  description: data.data.description?.substring(0, 160),
                  images: data.data.image ? [data.data.image] : [],
              }
          }
      }
  } catch (error) {
      console.error("Failed to fetch event metadata", error);
  }

  return {
    title: 'Event Details',
  }
}

export default function EventDetailsPage() {
    return <EventDetailsClient />;
}
