import { Metadata } from 'next';
import EditEventClient from './EditEventClient';

export const metadata: Metadata = {
  title: "Edit Event",
};

export default function EditEventPage() {
    return <EditEventClient />;
}
