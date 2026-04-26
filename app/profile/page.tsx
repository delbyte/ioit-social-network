import { ProfileClient } from "@/app/profile/profile-client";
import { currentUser, eventPosts } from "@/lib/events";

export default function ProfilePage() {
  const createdEvents = eventPosts.filter((event) => event.hostId === currentUser.id);

  return <ProfileClient createdEvents={createdEvents} />;
}
