"use client";

import { projects } from "@/lib/projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, GitFork } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between sm:flex-row flex-col sm:items-baseline items-start print:flex-row print:items-baseline">
          <CardTitle className="text-sm md:text-base print:text-sm">
            {project.html_url ? (
              <a
                href={project.html_url}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {project.name}
              </a>
            ) : (
              project.name
            )}
          </CardTitle>
          <em className="sm:mt-0 mt-1 text-xs md:text-sm print:text-xs print:mt-0">
            {formatDate(project.created_at)}
            {project.updated_at !== project.created_at &&
              ` - ${formatDate(project.updated_at)}`}
          </em>
        </div>
        {project.description && (
          <CardDescription className="text-sm md:text-base">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-xs md:text-sm text-muted-foreground">
          {project.language && <span>Language: {project.language}</span>}
          {project.stargazers_count > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {project.stargazers_count}
            </span>
          )}
          {project.forks_count > 0 && (
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              {project.forks_count}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(projects, {
        keys: ["name", "description", "language"],
        threshold: 0.3,
        includeScore: true,
      }),
    []
  );

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return projects;
    }
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, fuse]);

  return (
    <div className="space-y-4">
      <div className="sticky top-12 z-10 bg-background pt-4 pb-4">
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      {filteredProjects.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 mb-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="truncate">No projects found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
