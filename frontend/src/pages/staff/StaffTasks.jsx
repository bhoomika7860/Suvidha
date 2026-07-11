import { useState } from "react";

import ProgressCard from "../../components/staff/tasks/ProgressCard";
import PendingTasks from "../../components/staff/tasks/PendingTasks";
import CompletedTasks from "../../components/staff/tasks/CompletedTasks";

export default function StaffTasks() {

  const [pendingTasks, setPendingTasks] = useState([
  {
    id: 1,
    title: "Arrange OTC Shelf",
    type: "checklist",
    requiresPhoto: false,
    photoUploaded: false,
  },
  {
    id: 2,
    title: "Clean Refrigerator",
    type: "photo",
    requiresPhoto: true,
    photoUploaded: false,
  },
  {
    id: 3,
    title: "Decorate Front Counter",
    type: "checklist",
    requiresPhoto: false,
    photoUploaded: false,
  },
  {
    id: 4,
    title: "Take Store Front Photo",
    type: "photo",
    requiresPhoto: true,
    photoUploaded: false,
  },
]);
  const [completedTasks, setCompletedTasks] = useState([]);

  function completeTask(task) {

    setPendingTasks(prev => prev.filter(t => t.id !== task.id));

    setCompletedTasks(prev => [
      {
        ...task,
        completedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);

  }

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          My Tasks
        </h1>

        <p className="text-gray-500 mt-1">
          Complete today's assigned work.
        </p>

      </div>

      <ProgressCard
        completed={completedTasks.length}
        total={pendingTasks.length + completedTasks.length}
      />

      <PendingTasks
        tasks={pendingTasks}
        onComplete={completeTask}
      />

      <CompletedTasks
        tasks={completedTasks}
      />

    </div>

  );

}