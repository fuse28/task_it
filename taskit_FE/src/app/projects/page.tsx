"use client";

import { useState } from "react";
import MainLayout from "../../components/MainLayout";
import Modal from "@/common/Modal";
import { Button } from "@/components/ui/button";

const kanbanColumns = [
  {
    title: "To Do",
    tasks: [
      {
        id: 1,
        title: "Design user interface",
        description: "Create wireframes and mockups",
      },
      {
        id: 2,
        title: "Setup database",
        description: "Configure database schema",
      },
      {
        id: 3,
        title: "Write documentation",
        description: "Document API endpoints",
      },
    ],
  },
  {
    title: "In Progress",
    tasks: [
      {
        id: 4,
        title: "Implement authentication",
        description: "Add user login functionality",
      },
      {
        id: 5,
        title: "Create dashboard",
        description: "Build main dashboard interface",
      },
      { id: 6, title: "Setup testing", description: "Configure unit tests" },
    ],
  },
  {
    title: "In Review",
    tasks: [
      { id: 7, title: "Code review", description: "Review pull request #123" },
    ],
  },
  {
    title: "Done",
    tasks: [
      {
        id: 8,
        title: "Project setup",
        description: "Initialize project structure",
      },
      {
        id: 9,
        title: "Environment setup",
        description: "Configure development environment",
      },
    ],
  },
];

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    members: string[];
  }) => void;
  membersOptions: { value: string; label: string }[]; // list of users
}

export default function ProjectsPage() {
  const [visible, setVisible] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your projects and tasks</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap">
              New project
            </button> */}
          </div>
        </div>

        {/* Project Name */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Name</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96">
          <div className="p-6 h-full">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mt-6">
                  <Button onClick={() => setVisible(true)}>
                    Create New Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal visible={visible} setVisible={setVisible} />
        {/* Kanban Board */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kanbanColumns.map((column, columnIndex) => (
            <div key={column.title} className="min-w-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-300 rounded"></div>
                        <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </MainLayout>
  );
}
