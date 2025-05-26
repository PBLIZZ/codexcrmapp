"use client";
import { useState, DragEvent } from "react";
import { api } from "@/lib/trpc";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
}

/**
 * Pattern1Kanban: A simple Kanban-style board with three stages (Lead, Nurture, Client).
 * Contacts are fetched via TRPC and can be dragged between stages (client-side only).
 */
export function Pattern1Kanban() {
  const stages = [
    { id: "lead", name: "Lead" },
    { id: "nurture", name: "Nurture" },
    { id: "client", name: "Client" },
  ];
  const { data: contacts, isLoading } = api.contacts.list.useQuery<Contact[]>();
  // localStageMap holds stage assignment per contact (client-side)
  const [localStages, setLocalStages] = useState<Record<string, string>>({});

  if (isLoading) {
    return <p>Loading Kanban view...</p>;
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, contactId: string) => {
    e.dataTransfer.setData("contactId", contactId);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, stageId: string) => {
    e.preventDefault();
    const contactId = e.dataTransfer.getData("contactId");
    if (!contactId) return;
    setLocalStages((prev) => ({ ...prev, [contactId]: stageId }));
    // TODO: Persist stage change via an API/mutation when 'stage' is available on Contact
  };

  return (
    <div className="flex space-x-4 overflow-x-auto">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="flex-1 bg-gray-100 p-4 rounded-lg min-w-[250px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, stage.id)}
        >
          <h3 className="font-semibold mb-2">{stage.name}</h3>
          <div className="space-y-2">
            {contacts?.map((contact) => {
              // default to 'lead' if not moved yet
              const contactStage = localStages[contact.id] || 'lead';
              if (contactStage !== stage.id) return null;
              return (
                <div
                  key={contact.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, contact.id)}
                  className="bg-white p-2 rounded shadow cursor-move"
                >
                  {contact.first_name} {contact.last_name}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}