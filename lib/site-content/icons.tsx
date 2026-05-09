import type { LucideIcon } from "lucide-react"
import { Award, Brain, Code, Globe, Palette, Server, Smartphone, Target, Users, Zap } from "lucide-react"
import type { ServiceItem, StatItem } from "./types"

const serviceIconMap: Record<ServiceItem["icon"], LucideIcon> = {
  Palette,
  Globe,
  Code,
  Smartphone,
  Brain,
  Server,
}

const statIconMap: Record<StatItem["icon"], LucideIcon> = {
  Users,
  Target,
  Award,
  Zap,
}

export function getServiceIcon(name: ServiceItem["icon"]): LucideIcon {
  return serviceIconMap[name] ?? Code
}

export function getStatIcon(name: StatItem["icon"]): LucideIcon {
  return statIconMap[name] ?? Users
}

export const SERVICE_ICON_OPTIONS: ServiceItem["icon"][] = [
  "Palette",
  "Globe",
  "Code",
  "Smartphone",
  "Brain",
  "Server",
]

export const STAT_ICON_OPTIONS: StatItem["icon"][] = ["Users", "Target", "Award", "Zap"]
