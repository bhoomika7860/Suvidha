import { useEffect, useState } from "react";

import { taskService } from "../../services/taskService";

import TasksHeader from "../../components/tasks/TasksHeader";
import TasksToolbar from "../../components/tasks/TasksToolbar";
import AssignTaskModal from "../../components/tasks/AssignTaskModal";
import TaskTable from "../../components/tasks/TaskTable";

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();

      const formattedTasks = data.map((task) => ({
        id: task.id,

        task: task.task_title,

        employee:
          task.employee_name ||
          task.assigned_to_name ||
          task.assigned_to,

        role: task.role,

        store:
          task.store_name ||
          task.store_id,

        progress: Math.round(task.completion_percentage || 0),

        due: task.due_date,

        requiresPhoto: task.requires_photo,

        target: task.target_quantity,

        type: task.task_type,

        status: task.status,
      }));

      setTasks(formattedTasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (task) => {
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

  console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log("DATA:", err.response?.data);

  alert(
    JSON.stringify(err.response?.data, null, 2)
  );
}
  };

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