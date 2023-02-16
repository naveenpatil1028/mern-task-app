import {useState,useEffect} from 'react'
import { toast } from 'react-toastify';
import Task from './Task'
import TaskForm from './TaskForm'
import axios from 'axios';
import { URL } from '../App';
import spinner from "../assets/loader.gif"


function TaskList() {
const [tasks, setTasks] = useState([])
const [completedTasks, setCompletedTasks] = useState([])
const [isLoading, setIsLoading] = useState(false)
const [isEditing, setIsEditing] = useState(false)
const [taskId, setTaskId] = useState("")
const [formData, setFormData] = useState({
  name:'',
  completed:false
})

const {name}=formData;

const handleInputChange=(e)=>{
  const {name,value}=e.target
  setFormData({...formData, [name]:value})
}

//create Task Frontend
const createTask=async (e)=>{
  e.preventDefault()
  if(name===''){
    return toast.error("Input Field cannot be empty")
  }
  try {
    await axios.post(`${URL}/api/tasks`,formData)
    toast.success("Task Added successfully")
    setFormData({...formData,name:""})
    getTasks()
  } catch (error) {
    toast.error(error.message)
  }
}

useEffect(() => {
 getTasks()
}, [])

useEffect(() => {
  const cTask=tasks.filter((task)=>{
    return task.completed===true
  })
  setCompletedTasks(cTask)
 }, [tasks])
 

//Get all Tasks Frontend
const getTasks=async()=>{
  setIsLoading(true)
  try {
    const {data}=await axios.get(`${URL}/api/tasks`) 
    setTasks(data)
    setIsLoading(false)
  } catch (error) {
    toast.error(error.message)
  }
  setIsLoading(false)
}


//Delete Task Frontend
const deleteTask=async(id)=>{
  try {
    await axios.delete(`${URL}/api/tasks/${id}`)
    toast.success("Task deleted successfully")
    getTasks()

  } catch (error) {
    toast.error(error.message) 
  }
}

//Get task to form
const getSingleTask=async(task)=>{
  setFormData({name:task.name,completed:false})
  setTaskId(task._id)
  setIsEditing(true)
}

//Update Task
const updateTask=async(e)=>{
  e.preventDefault()
  if(name===""){
   return toast.error("input field connot be empty")
  }
  try {
    await axios.put(`${URL}/api/tasks/${taskId}`,formData)
    setFormData({...formData,name:""})
    setIsEditing(false)
    getTasks();
  } catch (error) {
    toast.error(error.message)
  }
}

//set task to complete
const setToComplete=async(task)=>{
  const newFormData={
    name:task.name,
    completed:true
  }
  try {
    await axios.put(`${URL}/api/tasks/${task._id}`,newFormData)
    getTasks()
  } catch (error) {
    toast.error(error.message)
  }
}


  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm name={name} 
       handleInputChange={handleInputChange}
       createTask={createTask}
       isEditing={isEditing}
       updateTask={updateTask}/>
       {tasks.length>0 && (
          <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b>{tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b>{completedTasks.length}
          </p>
        </div>
       )}
      
      <hr />
      {
       isLoading&&(
        <div className="--flex-center">
          <img src={spinner} alt="...Loading" />
        </div>
       )
      }
      {
        !isLoading&&tasks.length===0?(
          <p className='--py'>No Task added. Please add a task</p>
        ):(
          <>
          {tasks.map((task,index)=>{
            return (
              <Task
              key={task._id} 
              task={task} 
              index={index}
              deleteTask={deleteTask}
              getSingleTask={getSingleTask}
              setToComplete={setToComplete}
              />
            )
          })
          
          }
          </>
        )
      }
    </div>
  )
}

export default TaskList