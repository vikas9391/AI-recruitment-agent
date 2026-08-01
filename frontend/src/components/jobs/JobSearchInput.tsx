import { Search } from "lucide-react";
import { Input } from "../ui/Input";

interface JobSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobSearchInput({ value, onChange }: JobSearchInputProps) {
  return (
    <Input
      icon={<Search size={16} />}
      placeholder="Search by title, department, or location..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}