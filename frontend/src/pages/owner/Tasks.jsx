import { useState } from "react";

import TasksHeader from "../../components/tasks/TasksHeader";
import TasksToolbar from "../../components/tasks/TasksToolbar";
import TaskCard from "../../components/tasks/TaskCard";
import AssignTaskModal from "../../components/tasks/AssignTaskModal";
import TaskTable from "../../components/tasks/TaskTable";

export default function Tasks() {

  const [showModal, setShowModal] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      employee: "Rahul Sharma",
      role: "Store Manager",
      store: "Sector 7",
      task: "Today's Sales",
      type: "sales",
      target: "₹50,000",
      progress: 72,
      requiresPhoto: false,
      due: "Today",
    },
    {
      id: 2,
      employee: "Amit Kumar",
      role: "Staff",
      store: "Sector 7",
      task: "Clean Refrigerator",
      type: "normal",
      target: "-",
      progress: 0,
      requiresPhoto: true,
      due: "Today",
    },
  ]);

  function addTask(task) {

    setTasks(prev => [
      {
        id: Date.now(),
        progress: 0,
        ...task,
      },
      ...prev,
    ]);

    setShowModal(false);

  }

  return (

    <div className="space-y-6">

      <TasksHeader />

      <TasksToolbar
        onAssign={() => setShowModal(true)}
      />

      <TaskTable
  tasks={tasks}
/>

      <AssignTaskModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={addTask}
      />

    </div>

  );

}