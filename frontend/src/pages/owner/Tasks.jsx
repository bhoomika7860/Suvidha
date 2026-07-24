import { useEffect, useState } from "react";

import { taskService } from "../../services/taskService";

import TasksHeader from "../../components/tasks/TasksHeader";
import TasksToolbar from "../../components/tasks/TasksToolbar";
import AssignTaskModal from "../../components/tasks/AssignTaskModal";
import TaskTable from "../../components/tasks/TaskTable";

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  async function loadTasks() {
    try {
      const data = await taskService.getTasks();

      console.log("Backend Tasks:", data);

      const formattedTasks = data.map((task) => ({
        id: task.id,

        task: task.title,

        employee: task.employee,

        role: task.role,

        store: task.store,

        type: task.type,

        target: task.target_quantity,

        completed: task.completed_quantity,

        progress: Math.round(task.completion_percentage ?? 0),

        requiresPhoto: task.requiresPhoto,

        photo: task.photo_url,

        note: task.note,

        due: task.due_date,

        status: task.status,
      }));

      console.log("Formatted Tasks:", formattedTasks);

      setTasks(formattedTasks);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(task) {
    try {
      await taskService.createTask({
        store_id: Number(task.store),

        assigned_to: Number(task.employee),

        task_title: task.task,

        task_type: task.type,

        role:
          task.role === "Store Manager"
            ? "store_manager"
            : task.role === "Delivery Boy"
            ? "delivery"
            : "staff",

        target_quantity: Number(task.target || 0),

        requires_photo: task.requiresPhoto,
      });

      await loadTasks();

      setShowModal(false);
    } catch (err) {
      console.error(err);

      console.log(err.response?.data);

      alert(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );
    }
  }

  return (
    <div className="space-y-6">

      <TasksHeader />

      <TasksToolbar
        onAssign={() => setShowModal(true)}
      />

      <TaskTable tasks={tasks} />

      <AssignTaskModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={addTask}
      />

    </div>
  );
}