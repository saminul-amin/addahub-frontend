import { Metadata } from 'next';
import MyEventsClient from './MyEventsClient';

export const metadata: Metadata = {
  title: "My Events",
};

export default function MyEventsPage() {
    return <MyEventsClient />;
}
