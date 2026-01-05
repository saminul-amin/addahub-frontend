import { Metadata } from 'next';
import EventsClient from './EventsClient';

export const metadata: Metadata = {
  title: "Explore Events",
};

export default function EventsPage() {
    return <EventsClient />;
}
