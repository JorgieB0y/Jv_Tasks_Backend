import useAuth from "./useAuth";
import useProjects from "./useProjects";

const useAdmin = () => {
    const { project } = useProjects()
    const { auth } = useAuth()

    return project.projectOwner === auth._id
}

export default useAdmin;
