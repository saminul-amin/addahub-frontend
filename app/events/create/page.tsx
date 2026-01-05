import { Metadata } from 'next';
import CreateEventClient from './CreateEventClient';

export const metadata: Metadata = {
  title: "Create Event",
};

export default function CreateEventPage() {
    return <CreateEventClient />;
}
