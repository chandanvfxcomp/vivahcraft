import InvitationEditor from "@/components/editor/InvitationEditor";
import { getTemplate } from "@/lib/templates";
import { notFound } from "next/navigation";

export default function CreateRoyalPalace() {
  const template = getTemplate("royal-palace");
  if (!template) notFound();
  return <InvitationEditor template={template} />;
}
