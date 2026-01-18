import { Metadata, ResolvingMetadata } from 'next';
import EventDetailsClient from './EventDetailsClient';

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  try {
    const res = await fetch(`https://addahub-backend.vercel.app/api/v1/events/${id}`);
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
