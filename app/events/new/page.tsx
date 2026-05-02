import { Suspense } from "react";
import { NewEventComposer } from "@/app/events/new/new-event-composer";

export default function NewEventPage() {
  return (
    <Suspense>
      <NewEventComposer />
    </Suspense>
  );
}
