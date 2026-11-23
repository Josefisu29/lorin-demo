import { createFileRoute } from "@tanstack/react-router";
import { LorinApp } from "@/components/lorin/App";

export const Route = createFileRoute("/")({ component: LorinApp });
