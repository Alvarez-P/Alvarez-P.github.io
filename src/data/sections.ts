import {
  UserRound,
  Briefcase,
  Rocket,
  FolderGit2,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface SectionDef {
  id: string;
  label: string;
  color: string;
  icon: LucideIcon;
}

export const SECTIONS: SectionDef[] = [
  { id: "sobre-mi", label: "Sobre mí", color: "#8ea6d6", icon: UserRound },
  { id: "experiencia", label: "Experiencia", color: "#8ea6d6", icon: Briefcase },
  { id: "skills", label: "Skills", color: "#8ea6d6", icon: Rocket },
  { id: "proyectos", label: "Proyectos", color: "#8ea6d6", icon: FolderGit2 },
  { id: "contacto", label: "Contacto", color: "#8ea6d6", icon: Mail },
];
