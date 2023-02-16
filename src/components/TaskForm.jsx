import React from 'react'

function TaskForm({createTask,name,updateTask,isEditing,handleInputChange}) {
  return (
    <div>
      <form className='task-form' onSubmit={!isEditing?createTask:updateTask}>
          <input type="text" placeholder='Add a task' name='name' value={name} onChange={handleInputChange}/>
          <button type="submit">{isEditing?"Edit":"Add"}</button>
      </form>
    </div>
  )
}

export default TaskForm