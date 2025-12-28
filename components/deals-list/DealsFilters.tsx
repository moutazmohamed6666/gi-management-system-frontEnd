import { useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search } from "lucide-react";
import { useFilters } from "@/lib/useFilters";

interface DealsFiltersProps {
  role: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  agentFilter: string;
  onAgentFilterChange: (value: string) => void;
  developerFilter: string;
  onDeveloperFilterChange: (value: string) => void;
  projectFilter: string;
  onProjectFilterChange: (value: string) => void;
  statusIdFilter: string;
  onStatusIdFilterChange: (value: string) => void;
}

export function DealsFilters({
  role,
  searchTerm,
  onSearchChange,
  agentFilter,
  onAgentFilterChange,
  developerFilter,
  onDeveloperFilterChange,
  projectFilter,
  onProjectFilterChange,
  statusIdFilter,
  onStatusIdFilterChange,
}: DealsFiltersProps) {
  const {
    agents,
    developers,
    projects,
    statuses,
    isLoading: filtersLoading,
  } = useFilters();

  const filteredProjects = useMemo(() => {
    if (developerFilter === "all") return projects;
    type ProjectOption = { developerId?: string };
    const byDev = projects.filter((p) => {
      const devId = (p as unknown as ProjectOption).developerId;
      return devId === developerFilter;
    });
    return byDev.length > 0 ? byDev : projects;
  }, [projects, developerFilter]);

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by ID, buyer, project, or developer..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {role !== "agent" && (
            <Select
              value={agentFilter}
              onValueChange={onAgentFilterChange}
              disabled={filtersLoading}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            value={developerFilter}
            onValueChange={(v) => {
              onDeveloperFilterChange(v);
              onProjectFilterChange("all");
            }}
            disabled={filtersLoading}
          >
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="All Developers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Developers</SelectItem>
              {developers.map((dev) => (
                <SelectItem key={dev.id} value={dev.id}>
                  {dev.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={projectFilter}
            onValueChange={onProjectFilterChange}
            disabled={filtersLoading}
          >
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {filteredProjects.length === 0 ? (
                <SelectItem value="__no_projects__" disabled>
                  No projects available
                </SelectItem>
              ) : (
                filteredProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select
            value={statusIdFilter}
            onValueChange={onStatusIdFilterChange}
            disabled={filtersLoading}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Deal Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deal Statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

