import { useEffect, useState } from "react";
import { taskService } from "../../services/taskService";

import ProgressCard from "../../components/staff/tasks/ProgressCard";
import PendingTasks from "../../components/staff/tasks/PendingTasks";
import CompletedTasks from "../../components/staff/tasks/CompletedTasks";



export default function StaffTasks() {
  const [pendingTasks, setPendingTasks] = useState([]);

const [completedTasks, setCompletedTasks] = useState([]);
  
useEffect(() => {
  loadTasks();
}, []);

async function loadTasks() {
  const tasks = await taskService.getMyTasks();

console.log(tasks);

setPendingTasks(
  tasks.filter((t) => t.status !== "completed")
);
  try {
    const tasks = await taskService.getMyTasks();

    setPendingTasks(
      tasks.filter((t) => t.status !== "completed")
    );

    setCompletedTasks(
      tasks.filter((t) => t.status === "completed")
    );

  } catch (err) {
    console.error(err);
  }
}
async function completeTask(task) {
  try {

    await taskService.completeTask(task.id, {
  completed_quantity: task.completed_quantity,

  photo_url: task.photo || null,

  note: task.note || "",
});

await loadTasks();

    loadTasks();

  } catch (err) {
    console.error(err);
  }
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