import InvitationEditor from "@/components/editor/InvitationEditor";
import { getTemplate } from "@/lib/templates";
import { notFound } from "next/navigation";

export default function CreateModernFloral() {
  const template = getTemplate("modern-floral");
  if (!template) notFound();
  return <InvitationEditor template={template} />;
}
