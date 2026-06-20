import { listTodos } from "@/features/todo/api/todos.server"
import { TodoList } from "@/features/todo/components/todo-list"

export default function TodosPage() {
  const initialTodos = listTodos()

  return <TodoList initialTodos={initialTodos} />
}
